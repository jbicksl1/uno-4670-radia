export default class PlayerObject extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, hue, controlStrategy, playerNumber) {
	super(scene, x, y, 'player');
	scene.add.existing(this);
	scene.physics.add.existing(this);
	
	this.setTintFill(Phaser.Display.Color.HSLToColor(hue, 1.0, 0.5).color);
	this.hue = hue;
	
	this.controlStrategy = controlStrategy;

	this.spawnTime = this.scene.time.now;
	this.playerNumber = playerNumber;

	this.lastThrustTime = this.scene.time.now;
	
	this.constructEmitter(scene);

	if(playerNumber == 0) {
	    this.setPosition(x, y-200);
	    this.body.setVelocityX(50);
	} else if(playerNumber == 1) {
	    this.setPosition(x, y+200);
	    this.body.setVelocityX(-50);
	} else if(playerNumber == 2) {
	    this.setPosition(x+200, y);
	    this.body.setVelocityY(50);
	} else if(playerNumber == 3) {
	    this.setPosition(x-200, y);
	    this.body.setVelocityY(-50);
	}
    }

    constructEmitter(scene) {
	this.emitter = scene.particles.createEmitter();
	this.emitter.setSpeed(10);
	this.emitter.setFrequency(5);
	this.emitter.startFollow(this);
	this.emitter.stop();
	this.emitterState = 'off';
    }

    preUpdate() {
	this.updateEmitter();
	this.controlStrategy.runControls();
    }

    updateEmitter() {
	if(this.controlStrategy.isMoving) {
	    this.setEmitterFullSat();
	} else if(this.body.velocity.lengthSq() > 250000) {
	    this.setEmitterFullSat();
	} else if(this.body.velocity.lengthSq() > 2500) {
	    this.setEmitterHalfSat();
	} else {
	    this.setEmitterOff();
	}
	this.emitter.forEachAlive((particle) => particle.tint = this.particleTint);
    }

    setEmitterFullSat() {
	if(this.emitterState != 'fullSat') {
	    this.emitter.setFrequency(10);
	    this.particleTint = Phaser.Display.Color.HSLToColor(this.hue, 1.0, 0.5).color & 0xffffff;
	    this.emitter.start();
	    this.emitterState = 'fullSat';
	}
    }

    setEmitterHalfSat() {
	if(this.emitterState != 'halfSat') {
	    this.emitter.setFrequency(5);
	    this.particleTint = Phaser.Display.Color.HSLToColor(this.hue, 0.5, 0.25).color & 0xffffff;
	    this.emitter.start();
	    this.emitterState = 'halfSat';
	}
    }

    setEmitterOff() {
	if(this.emitterState != 'off') {
	    this.emitter.stop();
	    this.emitterState = 'off';
	}
    }

    calculateBaseAcceleration() {
	if(this.dx && this.dy && this.rSq) {
	    return new Phaser.Math.Vector2(-this.dx/this.rSq*2000, -this.dy/this.rSq*2000);
	} else {
	    return new Phaser.Math.Vector2(0,0);
	}
    }

    thrust(vector) {
	if(this.scene.time.now - this.lastThrustTime > 3000) {
	    var thrustVector = vector.normalize().scale(200);
	    this.body.setVelocity(thrustVector.x, thrustVector.y);
	    this.lastThrustTime = this.scene.time.now;
	}
    }

    takeDeathStatistic() {
	var timeOfDeath = this.scene.time.now;
	var lifeTimeMillis = timeOfDeath - this.spawnTime;
	var lifeTime = lifeTimeMillis / 1000.0;
	console.log("Death Report");
	console.log(this.playerNumber);
	console.log(lifeTime);
    }
}
