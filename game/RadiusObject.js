export default class RadiusObject extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, radius) {
	super(scene, scene.cameras.main.centerX, scene.cameras.main.centerY, 'radius');
	this.setTintFill();
	scene.add.existing(this);
	scene.physics.add.existing(this);
	this.scene = scene;

	this.radius = radius;
	this.setScale(this.radius/800);
    }

    preUpdate() {
	_.forEach(this.scene.players, (player, playerNumber) => {
	    if(player) {
		var dx = player.x - this.x;
		var dy = player.y - this.y;
		var rSq = dx*dx+dy*dy;
		if(rSq*4 > this.radius*this.radius) {
		    this.scene.respawn(playerNumber);
		}
	    }
	});
    }
}
