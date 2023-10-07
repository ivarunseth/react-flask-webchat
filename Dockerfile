# This Dockerfile builds the React client and API together

# Build step #1: build the React front end
FROM node:18.17.1-alpine as build-step
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY ./src ./src
COPY ./public ./public
RUN yarn install
RUN yarn build

# Build step #2: build the API with the client as static files
FROM python:3.9.18-alpine
# Create a non-root user
RUN adduser -D varunseth
WORKDIR /app
RUN mkdir ./logs && chown 666 ./logs
COPY --from=build-step /app/build ./build
RUN apk update && apk add supervisor
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY ./api ./api
COPY ./migrations ./migrations
COPY app.py app.py
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
ENV FLASK_ENV production

# Set the user to run the app
USER varunseth

EXPOSE 5000

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
