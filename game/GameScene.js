import PlayerObject from './PlayerObject.js';
import RadiusObject from './RadiusObject.js';
import GamepadPlayerController from './GamepadPlayerController.js';
import gamepadControlMappers from './GamepadControlMapper.js';

export default class GameScene extends Phaser.Scene {
    preload() {
	this.load.image('player', './assets/radia_player.png');
	this.load.image('pellet', './assets/radia_pellet.png');
	this.load.image('radius', './assets/radia_radius.png');
	this.load.image('eliminated', './assets/radia_eliminated.png');
    }

    create() {
	this.time.timeScale = 0.5;
	
	this.particles = this.add.particles('pellet');
	this.controllerConnected = [false, false, false, false];

	this.colors = [];
	this.colors.push(Phaser.Math.FloatBetween(0.0, 1.0));
	this.colors.push((this.colors[0]+0.5) % 1.0);
	this.colors.push((this.colors[0]+0.25) % 1.0);
	this.colors.push((this.colors[0]+0.75) % 1.0);

	this.players = [ null, null, null, null ];
	this.scoreboard = [ null, null, null, null ];
	this.eliminated = [ false, false, false, false ];
	this.radii = [];
	this.radii.push(new RadiusObject(this, 1000));

	this.playerCount = 0;
    }

    createPlayerAndController(playerNumber) {
	var pad = gamepadControlMappers[playerNumber].handling(this.input.gamepad.gamepads[playerNumber]);
	var playerController = new GamepadPlayerController(pad);
	var player = this.spawnPlayer(playerNumber, playerController);
	var scoreboard = this.constructScoreboard(playerNumber);
	this.playerCount++;
    }

    spawnPlayer(playerNumber, playerController) {
	var player = new PlayerObject(this, this.cameras.main.centerX, this.cameras.main.centerY, this.colors[playerNumber], playerController, playerNumber);
	playerController.registerPlayer(player);
	this.players[playerNumber] = player;
	for(var x = 0; x < 4; x++) {
	    if(this.players[x] != null) {
		this.physics.add.collider(player, this.players[x],
					  this.elasticCollider);
	    }
	}
    }

    update() {
	_.forEach(this.controllerConnected, (connected, player) => {
	    if(!connected && this.input.gamepad.gamepads[player]) {
		this.createPlayerAndController(player);
		this.controllerConnected[player] = true;
	    }
	});
	
    }

    respawn(playerNumber) {
	var controller = this.players[playerNumber].controlStrategy;
	this.players[playerNumber].emitter.explode(30);
	this.players[playerNumber].destroy();
	if(this.playerCount > 1) {
	    try {
		this.scoreboard[playerNumber].pop().destroy();
	    } catch(e) {
		var x = this.cameras.main.centerX;
		var y = this.cameras.main.centerY;
		if(playerNumber == 0) {
		    x -= 500;
		    y -= 400;
		} else if(playerNumber == 1) {
		    x += 500;
		    y -= 400;
		} else if(playerNumber == 2) {
		    x -= 500;
		    y += 400;
		} else if(playerNumber == 3) {
		    x += 500;
		    y += 400;
		}		
		this.scoreboard[playerNumber] = this.add.image(x, y, 'eliminated');
		this.scoreboard[playerNumber].setTintFill(Phaser.Display.Color.HSLToColor(this.colors[playerNumber], 1.0, 0.5).color);
		this.eliminated[playerNumber] = true;
	    }
	}
	if(!this.eliminated[playerNumber]) {
	    this.spawnPlayer(playerNumber, controller);
	}
    }

    constructScoreboard(playerNumber) {
	var x = this.cameras.main.centerX;
	var y = this.cameras.main.centerY;
	if(playerNumber == 0) {
	    x -= 500;
	    y -= 400;
	} else if(playerNumber == 1) {
	    x += 500;
	    y -= 400;
	} else if(playerNumber == 2) {
	    x -= 500;
	    y += 400;
	} else if(playerNumber == 3) {
	    x += 500;
	    y += 400;
	}

	this.scoreboard[playerNumber] = [
	    new Phaser.GameObjects.Image(this, x-50, y, 'player'),
	    new Phaser.GameObjects.Image(this, x, y, 'player'),
	    new Phaser.GameObjects.Image(this, x+50, y, 'player')
	];

	for(var x = 0; x < 3; x++) {
	    this.scoreboard[playerNumber][x].setTintFill(Phaser.Display.Color.HSLToColor(this.colors[playerNumber], 1.0, 0.5).color);
	    this.add.existing(this.scoreboard[playerNumber][x]);
	}
    }

    elasticCollider(body1, body2) {
	var velocityDifference = new Phaser.Math.Vector2(
	    body1.body.velocity).subtract(body2.body.velocity);
	var positionDifference = new Phaser.Math.Vector2(
	    body1.body.position).subtract(body2.body.position);
	var diffMag = velocityDifference.dot(positionDifference)/
	    positionDifference.dot(positionDifference);
	positionDifference.scale(diffMag);
	body1.body.velocity.subtract(positionDifference);
	body2.body.velocity.add(positionDifference);
    }
}
