var theGame = function(game){}

var kangoo,
	kangooGravity = 800, // gravedad con la que cae el kanguro
	placedPoles,
	poleGroup,
    minPoleGap = 80, //minimo y maximo entre cada pole
    maxPoleGap = 190,
    scale02 = 0.2,
    scale01 = 0.16,
    minPoley = 240, //minimo y maximo posicionamiento en eje Y
    maxPoley =440,
    powerBar,
    powerTween,
    kangooJumpPower,
    kangooJumping,
    kangooFallingDown,
    pointerDuration,
    background,
    desert,
    lava1,
    lava2,
    bg,
    score = 0,
	scoreText,
	scoreText2,
    topScore,
    extraScore,
    textArrives,
    textLeaves;


theGame.prototype = {
  	create: function(){
		/*
		* tilemap fondo y desierto se posicionan en el juego 
		* phaser da la posibilidad de generar un mapa infinito 
		* automaticamente añadiendo al juego la funcion tileSprite()
		* cuando el canguro salta o esta cayendo añadimos la funcionalidad
		* de mover estos sprite en el prototipo update del objeto pole
		 */
		background = game.add.tileSprite(0, 0, game.stage.bounds.width,
					 game.cache.getImage('background').height, 'background');
		background.anchor.setTo(0,0);
		background.scale.set(1);
		background.tileScale.x = scale02;
		background.tileScale.y = scale02;

		desert = game.add.tileSprite(0, 240, game.stage.bounds.width, game.cache.getImage('desert').height, 'desert');
		desert.anchor.setTo(0,0);
		desert.scale.set(1);
		desert.tileScale.x = scale01;
		desert.tileScale.y = scale01;

		/*
		* creacion del grupo de nubes
		 */
		clouds = game.add.group();
		clouds.enableBody = true;
    	clouds.physicsBodyType = Phaser.Physics.ARCADE;
		this.time.events.loop(2700, createCloud, this);

  		/*
  		*se inicializa a false que el canguro este saltando y callendo
  		 */
  		kangooJumping = false;
		kangooFallingDown = false;
		/*
		* establecer caracteristicas del texto de puntuacion y 
		* añadir al juego
		 */
		score = 0;
		topScore = localStorage.getItem("topKangooScore")==null? 0 : localStorage.getItem("topKangooScore");
		var sty={ font:"bold 20px Arial", fill: "#fff"};
		scoreText = game.add.text(15,25,"-",sty);
		scoreText2 = game.add.text(15,55,"-",sty);
		scoreText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
		scoreText2.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
		updateScore();
		
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
		* añadir puntuacion si canguro salta mas de una pole
		* con una animacion que entre el texto desde la izquierda
		* hacia el centro del juego
		 */
		extraScore = game.add.text(-50, game.world.centerY,"X",{
			font:"bold 56px Arial", fill: "#fff"
		});
		extraScore.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
		updateScore();
		textArrives = game.add.tween(extraScore);
    	textArrives.to({x:game.world.centerX}, 1000, Phaser.Easing.Bounce.Out);
    	textArrives.onComplete.add(theEnd, this);

		/*
		*  tile srpite lava 1
		 */
		lava1 = game.add.tileSprite(0, 440, game.stage.bounds.width, game.cache.getImage('lava1').height, 'lava1');
		lava1.anchor.setTo(0,0);
		lava1.scale.set(1);
		lava1.tileScale.x = scale01;
		lava1.tileScale.y = scale01;
		/*
		se añade el Kangaroo y se habilita la fisica arcarde
		con la funcion physics.arcade.enable
		la gravedad del kangaroo inicial sera de 800
		 */
		kangoo = this.add.sprite(60, 0, "kangoo");
		kangoo.scale.set(0.2);
		kangoo.anchor.set(0.5);
		kangoo.lastPole = 1;
		this.physics.arcade.enable(kangoo);              
		kangoo.body.gravity.y = kangooGravity;
		//añadir la primera pole en posicion x = 30
		addPole(60);

		//añade texto en pantalla de prototipo
		var style = { font: "45px Arial", fill: "#ff0044", align: "center" };
		var bmpText = this.add.text(40, 100,'Prototipo: 2', style);

		/*
		*  tile srpite lava 2
		 */
		lava2 = game.add.tileSprite(0, 453, game.stage.bounds.width, game.cache.getImage('lava2').height, 'lava2');
		lava2.anchor.setTo(0,0);
		lava2.scale.set(1);
		lava2.tileScale.x = scale01;
		lava2.tileScale.y = scale01;

		/*
		* configurar el audio de muerte
		* se llama al audio cuando canguro cae a la lava
		* en la funcion update mediante fx.play()
		 */
		fx = game.add.audio('sfx');
	    fx.allowMultiple = true;
		/*
		* se añade funcionalidad al pulsar con el puntero (raton) o
		* en dispositivos moviles con el dedo
		* se establece prioridad entre sprites con funcionalidad de input
		* para prevenir que se ejecuten eventos a la vez
		* bg es una imagen de 1px x 1px que se ajusta al tamaño del dispositivo
		 */
		bg = game.add.sprite(0, 0, 'bg');
		bg.fixedToCamera = true;
		bg.scale.setTo(game.width, game.height);
		bg.inputEnabled = true;
		bg.input.priorityID = 0;
		bg.events.onInputDown.add(prepareToJump,this);
	    /*
		* añade el boton para pausar y reanudar la musica
		* con prioridad mas alta para que se ejecute antes de que el canguro salte
		 */
		soundButton = game.add.sprite(250,10, "btnGameMusic");
		soundButton.scale.set(0.5);
		soundButton.inputEnabled = true;
		soundButton.input.priorityID = 1;
		soundButton.events.onInputDown.add(changeStateSound, this);

		
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
			if(kangoo.y > game.height || kangoo.x < 0){
				fx.play();
				//alert("kangoo muerto");
				die(this);
			}
		}catch (e) {
			console.log(e);
		}
		pointerDuration = this.input.activePointer.duration;
		//movimiento de las nubes para todo el grupo
		clouds.setAll('x', -1, true, true, 1);
		//console.log("pointer duration: "+pointerDuration);
		lava1.tilePosition.x -= 5;
		lava2.tilePosition.x -= 2;

		//ver si el sonido esta desactivado
		checkSound();

		
	}

	
}

/*
* checkSound()
* verifica si la musica esta sonando o no
 */
function checkSound() {
	if(!gameMusic.isPlaying) {
		soundButton.frame = 1;
	}
}
/*
* updateScore()
* funcion para actualizar el estado de la puntuacion
 */
function updateScore(){
	scoreText.text = "Score: "+score;
	scoreText2.text = "Best: "+topScore;	
}
/*
* extraPoint(numPoles)
* consigue el numero de poles que ha saltado con exito el canguro
* y llama a la animacion para mostrar mensaje en el centro del juego
 */
function extraPoint(numPoles) {
	extraScore.text = "X " + numPoles;
	textArrives.start();
}
/*
* theEnd()
* animacion de salida del texto fuera del juego
 */
function theEnd() {
	textLeaves = game.add.tween(extraScore);
	textLeaves.to({ x: -200 }, 1000, Phaser.Easing.Bounce.Out);
	textLeaves.start();
}
/*
* changeStateSound()
* cambia de estado del boton y pausa o reanuda la musica
 */
function changeStateSound(){
	if (soundButton.frame == 0) {
		soundButton.frame = 1;
		gameMusic.pause();
	}else {
		soundButton.frame = 0;
		gameMusic.resume();
	}
}
/*
* funcion pepareToJump()
* se prepara para el salto y si el canguro tiene una velocidad 
* en el eje y = 0  se añade la funcionalidad de salto al soltar 
* el imput (raton o dedo)
 */
function prepareToJump(){
	
	if(kangoo.body.velocity.y==0){
	      powerBar = game.add.sprite(kangoo.x,kangoo.y-50,"powerbar");
	      powerBar.width = 0;
	      /*
	      game.add.tween(powerBar.width).to({
			 width: 100
		  },100,Phaser.Easing.Linear.None,true,0,1000,true);
	      powerTween = game.add.tween(powerBar).to({
		   width:100
		}, 1000, "Linear",true);*/ 
	      //game.input.onDown.remove(prepareToJump, this);
	      //game.input.onUp.add(jump, this);
	      bg.events.onInputDown.remove(prepareToJump,this);
	      bg.events.onInputUp.add(jump, this);
	  } 
} 
/*
* jump()
* ejecuta la funcionalidad de salto del canguro
* aplica velocidad en el eje y segun la duracion de presion
* del puntero en el dispositivo
 */
function jump(){
	kangooJumpPower= -pointerDuration;
	powerBar.destroy();
	//game.tweens.removeAll();
	kangoo.body.velocity.y = kangooJumpPower*2;
	kangooJumping = true;
	//powerTween.stop();
	//game.input.onUp.remove(jump, this);
	bg.events.onInputUp.remove(jump, this);
 }
 /*
* addNewPoles()
* añade nuevas poles a medida que el mundo del juego avanza
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
		var pole = new Pole(game,poleX,game.rnd.between(minPoley,maxPoley));
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
* se establece la puntuacion maxima de todos los juegos y se guarda
* en local mediante localStorage.setItem().
* almacenan los datos en una base de datos sqlite
 */
function die(){
	localStorage.setItem("topKangooScore",Math.max(score,topScore));
	game.state.start("TheGame");
}

/*
* checkLanding()
*  se ejecuta cuando colisiona el canguro con la pole
*  verifica el numero de pole, si el canguro esta saltando
*  o cayendo. este metodo se ejecuta en el update del estado 
*  en forma de bucle infinito
 */
function checkLanding(kangoo,pole){
	//console.log(kangoo);
	//console.log(pole);
	if(kangoo.body.touching.down){

		var poleDiff = pole.poleNumber-kangoo.lastPole;
		if(poleDiff>0){
			//score += Math.pow(2,poleDiff);
			score += poleDiff;
			if (poleDiff > 1){
				extraPoint(poleDiff);
			}
 			updateScore();
			kangoo.lastPole= pole.poleNumber;
		}
		if(kangooJumping){
           	kangooJumping = false;              
           	//game.input.onDown.add(prepareToJump, this);
           	bg.events.onInputDown.add(prepareToJump,this);
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
	this.scale.set(scale02);
    this.body.immovable = true;
    this.poleNumber = placedPoles;
};

Pole.prototype = Object.create(Phaser.Sprite.prototype);
Pole.prototype.constructor = Pole;

Pole.prototype.update = function() {
      if(kangooJumping && !kangooFallingDown){
           this.body.velocity.x = kangooJumpPower/2;
           /*
           * movimiento del backgrond tileposition en el eje x
           * movimiento del desierto tileposition en el eje x
            */
           background.tilePosition.x -= 1;
           desert.tilePosition.x -= 1.7;
           clouds.setAll('x', -0.3, true, true, 1);
           lava1.tilePosition.x -= 1;
	       lava2.tilePosition.x -= 0.5;
      }
      else{
           this.body.velocity.x = 0
      }
	if(this.x<-this.width){
		this.destroy();
		addNewPoles();
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



if (typeof window.DeviceMotionEvent != 'undefined') {
    // Shake sensitivity (a lower number is more)
    var sensitivity = 20;

    // Position variables
    var x1 = 0, y1 = 0, z1 = 0, x2 = 0, y2 = 0, z2 = 0;

    // Listen to motion events and update the position
    window.addEventListener('devicemotion', function (e) {
        x1 = e.accelerationIncludingGravity.x;
        y1 = e.accelerationIncludingGravity.y;
        z1 = e.accelerationIncludingGravity.z;
    }, false);

    // Periodically check the position and fire
    // if the change is greater than the sensitivity
    setInterval(function () {
        var change = Math.abs(x1-x2+y1-y2+z1-z2);

        if (change > sensitivity) {
            alert('Shake!');
        }

        // Update new position
        x2 = x1;
        y2 = y1;
        z2 = z1;
    }, 150);
}

