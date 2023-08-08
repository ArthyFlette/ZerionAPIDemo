'use strict'

const ZerionConnector = require('./ZerionConnector')
const ZerionParser = require('./ZerionParser')
const fs = require('fs-extra')
const config = require('../../../config.json')
const path = require('path')

class ZerionHistory {
	constructor (wallet) {
		this.outputFolder = path.join(__dirname, '/../../../output/zerion/transactions')
		fs.ensureDirSync(this.outputFolder)

		this.api = new ZerionConnector(config.zerion.apiKey)
		this.parser = new ZerionParser()

		this.wallet = wallet
	}

	async update (force = false) {
		const historyFile = this.outputFolder + '/' + this.wallet.address + '.json'

		if (!force && fs.existsSync(historyFile)) {
			this.data = JSON.parse(fs.readFileSync(historyFile, 'utf-8'))
			console.log(' -> using existing data, resuming update')
		} else {
			console.log(' -> fetch history from scratch')
			this.data = {
				name: this.wallet.id,
				nextPage: null,
				transactions: []
			}
		}

		this.pageCount = 0
		await this.fetchNextHistoryPage()
		console.log('loaded ', this.pageCount, 'pages')

		// save file
		fs.writeFileSync(historyFile, JSON.stringify(this.data, null, 4))
	}

	async fetchNextHistoryPage () {
		this.pageCount++

		const txs = await this.api.getWalletTransactions(this.wallet.address, this.data.nextPage)
		if (txs.errors) {
			console.log('ERROR while fecthing history:', txs.errors)
			return
		}

		for (let index = 0; index < txs.data.length; index++) {
			const tx = txs.data[index]
			if (this.txExists(tx)) {
				// console.log('skipping existing tx')
			} else {
				// console.log("adding tx", tx.id)
				this.data.transactions.push(this.parser.parseTransaction(tx))
			}
		}

		if (txs.links.next) {
			this.data.nextPage = txs.links.next
			await this.fetchNextHistoryPage()
		}
	}

	txExists (tx) {
		for (let index = 0; index < this.data.transactions.length; index++) {
			const src = this.data.transactions[index]
			if (src.id === tx.id) return true
		}
		return false
	}
}

module.exports = ZerionHistory
