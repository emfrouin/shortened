const mongoose = require("mongoose");
const isUrl = require('is-url');
const normalizeUrl = require('normalize-url');
const nanoid = require('nanoid');
const ShortUrl = mongoose.model("ShortUrl");
const SHORT_BASE = "sk.sh/";

module.exports = {
    getShortened: async function (realUrl) {
        const originalUrl = normalizeUrl(realUrl);
        return await ShortUrl.findOne({
                originalUrl
            }).exec()
            .then((item) => {
                if (typeof item !== 'undefined' && item !== null) {
                    console.log("Found stored item for url %s", JSON.stringify(item));
                    let response = {
                        'shortUrl': item.shortUrl,
                        'realUrl': originalUrl,
                        'shortCode': item.shortCode
                    }
                    return response;
                } else {
                    console.log("creating new item for url");
                    const createdAt = new Date();
                    let shortCode = nanoid();
                    let shortUrl = normalizeUrl(SHORT_BASE.concat(shortCode));
                    let newUrl = new ShortUrl({
                        originalUrl,
                        shortUrl,
                        shortCode,
                        createdAt
                    });
                    return newUrl.save()
                        .then((newUrl) => {
                            let response = {
                                'shortUrl': newUrl.shortUrl,
                                'realUrl': originalUrl,
                                shortCode
                            }
                            return response;
                        }).catch((err) => {
                            return err;
                        });

                }
            });
    }
};