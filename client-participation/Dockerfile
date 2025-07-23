# NOTE: This Dockerfile is not actually used by the docker-compose.yml.
# Instead, the file-server Dockerfile builds and serves these assets.
# But this file is still useful for development or deployments that do not use
# the docker compose configuration.

FROM docker.io/node:18-alpine

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

COPY package*.json ./

RUN npm ci --production=false

COPY . .

CMD npm run build:prod
