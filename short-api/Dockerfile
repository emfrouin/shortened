FROM node:8.15.1-alpine
EXPOSE 3000

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN mkdir /app && mkdir /app/env && \
    # create api user
    addgroup -S api && \
    adduser  -S api -G api -D -h /home/api
WORKDIR /app

COPY package.json .
RUN npm install && chown -R api:api /app
COPY lib lib
COPY models models
COPY routes routes
# setup permissions
RUN chown -R api:api /app
USER api
HEALTHCHECK --interval=1s --timeout=1s --start-period=1m --retries=5 \
    CMD curl -f --insecure http://localhost:3000/healthcheck || exit 1
CMD ["npm","run", "start"]
#CMD exec /bin/bash -c "trap : TERM INT; sleep 1000000 & wait"



