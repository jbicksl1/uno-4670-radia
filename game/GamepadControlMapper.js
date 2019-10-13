let gamepadControlMappers;

class GamepadControlMapper {
    handling(gamepad) {
	this.gamepad = gamepad;
	return this;
    }

    accelX() {
	return this.gamepad && this.gamepad.getAxisValue(0);
    }

    accelY() {
	return this.gamepad && this.gamepad.getAxisValue(1);
    }
    
    jumpX() {
	return this.gamepad && this.gamepad.getAxisValue(3);
    }

    jumpY() {
	return this.gamepad && this.gamepad.getAxisValue(2);
    }

    jumpButton() {
	return this.gamepad && this.gamepad.R1;
    }

    backButton() {
	return this.gamepad && this.gamepad.B;
    }

    rebind(accelXAxis, accelYAxis, jumpXAxis, jumpYAxis, jumpButton, backButton) {
	if(accelXAxis < 0) {
	    this.accelX = () => {
		return this.gamepad && -this.gamepad.getAxisValue(-accelXAxis-1);
	    };
	} else {
	    this.accelX = () => {
		return this.gamepad && this.gamepad.getAxisValue(accelXAxis-1);
	    };
	}
	if(accelYAxis < 0) {
	    this.accelY = () => {
		return this.gamepad && -this.gamepad.getAxisValue(-accelYAxis-1);
	    };
	} else {
	    this.accelY = () => {
		return this.gamepad && this.gamepad.getAxisValue(accelYAxis-1);
	    };
	}
	if(jumpXAxis < 0) {
	    this.jumpX = () => {
		return this.gamepad && -this.gamepad.getAxisValue(-jumpXAxis-1);
	    };
	} else {
	    this.jumpX = () => {
		return this.gamepad && this.gamepad.getAxisValue(jumpXAxis-1);
	    };
	}
	if(jumpYAxis < 0) {
	    this.jumpY = () => {
		return this.gamepad && -this.gamepad.getAxisValue(-jumpYAxis-1);
	    };
	} else {
	    this.jumpY = () => {
		return this.gamepad && this.gamepad.getAxisValue(jumpYAxis-1);
	    };
	}
	this.jumpButton = () => {
	    return this.gamepad && this.gamepad.getButtonValue(jumpButton);
	};
	this.backButton = () => {
	    return this.gamepad && this.gamepad.getButtonValue(backButton);
	};
    }
}

export default gamepadControlMappers = [
    new GamepadControlMapper(),
    new GamepadControlMapper(),
    new GamepadControlMapper(),
    new GamepadControlMapper()
];
