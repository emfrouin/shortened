FROM node:8.15.1-alpine
EXPOSE 3000

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN mkdir /app && mkdir /app/env && \
    # create api user
    groupadd api -g 1042 && \
    useradd api -g api -u 1042 -m -d /home/api
WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm ci && chown -R api:api /app
COPY lib lib
COPY models models
COPY routes routes
# setup permissions
RUN chown -R api:api /app/src
USER api
HEALTHCHECK --interval=1s --timeout=1s --start-period=1m --retries=5 \
    CMD curl -f --insecure http://localhost:3000/healthcheck || exit 1
CMD ["npm","run", "start:prod"]
#CMD exec /bin/bash -c "trap : TERM INT; sleep 1000000 & wait"



