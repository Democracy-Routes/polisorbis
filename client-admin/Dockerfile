# NOTE: This Dockerfile is not actually used by the docker-compose.yml.
# Instead, the file-server Dockerfile builds and serves these assets.
# But this file is still useful for development or deployments that do not use
# the docker compose configuration.

FROM docker.io/node:18-alpine

ARG ENABLE_TWITTER_WIDGETS
ARG FB_APP_ID
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

COPY package*.json ./

RUN npm ci --production=false

COPY . .

CMD npm run build:prod
