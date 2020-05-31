# see https://mherman.org/blog/dockerizing-an-angular-app/

#############
### build ###
#############

# base image
FROM node:13.10.1 as build

# install chrome for protractor tests
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -yq google-chrome-stable

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install
RUN npm install -g @angular/cli@8.3.25
# RUN npm install -g angular-cli-ghpages

# add app
COPY . /app

# run tests
# RUN ng test --watch=false
# RUN ng e2e --port 4202

# generate build
RUN ng build --prod --baseHref /home/ --output-path dist

############
### prod ###
############

# base image
FROM bremersee/scs:snapshot

# copy artifact build from the 'build environment'
COPY --from=build /app/dist /opt/content
