# Use an official Node runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Install git
RUN apt-get update && \
    apt-get install -y git

# Clone the desired git repository
RUN git clone https://github.com/ZhenXunGe/zkwasm-react-template .

# Install any needed packages specified in package.json
RUN npm install

# Run npm build
RUN npm run build

# Your application is now built, you can add commands to run it
ENTRYPOINT [ "npm ", "run start" ]
