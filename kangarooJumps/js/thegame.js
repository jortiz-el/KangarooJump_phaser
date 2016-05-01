var theGame = function(game){}

var kangoo,
	kangooGravity = 800,
	placedPoles,
	poleGroup,
    minPoleGap = 80,
    maxPoleGap = 120,
    powerBar,
    powerTween,
    kangooJumpPower,
    kangooJumping,
    kangooFallingDown,
    pointerDuration ;

theGame.prototype = {
  	create: function(){

  		
  		kangooJumping = false;
		kangooFallingDown = false;
		/*
		* se inicializa el posicionamiento de las Poles
		* y se añade a la variable poleGroup la posibilidad de
		* generar grupos de Poles
		 */
		placedPoles = 0;
		poleGroup = this.add.group();
		/*
		* se añade al juego el modelo de fisica ARCADE
		 */
		this.physics.startSystem(Phaser.Physics.ARCADE);
		/*
		se añade el Kangaroo y se habilita la fisica arcarde
		con la funcion physics.arcade.enable
		la gravedad del kangaroo inicial sera de 800
		 */
		kangoo = this.add.sprite(30, 0, "kangoo");
		kangoo.scale.set(0.2);
		kangoo.anchor.set(0.5);
		kangoo.lastPole = 1;
		this.physics.arcade.enable(kangoo);              
		kangoo.body.gravity.y = kangooGravity;

		/*
		* se añade funcionalidad al pulsar con el puntero (raton) o
		* en dispositivos moviles con el dedo
		 */
		this.input.onDown.add(function(){ return prepareToJump(this);}, this);
		//añadir la primera pole en posicion x = 30
		addPole(30, this);
		
	},
	update: function(){
		//this.physics.arcade.collide(kangoo, poleGroup, checkLanding);
		this.physics.arcade.collide(kangoo, poleGroup);
		//var l = this.add.text(32, 64, 'Animation looped', { fill: 'white' });
		
		try {
			/*
			si la posicion y del Kangaroo es mayor que el alto del juego
			el canguro muere mediante la funcion die()  
			 */
			if(kangoo.y > window.innerHeight){
				alert("kangoo muerto");
				die(this);
			}
		}catch (e) {
			console.log(e);
		}
		pointerDuration = this.input.activePointer.duration;
		
	}
	
}




/*
*
 */
function prepareToJump(game){
	
	//console.log(n);
	console.log(kangoo.x);
	
	

	
	if(kangoo.body.velocity.y == 0){

          powerBar = game.add.sprite(kangoo.x, kangoo.y-50, "powerbar");
          powerBar.width = 0;
          
          console.log(game.add.tween(powerBar).to);
        kangoo.body.velocity.y = 200;

          /*powerTween = game.add.tween(powerBar).to({
		   width:100
		}, 1000, "Linear.none",true); 
          console.log(powerTween);
          powerTween.start();*/

         game.input.onDown.remove(function(){return prepareToJump(game);}, this);
          game.input.onUp.add(function(){return jump(game);}, this);
          //alert("barra de carga");
      } 
          	
} 

/*
*
 */
function jump(game){
	  //kangooJumpPower= -powerBar.width*3-100
	  //powerBar.destroy();
	  //game.tweens.removeAll();
	  kangoo.body.velocity.y = 200*2;
	  kangooJumping = true;
	  //powerTween.stop();
	  game.input.onUp.remove(function(){return jump(game);}, this);
 }

 /*
*
 */
function addNewPoles(){
 	var maxPoleX = 0;
	poleGroup.forEach(function(item) {
		maxPoleX = Math.max(item.x,maxPoleX)			
	});
	var nextPolePosition = maxPoleX + theGame.rnd.between(minPoleGap,maxPoleGap);
	addPole(nextPolePosition, theGame);			
}

/*
* funcion addPole()
* recoge dos , un parametro poleX que es la posicion X en el juego
* y otro parametro game que es el juego en si
* si la posicion de la poleX es menor que el ancho del juego * 2
* añadira una nueva pole entre el minimo y el maximo establecido
 */
function addPole(poleX, game){
	if(poleX < window.innerWidth * 2){
		placedPoles++;
		var pole = new Pole(game,poleX,game.rnd.between(280,400));
		game.add.existing(pole);
        pole.anchor.set(0.5,0);
		poleGroup.add(pole);
		var nextPolePosition = poleX + game.rnd.between(minPoleGap,maxPoleGap);
		addPole(nextPolePosition, game);
	}
} 

/*
* funcion die()
* recoge un parametro thisGame que es el juego en el que esta 
* mata al canguro llamando a un nuevo estado de juego
 */
function die(thisGame){
	//localStorage.setItem("topKangooScore",Math.max(score,topScore));	
	thisGame.game.state.start("TheGame");
}


/*
*
 */
Pole = function (thisGame, x, y) {
	Phaser.Sprite.call(this, thisGame, x, y, "pole");
	thisGame.physics.enable(this, Phaser.Physics.ARCADE);
	this.scale.set(0.2);
    this.body.immovable = true;
    this.poleNumber = placedPoles;
};

Pole.prototype = Object.create(Phaser.Sprite.prototype);
Pole.prototype.constructor = Pole;
Pole.prototype.update = function() {
      if(kangooJumping && !kangooFallingDown){
           this.body.velocity.x = kangooJumpPower;
      }
      else{
           this.body.velocity.x = 0
      }
	if(this.x<-this.width){
		this.destroy();
		addNewPoles();
	}
}
