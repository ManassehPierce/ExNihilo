// main.js

function destroyBlock(x, y, z, side) {
	if(getBlockEntity(x, y, z)) {
		removeBlockEntity(x, y, z);
	}
}

function modTick() {
	updateBarrels();
}