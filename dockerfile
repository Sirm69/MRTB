FROM node:18-alpine AS builder
WORKDIR /app

RUN apk add --no-cache python3 make g++ libc6-compat

COPY package.json yarn.lock ./
COPY patches ./patches

COPY public ./public

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build --no-lint

FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/package.json ./ 
COPY --from=builder /app/yarn.lock ./ 
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

ENV NODE_ENV=production

CMD ["yarn", "start"]
