FROM node:18.17.1-alpine3.18 AS build
ARG BUILD_CONTEXT
ARG DEPLOY_ENVIRONMENT_ARG
ARG NEXT_PUBLIC_BUILD_NUMBER_ARG

RUN apk update \
  && apk --no-cache --update add libc6-compat alpine-sdk python3

WORKDIR /app
COPY package.json .
COPY yarn.lock .

COPY ./packages/$BUILD_CONTEXT/package.json packages/$BUILD_CONTEXT/package.json

COPY ./lib lib
COPY ./contract-bindings contract-bindings

RUN yarn --frozen-lockfile

COPY ./packages/$BUILD_CONTEXT packages/$BUILD_CONTEXT
COPY ./packages/shared packages/shared

ENV NODE_ENV production
ENV NEXT_PUBLIC_DEPLOY_ENVIRONMENT=$DEPLOY_ENVIRONMENT_ARG
ENV NEXT_PUBLIC_BUILD_NUMBER=$NEXT_PUBLIC_BUILD_NUMBER_ARG
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

RUN yarn workspace @slender/$BUILD_CONTEXT build
RUN chown -R nextjs:nodejs packages/$BUILD_CONTEXT/.next

USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV NEXT_TELEMETRY_DISABLED 1
ENV PACKAGE_NAME=$BUILD_CONTEXT

CMD ["sh", "-c", "yarn workspace @slender/$PACKAGE_NAME start"]

