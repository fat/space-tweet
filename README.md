SPACE TWEET
=============

Space Tweet is a visualization of the twitter stream - it uses node.js and the twitter firehose to stage a match of good vs evil: every evil tweet creates a new space invader, while each positive tweet fires a bullet of good from the space defender... Watch the youtube demo @ http://www.youtube.com/watch?v=xvDzLODyDBo


INSTALLATION
============

You will need both node.js and npm installed to get Space Tweet running locally.

If you have those, just cd into the root of this repo and run:

    $ npm install .

boom! all server dependencies installed...

Oh crap?! something went wrong with the twitter-node dependecy?? If that's the case, don't sweat, it's a known issue: [dumb issue](http://stackoverflow.com/questions/4407531/twitter-node-failing-to-build-node-js-npm-install-twitter-node). The current fix, is to manually clone the repo [here](https://github.com/patmcnally/twitter-node) into a local directory, cd into it, then run "npm install .". If you run into any problems with that feel free to message me.

Next you need to get your client-side decencies (socket.io). To do that:

    git submodule update --init

This will add socket.io's magic to your public/javascript folder. awesome.


RUNNING THIS LOCALLY
====================

Once you've got everything installed, make sure to update the config.json with your twitter username and password! Then:

    node app.js

this will start up space tweet on port 3000... so go to your browser:

    localhost:3000

hopefully you should see space tweet!! hooray!