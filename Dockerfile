FROM node:20-alpine
RUN mkdir -p /app

WORKDIR /app

RUN yarn
RUN npm i -g serve

COPY . .
COPY .env .

EXPOSE 3010

# Specify the command to run your application
CMD ["npm", "run", "dev"]
