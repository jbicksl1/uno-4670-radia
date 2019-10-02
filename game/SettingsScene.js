export default class SettingsScene extends Phaser.Scene {
    preload() {
	this.load.image('/assets/radia_settings_choose_controller.png', 'choose_controller');
	this.load.image('/assets/radia_settings_choose_accel.png', 'choose_accel');
	this.load.image('/assets/radia_settings_choose_aim.png', 'choose_aim');
	this.load.image('/assets/radia_settings_choose_jump.png', 'choose_jump');
	this.load.image('/assets/radia_settings_turn_clockwise.png', 'turn_clockwise');
    }

    create() {
	this.configureSequence = [ this.chooseJump, this.chooseAccelerate, this.chooseController ];
    }

    update() {
	(this.configureSequence.pop())();
    }

    chooseController() {
	this.message = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'choose_controller');
	this.preActivePads = [ false, false, false, false ];
	for(var x = 0; x < 4; x++) {
	    var pad = this.gamepad.getPad(x);
	    if(pad) {
		var buttonTotal = pad.getButtonTotal();
		for(var y = 0; y < buttonTotal; y++) {
		    if(pad.getButtonValue(y)) {
			this.preActiveGamepads[x] = true;
		    }
		}
	    }
	}
	this.activePads = [ false, false, false, false ];
	this.padActivateTimes = [ this.time.now, this.time.now, this.time.now, this.time.now ];
	this.configureSequence.push(this.awaitControllerChoice);
    }

    awaitControllerChoice() {
	var next = false;
	for(var x = 0; x < 4; x++) {
	    var pad = this.gamepad.getPad(x);
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
	    this.configureSequence.push(this.chooseAccelerate);
	} else {
	    this.configureSequence.push(this.awaitControllerChoice);
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

	this.axisActivateTimes = [ this.time.now, this.time.now, this.time.now, this.time.now ];
    }

    chooseJump() {
    }
}
