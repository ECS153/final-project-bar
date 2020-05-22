const Bar = artifacts.require('./Bar.sol')

contract('Bar', (accounts) => { //accounts in the blockchain (ganache)
    before(async () => {
        this.bar = await Bar.deployed()
    })

    it('deploys successfully', async () => {
        const address = await this.bar.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })

    it('lists messages', async () => {
        const msgCount = await this.bar.msgCount()
        const msg = await this.bar.messages(msgCount)
        assert.equal(msg.id.toNumber(), msgCount.toNumber())
        assert.equal(msg.content, 'Hello World')
        assert.equal(msgCount.toNumber(), 1)
    })

    it('creates messages', async () => {
        const result = await this.bar.createMessage('A new message')
        const msgCount = await this.bar.msgCount()
        assert.equal(msgCount, 2)
        const event = result.logs[0].args // emitted event from Bar.sol.createMessage
        assert.equal(event.id.toNumber(), 2)
        assert.equal(event.content, 'A new message')
    })
})