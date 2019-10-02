let gamepadControlMappers;
export default gamepadControlMappers = [
    new GamepadControlMapper(),
    new GamepadControlMapper(),
    new GamepadControlMapper(),
    new GamepadControlMapper()
];

class GamepadControlMapper {
    handling(gamepad) {
	this.gamepad = gamepad;
	return this;
    }

    accelX() {
	return this.gamepad.getAxisValue(1);
    }

    accelY() {
	return this.gamepad.getAxisValue(0);
    }
    
    jumpX() {
	return this.gamepad.getAxisValue(3);
    }

    jumpY() {
	return this.gamepad.getAxisValue(2);
    }

    jumpButton() {
	return this.gamepad.R1;
    }

    rebind(accelXAxis, accelYAxis, jumpXAxis, jumpYAxis, jumpButton) {
	if(accelXAxis < 0) {
	    this.accelX = () => {
		return -this.gamepad.getAxisValue(-accelXAxis-1);
	    };
	} else {
	    this.accelX = () => {
		return this.gamepad.getAxisValue(accelXAxis-1);
	    };
	}
	if(accelYAxis < 0) {
	    this.accelY = () => {
		return -this.gamepad.getAxisValue(-accelYAxis-1);
	    };
	} else {
	    this.accelY = () => {
		return this.gamepad.getAxisValue(accelYAxis-1);
	    };
	}
	if(jumpXAxis < 0) {
	    this.jumpX = () => {
		return -this.gamepad.getAxisValue(-jumpXAxis-1);
	    };
	} else {
	    this.jumpX = () => {
		return this.gamepad.getAxisValue(jumpXAxis-1);
	    };
	}
	if(jumpYAxis < 0) {
	    this.jumpY = () => {
		return -this.gamepad.getAxisValue(-jumpYAxis-1);
	    };
	} else {
	    this.jumpY = () => {
		return this.gamepad.getAxisValue(jumpYAxis-1);
	    };
	}
	this.jumpButton = () => {
	    return this.gamepad.getButtonValue(jumpButton);
	};
    }
}
