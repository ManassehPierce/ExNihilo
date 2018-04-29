class Map {
	constructor( iterable = [] ) {
		this.array = iterable.slice()
		this.keys = [], this._values = []
		this.array.forEach( pair => { 
			this.keys.push(pair[0])
			this._values.push(pair[1])
		})
	}

	get length() { return this.array.length }

	get size() { return this.array.length }

	clear() { this.array = [] }

	delete( key ) {
		let i = this.keys.indexOf(key)
		if( i > -1 ) {
			this.array.splice(i, 1)
			this._values.splice(i, 1)
			this.keys.splice(i, 1)
			return true
		}
		return false
	}

	entries() {
		return this.array.slice() // thank you slice :|
	}

	get( key ) {
		if( this.keys.indexOf(key) > -1 ) return this._values[index]
		return
	}

	has( key ) {
		if( this.keys.indexOf(key) > -1 ) return true
		return false
	}

	keys() {
		return this.keys.slice()
	}

	set( key, value ) {
		if(this.has(key)) {
			let i = this.keys.indexOf(key)
			this._values[i] = value
			this.array[i][1] = value
		} else {
			this.keys.push(key)
			this._values.push(value)
			this.array.push([key, value])
		}
		return this
	}

	values() {
		return this._values.slice()
	}
}