var preload = function(game){}

preload.prototype = {
	preload: function(){ 
		/*
		preload: se añaden en este estado todas los graficos assets del juego
		se cargaran antes de empezar el juego
		mediante el metodo ""load.setPreloadSprite" se añade la animacion 
		a la barra de carga antes de llegar a la portada del juego, 
		la cual tendra un ancho tan largo como tiempo tarde en la precarga 
		de los graficos
		*/
	  	var loadingBar = this.add.sprite(160,240,"loading");
	  	loadingBar.anchor.setTo(0.5,0.5);
	  	this.load.setPreloadSprite(loadingBar);
	  	
	  	var title = this.add.sprite(160,190,"gametitle");
	  	title.anchor.setTo(0.5,0.5);
	  	title.scale.set(0.5);
		title.smoothed = false;
	  	
	  	//imagenes
	  	this.game.load.image("background","assets/background.png");
	  	this.game.load.image("desert","assets/desert.png");
	  	this.game.load.image("cloud","assets/cloud.png");
	  	this.game.load.image("logo","assets/logoKangoo.png");
	    this.game.load.image("play","assets/play.png");
	    this.game.load.image("pole","assets/pole.png");
	    this.game.load.image("powerbar","assets/powerbar.png");
	  	this.game.load.image("kangoo","assets/kangoo.png");
	  	this.game.load.image("lava1","assets/lava1.png");
	  	this.game.load.image("lava2","assets/lava2.png");
	  	this.game.load.image("bg","assets/bg.png");
	  	this.game.load.spritesheet("btnGameMusic","assets/btnSound.png", 115, 110);
	  	//sonidos
	  	game.load.audio('sfx', 'assets/audio/Small Fireball-SoundBible.com-1381880822.mp3');
	  	game.load.audio('gameMusic', 'assets/audio/bodenstaendig_2000_in_rock_4bit.mp3');
	  	game.load.audio('btnSound', 'assets/audio/pickup.wav');

		
	},
  	create: function(){
		/*
		create: se inicializa el estado de la portada del juego
		*/
		this.game.state.start("GameTitle");
	}
}