const mongoose = require("mongoose");
const isUrl = require('is-url');
const shortenLib = require('../lib/ShortUrl');
const ShortUrl = mongoose.model("ShortUrl");
const Analytics = mongoose.model("Analytics");
const SHORT_BASE = "localhost/";
const ERROR_URL = "http://localhost:3000/404.html";
module.exports = app => {
    //GET API for redirecting to Original URL
    app.post("/api/shorten", async (req, res) => {
        if (typeof req.body === 'undefined' || req.body === null) {
            return res.status(400).send({
                'error': 'No input given'
            });
        } else if (!req.body.hasOwnProperty("text")) {
            return res.status(400).send({
                'error': 'Must have text property'
            });
        } else {
            let {
                text
            } = req.body;
            let urls = text.match(/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm);
            let replaceUrl = function replaceUrl(url) {
                return new Promise(resolve => {
                    console.log("Evaluating url %s", url);
                    if (isUrl(url)) {
                        return shortenLib.getShortened(url)
                            .then((shortened) => {
                                console.log("Retrieved short url %s", JSON.stringify(shortened));
                                if (typeof shortened !== 'undefined' && shortened !== null) {
                                    let {
                                        shortUrl,
                                    } = shortened;
                                    resolve({
                                        url,
                                        shortUrl
                                    });
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                                return res.status(500).send({
                                    'error': 'failed to shorten urls'
                                });
                            });
                    }
                });
            };
            let processUrls = urls.map(replaceUrl);
            Promise.all(processUrls)
                .then((urls) => {
                    urls.forEach(({
                        url,
                        shortUrl
                    }) => {
                        console.log("Process each url and replace in text");
                        let anchortag = '<a href="' + shortUrl + '">' + shortUrl + '</a>';
                        text = text.replace(url, anchortag);
                        console.log("Anchor text %s", text);
                    })
                    return res.status(200).send(text);
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(500).send({
                        'error': 'failed to shorten urls'
                    });
                });

        }


    });

    app.get("/api/url/:shortCode", async (req, res) => {
        const shortCode = req.params.shortCode;
        return ShortUrl.findOne({
                shortCode
            }).then((realUrl) => {
                if (typeof realUrl !== 'undefined' && realUrl !== null) {
                    console.log('Redirected %s : %s', realUrl.shortUrl, realUrl.originalUrl);
                    const clickedDate = new Date();
                    let stat = new Analytics({
                        realUrl: realUrl.originalUrl,
                        ips: req.headers['x-forwarded-for'],
                        referer: req.headers['referer'],
                        userAgent: req.headers['user-agent'],
                        clickDate: clickedDate
                    });
                    stat.save();
                    return res.redirect(realUrl.originalUrl);
                } else {
                    console.log('No redirect found for %s', shortCode);
                    res.redirect(ERROR_URL);
                }
            })
            .catch((err) => {
                console.log('ERROR', err);
                res.redirect(ERROR_URL);
            });

    });
    //POST API for creating short url from Original URL
    app.post("/api/url", async (req, res) => {
        if (typeof req.body === 'undefined' || req.body === null) {
            return res.status(400).send({
                'error': 'No input given'
            });
        }
        const {
            realUrl
        } = req.body;
        if (!isUrl(realUrl)) {
            return res.status(400).send({
                'error': 'Invalid URL input'
            });
        } else {
            return shortenLib.getShortened(realUrl)
                .then((shortened) => {
                    if (typeof shortened !== 'undefined' && shortened !== null) {
                        return res.status(200).json(shortened);
                    }
                }).catch((err) => {
                    return res.status(500).send({
                        'error': 'Error retrieving short urls'
                    });
                });

        }

    });
};