export default class PlayerObject extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, hue, controlStrategy) {
	super(scene, x, y, 'player');
	scene.add.existing(this);
	scene.physics.add.existing(this);
	
	this.setTintFill(Phaser.Display.Color.HSLToColor(hue, 1.0, 0.5).color);
	this.hue = hue;
	
	this.controlStrategy = controlStrategy;
	
	this.constructEmitter(scene);
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
	return new Phaser.Math.Vector2(0,0);
    }
}
