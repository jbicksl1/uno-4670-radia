import gamepadControlMappers from './GamepadControlMapper.js';

export default class MenuScene extends Phaser.Scene {
    preload() {
	this.load.image('title_text', './assets/radia_title_turret_road.png');
	this.load.image('menu_new_game', './assets/radia_menu_new_game.png');
	this.load.image('menu_settings', './assets/radia_menu_settings.png');
	this.load.image('menu_credits', './assets/radia_menu_credits.png');
	this.load.image('controller_text', './assets/radia_please_connect_controller.png');
    }
    
    create () {
	this.createBackground();
	this.createMenu();
	this.createControllerText();
	this.createInputTimer();
    }

    createBackground() {
	this.cameras.main.setBackgroundColor('rgba(127,127,127,1)');
    }
    
    createMenu() {
	this.titleText = this.add.image(this.cameras.main.centerX, 1/8*this.cameras.main.centerY, 'title_text');
	this.menu = [];
	this.menu.push(this.add.image(0,0,'menu_new_game'));
	this.menu.push(this.add.image(0,0,'menu_settings'));
	this.menu.push(this.add.image(0,0,'menu_credits'));
	this.calculateMenuPositions();
    }
    
    calculateMenuPositions() {
	let menuHeight = _.reduce(this.menu, (accum, menuItem) => accum + menuItem.height, 0);
	let menuCenterX = this.cameras.main.centerX;
	let menuCenterY = this.cameras.main.centerY;
	let cumulativeHeight = menuCenterY-1/2*menuHeight;
	for(let i = 0; i < this.menu.length; i++) {
	    this.menu[i].x = menuCenterX;
	    this.menu[i].y = cumulativeHeight + 1/2*this.menu[i].height;
	    cumulativeHeight += this.menu[i].height;
	}
    }

    createControllerText() {
	this.controllerText = this.add.image(this.cameras.main.centerX, 15/8*this.cameras.main.centerY, 'controller_text');
	this.input.gamepad.once('connected', (pad) => {});
    }

    createInputTimer() {
	this.lastInputTime = this.time.now;
    }

    update () {
	this.updateControllerConnected();
	this.updateMenuItemSelected();
    }

    updateControllerConnected() {
	let pads = this.input.gamepad.gamepads;
	if(pads.length == 0 && !this.controllerText) {
	    this.createControllerText();
	} else {
	    if(pads.length > 0) {
		if(this.controllerText) {
		    this.controllerText.destroy();
		    this.controllerText = null;
		    this.selectedMenuItem = 0;
		}
	    }
	}
    }

    updateMenuItemSelected() {
	let pads = this.input.gamepad.gamepads;
	if(this.time.now - this.lastInputTime < 0 || this.time.now - this.lastInputTime > 500) {
	    if(pads.length > 0) {
		let pad = gamepadControlMappers[0].handling(pads[0]);
		if(pad.accelY() > 0) {
		    this.menu[this.selectedMenuItem].clearTint();
		    this.selectedMenuItem = (this.selectedMenuItem + 1) % this.menu.length;
		    this.menu[this.selectedMenuItem].setTintFill();
		    this.lastInputTime = this.time.now;
		} else if (pad.accelY() < 0) {
		    this.menu[this.selectedMenuItem].clearTint();
		    this.selectedMenuItem = (this.selectedMenuItem - 1 + this.menu.length) % this.menu.length;
		    this.menu[this.selectedMenuItem].setTintFill();
		    this.lastInputTime = this.time.now;
		} else if (pad.jumpButton()) {
		    this.selectMenuItem();
		}
	    }
	}
    }

    selectMenuItem() {
	if(this.selectedMenuItem == 0) {
	    this.startNewGame();
	} else if(this.selectedMenuItem == 1) {
	    this.showSettings();
	} else {
	    this.showCredits();
	}
    }

    startNewGame() {
	this.scene.switch('GameScene');
    }

    showSettings() {
	this.scene.switch('SettingsScene');
    }
    
    showCredits() {}
}
