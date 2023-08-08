'use strict'

class TimeUtil {
	static getCurrentDayFile () {
		return this.getDateYYMMDD(new Date())
	}

	static getDateYYMMDD (d) {
		const year = d.getFullYear()
		let month = d.getMonth() + 1
		let dt = d.getDate()
		if (dt < 10) dt = '0' + dt
		if (month < 10) month = '0' + month
		return year + '-' + month + '-' + dt
	}
}

module.exports = TimeUtil
