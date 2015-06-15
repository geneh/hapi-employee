# Docker version 1.6.X
#
# To build: docker build --force-rm=true -t ghazan/hapi-employee:1.0.0 .
# To run:   docker run -d -p 80:3000 -e "COUCHDB_HOSTNAME=192.168.59.103" ghazan/hapi-employee:1.0.0
# To tag:   docker <container_id> -t ghazan/hapi-employee:latest
#
# Poke at the environment:
#   docker run -t -i -p 80:3000  ghazan/hapi-employee:1.0.0 /bin/bash

# Install Guest OS
FROM    debian:latest

# Declare who maintains the image
MAINTAINER Gene Hazan <ghazan@costco.com>

# Update Guest OS packages and install any needed packages
RUN apt-get update && apt-get install -y curl

# Install Node.js or iojs using NVM
RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | bash && . ~/.bashrc  && nvm install 2.2.1 && nvm alias default 2.2.1

# Clean up unnecessary packages.  Goal is to reduce size.
RUN apt-get purge -y curl; apt-get clean && apt-get autoclean && apt-get -y autoremove && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Add production version of your application.
WORKDIR /root
RUN mkdir -p server
ADD . server

# Expose port needed for Node.js or iojs
EXPOSE 3000

# Start Node.js or iojs application
CMD ["/bin/bash", "-c", ". ~/.bashrc && cd server && node . $COUCHDB_HOSTNAME"]
