FROM node:16 AS base
WORKDIR /usr/src/app
ENV REACT_APP_BACKEND_URL=http://localhost:3000
COPY . .

FROM base AS test
RUN npm ci
ENV CI=true
RUN npm run test

FROM base AS build
RUN npm ci
ENV CI=true
RUN npm run test
RUN npm run build

FROM nginx:1.20-alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
