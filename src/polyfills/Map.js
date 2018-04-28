class Map {
	constructor( iterable ) {
		this.array = [];
		this.keys = [];
		this._values = [];
		if( iterable && iterable.length > 0 ) {
			// check each pair
			iterable.forEach( pair => {
				if( pair.length != 2 ) {
					throw 'all pairs need to be pairs only'
				} else {
					this.array.push( pair )
					this.keys.push( pair[0] )
					this._values.push( pair[1] )
				}
			})
		}
	}

	get length() {
		return this.array.length
	}

	get size() {
		return this.array.length
	}

	clear() {
		this.array = []
	}

	delete( key ) {
		let val = false
		let index = this.keys.indexOf( key )
		if( index > -1 ) {
			this.array.splice(index, 1)
			this._values.splice(index, 1)
			this.keys.splice(index, 1)
			val = true
		}
	}

	entries() {
		let arr = []
		this.array.forEach( pair => {
			arr.push(pair)
		})
		return arr
	}

	get( key ) {
		let val = null
		let index = this.keys.indexOf( key )
		if( index > -1 ) val = this._values[index]
		return val
	}

	has( key ) {
		let val = false
		let index = this.keys.indexOf( key )
		if( index > -1 ) val = true
		return val
	}

	keys() {
		let arr = []
		this.keys.forEach( key => {
			arr.push( key )
		})
		return arr
	}

	set( key, value ) {
		// see if we have the key yet or not
		if(this.has(key)) {
			let index = this.keys.indexOf(key)
			this._values[index] = value
			this.array[index][1] = value
		} else {
			this.keys.push(key)
			this._values.push(value)
			this.array.push([key, value])
		}
		return this
	}

	values() {
		let arr = []
		this._values.forEach( value => {
			arr.push( value )
		})
		return arr
	}
}