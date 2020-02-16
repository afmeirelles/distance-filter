const expect = require('expect.js')
const sinon = require('sinon')

const source = require('../')
const reader = require('../reader')

describe('the source reader', () => {

    let readerStub

    beforeEach(() => {
        readerStub = sinon.stub(reader, 'read')
    })

    afterEach(() => {
        readerStub.restore()
    })

    it('should return an empty array if source is missing', () => {
        readerStub.throws()
        const partners = source.getPartners()
        expect(partners).to.be.an('array')
        expect(partners).to.be.empty()
    })

    it('should return an array of partners if the source is found', () => {
        readerStub.returns(JSON.stringify(
            [
                {
                    organization: 'partner1'
                },
                {
                    organization: 'partner2'
                }
            ])
        )
        const partners = source.getPartners()
        expect(partners).to.be.an('array')
        expect(partners).to.have.length(2)
    })

})