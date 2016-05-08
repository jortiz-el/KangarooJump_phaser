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
	  	
	  	this.game.load.image("background","assets/background.png");
	  	this.game.load.image("desert","assets/desert.png");
	  	this.game.load.image("cloud","assets/cloud.png");
	  	this.game.load.image("logo","assets/logoKangoo.png");
	    this.game.load.image("play","assets/play.png");
	    this.game.load.image("pole","assets/pole.png");
	    this.game.load.image("powerbar","assets/powerbar.png");
	  	this.game.load.image("kangoo","assets/kangoo.png");

		
	},
  	create: function(){
		/*
		create: se inicializa el estado de la portada del juego
		*/
		this.game.state.start("GameTitle");
	}
}