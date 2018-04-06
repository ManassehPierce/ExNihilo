/* barrel.js
  @author Manasseh Pierce
  @description defines barrels
*/

// BARRELS!
var BARRELS = [];

const BARREL_MAX_COMPOSTING_TIME = 1000;
const BARREL_MAX_FLUID = 1000;
const BARREL_UPDATE_INTERVAL = 10; // every 10 tick, increase to decrease lag

const MOSS_SPREAD_X_POS = 2;
const MOSS_SPREAD_X_NEG = -2;
const MOSS_SPREAD_Y_POS = 2;
const MOSS_SPREAD_Y_NEG = -1;
const MOSS_SPREAD_Z_POS = 2;
const MOSS_SPREAD_Z_NEG = -2;

var updateCounter = 0;

const ExtractMode = { None: 0, Always: 1, PeacfulOnly: 2 };

const BarrelMode = {
	EMPTY: { 'value': 0, 'extract': ExtractMode.None },
	FLUID: { 'value': 1, 'extract': ExtractMode.None },
	COMPOST: { 'value': 2, 'extract': ExtractMode.None },
	DIRT: { 'value': 3, 'extract': ExtractMode.Always },
	CLAY: { 'value': 4, 'extract': ExtractMode.Always },
	SPORED: { 'value': 5, 'extract': ExtractMode.None },
	SLIME: { 'value': 6, 'extract': ExtractMode.Always },
	NETHERRACK: { 'value': 7, 'extract': ExtractMode.Always },
	ENDSTONE: { 'value': 8, 'extract': ExtractMode.Always },
	MILKED: { 'value': 9, 'extract': ExtractMode.None },
	SOULSAND: { 'value': 10, 'extract': ExtractMode.Always },
	BEETRAP: { 'value': 11, 'extract': ExtractMode.Always },
	OBSIDIAN: { 'value': 12, 'extract': ExtractMode.Always },
	COBBLESTONE: { 'value': 13, 'extract': ExtractMode.Always },
	BLAZE_COOKING: { 'value': 14, 'extract': ExtractMode.None },
	BLAZE: { 'value': 15, 'extract': ExtractMode.PeacfulOnly },
	ENDER_COOKING: { 'value': 16, 'extract': ExtractMode.None },
	ENDER: { 'value': 17, 'extract': ExtractMode.PeacfulOnly },
	DARKOAK: { 'value': 18, 'extract': ExtractMode.Always }
};

class Barrel extends EventEmitter {
	constructor(x, y, z, data = 0) {
		super();
		this.x = x;
		this.y = y;
		this.z = z;
		this.data = data;
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
					if(this.isFull() && getNearbyBlocks(110, 0) > 0) {
						this.setMode(BarrelMode.SPORED);
						this.needsUpdate = true;
					}

					// Turn into Cobblestone?
					if(this.isFull() && (Level.getTile(this.x, this.y + 1, this.z) === 10 || Level.getTile(this.x, this.y + 1, this.z) === 11)) {
						this.setMode(BarrelMode.COBBLESTONE);
						this.needsUpdate = true;
					}

					// Spread Moss.
					if(this.volume > 0 && Level.getData() === 6&& Math.floor(Math.random()*500) === 0) {
						let x = this.x + Math.floor(Math.random() * (MOSS_SPREAD_X_POS - MOSS_SPREAD_X_NEG + 1) + MOSS_SPREAD_X_NEG);
						let y = this.y + Math.floor(Math.random() * (MOSS_SPREAD_Y_POS - MOSS_SPREAD_Y_NEG + 1) + MOSS_SPREAD_Y_NEG);
						let z = this.z + Math.floor(Math.random() * (MOSS_SPREAD_Z_POS - MOSS_SPREAD_Z_NEG + 1) + MOSS_SPREAD_Z_NEG);
						let lightLevel = Level.getBrightness(x, y + 1, z);
						if(Level.getTile(x, y, z) !== 0 && !Level.canSeeSky(x, y, z) && lightLevel >= 9 && lightLevel <= 11) {
							let blockID = Level.getTile(x, y, z);
							let blockData = Level.getData(x, y, z);
							if(blockID === 98 && blockData === 0) {
								Level.setTile(x, y, z, 98, 1);
							}

							if(blockID === 4) {
								Level.setTile(x, y, z, 48, 0);
							}
						}
					}
				}

				// LAVA!
				if(this.fluid === 'LAVA') {  }
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

	getNearbyBlocks(blockID, blockData) {
		let count = 0;
		for(let x = -1; x <= 1; x++) {
			for(let y = -1; y <= 1; y++) {
				for(let z = -1; z <= 1; z++) {
					if(Level.getTile(this.x + x, this.y + y, this.z + z) == blockID && Level.getData(this.x + x, this.y + y, this.z + z) == blockData) {
						count++;
					}
				}
			}
		}
		return count;
	}

	addCompostItem(compostItem) {  }

	isFull() { return volume >= 1.0; }

	isDone() { return timer >= BARREL_MAX_COMPOSTING_TIME; }

	giveItem(itemID, itemCount, itemData) {
		Level.dropItem(this.x + 0.5, this.y + 1.5, this.z + 0.5, 0.05, itemID, itemCount, itemData);
		this.resetBarrel();
	}

	getExtractItem() {
		switch(this.getMode()) {
			case BarrelMode.CLAY:
				this.giveItem(82, 1, 0);
				break;
			case BarrelMode.DIRT:
				this.giveItem(3, 1, 0);
				break;
			case BarrelMode.ENDSTONE:
				this.giveItem(121, 1, 0);
				break;
			case BarrelMode.NETHERRACK:
				this.giveItem(87, 1, 0);
				break;
			case BarrelMode.SLIME:
				this.giveItem(341, 1 + Math.floor(Math.random()*4), 0);
				break;
			case BarrelMode.SOULSAND:
				this.giveItem(88, 1, 0);
				break;
			case BarrelMode.OBSIDIAN:
				this.giveItem(49, 1, 0);
				break;
			case BarrelMode.COBBLESTONE:
				this.giveItem(4, 1, 0);
				break;
			case BarrelMode.BLAZE:
				this.giveItem(369, 1, 0);
				break;
			case BarrelMode.ENDER:
				this.giveItem(368, 1, 0);
				break;
			//case BarrelMode.BEETRAP:
			//	this.giveItem(BEETRAP_BLOCK, 1, 0);
			//	break;
			case BarrelMode.DARKOAK:
				this.giveItem(6, 1, 5);
				break;
			default:
				return;
			
		}
	}

	getVolume() { return this.volume; }

	getTimer() { return this.timer; }

	resetBarrel() {
		this.fluid = 'WATER';
		this.volume = 0;
		this.setMode(BarrelMode.EMPTY);
		this.needsUpdate = true;
	}

	getPosition() {
		return [this.x, this.y, this.z].join(',');
	}
}

function updateBarrels() {
	if(updateCounter >= BARREL_UPDATE_INTERVAL) {
		updateCounter = 0;
		let updates = BARRELS.filter((barrel) => barrel.needsUpdate === true);
		updates.forEach((barrel) => {
			barrel.emit('update');
		});
	} else {
		updateCounter++;
	}
}

function getBarrel(x, y, z) {
	let xs = BARRELS.filter((barrel) => barrel.x === x);
	let ys = xs.filter((barrel) => barrel.y === y);
	let zs = ys.filter((barrel) => barrel.z === z);
	return zs[0];
}

function saveBarrels() {
	let content = JSON.stringify(BLOCKENTITIES, null, 4);
	ModPE.saveWorldFile('barrels.json', content);
}

function loadBarrels() {
	let content = ModPE.loadWorldFile('barrels.json');
	BARRELS = JSON.parse(content);
}

function removeBarrel(x, y, z) {
	let barrel = getBarrel(x, y, z);
	let index = BARRELS.indexOf(barrel);
	BARRELS.splice(index, 1);
}