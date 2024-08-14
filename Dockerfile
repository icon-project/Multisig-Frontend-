FROM node:20-alpine
RUN mkdir -p /app

WORKDIR /app

RUN yarn
RUN npm i -g serve

COPY . .
COPY .env .

RUN npm run build

EXPOSE 3010

# Specify the command to run your application
CMD ["serve", "-s", "-p", "3010", "dist"]
