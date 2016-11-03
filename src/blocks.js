/* blocks.js
  @author Manasseh Pierce
  @description defines blocks
*/

function creativeBlocks() {
	for(var i = 0; i < 6; i ++) {
		Player.addItemCreativeInv(BARREL_BLOCK_ID, 5, i);
	}
}

const BARREL_BLOCK_ID = 200;
Block.defineBlock(BARREL_BLOCK_ID, 'exnihilope.barrel', ['planks', 0], 5, false);
Block.setDestroyTime(BARREL_BLOCK_ID, 2.0);
BLock.setShape(0.1, 0.0, 0.1, 0.9, 1.0, 0.9);
Item.setStackedByData(BARREL_BLOCK_ID, true);
