/**
  * SpaceTweet (space... video games... twitter. )
  *
  * @author Jacob Thornton <@fat> || <jacob@twitter.com>
  * @license The MIT license. 2011
  *
  */

var express = require('express')
  , app = express.createServer()
  , spaceTweet = require('./lib/space-tweet')
  , port = 3000;

//config
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

//Routes
app.get('/', spaceTweet(app));

//Run
app.listen(port);

//It's Log! Log! Log! Better than bad, it's good!
console.log('Beware of the invasion on: ' + port);