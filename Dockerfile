#
# Select Base image, we choose a Nodejs base 
# because it has already all the ingredients for 
# our Nodejs app
#
FROM    dockerfile/nodejs

#
# Bundle our app source with the container, we
# could also be fetching the code from a git 
# repo, or really anything else.
#
ADD . /src

#
# Install app dependencies - Got to install them 
# all! :)
#
RUN cd /src; npm install; npm install -g bower; bower install --allow-root

# 
# Which ports you want to be exposing from this 
# container
#
EXPOSE  3000

#
# Specify the runtime (node) and the source to 
# be run
#
CMD ["node", "/src/server.js"]

#
# Note: You can do pretty much anything you 
# would do in a command line, using the `RUN` 
# prefix 
#
