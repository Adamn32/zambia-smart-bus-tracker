# ----------------------------------------------------------------------------
# Project     : Zambia Smart Bus Tracker
# Module      : Dockerfile
# Author      : Adam ChapChap Ng'uni
# Date        : 2026-03-20
# Time        : 10:54:11 CAT
# Description : Container build instructions for the frontend React application.
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
