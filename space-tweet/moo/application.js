/* WHAT. ?? 8!o
======================*/

var Visualization = new Class({
  //the ugly
  
  images: {},
  invaders: [],
  folders: ['a','b','c','d','e'],
  ship: null,
  rowWidth: 0,
  gen: 0,
  gameisover: false,
  periodical: null,
  
  i: 0,
  
  initialize: function(){
    this.initCanvas();
    this.initSocket();
    this.listen();
  },
  
  checkContact: function(bullet){
    for(var i = 0, l = this.invaders.length; i < l; i++){
      if (((this.invaders[i].left < (bullet[0] + bullet[2])) && 
          ((this.invaders[i].left + 60) > bullet[0]) &&
          (this.invaders[i].top < (bullet[1] + bullet[3])) && 
          (this.invaders[i].top + 60) > bullet[1])){
            //it's a hit!
            this.ship.bullets.splice(this.ship.bullets.indexOf(bullet),1);
            this.invaders[i].destroy();
            break;
      }    
    }
  },
  
  initCanvas: function(){
    this.canvas = new Canvas({ 
      id: 'space', 
      width: $(window).getSize().x - 5, 
      height: $(window).getSize().y -55
    });
    this.rowWidth = Math.round(this.canvas.width / 60) - 2;
    $(document.body).adopt(this.canvas);
    this.ctx = this.canvas.getContext('2d');  
  },
  
  initSocket: function(){
    io.setPath('/client/');
    this.socket = new io.Socket(null, {rememberTransport: false, port: 8080});
    this.socket.connect();
  },
  
  listen: function(){    
    //preload images
    var x = ((this.folders.length * 3) * 2) + 2, y = 0, z = false;
    var fn = function(e){
      if(e) y++;
      if(x == y && z){
        this.ship = new Ship(this);
        this.socket.addEvent('message', this.socketListener = function(message){
          this.process(message);
        }.bind(this));
        this.periodical = this.move.bind(this).periodical(100);
      }
    }.bind(this);
      
    this.images.boom = new Image();   
    this.images.ship = new Image(); 
    this.images.boom.onload = fn;   
    this.images.ship.onload = fn; 
    this.images.boom.src = '/img/boom.png';    
    this.images.ship.src = '/img/ship.png';
    
    for(var i = 0, l = this.folders.length; i < l; i++){
      for (var j = 1, k = 3; j <= k; j++){
        var up = 'invader'+this.folders[i]+j;
        var down = 'invader'+this.folders[i]+j+'_o'; 
        this.images[up] = new Image();
        this.images[down] = new Image();
        this.images[up].onload = fn;
        this.images[down].onload = fn;
        this.images[up].src = '/img/'+this.folders[i]+'/alien'+j+'.png';
        this.images[down].src = '/img/'+this.folders[i]+'/alien'+j+'-open.png';
      }
    }
    z = true;
    fn(false);
      
  },
  
  gameover: function(){
    if(this.gameisover) return;
    this.gameisover = true;
    $clear(this.periodical);
    this.socket.removeEvent('message', this.socketListener);
    this.invaders = [];
    this.gen = 0;
    this.i = 0;
    this.images.gameover = new Image();
    this.images.insertcoin = new Image();  
    this.images.gameover.onload = function(){
      var top = (this.canvas.height/2)-270;
      var width = (this.canvas.width/2)-193;
      var width2 = (this.canvas.width/2)-122;
      var top2 = top + 470;
      var blink = false;
      
      this.periodical = (function(){
        this.canvas.width = this.canvas.width;
        this.ctx.drawImage(this.images.gameover, width, top);
        if(blink) this.ctx.drawImage(this.images.insertcoin, width2, top2);
        blink = !blink;
      }.bind(this)).periodical(500);
      
      (function(){
        $clear(this.periodical);
        this.restart();
      }.bind(this)).delay(5000);
      
    }.bind(this);
    
    this.images.gameover.src = '/img/gameover.png'; 
    this.images.insertcoin.src = '/img/insertcoin.png'; 
  },
  
  restart: function(){
    this.socket.addEvent('message', this.socketListener);
    this.periodical = this.move.bind(this).periodical(100);
    this.gameisover = false;
  },
  
  move: function(){
    this.canvas.width = this.canvas.width;
    if(this.i==5){
      this.i=0;
      this.invaders.each(function(invader){
        invader.open = !invader.open
        invader.slide();
      }.bind(this));
    }
    else{
      this.i++;
      this.invaders.each(function(invader){
        invader.draw();
      }.bind(this));
    }
    this.ship.slide();
  },
  
  process: function(message){
    var text = message.tweet.text;
    if(text.test('good')){//eeeat's good.
      this.ship.shoot();
    }
    else{ //shit's evil!
      this.canvas.width = this.canvas.width;
      var newRow = !(this.gen % this.rowWidth);
      this.invaders.each(function(invader){
        invader.shove(newRow);
      }.bind(this));
      
      this.invaders.push(new Invader(this, message.tweet, Math.ceil((this.gen / this.rowWidth)+.0000001)));
      
      this.gen++;
      
      this.ship.draw();
    }
  },
  
  propagate: function(move, row){
    var x;
    for(var i = 0, l = this.invaders.length; i < l; i++){
      if(this.invaders[i].row == row){
        this.invaders[i].direction = move;
        x = true
      }
      else if(x){
        break; //exit when done with row
      }
    }
  }
  
});

var Ship = new Class({
  //the good
  
  top: 0,
  left: 0,
  direction: 'right',
  image: null,
  bullets: [],

  initialize: function(manager){
    this.manager = manager;
    this.image = this.manager.images.ship;
    this.top = this.manager.canvas.height - 45;
    this.manager.ctx.fillStyle = "rgb(255,255,255)";
    this.draw();
  },
  
  draw: function(){
    this.manager.ctx.drawImage(this.image,this.left, this.top);
    if(this.bullets.length) this.drawBullets();
  },
  
  drawBullets: function(){
    this.bullets.each(function(bullet,i){
      this.manager.ctx.fillStyle = '#fff';
      this.manager.ctx.fillRect(bullet[0],bullet[1],bullet[2],bullet[3]);
      this.bullets[i][1] -= 20;
      if(this.bullets[i][1] < 0) this.bullets.splice(i,1);
      this.manager.checkContact(bullet);
    }.bind(this));
  },
  
  shoot: function(){
    this.bullets.push([this.left+28,this.top-25, 5,15]);
  },
  
  slide: function(){
  
    //manage direction
    if(this.direction == 'right'){
      this.left += 10;
      if(this.left+60 >= this.manager.canvas.width){
        this.direction = 'left';
      }
    }
    else {
      this.left -= 10;
      if(this.left <= 0){
        this.direction = 'right';
      }
    }

    this.draw();
  }

});

var Invader = new Class({
  //the bad
  
  message: null,
  
  image: null,
  image_o: null,
  
  top: -60,
  left: 0,
  
  open: false,
  direction: 'right',
  rowComplete: false,
  
  
  initialize: function(manager, tweet, row){
    this.manager = manager;
    this.tweet = tweet;
    this.row = row;
    this.process();
    this.draw();
  },

  destroy: function(){
    //boom!
    this.manager.ctx.drawImage(this.manager.images.boom, this.left, this.top);
    this.manager.invaders.splice(this.manager.invaders.indexOf(this),1);
  },
  
  draw: function(){
    this.manager.ctx.drawImage(this.open ? this.image : this.image_o, this.left, this.top);
  },

  process: function(){
    var i;
    if(this.tweet.text.test('lame')){
      i = 1;
    }
    else if(this.tweet.text.test('dumb')){
      i = 2;
    }
    else {
      i = 3;
    }
    
    this.image = this.manager.images['invader'+this.manager.folders[this.row % 5]+i];
    this.image_o = this.manager.images['invader'+this.manager.folders[this.row % 5]+i+'_o'];
  },
  
  slide: function(){
    //manage direciton
    if(this.direction == 'right'){
      this.left += 5;
      if(this.left+60 >= this.manager.canvas.width){
        this.direction = 'left';
        this.manager.propagate('left', this.row);
      }
    }
    else {
      this.left -= 5;
      if(this.left <= 0){
        this.direction = 'right';
        this.manager.propagate('right', this.row);
      }
    }
    this.draw();
  },
  
  shove: function(row){
    if(row) {
      this.top +=60;
      this.rowComplete = true;
      if(this.top + 60 >= this.manager.canvas.height) this.manager.gameover();
    }
    if(!this.rowComplete) this.left += 60;
    
    this.draw();
  }

});