/*
 * SpaceTweet (space... video games... twitter. )
 *
 * @author Jacob Thornton <@fat> || <jacob@twitter.com>
 * @license The MIT license. 2011
 *
 * note: this is outer-freaking-space. get with it.
 */

var io = require('socket.io')
  , fs = require('fs')
  , TwitterNode = require('twitter-node').TwitterNode;

module.exports = function (app) {
  var socket = io.listen(app)
    , twitterStream
    , buffer = []
    , config = JSON.parse(fs.readFileSync("./config.json", 'UTF-8'));

  socket.on('connection', function (client) {

    client.on('message', function (message) {
        if (twitterStream) {
          return;
        }

        twitterStream = new TwitterNode({
          user: config.user
        , password: config.password
        , track: JSON.parse(message)
        })

          .addListener('tweet', function (tweet) {
            client.broadcast({ tweet: tweet });
          })

          .addListener('end', function (stream) {
            console.log(stream);
          })

        .stream();
    });

  });

  return function (req, res) {
    res.render('space');
  };
}