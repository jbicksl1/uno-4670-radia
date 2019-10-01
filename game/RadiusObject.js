export default class RadiusObject extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, radius) {
	super(scene, scene.cameras.main.centerX, scene.cameras.main.centerY, 'radius');
	this.setTintFill();
	scene.add.existing(this);
	scene.physics.add.existing(this);

	this.radius = radius;
	this.setScale(this.radius/800);
    }
}
