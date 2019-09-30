export default class MenuScene extends Phaser.Scene {
    preload() {
	this.load.image('title_text', '/assets/radia_title_turret_road.png');
	this.load.image('menu_new_game', '/assets/radia_menu_new_game.png');
	this.load.image('menu_credits', '/assets/radia_menu_credits.png');
	this.load.image('controller_text', '/assets/radia_please_connect_controller.png');
    }
    
    create () {
	this.create_background();
	this.create_menu();
	this.create_controller();
    }

    create_background() {
	this.cameras.main.setBackgroundColor('rgba(127,127,127,1)');
    }
    
    create_menu() {
	this.titleText = this.add.image(this.cameras.main.centerX, 1/8*this.cameras.main.centerY, 'title_text');
	this.menu = [];
	this.menu.push(this.add.image(0,0,'menu_new_game'));
	this.menu.push(this.add.image(0,0,'menu_credits'));
	this.calculate_menu_positions();
    }
    
    calculate_menu_positions() {
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

    create_controller() {
	this.controllerText = this.add.image(this.cameras.main.centerX, 15/16*this.cameras.main.centerY, 'controller_text');
	this.input.gamepad.once('connected', function (pad) {
	    this.pad = pad;
	    this.controllerText.destroy();
	});
    }
    
    update () {}
}
