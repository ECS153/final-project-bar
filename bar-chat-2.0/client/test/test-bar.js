const Bar = artifacts.require('./Bar.sol')

require('chai')
    .use(require('chai-as-promised'))
    .should()

// deployer = account that deploys the blockchain
contract('Bar', ([deployer, author]) => {
    let bar

    // Deploy Bar before running tests
    before(async () => {
        bar = await Bar.deployed()
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = await bar.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has a name', async () => {
            const name = await bar.name()
            assert.equal(name, 'Bar Live Chat')
        })
    })

    describe('messages', async () => {
        let result, msgCount

        before(async () => {
            result = await bar.createMessage('New Message', { from: author }) // { function metadata }
            msgCount = await bar.messageCount()
        })
        it('creates messages', async () => {
            assert.equal(msgCount, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), msgCount.toNumber(), 'id correct')
            assert.equal(event.content, 'New Message', 'content correct')
            assert.equal(event.author, author, 'author correct')

            await bar.createMessage('', { from: author }).should.be.rejected
        })
        it('lists messages', async () => {
            const message = await bar.messages(msgCount)
            assert.equal(message.id.toNumber(), msgCount.toNumber(), 'id correct')
            assert.equal(message.content, 'New Message', 'content correct')
            assert.equal(message.author, author, 'author correct')
        })
    })
})