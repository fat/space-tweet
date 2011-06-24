/**
 * Module dependencies.
 */

var sio = require('socket.io')
  , fs = require('fs')
  , TwitterNode = require('twitter-node').TwitterNode
  , config = JSON.parse(fs.readFileSync('./config.json'));

/**
 * Exports.
 */

module.exports = function (app) {

  var io = sio.listen(app);

  var twitterStream = new TwitterNode({
      user: config.user
    , password: config.password
    , track: ['good', 'bad', 'lame', 'dumb']
  });

  twitterStream.addListener('tweet', function (tweet) {
    io.sockets.emit('tweet', tweet);
  })

  twitterStream.stream();

  return function (req, res) {
    res.render('space');
  };
}