FROM node:18.17.1-alpine3.18 AS build
ARG BUILD_CONTEXT
ARG DEPLOY_ENVIRONMENT

RUN apk update \
  && apk --no-cache --update add libc6-compat alpine-sdk python3

WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY ./packages/$BUILD_CONTEXT/package.json packages/$BUILD_CONTEXT/package.json

COPY ./lib lib
RUN ls -la /app/lib

RUN yarn --frozen-lockfile

COPY ./packages/$BUILD_CONTEXT packages/$BUILD_CONTEXT

ENV NODE_ENV production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

RUN yarn workspace @slender/$BUILD_CONTEXT build
RUN chown -R nextjs:nodejs packages/$BUILD_CONTEXT/.next

USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV NEXT_TELEMETRY_DISABLED 1
ENV PACKAGE_NAME=$BUILD_CONTEXT
ENV DEPLOY_ENVIRONMENT=$DEPLOY_ENVIRONMENT

CMD ["sh", "-c", "yarn workspace @slender/$PACKAGE_NAME start"]

