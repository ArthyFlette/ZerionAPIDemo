'use strict'

class ZerionPeriod {
	static Hour = new ZerionPeriod('hour')
	static Day = new ZerionPeriod('day')
	static Week = new ZerionPeriod('week')
	static Month = new ZerionPeriod('month')
	static Year = new ZerionPeriod('year')
	static Max = new ZerionPeriod('max')

	constructor (name) {
		this.name = name
	}
}

module.exports = ZerionPeriod
