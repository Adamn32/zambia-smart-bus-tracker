# ----------------------------------------------------------------------------
# Project     : Zambia Smart Bus Tracker
# Module      : Dockerfile
# Author      : Adam ChapChap Ng'uni
# Date        : 2026-03-20
# Time        : 10:54:11 CAT
# Description :
#   Builds the frontend container and serves compiled static assets.
#
#   This file's role in the codebase:
#     - installs Node dependencies for React build pipeline
#     - compiles production bundle from public/src directories
#     - prepares the image used to host frontend in compose setup
#
# Notes:
#   Build and runtime Node/tooling versions should stay mutually compatible.
# ----------------------------------------------------------------------------

FROM node:20
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY public public
COPY src src
RUN npm run build
RUN npm install -g serve
CMD ["serve","-s","build","-l","3000"]
