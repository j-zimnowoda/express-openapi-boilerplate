# --------------- Dev stage for developers to override sources
FROM node:14-slim as dev

ENV NODE_ENV=development

RUN mkdir /app
WORKDIR /app
COPY package*.json ./
RUN yarn install --frozen-lockfile

# --------------- CI stage
FROM dev as ci

COPY . .eslintrc.yml ./
ARG CI=true
ENV NODE_ENV=test

RUN yarn lint && yarn test

RUN yarn build-all

# --------------- Clean stage
FROM dev as clean
# below command removes the packages specified in devDependencies
RUN npm prune --production
# --------------- Production stage
FROM node:14.17-alpine AS prod

RUN mkdir /app
WORKDIR /app
COPY --from=clean /app/node_modules node_modules
COPY --from=ci /app/dist dist
COPY package.json .

USER node
EXPOSE 8080
ENV NODE_ENV=production

CMD ["node", "dist/tsc/app.js"]
