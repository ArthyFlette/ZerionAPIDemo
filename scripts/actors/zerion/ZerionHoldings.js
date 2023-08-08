'use strict'

const TimeUtil = require('../../util/TimeUtil')
const ZerionConnector = require('./ZerionConnector')
const ZerionParser = require('./ZerionParser')
const fs = require('fs-extra')
const config = require('../../../config.json')
const path = require('path')

class ZerionHoldings {
	constructor () {
		this.outputFolder = path.join(__dirname, '/../../../output/zerion/history')
		fs.ensureDirSync(this.outputFolder)

		this.wallets = []

		this.api = new ZerionConnector(config.zerion.apiKey)
		this.parser = new ZerionParser()
	}

	setWallets (aWallets) {
		this.wallets = aWallets
	}

	async update (force = false) {
		if (this.wallets.length === 0) {
			throw new Error('you need to set wallet addresses first.')
		}

		const file = this.outputFolder + '/' + TimeUtil.getCurrentDayFile() + '.json'

		let data = []
		if (!force && fs.existsSync(file)) {
			console.log(' -> today holdings file exists already')
			data = JSON.parse(fs.readFileSync(file))
			return data
		}

		console.log(' -> updating zerion holdings')

		data = await this.getWalletsHoldings()

		fs.writeFileSync(file, JSON.stringify(data, null, 4))

		return data
	}

	async getWalletsHoldings () {
		const result = []

		for (let index = 0; index < this.wallets.length; index++) {
			const wallet = this.wallets[index]
			console.log(`- updating wallet: ${wallet.id} (${index + 1}/${this.wallets.length})`)
			const overview = await this.api.getPortfolio(wallet.address)
			const positions = await this.api.getWalletPositions(wallet.address)

			result.push(
				{
					name: wallet.id,
					address: wallet.address,
					overview: this.parser.parseOverview(overview),
					positions: this.parser.parsePositions(positions)
				}
			)
		}
		return result
	}
}

module.exports = ZerionHoldings
