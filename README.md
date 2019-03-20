# URL Shortener

Service to convert and redirect to shortened URLs.

## Installing with Docker

Build the api server

```
docker build -t api-server ./short-api
```

Build the proxy

```
docker build -t shorten-proxy ./shorten-proxy
```

Deploy the stack

```
docker stack deploy -c docker-compose.yml url-shortener
```

## Installing without docker:

* Install Mongo
* Install Nginx, copy shorten-proxy/nginx.conf to /etc/nginx/sites-enabled/default
* In /short-api Run 
```npm run start```


## Deployment

**NOT Production ready:**
*No auth on anything*,
*no certs anywhere*


## Built With

* Nodejs
* MongoDB
* Nginx
* Docker

## Authors

* **Emily Frouin** - *Initial work*

## Acknowledgments

Inspiration taken from [Muhsin.K's](https://github.com/muhzi4u/URL-Shortner) project.

