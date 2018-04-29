/* blocks.js
  @author Manasseh Pierce
  @description defines blocks
*/

const BARREL_ID
const BARREL_STONE_ID
const CRUCIBLE_ID
const UNFIRED_CRUCIBLE_ID
const DUST_ID
const LEAVES_INFESTED_ID
const SIEVE_ID
const BEE_TRAP_ID
const BEE_TRAP_TREATED_ID
const NETHER_GRAVEL_ID
const ENDER_GRAVEL_ID


Block.defineBlock(BARREL_ID, 'exnihilo.barrel', [
	['planks', 0], ['planks', 0], ['planks', 0], ['planks', 0], ['planks', 0], ['planks', 0], ['planks', 0],
	['planks', 1], ['planks', 1], ['planks', 1], ['planks', 1], ['planks', 1], ['planks', 1], ['planks', 1],
	['planks', 2], ['planks', 2], ['planks', 2], ['planks', 2], ['planks', 2], ['planks', 2], ['planks', 2],
	['planks', 3], ['planks', 3], ['planks', 3], ['planks', 3], ['planks', 3], ['planks', 3], ['planks', 3],
	['planks', 4], ['planks', 4], ['planks', 4], ['planks', 4], ['planks', 4], ['planks', 4], ['planks', 4],
	['planks', 5], ['planks', 5], ['planks', 5], ['planks', 5], ['planks', 5], ['planks', 5], ['planks', 5]
], 5, false)

Block.defineBlock(BARREL_STONE_ID)

Block.setDestroyTime(BARREL_ID, 2.0)
Block.setShape(BARREL_ID, 0.1, 0.0, 0.1, 0.9, 1.0, 0.9)
Item.setStackedByData(BARREL_ID, true)
Item.setCategory(BARREL_ID, ItemCategory.DECORATION)

function creativeBlocks() {
	Player.addItemCreativeInv(BARREL_ID, 5, 0)
}
