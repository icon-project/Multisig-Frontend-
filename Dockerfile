FROM node:22-alpine AS build

WORKDIR /app

# Install deps required for node-gyp addons like `usb`
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    linux-headers \
    eudev-dev \
    pkgconfig

# Hint node-gyp which python to use
ENV PYTHON=python3

# Install JS deps
COPY package.json yarn.lock ./
RUN yarn install

# Build app
COPY . .
RUN yarn run build


# --- Production image ---
FROM node:22-alpine AS production

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist /app/dist

EXPOSE 3010
CMD ["serve", "-s", "/app/dist", "-l", "3010"]
