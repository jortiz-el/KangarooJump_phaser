


/*
* boot inicializacion
 */
var boot = function(game){
	console.log("%cStarting Kangaroo Jump", "color:white; background:red");
};
  
boot.prototype = {
	preload: function(){
		/*
		preload: cargamos la imagen de loading y el titulo del juego
		 */
        this.game.load.image("loading","assets/loading.png"); 
        this.game.load.image("gametitle","assets/title.png");
	},
  	create: function(){
  		/*
  		create : se inicializa el boot 
  		el juego se escala para adaptarse a los distintos dispositivos
  		y se inicia el estado de Preload
  		 */
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.setScreenSize();
		this.game.state.start("Preload");
	}
}