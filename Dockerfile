FROM node:18.16-alpine

RUN set -x \
  && apk update \
  && apk add g++ make git

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
ENV APP_DIR /usr/src/app

RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

ADD . ${APP_DIR}

RUN yarn install --frozen-lockfile
