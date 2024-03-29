import gamepadControlMappers from './GamepadControlMapper.js';

export default class SettingsScene extends Phaser.Scene {
    preload() {
	this.load.image('choose_controller', './assets/radia_settings_choose_controller.png');
	this.load.image('choose_accel', './assets/radia_settings_choose_accel.png');
	this.load.image('choose_aim', './assets/radia_settings_choose_aim.png');
	this.load.image('choose_jump', './assets/radia_settings_choose_jump.png');
	this.load.image('choose_back', './assets/radia_settings_choose_back.png');
	this.load.image('turn_clockwise', './assets/radia_settings_turn_clockwise.png');
    }

    create() {
	this.cameras.main.setBackgroundColor('rgba(127,127,127,1)');
	this.configureSequence = this.chooseController;
    }

    update() {
	if(this.configureSequence != this.chooseBackButton && this.configureSequence != this.awaitBackButtonChoice && this.configureSequence != this.awaitButtonReleased) {
	    this.testBackOut();
	}
	this.configureSequence();
    }

    testBackOut() {
	var controller = gamepadControlMappers[0].handling(this.input.gamepad.getPad(0));
	if(controller.backButton()) {
	    this.configureSequence = this.chooseController;
	    this.scene.switch('MenuScene');
	}
    }

    chooseController() {
	this.message = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'choose_controller');
	this.preActivePads = [ false, false, false, false ];
	for(var x = 0; x < 4; x++) {
	    var pad = this.input.gamepad.getPad(x);
	    if(pad) {
		var buttonTotal = pad.getButtonTotal();
		for(var y = 0; y < buttonTotal; y++) {
		    if(pad.getButtonValue(y)) {
			this.preActivePads[x] = true;
		    }
		}
	    }
	}
	this.activePads = [ false, false, false, false ];
	this.padActivateTimes = [ this.time.now, this.time.now, this.time.now, this.time.now ];
	this.configureSequence = this.awaitControllerChoice;
    }

    awaitControllerChoice() {
	var next = false;
	for(var x = 0; x < 4; x++) {
	    var pad = this.input.gamepad.getPad(x);
	    if(pad) {
		var buttonTotal = pad.getButtonTotal();
		var isActive = false;
		for(var y = 0; y < buttonTotal; y++) {
		    if(pad.getButtonValue(y)) {
			if(!this.preActivePads[x]) {
			    if(!this.activePads[x]) {
				this.activePads[x] = true;
				this.padActivateTimes[x] = this.time.now;
			    } else if(this.time.now - this.padActivateTimes[x] > 1000) {
				this.padToConfigure = pad;
				this.padNumber = x;
				next = true;
			    }
			}
			isActive = true;
		    }
		}
		if(!isActive) {
		    this.activePads[x] = false;
		    this.preActivePads[x] = false;
		}
	    }
	}
	if(next) {
	    this.message.destroy();
	    this.configureSequence = this.chooseAccelerate;
	}
    }

    chooseAccelerate() {
	this.message = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'choose_accel');
	this.preActiveAxes = [];
	var axisTotal = this.padToConfigure.getAxisTotal();
	for(var x = 0; x < axisTotal; x++) {
	    if(this.padToConfigure.getAxisValue(x) != 0) {
		this.preActiveAxes.push(true);
	    } else {
		this.preActiveAxes.push(false);
	    }
	}

	this.activeAxes = [];
	for(x = 0; x < axisTotal; x++) {
	    this.activeAxes.push(false);
	}

	this.axisActivateTimes = [];
	for(x = 0; x < axisTotal; x++) {
	    this.axisActivateTimes.push(this.time.now);
	}
	
	this.configureSequence = this.awaitAccelerateChoice;
    }
    
    awaitAccelerateChoice() {
	var next = false;
	var axisTotal = this.padToConfigure.getAxisTotal();
	for(var x = 0; x < axisTotal; x++) {
	    var axis = this.padToConfigure.getAxisValue(x);
	    if(axis != 0) {
		if(!this.preActiveAxes[x]) {
		    if(!this.activeAxes[x]) {
			this.activeAxes[x] = true;
			this.axisActivateTimes[x] = this.time.now;
		    } else if(this.time.now - this.axisActivateTimes[x] > 1000) {
			if(axis < 0) {
			    this.northAccelAxis = -x-1;
			} else {
			    this.northAccelAxis = x+1;
			}
			next = true;
		    }
		}
	    } else {
		this.activeAxes[x] = false;
		this.preActiveAxes[x] = false;
	    }
	}
	if(next) {
	    this.message.destroy();
	    this.configureSequence = this.turnClockwiseNE;
	    this.turnAxis = this.northAccelAxis;
	    this.storeTurn = (north, east) => {
		this.northAccelAxis = north;
		this.eastAccelAxis = east;
	    };
	    this.failTurn = () => {
		this.message.destroy();
		this.configureSequence = this.chooseAccelerate;
	    };
	    this.succeedTurn = () => {
		this.message.destroy();
		this.configureSequence = this.chooseJump;
	    };
	}
    }

    chooseJump() {
	this.message = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'choose_aim');
	this.preActiveAxes = [];
	var axisTotal = this.padToConfigure.getAxisTotal();
	for(var x = 0; x < axisTotal; x++) {
	    if(this.padToConfigure.getAxisValue(x) != 0) {
		this.preActiveAxes.push(true);
	    } else {
		this.preActiveAxes.push(false);
	    }
	}

	this.activeAxes = [];
	for(x = 0; x < axisTotal; x++) {
	    this.activeAxes.push(false);
	}

	this.axisActivateTimes = [];
	for(x = 0; x < axisTotal; x++) {
	    this.axisActivateTimes.push(this.time.now);
	}
	
	this.configureSequence = this.awaitJumpChoice;
    }
    
    awaitJumpChoice() {
	var next = false;
	var axisTotal = this.padToConfigure.getAxisTotal();
	for(var x = 0; x < axisTotal; x++) {
	    var axis = this.padToConfigure.getAxisValue(x);
	    if(axis != 0) {
		if(!this.preActiveAxes[x]) {
		    if(!this.activeAxes[x]) {
			this.activeAxes[x] = true;
			this.axisActivateTimes[x] = this.time.now;
		    } else if(this.time.now - this.axisActivateTimes[x] > 1000) {
			if(axis < 0) {
			    this.northJumpAxis = -x-1;
			} else {
			    this.northJumpAxis = x+1;
			}
			next = true;
		    }
		}
	    } else {
		this.activeAxes[x] = false;
		this.preActiveAxes[x] = false;
	    }
	}
	if(next) {
	    this.message.destroy();
	    this.configureSequence = this.turnClockwiseNE;
	    this.turnAxis = this.northJumpAxis;
	    this.storeTurn = (north, east) => {
		this.northJumpAxis = north;
		this.eastJumpAxis = east;
	    };
	    this.failTurn = () => {
		this.message.destroy();
		this.configureSequence = this.chooseJump;
	    };
	    this.succeedTurn = () => {
		this.message.destroy();
		this.configureSequence = this.chooseJumpButton;
	    };
	}
    }

    chooseJumpButton() {
	this.message = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'choose_jump');
	this.preActiveButtons = [];
	var buttonTotal = this.padToConfigure.getButtonTotal();
	for(var x = 0; x < buttonTotal; x++) {
	    if(this.padToConfigure.getButtonValue(x) != 0) {
		this.preActiveButtons.push(true);
	    } else {
		this.preActiveButtons.push(false);
	    }
	}

	this.activeButtons = [];
	for(x = 0; x < buttonTotal; x++) {
	    this.activeButtons.push(false);
	}

	this.buttonActivateTimes = [];
	for(x = 0; x < buttonTotal; x++) {
	    this.buttonActivateTimes.push(this.time.now);
	}
	
	this.configureSequence = this.awaitJumpButtonChoice;
    }

    awaitJumpButtonChoice() {
	var next = false;
	var buttonTotal = this.padToConfigure.getButtonTotal();
	for(var x = 0; x < buttonTotal; x++) {
	    var button = this.padToConfigure.getButtonValue(x);
	    if(button) {
		if(!this.preActiveButtons[x]) {
		    if(!this.activeButtons[x]) {
			this.activeButtons[x] = true;
			this.buttonActivateTimes[x] = this.time.now;
		    } else if(this.time.now - this.buttonActivateTimes[x] > 1000) {
			this.jumpButton = x;
			next = true;
		    }
		}
	    } else {
		this.activeButtons[x] = false;
		this.preActiveButtons[x] = false;
	    }
	}
	if(next) {
	    this.message.destroy();
	    this.configureSequence = this.awaitButtonReleased;
	    this.releaseButton = this.jumpButton;
	    this.releaseFunction = this.chooseBackButton;
	}
    }

    chooseBackButton() {
	this.message = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'choose_back');
	this.preActiveButtons = [];
	var buttonTotal = this.padToConfigure.getButtonTotal();
	for(var x = 0; x < buttonTotal; x++) {
	    if(this.padToConfigure.getButtonValue(x) != 0) {
		this.preActiveButtons.push(true);
	    } else {
		this.preActiveButtons.push(false);
	    }
	}

	this.activeButtons = [];
	for(x = 0; x < buttonTotal; x++) {
	    this.activeButtons.push(false);
	}

	this.buttonActivateTimes = [];
	for(x = 0; x < buttonTotal; x++) {
	    this.buttonActivateTimes.push(this.time.now);
	}
	
	this.configureSequence = this.awaitBackButtonChoice;
    }

    awaitBackButtonChoice() {
	var next = false;
	var buttonTotal = this.padToConfigure.getButtonTotal();
	for(var x = 0; x < buttonTotal; x++) {
	    var button = this.padToConfigure.getButtonValue(x);
	    if(button) {
		if(!this.preActiveButtons[x]) {
		    if(!this.activeButtons[x]) {
			this.activeButtons[x] = true;
			this.buttonActivateTimes[x] = this.time.now;
		    } else if(this.time.now - this.buttonActivateTimes[x] > 1000) {
			this.backButton = x;
			next = true;
		    }
		}
	    } else {
		this.activeButtons[x] = false;
		this.preActiveButtons[x] = false;
	    }
	}
	if(next) {
	    this.message.destroy();
	    this.configureSequence = this.awaitButtonReleased;
	    this.releaseButton = this.backButton;
	    this.releaseFunction = this.reconstructControllerConfig;
	}
    }

    awaitButtonReleased() {
	try {
	    if(!this.padToConfigure.getButtonValue(this.releaseButton)) {
		this.configureSequence = this.releaseFunction;
	    }
	}
	catch (e) {}
    }

    reconstructControllerConfig() {
	gamepadControlMappers[this.padNumber].rebind(this.eastAccelAxis, -this.northAccelAxis, this.eastJumpAxis, -this.northJumpAxis, this.jumpButton, this.backButton);
	this.configureSequence = this.chooseController;
	this.scene.switch('MenuScene');
    }

    turnClockwiseNE() {
	this.message = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'turn_clockwise');
	
	this.preActiveAxes = [];
	var axisTotal = this.padToConfigure.getAxisTotal();
	for(var x = 0; x < axisTotal; x++) {
	    this.preActiveAxes.push(this.padToConfigure.getAxisValue(x) != 0);
	}
	
	this.configureSequence = this.awaitClockwiseNE;
    }

    awaitClockwiseNE() {
	var next = false;
	var axisTotal = this.padToConfigure.getAxisTotal();
	for(var x = 0; x < axisTotal; x++) {
	    if(x != this.turnAxis-1 && x != -this.turnAxis-1) {
		var axis = this.padToConfigure.getAxisValue(x);
		if(axis != 0) {
		    if(!this.preActiveAxes[x]) {
			if(axis < 0) {
			    this.storeTurn(this.turnAxis, -x-1);
			    this.turnAxis2 = -x-1;
			    next = true;
			} else {
			    this.storeTurn(this.turnAxis, x+1);
			    this.turnAxis2 = x+1;
			    next = true;
			}
		    }
		} else {
		    this.preActiveAxes[x] = 0;
		}
	    }
	}
	if(next) {
	    this.configureSequence = this.turnClockwiseES;
	}
    }

    turnClockwiseES() {
	this.preActiveAxes = [];
	var axisTotal = this.padToConfigure.getAxisTotal();
	for(var x = 0; x < axisTotal; x++) {
	    this.preActiveAxes.push(this.padToConfigure.getAxisValue(x) != 0);
	}
	
	this.configureSequence = this.awaitClockwiseES;
    }

    awaitClockwiseES() {
	var next = false;
	var axisTotal = this.padToConfigure.getAxisTotal();
	for(var x = 0; x < axisTotal; x++) {
	    if(x != this.turnAxis2-1 && x != -this.turnAxis2-1) {
		var axis = this.padToConfigure.getAxisValue(x);
		if(axis != 0) {
		    if(!this.preActiveAxes[x]) {
			if(x == this.turnAxis-1 && axis < 0) {
			    next = true;
			} else if(x == -this.turnAxis-1 && axis > 0) {
			    next = true;
			} else {
			    this.failTurn();
			}
		    }
		} else {
		    this.preActiveAxes[x] = 0;
		}
	    }
	}
	if(next) {
	    this.configureSequence = this.turnClockwiseSW;
	}
    }
    
    turnClockwiseSW() {
	this.preActiveAxes = [];
	var axisTotal = this.padToConfigure.getAxisTotal();
	for(var x = 0; x < axisTotal; x++) {
	    this.preActiveAxes.push(this.padToConfigure.getAxisValue(x) != 0);
	}
	
	this.configureSequence = this.awaitClockwiseSW;
    }

    awaitClockwiseSW() {
	var next = false;
	var axisTotal = this.padToConfigure.getAxisTotal();
	for(var x = 0; x < axisTotal; x++) {
	    if(x != this.turnAxis-1 && x != -this.turnAxis-1) {
		var axis = this.padToConfigure.getAxisValue(x);
		if(axis != 0) {
		    if(!this.preActiveAxes[x]) {
			if(x == this.turnAxis2-1 && axis < 0) {
			    next = true;
			} else if(x == -this.turnAxis2-1 && axis > 0) {
			    next = true;
			} else {
			    this.failTurn();
			}
		    }
		} else {
		    this.preActiveAxes[x] = 0;
		}
	    }
	}
	if(next) {
	    this.succeedTurn();
	}
    }
}
