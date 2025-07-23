######################## POLIS CLIENT ADMIN ########################
#FROM client-base AS client-admin # <- switch back to basing on client admin once we upgrade other clients
FROM docker.io/node:18-alpine AS client-admin

ARG ENABLE_TWITTER_WIDGETS
ARG FB_APP_ID
ARG P_HOME_NAME
ARG P_LOGO_ICO_URL
ARG P_LOGO_URL
ARG P_TITLE
ARG P_CLAIM
ARG P_DESCRIPTION
ARG P_DOC_URL
ARG P_REPO_URL
ARG P_TOS_URL
ARG P_PRIVACY_POLICY_URL
ARG P_OPENID_ENABLED
ARG P_OPENID_PROVIDER_NAME
ARG P_OPENID_PROFILE_PAGE_URL
ENV ENABLE_TWITTER_WIDGETS ${ENABLE_TWITTER_WIDGETS}
ENV FB_APP_ID ${FB_APP_ID}
ENV P_CLAIM ${P_CLAIM}
ENV P_HOME_NAME ${P_HOME_NAME}
ENV P_LOGO_ICO_URL ${P_LOGO_ICO_URL}
ENV P_LOGO_URL ${P_LOGO_URL}
ENV P_TITLE ${P_TITLE}
ENV P_CLAIM ${P_CLAIM}
ENV P_DESCRIPTION ${P_DESCRIPTION}
ENV P_DOC_URL ${P_DOC_URL}
ENV P_REPO_URL ${P_REPO_URL}
ENV P_TOS_URL ${P_TOS_URL}
ENV P_PRIVACY_POLICY_URL ${P_PRIVACY_POLICY_URL}
ENV P_OPENID_ENABLED ${P_OPENID_ENABLED}
ENV P_OPENID_PROVIDER_NAME ${P_OPENID_PROVIDER_NAME}
ENV P_OPENID_PROFILE_PAGE_URL ${P_OPENID_PROFILE_PAGE_URL}

# Set default NODE_ENV to production unless overridden at build time with --build-arg NODE_ENV=development
ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV:-production}

WORKDIR /app

COPY client-admin/package*.json ./

RUN npm ci --production=false

COPY client-admin/. .

RUN npm run build:prod



##################### POLIS CLIENT PARTICIPATION #####################
FROM docker.io/node:18-alpine AS client-participation

ARG EMBED_SERVICE_HOSTNAME
ARG FB_APP_ID
ARG GA_TRACKING_ID
ARG P_HOME_NAME
ARG P_LOGO_ICO_URL
ARG P_LOGO_URL
ARG P_TITLE
ARG P_CLAIM
ARG P_DESCRIPTION
ARG P_DOC_URL
ARG P_REPO_URL
ARG P_TOS_URL
ARG P_PRIVACY_POLICY_URL
ARG P_OPENID_ENABLED
ARG P_OPENID_PROVIDER_NAME
ENV EMBED_SERVICE_HOSTNAME ${EMBED_SERVICE_HOSTNAME}
ENV FB_APP_ID ${FB_APP_ID}
ENV GA_TRACKING_ID ${GA_TRACKING_ID}
ENV P_CLAIM ${P_CLAIM}
ENV P_HOME_NAME ${P_HOME_NAME}
ENV P_LOGO_ICO_URL ${P_LOGO_ICO_URL}
ENV P_LOGO_URL ${P_LOGO_URL}
ENV P_TITLE ${P_TITLE}
ENV P_DESCRIPTION ${P_DESCRIPTION}
ENV P_DOC_URL ${P_DOC_URL}
ENV P_REPO_URL ${P_REPO_URL}
ENV P_TOS_URL ${P_TOS_URL}
ENV P_PRIVACY_POLICY_URL ${P_PRIVACY_POLICY_URL}
ENV P_OPENID_ENABLED ${P_OPENID_ENABLED}
ENV P_OPENID_PROVIDER_NAME ${P_OPENID_PROVIDER_NAME}

# Set default NODE_ENV to production unless overridden at build time with --build-arg NODE_ENV=development
ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV:-production}

WORKDIR /app

COPY client-participation/package*.json ./

RUN npm ci --production=false

COPY client-participation/. .

RUN npm run build:prod



######################## POLIS CLIENT REPORT ########################
# FROM client-base AS client-report
FROM docker.io/node:18-alpine AS client-report

# Set default NODE_ENV to production unless overridden at build time with --build-arg NODE_ENV=development
ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV:-production}

WORKDIR /app

RUN apk add git

COPY client-report/package*.json ./

RUN npm ci --production=false

COPY client-report/. .

# GIT_HASH will be set properly when running `make` (see Makefile).
ARG GIT_HASH
ARG SERVICE_URL
ARG P_HOME_NAME
ARG P_LOGO_ICO_URL
ARG P_LOGO_URL
ARG P_TITLE
ARG P_CLAIM
ARG P_DESCRIPTION
ARG P_DOC_URL
ARG P_REPO_URL
ARG P_TOS_URL
ARG P_PRIVACY_POLICY_URL
ARG P_OPENID_ENABLED
ARG P_OPENID_PROVIDER_NAME
ENV GIT_HASH ${GIT_HASH:-placeholder}
ENV SERVICE_URL ${SERVICE_URL}
ENV P_CLAIM ${P_CLAIM}
ENV P_HOME_NAME ${P_HOME_NAME}
ENV P_LOGO_ICO_URL ${P_LOGO_ICO_URL}
ENV P_LOGO_URL ${P_LOGO_URL}
ENV P_TITLE ${P_TITLE}
ENV P_DESCRIPTION ${P_DESCRIPTION}
ENV P_DOC_URL ${P_DOC_URL}
ENV P_REPO_URL ${P_REPO_URL}
ENV P_TOS_URL ${P_TOS_URL}
ENV P_PRIVACY_POLICY_URL ${P_PRIVACY_POLICY_URL}
ENV P_OPENID_ENABLED ${P_OPENID_ENABLED}
ENV P_OPENID_PROVIDER_NAME ${P_OPENID_PROVIDER_NAME}

RUN npm run build:prod



############################ FILE SERVER ############################
FROM docker.io/node:18-alpine

# Set default NODE_ENV to production unless overridden at build time with --build-arg NODE_ENV=development
ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV:-production}

WORKDIR /app

COPY file-server/package*.json ./

RUN npm ci

COPY file-server/. .

# use the multi-stage builds above to copy out the resources
RUN mkdir /app/build
COPY --from=client-admin          /app/build/       /app/build
COPY --from=client-participation  /app/dist/        /app/build
COPY --from=client-report         /app/dist/        /app/build

EXPOSE 8080

CMD npm run serve
