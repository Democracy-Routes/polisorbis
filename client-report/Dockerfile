# NOTE: This Dockerfile is not actually used by the docker-compose.yml.
# Instead, the file-server Dockerfile builds and serves these assets.
# But this file is still useful for development or deployments that do not use
# the docker compose configuration.

FROM docker.io/node:18-alpine

# Set default NODE_ENV to production unless overridden at build time with --build-arg NODE_ENV=development
ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV:-production}

WORKDIR /app

RUN apk add git

COPY package*.json ./

RUN npm ci --production=false

COPY . .

# GIT_HASH is optional and will be set properly when running `make` (see Makefile).
# Or may be passed in at build time with --build-arg GIT_HASH=$(git rev-parse --short HEAD)
ARG GIT_HASH
ARG SERVICE_URL
ARG P_LOGO_ICO_URL
ARG P_LOGO_URL
ARG P_TITLE
ARG P_CLAIM
ARG P_DESCRIPTION
ARG P_DOC_URL
ARG P_REPO_URL
ARG P_TOS_URL
ARG P_PRIVACY_POLICY_URL
ENV GIT_HASH ${GIT_HASH:-placeholder}
ENV SERVICE_URL ${SERVICE_URL}
ENV P_CLAIM ${P_CLAIM}
ENV P_LOGO_ICO_URL ${P_LOGO_ICO_URL}
ENV P_LOGO_URL ${P_LOGO_URL}
ENV P_TITLE ${P_TITLE}
ENV P_DESCRIPTION ${P_DESCRIPTION}
ENV P_DOC_URL ${P_DOC_URL}
ENV P_REPO_URL ${P_REPO_URL}
ENV P_TOS_URL ${P_TOS_URL}
ENV P_PRIVACY_POLICY_URL ${P_PRIVACY_POLICY_URL}

CMD npm run build:prod
