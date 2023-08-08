'use strict'

const request = require('request')

class ZerionConnector {
	constructor (apiKey) {
		this.APIKEY = apiKey
		this.baseURL = 'https://api.zerion.io/v1'
	}

	// Wallets
	async getPortfolio (address, currency = 'usd') {
		const url = `/wallets/${address}/portfolio?currency=${currency}`
		return await this.sendRequest('wallet_portofolio', url, 'GET')
	}

	async getWalletPositions (address) {
		const url = `/wallets/${address}/positions`
		return await this.sendRequest('wallet_pos', url, 'GET')
	}

	async getWalletTransactions (address, pageURL, pageSize = 100, currency = 'usd') {
		if (pageURL) return await this.sendRequest('wallet_txs', null, 'GET', null, pageURL)

		const url = `/wallets/${address}/transactions?currency=${currency}&page[size]=${pageSize}`
		return await this.sendRequest('wallet_txs', url, 'GET')
	}

	async getWalletNFTs (address) {
		const url = `/wallets/${address}/nft-positions`
		return await this.sendRequest('wallet_nfts', url, 'GET')
	}

	// Fungibles
	async getFungibles (page = 1, pageSize = 100, currency = 'usd') {
		const url = `/fungibles?currency=${currency}&page[size]=${pageSize}&page[after]=${page}`
		return await this.sendRequest('fung_list', url, 'GET')
	}

	async getFungibleByID (id, currency = 'usd') {
		const url = `/fungibles/${id}?currency=${currency}`
		return await this.sendRequest('fung_asset', url, 'GET')
	}

	async getFungibleChart (id, period, currency = 'usd') {
		const url = `/fungibles/${id}/charts/${period.name}?currency=${currency}`
		console.log(url)
		return await this.sendRequest('fung_chart', url, 'GET')
	}

	// Chains
	async getChains () {
		const url = '/chains/'
		return await this.sendRequest('chains', url, 'GET')
	}

	async getChain (id) {
		const url = `/chains/${id}`
		return await this.sendRequest('chain', url, 'GET')
	}

	// request
	sendRequest (id, urn, method, queryParams = null, forcedURL = null) {
		return new Promise((resolve, reject) => {
			const options = {
				url: forcedURL || this.baseURL + urn,
				method,
				headers: {
					accept: 'application/json',
					authorization: 'Basic ' + this.APIKEY
				}

			}
			if (method === 'POST') { options.body = JSON.stringify(queryParams) } else { options.qs = queryParams }

			// console.log(options)
			request(options, (err, res, body) => {
				if (err) {
					console.log('ERROR ', err)
					reject(err)
					return
				}

				let json
				try {
					json = JSON.parse(body)
				} catch (e) {
					throw new Error('cannot parse json ', body)
				}

				resolve(json)
			})
		})
	}
}
module.exports = ZerionConnector
