module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true
	},
	extends: 'standard',
	overrides: [
		{
			env: {
				node: true
			},
			files: [
				'.eslintrc.{js,cjs}'
			],
			parserOptions: {
				sourceType: 'script'
			}
		}
	],
	parserOptions: {
		ecmaVersion: 'latest'
	},
	ignorePatterns: ['output/*', 'scripts/express/*'],
	rules: {
		indent: ['error', 'tab'],
		'no-tabs': 0
	}
}
