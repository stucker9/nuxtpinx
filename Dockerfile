FROM node:lts-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json, pnpm-lock.yaml and .npmrc
COPY package.json pnpm-lock.yaml .npmrc ./

# Install dependencies
RUN pnpm install

COPY . .

EXPOSE 3000

RUN pnpm build
CMD [ "node", ".output/server/index.mjs" ]
