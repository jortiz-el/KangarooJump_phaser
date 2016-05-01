var gameTitle = function(game){}

gameTitle.prototype = {
  	create: function(){

		var background = this.game.add.sprite(0,0,"background");
		background.anchor.setTo(0.08,0);
		background.scale.set(0.2);

		var logo = this.game.add.sprite(160,240,"logo");
		logo.anchor.setTo(0.5,0.5);
		logo.scale.set(0.45);

		var gameTitle = this.game.add.sprite(160,90,"gametitle");
		gameTitle.anchor.setTo(0.5,0.5);


		/*
		Añadir funcionalidad al boton de Jugar para que entre al siguiente estado de juego
		mediante la funcion playTheGame 
		 */
		var playButton = this.game.add.button(160,390,"play",this.playTheGame,this);
		playButton.scale.set(0.7);
		playButton.anchor.setTo(0.5,0.5);
	},
	playTheGame: function(){
		this.game.state.start("TheGame");
		
	}
}	
		
