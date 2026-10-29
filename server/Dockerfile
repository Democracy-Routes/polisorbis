# To build locally, for example:
# docker build -t polis-server:local .
# To run locally, for example:
# docker run --rm --name polis-server --env-file .env --network polis-dev_polis-net \
#  -p 5000:5000 --target dev polis-server:local
#
# For a dev build, use `--target dev`.
# Should default to prod build, but you can also explicitly use `--target prod`

FROM docker.io/node:18-slim AS base

ARG NODE_ENV

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    cron \
    curl \
    g++ \
    libpq-dev \
    make \
    python3 \
    && rm -rf /var/lib/apt/lists/*

COPY prune.sh /usr/local/bin/
COPY startup.sh /usr/local/bin/startup
RUN chmod +x /usr/local/bin/prune.sh /usr/local/bin/startup

COPY package*.json ./

EXPOSE 5000

# Egress lock-down defaults: with these defaults the server does not send data to
# third-party services (email, MaxMind, Google, Akismet, Twitter, Facebook).
# OpenID (P_OPENID_*) is intentionally left untouched.
# These are declarative defaults only: runtime values from .env / docker compose
# override them, and the code enforces the same behavior when values are empty.
ENV SHOULD_USE_TRANSLATION_API=false \
    EMAIL_TRANSPORT_TYPES= \
    MAILGUN_API_KEY= \
    MAILGUN_DOMAIN= \
    AWS_REGION= \
    AWS_ACCESS_KEY_ID= \
    AWS_SECRET_ACCESS_KEY= \
    MAXMIND_USER_ID= \
    MAXMIND_LICENSE_KEY= \
    GOOGLE_API_KEY= \
    GOOGLE_CREDENTIALS_BASE64= \
    GOOGLE_CREDS_STRINGIFIED= \
    GOOGLE_APPLICATION_CREDENTIALS= \
    AKISMET_ANTISPAM_API_KEY= \
    TWITTER_CONSUMER_KEY= \
    TWITTER_CONSUMER_SECRET= \
    FB_APP_ID= \
    AI_PROVIDER_BASE_URL= \
    AI_PROVIDER_API_KEY= \
    AI_MODEL= \
    AI_PROVIDER_NAME= \
    AI_JSON_MODE=


# Define the development build

FROM base AS dev

# Set default NODE_ENV to development unless overridden at build time with --build-arg NODE_ENV=production
ENV NODE_ENV ${NODE_ENV:-development}

COPY . .

CMD ["/usr/local/bin/startup", "npm", "run", "dev"]



# Define the production build

FROM base AS prod

# Set default NODE_ENV to production unless overridden at build time with --build-arg NODE_ENV=development
ENV NODE_ENV ${NODE_ENV:-production}

RUN npm ci --production=false

# For prod builds, to minimize the image size, remove build dependencies.
RUN apt-get update && apt-get purge -y --auto-remove g++ make python3 && rm -rf /var/lib/apt/lists/*

COPY . .

RUN npm run build

CMD ["/usr/local/bin/startup", "npm", "run", "serve"]


