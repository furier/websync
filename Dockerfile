FROM node:latest

MAINTAINER Sander Struijk, furier84+docker@gmail.com

# set user root
USER root

# install base dependencies
RUN apt-get install sshpass

# create user
RUN useradd -m -d /home/wsuser -p wsuser wsuser

# set HOME env
ENV HOME /home/wsuser

# set working directory
WORKDIR /home/wsuser/websync

# make the wsuser own
RUN chown -R wsuser:wsuser /home/wsuser

# set user wsuser
USER wsuser

# install websync
RUN npm install websync

# create SSH key
RUN ssh-keygen -t rsa -N "" -f /home/wsuser/.ssh/id_rsa

# expose websync server port
EXPOSE  3000

# start websync
CMD npm start
