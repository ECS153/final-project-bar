const lotion = require('lotion');

let app = lotion({
    initialState: {
        count: 0 // how many counts somebody has run the blockchain
    } // default state when blockchain is launched
}); 

// intercept transactional request 
// and decide if we want to process it
// middleware MUST be deterministic (no RNG)
app.use((state, tx) => {
    // TODO: smart contract (logic that allows transaction)
    if (state.count === tx.nonce) {
        state.count++;
    }
});

app.start(3000).then(genesis => {
    console.log('App listening on port 3000.')
});

process.on('unhandledRejection', e => {
    console.log(e)
});