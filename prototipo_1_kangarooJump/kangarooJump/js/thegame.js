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
  		/*
  		*se inicializa a false que el canguro este saltando y callendo
  		 */
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
		this.input.onDown.add(prepareToJump, this);
		//añadir la primera pole en posicion x = 30
		addPole(30);
		//añade texto en pantalla de prototipo
		var style = { font: "45px Arial", fill: "#ff0044", align: "center" };
		var bmpText = this.add.text(40, 100,'Prototipo: 1', style);
		
	},
	update: function(){
		/*
		* se establecen las fisicas de colision entre el canguro y las poles
		 */
		this.physics.arcade.collide(kangoo, poleGroup, checkLanding);
		
		try {
			/*
			si la posicion y del Kangaroo es mayor que el alto del juego
			el canguro muere mediante la funcion die()  
			 */
			if(kangoo.y > game.height){
				alert("kangoo muerto");
				die(this);
			}
		}catch (e) {
			console.log(e);
		}
		pointerDuration = this.input.activePointer.duration;
		console.log("pointer duration: "+pointerDuration);

		
	}
	
}


/*
* funcion pepareToJump()
* se prepara para el salto y si el canguro tiene una velocidad 
* en el eje y = 0  se añade la funcionalidad de salto al soltar 
* el imput (raton o dedo)
 */
function prepareToJump(){
	
	console.log(game);
	if(kangoo.body.velocity.y==0){
	      powerBar = game.add.sprite(kangoo.x,kangoo.y-50,"powerbar");
	      powerBar.width = 100;
	    /*  powerTween = game.add.tween(powerBar).to({
		   width:100
		}, 1000, "Linear",true);*/ 
	      game.input.onDown.remove(prepareToJump, this);
	      game.input.onUp.add(jump, this);
	  } 
          	
} 

/*
*
 */
function jump(){
	  kangooJumpPower= -pointerDuration;
	  powerBar.destroy();
	  //game.tweens.removeAll();
	  kangoo.body.velocity.y = kangooJumpPower*2;
	  kangooJumping = true;
	  //powerTween.stop();
	  game.input.onUp.remove(jump, this);
 }

 /*
*
 */
function addNewPoles(){
 	var maxPoleX = 0;
	poleGroup.forEach(function(item) {
		maxPoleX = Math.max(item.x,maxPoleX)			
	});
	var nextPolePosition = maxPoleX + game.rnd.between(minPoleGap,maxPoleGap);
	addPole(nextPolePosition);			
}

/*
* funcion addPole()
* recoge un parametro poleX que es la posicion X en el juego
* si la posicion de la poleX es menor que el ancho del juego * 2
* añadira una nueva pole entre el minimo y el maximo establecido
 */
function addPole(poleX){
	if(poleX < game.width * 2){
		placedPoles++;
		var pole = new Pole(game,poleX,game.rnd.between(280,400));
		game.add.existing(pole);
        pole.anchor.set(0.5,0);
		poleGroup.add(pole);
		var nextPolePosition = poleX + game.rnd.between(minPoleGap,maxPoleGap);
		addPole(nextPolePosition);
	}
} 

/*
* funcion die()
* recoge un parametro thisGame que es el juego en el que esta 
* mata al canguro llamando a un nuevo estado de juego
 */
function die(){
	//localStorage.setItem("topKangooScore",Math.max(score,topScore));	
	game.state.start("TheGame");
}

/*
*
 */
function checkLanding(kangoo,pole){
	console.log(kangoo);
	console.log(pole);
	if(pole.y>=kangoo.y+kangoo.height/2){
		var poleDiff = pole.poleNumber-kangoo.lastPole;
		if(poleDiff>0){
			kangoo.lastPole= pole.poleNumber;
		}
		if(kangooJumping){
           	kangooJumping = false;              
           	game.input.onDown.add(prepareToJump, this);
      	}
	}
	else{
		kangooFallingDown = true;
		poleGroup.forEach(function(item) {
			item.body.velocity.x = 0;			
		});
	}			
}

/*
* se crea el objeto pole 
* el cual se llamara a travez de las funciones de añadir mas poles
 */
Pole = function (game, x, y) {
	Phaser.Sprite.call(this, game, x, y, "pole");
	game.physics.enable(this, Phaser.Physics.ARCADE);
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
