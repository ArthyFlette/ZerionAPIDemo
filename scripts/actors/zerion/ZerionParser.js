'use strict'

const config = require('../../../config.json')

class ZerionParser {
	parseOverview (src) {
		return src?.data?.attributes
	}

	parsePositions (src) {
		if (!src.data) return []

		const filtered = []
		for (let index = 0; index < src.data.length; index++) {
			const position = src.data[index]
			const parsed = this.parsePosition(position)

			if (parsed) { filtered.push(parsed) }
		}
		return filtered
	}

	parsePosition (data) {
		const rel = data.relationships
		const attr = data.attributes

		if (config.zerion.low_balance.ignore && attr.value < config.zerion.low_balance.thresholdUSD) {
			// console.log("low balance of ", attr.fungible_info.name)
			return null
		}

		return {
			// id: data.id,
			chain: rel.chain.data.id,
			fungId: rel.fungible.data.id,
			name: attr.fungible_info.name,
			symbol: attr.fungible_info.symbol,
			pos_type: attr.position_type,
			// icon: attr.fungible_info.icon,
			amount: attr.quantity.float,
			price: attr.price,
			valueUSD: attr.value,
			changes: attr.changes
		}
	}

	parseTransaction (tx) {
		const attr = tx.attributes

		return {
			id: tx.id,
			chain: tx.relationships.chain.data.id,
			date: attr.mined_at,
			type: attr.operation_type,
			fees: {
				currency: attr.fee.fungible_info.symbol,
				quantity: attr.fee.quantity.float,
				currencyPrice: attr.fee.price,
				valueUSD: attr.fee.value
			},
			transfers: this.parseTransfers(attr.transfers)
		}
	}

	parseTransfers (transfers, type) {
		const result = []

		for (let j = 0; j < transfers.length; j++) {
			const tr = transfers[j]
			let parsed

			if (tr.nft_info) {
				parsed = {
					nft: tr.nft_info.name,
					direction: tr.direction,
					quantity: tr.quantity.float,
					sender: tr.sender,
					recipient: tr.recipient
				}
			}

			if (tr.fungible_info) {
				parsed = {
					fungible: tr.fungible_info.symbol,
					direction: tr.direction,
					quantity: tr.quantity.float,
					value: tr.quantity.value,
					price: tr.quantity.price,
					sender: tr.sender,
					recipient: tr.recipient
				}
			}

			result.push(parsed)
		}
		return result
	}
}
module.exports = ZerionParser
