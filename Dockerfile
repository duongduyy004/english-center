FROM node:22-alpine

# Create app directory
WORKDIR /eng-center

# A wildcard is used to ensure both package.json and package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install --legacy-peer-deps

RUN npm i -g @nestjs/cli@10.0.3

#Bundle app source
COPY . .

# Creates a "dist" folder with production build
RUN npm run build

# Start the server using the production build
CMD ["node","dist/main.js"] 