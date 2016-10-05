'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// event.js
var EventEmitter = function () {
	function EventEmitter() {
		_classCallCheck(this, EventEmitter);

		this.listeners = new Map();
	}

	_createClass(EventEmitter, [{
		key: 'addListener',
		value: function addListener(label, callback) {
			this.listeners.has(label) || this.listeners.set(label, []);
			this.listeners.get(label).push(callback);
		}
	}, {
		key: 'isFunction',
		value: function isFunction() {
			return typeof obj == 'function' || false;
		}
	}, {
		key: 'removeListener',
		value: function removeListener(label, callback) {
			var listeners = this.listeners.get(label),
			    index = void 0;

			if (listeners && listeners.length) {
				index = listeners.reduce(function (i, listener, index) {
					return isFunction(listener) && listener === callback ? i = index : i;
				}, -1);

				if (index > -1) {
					listeners.splice(index, 1);
					this.listeners.set(label, listeners);
					return true;
				}
			}
			return false;
		}
	}, {
		key: 'emit',
		value: function emit(label) {
			for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				args[_key - 1] = arguments[_key];
			}

			var listeners = this.listeners.get(label);

			if (listeners && listeners.length) {
				listeners.forEach(function (listener) {
					listener.apply(undefined, args);
				});
				return true;
			}
			return false;
		}
	}]);

	return EventEmitter;
}();

// blockentity.js

var BLOCKENTITIES = {};

var BlockEntity = function (_EventEmitter) {
	_inherits(BlockEntity, _EventEmitter);

	function BlockEntity(x, y, z) {
		_classCallCheck(this, BlockEntity);

		var _this = _possibleConstructorReturn(this, (BlockEntity.__proto__ || Object.getPrototypeOf(BlockEntity)).call(this));

		_this.x = x, _this.y = y, _this.z = z;
		_this.label = [x, y, z].join(',');
		_this.tags = {};
		BLOCKENTITIES[_this.label] = _this;
		return _this;
	}

	_createClass(BlockEntity, [{
		key: 'setTag',
		value: function setTag(label, data) {
			this.tags[label] = data;
			BLOCKENTITIES[this.label] = this;
			return this;
		}
	}, {
		key: 'getTag',
		value: function getTag(label) {
			return this.tags[this.label];
		}
	}, {
		key: 'removeTag',
		value: function removeTag(label) {
			this.tags[label] = null;
			BLOCKENTITIES[this.label] = this;
			return this;
		}
	}]);

	return BlockEntity;
}(EventEmitter);

// returns a BlockEntity, or false if it doesn't exist


function getBlockEntity(x, y, z) {
	var label = [x, y, z].join(',');
	if (BLOCKENTITIES[label]) {
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
	var label = [x, y, z].join(',');
	if (BLOCKENTITIES[label]) {
		BLOCKENTITIES[label] = null;
		return true;
	}
	return false;
}

// main.js

function destroyBlock(x, y, z, side) {
	if (getBlockEntity(x, y, z)) {
		removeBlockEntity(x, y, z);
	}
}

function modTick() {
	updateBarrels();
}
// barrel.js

// BARRELS!
var BARRELS = [];

var BARREL_UPDATE_INTERVAL = 10;
var updateCounter = 0;

var ExtractMode = { 'None': 0, 'Always': 1, 'PeacfulOnly': 2 };

var BarrelMode = {
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

var Barrel = function (_BlockEntity) {
	_inherits(Barrel, _BlockEntity);

	function Barrel(x, y, z) {
		_classCallCheck(this, Barrel);

		var _this2 = _possibleConstructorReturn(this, (Barrel.__proto__ || Object.getPrototypeOf(Barrel)).call(this, x, y, z));

		_this2.setMode(BarrelMode.EMPTY);
		_this2.volume = 0;
		_this2.timer = 0;
		_this2.fluid = 'WATER';
		_this2.addEventListener('update', _this2.update);
		_this2.update();
		BARRELS.push(_this2);
		return _this2;
	}

	_createClass(Barrel, [{
		key: 'getMode',
		value: function getMode() {
			return this.mode;
		}
	}, {
		key: 'setMode',
		value: function setMode(mode) {
			this.mode = mode;
			this.needsUpdate = true;
		}
	}, {
		key: 'update',
		value: function update() {
			this.needsUpdate = false;

			switch (this.getMode()) {
				case BarrelMode.EMPTY:
					// Handle Rain
					if (Level.canSeeSky(this.x, this.y, this.z) && Level.getRainLevel() > 0.0) {
						this.fluid = 'WATER';
						this.setMode(BarrelMode.FLUID);
					}
					break;
				case BarrelMode.FLUID:
					// WATER!
					if (this.fluid == 'WATER') {
						// Handle Rain
						if (Level.canSeeSky(this.x, this.y, this.z) && !this.isFull() && Level.getRainLevel() > 0.0) {
							this.volume += Level.getRainLevel() / 1000;
							if (this.volume > 1) {
								this.volume = 1;
							}
							this.needsUpdate = true;
						}

						// Check for Spores.

						// Turn into Cobblestone?

						// Spread Moss.
					}
					// LAVA!
					if (this.fluid == 'LAVA') {}
					break;
				case BarrelMode.COMPOST:
					if (this.volume >= 1.0) {}
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
	}, {
		key: 'addCompostItem',
		value: function addCompostItem() {}
	}, {
		key: 'isFull',
		value: function isFull() {}
	}, {
		key: 'isDone',
		value: function isDone() {}
	}, {
		key: 'resetColor',
		value: function resetColor() {}
	}, {
		key: 'giveAppropiateItem',
		value: function giveAppropiateItem() {}
	}, {
		key: 'giveItem',
		value: function giveItem() {}
	}, {
		key: 'getExtractItem',
		value: function getExtractItem() {}
	}, {
		key: 'getVolume',
		value: function getVolume() {}
	}, {
		key: 'getTimer',
		value: function getTimer() {}
	}, {
		key: 'getAdjustedVolume',
		value: function getAdjustedVolume() {}
	}, {
		key: 'resetBarrel',
		value: function resetBarrel() {}
	}]);

	return Barrel;
}(BlockEntity);

function updateBarrels() {
	if (updateCounter >= BARREL_UPDATE_INTERVAL) {
		updateCounter = 0;
		var updates = BARRELS.filter(function (barrel) {
			return barrel.needsUpdate == true;
		});
		updates.forEach(function (barrel) {
			barrel.emit('update');
		});
	} else {
		updateCounter++;
	}
}