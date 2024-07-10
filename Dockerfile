FROM node:18-alpine

RUN apk add --no-cache bash

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

# COPY waiting.sh ./

# RUN chmod +x waiting.sh

COPY . .

# RUN yarn run typeorm:run-migrations

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]