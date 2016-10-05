// barrel.js

// BARRELS!
var BARRELS = [];

const BARREL_UPDATE_INTERVAL = 10;
var updateCounter = 0;

const ExtractMode = { 'None': 0, 'Always': 1, 'PeacfulOnly': 2 };

const BarrelMode = {
	'EMPTY': { 'value': 0, 'extract': ExtractMode.None },
	'FLUID': { 'value': 1, 'extract': ExtractMode.None },
	'COMPOST': { 'value': 2, 'extract': ExtractMode.None },
	'DIRT': { 'value': 3, 'extract': ExtractMode.Always },
	'CLAY': { 'value': 4, 'extract': ExtractMode.Always },
	'SPORED': { 'value': 5, 'extract': ExtractMode.None },
	'SLIME': { 'value': 6, 'extract': ExtractMode.Always },
	'NETHERRACK': { 'value': 7, 'extract': ExtractMode.Always },
	'ENDSTONE': { 'value': 8, 'extract': ExtractMode.Always },
	'MILKED': { 'value': 9, 'extract': ExtractMode.None },
	'SOULSAND': { 'value': 10, 'extract': ExtractMode.Always },
	'BEETRAP': { 'value': 11, 'extract': ExtractMode.Always },
	'OBSIDIAN': { 'value': 12, 'extract': ExtractMode.Always },
	'COBBLESTONE': { 'value': 13, 'extract': ExtractMode.Always },
	'BLAZE_COOKING': { 'value': 14, 'extract': ExtractMode.None },
	'BLAZE': { 'value': 15, 'extract': ExtractMode.PeacfulOnly },
	'ENDER_COOKING': { 'value': 16, 'extract': ExtractMode.None },
	'ENDER': { 'value': 17, 'extract': ExtractMode.PeacfulOnly },
	'DARKOAK': { 'value': 18, 'extract': ExtractMode.Always },
	'BLOCK': { 'value': 19, 'extract': ExtractMode.Always }
};

class Barrel extends BlockEntity {
	constructor(x, y, z) {
		super(x, y, z);
		this.setMode(BarrelMode.EMPTY);
		this.volume = 0;
		this.timer = 0;
		this.fluid = 'WATER';
		this.addEventListener('update', this.update);
		this.update();
		BARRELS.push(this);
	}

	getMode() { return this.mode; }

	setMode(mode) {
		this.mode = mode;
		this.needsUpdate = true;
	}

	update() {
		this.needsUpdate = false;

		switch(this.getMode()) {
			case BarrelMode.EMPTY:
				// Handle Rain
				if(Level.canSeeSky(this.x, this.y, this.z) && Level.getRainLevel() > 0.0) {
					this.fluid = 'WATER';
					this.setMode(BarrelMode.FLUID);
				}
				break;
			case BarrelMode.FLUID:
				// WATER!
				if(this.fluid == 'WATER') {
					// Handle Rain
					if(Level.canSeeSky(this.x, this.y, this.z) && !this.isFull() && Level.getRainLevel() > 0.0) {
						this.volume += Level.getRainLevel() / 1000;
						if(this.volume > 1) {
							this.volume = 1;
						}
						this.needsUpdate = true;
					}

					// Check for Spores.

					// Turn into Cobblestone?

					// Spread Moss.

				}
				// LAVA!
				if(this.fluid == 'LAVA') {  }
				break;
			case BarrelMode.COMPOST:
				if(this.volume >= 1.0) {  }
				break;
			case BarrelMode.MILKED:
				break;
			case BarrelMode.SLIME:
				break;
			case BarrelMode.SPORED:
				break;
			case BarrelMode.BLAZE_COOKING:
				break;
			case BarrelMode.BLAZE:
				break;
			case BarrelMode.ENDER_COOKING:
				break;
			case BarrelMode.ENDER:
				break;
		}
	}

	addCompostItem() {  }

	isFull() {  }

	isDone() {  }

	resetColor() {  }

	giveAppropiateItem() {  }

	giveItem() {  }

	getExtractItem() {  }

	getVolume() {  }

	getTimer() {  }

	getAdjustedVolume() {  }

	resetBarrel() {  }
}

function updateBarrels() {
	if(updateCounter >= BARREL_UPDATE_INTERVAL) {
		updateCounter = 0;
		let updates = BARRELS.filter((barrel) => barrel.needsUpdate == true);
		updates.forEach((barrel) => {
			barrel.emit('update');
		});
	} else {
		updateCounter++;
	}
}
