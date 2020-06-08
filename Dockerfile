# see https://mherman.org/blog/dockerizing-an-angular-app/

#############
### build ###
#############

# build image
FROM node:12.11.1 as build

# install chrome for protractor tests
#RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
#RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
#RUN apt-get update && apt-get install -yq google-chrome-stable

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
#ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
#COPY package.json /app/package.json
#RUN npm install
RUN npm install -g @angular/cli@9.1.7
# RUN npm install -g angular-cli-ghpages

# add app
COPY . /app

RUN npm install
# run tests
#RUN ng test --watch=false
#RUN ng e2e --port 4202

# generate build
ARG NG_CONFIG=""
ARG NG_BASE_HREF=""
RUN ng build --configuration=$NG_CONFIG --baseHref $NG_BASE_HREF --output-path dist

#############
### serve ###
#############

# base image
FROM bremersee/scs:latest

# copy artifact build from the 'build environment'
COPY --from=build /app/dist /opt/content
ARG APP_NAME="app"
ARG APP_PREFIX="/**"
RUN echo "$APP_NAME" > /opt/app.name.conf
RUN echo "$APP_PREFIX" > /opt/app.prefix.conf
