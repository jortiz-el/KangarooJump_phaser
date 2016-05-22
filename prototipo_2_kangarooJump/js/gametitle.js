var gameTitle = function(game){}

var clouds,
	gameMusic,
	soundButton,
	btnSound;

gameTitle.prototype = {
  	create: function(){
	    /*
	    * se añade la imagen de fondo mediante el metodo add.sprite()
	    * background es la primera imagen en el juego
	    * se añade como sprite para asignar animación
	     */
		var background = this.game.add.sprite(0,0,"background");
		background.anchor.setTo(0.08,0);
		background.scale.set(0.2);
		/*
		* creacion del grupo de nubes
		* mediante el metodo game.add.group() creamos un grupo
		* donde se iran incluyendo todas las nubes con el metodo .add()
		* se habilita para todo el grupo la fisica ARCADE
		* y se crea un evento que se disparara cada 1.7 segundos para
		* crear nuevas nubes con el metodo createCloud()
		 */
		clouds = game.add.group();
		clouds.enableBody = true;
    	clouds.physicsBodyType = Phaser.Physics.ARCADE;
		this.time.events.loop(1700, createCloud, this);

		var desert = this.game.add.sprite(0,230,"desert");
		desert.anchor.setTo(0.08,0);
		desert.scale.set(0.16);

		var logo = this.game.add.sprite(160,240,"logo");
		logo.anchor.setTo(0.5,0.5);
		logo.scale.set(0.45);

		var gameTitle = this.game.add.sprite(160,90,"gametitle");
		gameTitle.anchor.setTo(0.5,0.5);
		/*
		* Añadir funcionalidad al boton de Jugar para que entre al siguiente estado de juego
		* mediante la funcion playTheGame 
		* se añade una animacion mediante la funcion tween() de phaser
		* en boton cada segundo se escala de 0.6 a 0.7 
		*/
		var playButton = this.game.add.button(160,390,"play",this.playTheGame,this);
		playButton.scale.set(0.6);
		playButton.anchor.setTo(0.5,0.5);
		this.add.tween(playButton.scale).to({
		 x: 0.7, y: 0.7
		},1000,Phaser.Easing.Linear.None,true,0,1000,true);
		/*
		* soundButton boton que llama al metodo this.changeStateSound
		* en el que se cambia el frame del boton de doble posicion
		* y se pausa o reinicia la musica segun corresponda
		 */
		soundButton = this.game.add.button(250,410,"btnGameMusic", this.changeStateSound,this);
		soundButton.scale.set(0.5);
		
		/*
		* Añadir al juego Musica principal 
		* se añade funcionalidad de loop para que suene en bucle
		 */
		gameMusic = game.add.audio('gameMusic');
	    gameMusic.allowMultiple = true;
	    gameMusic.loop = true;
	  	gameMusic.play();
	  	/*
	  	* añadir sonido a los botones al pulsar
	  	 */
	    btnSound = game.add.audio('btnSound');
	    btnSound.allowMultiple = true;
		
		
	   
	},
	update: function() {

	/*
	* con setAll() añadimos una velocidad constante en este caso
	* sobre el eje x a todos los elementos dentro del grupo clouds
	* para que las nubes tengan animación de derecha a izquierda
	 */
	clouds.setAll('x', -1, true, true, 1);
	
	//console.log(game.rnd.integerInRange(0,game.world.height/2));

	},
	playTheGame: function(){
		this.game.state.start("TheGame");
	},
	changeStateSound: function(){
		//btnSound.play();
		if (soundButton.frame == 0) {
			soundButton.frame = 1;
			gameMusic.pause();
		}else {
			soundButton.frame = 0;
			gameMusic.resume();
		}
	}
}

/*
* función createCloud() 
* creamos una nube con un rango de la mitad del juego en eje Y hacia arriba
* establecemos el tamaño y llamada a una funcion checkCloud()
* en caso de que la nuve salga del mundo del juego
 */
function createCloud() {
    var size  = game.rnd.integerInRange(40,60)/100;
    //console.log(size);
    var cloud = clouds.create(game.world.width + 50, game.rnd.integerInRange(0,game.world.height/2), "cloud");
	cloud.anchor.setTo(0.5,0.5);
	cloud.scale.set(size);
	cloud.checkWorldBounds = true;
    cloud.events.onOutOfBounds.add(checkCloud, this);

}
/*
* función checkCloud()
* si la nube sale del mundo del juego llama a esta funcion
* se remueve el elemento del grupo
 */	
function checkCloud(cloud) {
    clouds.remove(cloud);
}
		
