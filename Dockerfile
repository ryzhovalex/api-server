# Install dependencies only when needed
FROM node:16
WORKDIR /app

USER root
COPY package.json yarn.lock* ./
RUN yarn install

COPY . .

CMD ["yarn", "prod"]
