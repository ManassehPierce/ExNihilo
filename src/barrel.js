/* barrel.js
  @author Manasseh Pierce
  @description defines barrels
*/

// BARRELS!
var BARRELS = []

const BARREL_MAX_COMPOSTING_TIME = 1000
const BARREL_MAX_FLUID = 1000
const BARREL_UPDATE_INTERVAL = 10 // every 10 tick, increase to decrease lag

const MOSS_SPREAD_X_POS = 2
const MOSS_SPREAD_X_NEG = -2
const MOSS_SPREAD_Y_POS = 2
const MOSS_SPREAD_Y_NEG = -1
const MOSS_SPREAD_Z_POS = 2
const MOSS_SPREAD_Z_NEG = -2

var updateCounter = 0

const ExtractMode = { None: 0, Always: 1, PeacfulOnly: 2 }

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
}

class Barrel extends EventEmitter {
	constructor(x, y, z) {
		super()
		this.x = x
		this.y = y
		this.z = z
		this.data = Level.getData(x, y, z)
		this.setMode(BarrelMode.EMPTY)
		this.volume = 0
		this.timer = 0
		this.fluid = 'WATER'
		this.addEventListener('update', this.update)
		this.update()
		BARRELS.push(this)
	}

	getMode() { return this.mode }

	setMode(mode) {
		this.mode = mode
		this.needsUpdate = true
	}

	update() {
		this.needsUpdate = false

		switch(this.getMode()) {
			case BarrelMode.EMPTY:
				// Handle Rain
				if(Level.canSeeSky(this.x, this.y, this.z) && Level.getRainLevel() > 0.0) {
					this.fluid = 'WATER'
					this.setMode(BarrelMode.FLUID)
					this.needsUpdate = true
				}
				break

			case BarrelMode.FLUID:
				// WATER!
				if(this.fluid == 'WATER') {
					// Handle Rain
					if(Level.canSeeSky(this.x, this.y, this.z) && !this.isFull() && Level.getRainLevel() > 0.0) {
						this.volume += Level.getRainLevel() / 1000
						if(this.volume > 1) {
							this.volume = 1
						}
						this.needsUpdate = true
					}

					// Check for Spores.
					if(this.isFull() && getNearbyBlocks(110, 0) > 0) {
						this.setMode(BarrelMode.SPORED)
						this.needsUpdate = true
					}

					// Turn into Cobblestone?
					if(this.isFull() && (Level.getTile(this.x, this.y + 1, this.z) === 10 || Level.getTile(this.x, this.y + 1, this.z) === 11)) {
						this.setMode(BarrelMode.COBBLESTONE)
						this.needsUpdate = true
					}

					// Spread Moss.
					if(this.volume > 0 && Level.getTile(this.x, this.y, this.z) === BARREL_ID && Math.floor(Math.random()* 500 ) === 0) {
						let x = this.x + Math.floor(Math.random() * (MOSS_SPREAD_X_POS - MOSS_SPREAD_X_NEG + 1) + MOSS_SPREAD_X_NEG)
						let y = this.y + Math.floor(Math.random() * (MOSS_SPREAD_Y_POS - MOSS_SPREAD_Y_NEG + 1) + MOSS_SPREAD_Y_NEG)
						let z = this.z + Math.floor(Math.random() * (MOSS_SPREAD_Z_POS - MOSS_SPREAD_Z_NEG + 1) + MOSS_SPREAD_Z_NEG)
						let lightLevel = Level.getBrightness(x, y + 1, z)
						if(Level.getTile(x, y, z) !== 0 && !Level.canSeeSky(x, y, z) && lightLevel >= 9 && lightLevel <= 11) {
							let blockID = Level.getTile(x, y, z)
							let blockData = Level.getData(x, y, z)
							if(blockID === 98 && blockData === 0) { // stone brick
								Level.setTile(x, y, z, 98, 1)
							}

							if(blockID === 4) { // cobblestone
								Level.setTile(x, y, z, 48, 0)
							}
						}
					}
				}

				// LAVA!
				if(this.fluid === 'LAVA') {
					// Burn the barrel, if it is flammable
					if(Level.getTile(this.x, this.y, this.z) === BARREL_ID) {
						this.timer++
						if( this.timer % 30 === 0 ) {
							Level.addParticle(ParticleType.smoke2, this.x + Math.random(), this.y + Math.random(), this.z + Math.random(), 0.0, 0.0, 0.0, 1.2)
						}
						if( this.timer % 5 === 0 ) {
							Level.addParticle(ParticleType.smoke, this.x + Math.random(), this.y + Math.random(), this.z + Math.random(), 0.0, 0.0, 0.0, 1)
						}
						if( this.timer >= 400 ) {
							this.timer = 0
							if( this.volume < 1 ) {
								// burn
								Level.setTile(this.x, this.y + 1, this.z, 51, 0)
							} else {
								// spit lava on the ground
								Level.setTile(this.x, this.y, this.z, 10, 0)
							}
						}
					}

					// turn to obsidian
					if( this.isFull() && ( Level.getTile(this.x, this.y + 1, this.z) === 8 || Level.getTile(this.x, this.y + 1, this.z) === 9 ) ) {
						this.setMode(BarrelMode.OBSIDIAN)
						this.needsUpdate = true
					}
				}
				break
			
			case BarrelMode.COMPOST:
				if(this.volume >= 1.0) { 
					this.timer++
					if( this.timer >= BARREL_MAX_COMPOSTING_TIME) {
						this.setMode(BarrelMode.DIRT)
						this.timer = 0
					}
				}
				break
			
			case BarrelMode.MILKED:
				this.timer++

				if(this.isDone()) {
					this.timer = 0
					this.setMode(BarrelMode.SLIME)
					this.needsUpdate = true
				}
				break
			
			case BarrelMode.SLIME:
				if( Level.getDifficulty() != 0 ) {
					this.timer++
					if(this.isDone()) {
						this.timer = 0
						// spawn slime
					}
					this.resetBarrel()
				}
				break
			
			case BarrelMode.SPORED:
				let nearbyMycelium = this.getNearbyBlocks(110, 0)
				
				this.timer += 1 + (nearbyMycelium/2)

				if(nearbyMycelium > 0) {
					// Spawn Mushrooms
					for(let x = -2; x <= 2; x++) {
						for(let y = -1; y <= 1; y++) {
							for(let z = -2; z <= 2; z++) {
								if(Level.getTile(this.x + x, this.y + y, this.z) === 110 && Level.getTile( this.x + x, this.y + y + 1, this.z + z) === 0 && Math.floor(Math.random()*1500) === 0) {
									let choice = Math.floor(Math.random()*2)
									if(choice == 0) {
										Level.setTile(this.x + x, this.y + y + 1, this.z + z, 39, 0)
									}
									if(choice == 1) {
										Level.setTile(this.x + x, this.y + y + 1, this.z + z, 40, 0)
									}
								}
							}
						}
					}
					if(this.isDone()) {
						this.timer = 0
						this.fluid = 'WITCHWATER'
						this.setMode(BarrelMode.FLUID)
						this.needsUpdate = true
					}
				}
				break
			
			case BarrelMode.BLAZE_COOKING:
				this.timer++

				if( Level.getTile(this.x, this.y, this.z) === BARREL_ID ) {
					// an earth-shattering kaboom...
					Level.destroyBlock(this.x, this.y, this.z, false)
					Level.explode(this.x, this.y, this.z, 4)
				}

				if( Math.floor(Math.random()*20) === 0 ) {
					// spawn lava particles
					Level.addParticle(ParticleType.lava, this.x + (Math.random()*0.6) + 0.2, this.y + 1, this.z + (Math.random()*0.6) + 0.2, 0.0, 0.0, 0.0, 1)
				}

				if( this.timer >= Math.floor(0.7 * BARREL_MAX_COMPOSTING_TIME) && Level.getTile(this.x, this.y + 1, this.z) === 0 ) {
					// spawn fire
					Level.setTile(this.x, this.y + 1, this.z, 51, 0)
				}

				if(this.isDone()) {
					this.setMode(BarrelMode.BLAZE)
					this.timer = 0
					this.needsUpdate = true
				}
				break
			
			case BarrelMode.BLAZE:
				break
			
			case BarrelMode.ENDER_COOKING:
				break
			
			case BarrelMode.ENDER:
				break
			
			default: 
				break
		}
	}

	getNearbyBlocks(blockID, blockData) {
		let count = 0
		for(let x = -1 x <= 1 x++) {
			for(let y = -1 y <= 1 y++) {
				for(let z = -1 z <= 1 z++) {
					if(Level.getTile(this.x + x, this.y + y, this.z + z) === blockID && Level.getData(this.x + x, this.y + y, this.z + z) === blockData) {
						count++
					}
				}
			}
		}
		return count
	}

	addCompostItem(compostItem) {  }

	isFull() { return this.volume >= 1.0 }

	isDone() { return this.timer >= BARREL_MAX_COMPOSTING_TIME }

	giveItem(itemID, itemCount, itemData) {
		Level.dropItem(this.x + 0.5, this.y + 1.5, this.z + 0.5, 0.05, itemID, itemCount, itemData)
		this.resetBarrel()
	}

	getExtractItem() {
		switch(this.getMode()) {
			case BarrelMode.CLAY:
				this.giveItem(82, 1, 0)
				break
			case BarrelMode.DIRT:
				this.giveItem(3, 1, 0)
				break
			case BarrelMode.ENDSTONE:
				this.giveItem(121, 1, 0)
				break
			case BarrelMode.NETHERRACK:
				this.giveItem(87, 1, 0)
				break
			case BarrelMode.SLIME:
				this.giveItem(341, 1 + Math.floor(Math.random()*4), 0)
				break
			case BarrelMode.SOULSAND:
				this.giveItem(88, 1, 0)
				break
			case BarrelMode.OBSIDIAN:
				this.giveItem(49, 1, 0)
				break
			case BarrelMode.COBBLESTONE:
				this.giveItem(4, 1, 0)
				break
			case BarrelMode.BLAZE:
				this.giveItem(369, 1, 0)
				break
			case BarrelMode.ENDER:
				this.giveItem(368, 1, 0)
				break
			//case BarrelMode.BEETRAP:
			//	this.giveItem(BEETRAP_BLOCK, 1, 0)
			//	break
			case BarrelMode.DARKOAK:
				this.giveItem(6, 1, 5)
				break
			default:
				return
			
		}
	}

	getVolume() { return this.volume }

	getTimer() { return this.timer }

	resetBarrel() {
		this.fluid = 'WATER'
		this.volume = 0
		this.setMode(BarrelMode.EMPTY)
		this.needsUpdate = true
	}

	get pos() {
		return [this.x, this.y, this.z].join(',')
	}
}

function updateBarrels() {
	if(updateCounter >= BARREL_UPDATE_INTERVAL) {
		updateCounter = 0
		let updates = BARRELS.filter((barrel) => barrel.needsUpdate === true)
		updates.forEach((barrel) => {
			barrel.emit('update')
		})
	} else {
		updateCounter++
	}
}

function getBarrel(x, y, z) {
	let xs = BARRELS.filter((barrel) => barrel.x === x)
	let ys = xs.filter((barrel) => barrel.y === y)
	let zs = ys.filter((barrel) => barrel.z === z)
	return zs[0]
}

function saveBarrels() {
	let content = JSON.stringify(BARRELS, null, 4)
	ModPE.saveWorldFile('barrels.json', content)
}

function loadBarrels() {
	let content = ModPE.loadWorldFile('barrels.json')
	BARRELS = JSON.parse(content)
}

function removeBarrel(x, y, z) {
	let barrel = getBarrel(x, y, z)
	if(barrel) {
		let index = BARRELS.indexOf(barrel)
		BARRELS.splice(index, 1)
	}
}