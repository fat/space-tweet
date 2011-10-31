SPACE TWEET
=============

Space Tweet is a visualization of the twitter stream - it uses node.js and the twitter firehose to stage a match of good vs evil: every evil tweet creates a new space invader, while each positive tweet fires a bullet of good from the space defender... Watch the youtube demo @ http://www.youtube.com/watch?v=xvDzLODyDBo

![spacetweet](http://f.cl.ly/items/1A2u2f052C0s1h2r1F15/screenshot.png)

INSTALLATION
============

You will need both node.js and npm installed to get Space Tweet running locally.

If you have those, just cd into the root of this repo and run:

    $ npm install .

boom! all server dependencies installed...

RUNNING THIS LOCALLY
====================

Once you've got everything installed, make sure to update the config.json with your twitter username and password! Then:

    sudo node server.js

this will start up space tweet on port 3000... so go to your browser:

    localhost:3000

hopefully you should see space tweet!! hooray!
