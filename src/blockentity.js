/* blockentity.js
  @author Manasseh Pierce
  @description Defines block entities
*/

var BLOCKENTITIES = {};

class BlockEntity {
	constructor(x, y, z) {
		this.x = x, this.y = y, this.z = z;
		this.label = [x, y, z].join(',');
		this.tags = {};
		BLOCKENTITIES[this.label] = this;
	}

	setTag(label, data) {
		this.tags[label] = data;
		BLOCKENTITIES[this.label] = this;
		return this;
	}

	getTag(label) {
		return this.tags[this.label];
	}

	removeTag(label) {
		this.tags[label] = null;
		BLOCKENTITIES[this.label] = this;
		return this;
	}
}

// returns a BlockEntity, or false if it doesn't exist
function getBlockEntity(x, y, z) {
	let label = [x, y, z].join(',');
	if(BLOCKENTITIES[label]) {
		return BLOCKENTITIES[label];
	}
	return false;
}

// sets a BlockEntity, and returns it
function setBlockEntity(x, y, z) {
	return new BlockEntity(x, y, z);
}

// removes a BlockEntity, returns true if successful
function removeBlockEntity(x, y, z) {
	let label = [x, y, z].join(',');
	if(BLOCKENTITIES[label]) {
		BLOCKENTITIES[label] = null;
		return true;
	}
	return false;
}

function saveBlockEntities() {
	let content = JSON.stringify(BLOCKENTITIES, null, 4);
	ModPE.saveWorldFile('blockentities.json', content);
}

function loadBlockEntities() {
	let content = ModPE.loadWorldFile('blockentities.json');
	BLOCKENTITIES = JSON.parse(content);
}