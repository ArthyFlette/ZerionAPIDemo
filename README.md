# Zerion API demo

This demo shows how to use Zerion API so save daily holdings of defined wallets (in config.json)
It also keep track of the history of each wallet.

For the purpose of the demo, 2 random wallets have been set in config.json

## run the demo
	npm i
	npm run test

## configuration
- edit the config.json
- add your Zerion API key 
- replace the demo wallets with your own hot wallets 

## What does the demo do

### daily snapshot
When you run `npm run test`, the app will generate a snapshot of wallets and save it in `output/zerion/history` as a daily file.
If you run the script again the same day, the app will not update it.

### history tracking
When you run `npm run test`, the app will also try to update each wallet history.
The first time you run the script, it will parse the blockchain and store all existing transactions.
Next time you start the app, it will resume where it stopped and check any new transactions.

