const config = require('../config.json')
const ZerionHoldings = require('./actors/zerion/ZerionHoldings')
const ZerionHistory = require('./actors/zerion/ZerionHistory')

async function getHoldings () {
	const holdings = new ZerionHoldings()
	holdings.setWallets(config.wallets)

	await holdings.update()

	console.log('holdings updated')
}

async function getHistory () {
	for (let index = 0; index < config.wallets.length; index++) {
		const wallet = config.wallets[index]
		console.log('** fetching history of', wallet.id)

		const history = new ZerionHistory(wallet)
		await history.update()
	}

	console.log('history updated')
}

async function update () {
	await getHoldings()
	await getHistory()
}

update()
