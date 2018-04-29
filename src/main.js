/* main.js
  @author Manasseh Pierce
  @description The main file, contains BL hooks
*/

function useItem(x, y, z, itemID, blockID, side, itemData, blockData) {
	if(itemID < 256) {
		preventDefault();
		let sides = [[x, y - 1, z],[x, y + 1, z],[x, y, z - 1],[x, y, z + 1],[x - 1, y, z],[x + 1, y, z]];
		if(Level.canPlaceBlock(sides[side][0], sides[side][1], sides[side][2])) {
			placeBlock(sides[side][0], sides[side][1], sides[side][2], itemID, itemData);
		}
	}

	if(blockID === BARREL_ID) {
		let barrel = getBarrel(x, y, z);
		if(barrel) {
			clientMessage(`x: ${x}\ny: ${y}\nz: ${z}\nmode: ${barrel.getMode().value}`);
		} else {
			// Uh-Oh! This barrel can't be found, this could only happen if we cant read the previous JSON file,
			// so it must've been deleted. The only way to fix this is to make the barrel a new one
			new Barrel(x, y, z, blockData);
		}
	}
}

// hook when a block is placed, the parameters are specific to the block that was placed
function placeBlock(x, y, z, blockID, blockData) {
	clientMessage(`block placed ${x}, ${y}, ${z}, ${blockID}, ${blockData}`);
	if(Level.getTile(x, y, z) === blockID && Level.getData(x, y, z) === blockData) {
		if(blockID === BARREL_ID) {
			let barrel = new Barrel(x, y, z, blockData);
			clientMessage(`barrel placed ${barrel.getPosition()}`)
		}
	}
	return;
}

function destroyBlock(x, y, z, side) {
	let blockID = Level.getTile(x, y, z);
	let blockData = Level.getData(x, y, z);
	if(blockID === BARREL_ID) {
		preventDefault();
		Level.destroyBlock(x, y, z, false);
		Level.dropItem(x + 0.5, y + 0.5, z + 0.5, 0, BARREL_ID, 1, blockData);
		removeBarrel(x, y, z);
	}
}

function modTick() {
	updateBarrels()
}

function newLevel() {
	loadBarrels()
	creativeBlocks()
}

function leaveGame() {
	saveBarrels()
}
