const expect = require('expect.js')
const sinon = require('sinon')

const distanceFilter = require('..')
const source = require('../../source')

describe('the distance filter function', () => {

    let getPartnersStub

    beforeEach(() => {
        getPartnersStub = sinon.stub(source, 'getPartners')
    })

    afterEach(() => {
        getPartnersStub.restore()
    })

    it('should return an empty array if source is empty', () => {
        getPartnersStub.returns([])
        expect(distanceFilter()).to.be.empty()
    })

    it('should filter addresses within 100km distance', () => {
        getPartnersStub.returns([
            {
                id: 4,
                urlName: "blue-square-360",
                organization: "Blue Square 360",
                customerLocations: "globally",
                willWorkRemotely: true,
                website: "http://www.bluesquare360.com/",
                services: "Blue Square 360 provides a professionally managed service covering all areas of a 360° Feedback initiative. We're experienced in supporting projects of all sizes, and always deliver a personal service that provides the level of support you need to ensure your 360 initiative delivers results for the business.",
                offices: [
                  {
                    location: "Singapore",
                    address: "Ocean Financial Centre, Level 40, 10 Collyer Quay, Singapore, 049315",
                    coordinates: "1.28304,103.85199319999992"
                  },
                  {
                    location: "London, UK",
                    address: "St Saviours Wharf, London SE1 2BE",
                    coordinates: "51.5014767,-0.0713608999999451"
                  }
                ]
            },
            {
                id: 6,
                urlName: "inspire-ignite",
                organization: "Inspire - Ignite",
                customerLocations: "across the UK",
                willWorkRemotely: true,
                website: "http://www.inspireignite.net/",
                services: "'Inspire - Ignite' is built on the philosophy that people perform better when they can be themselves. We work with individuals and organisations to be their best, achieve ambitions and be a success. We use Clarity4D and the concept of colour and 360 to build personal awareness and action plans.",
                offices: [
                  {
                    location: "Peterborough, UK",
                    address: "29 Warren Court, Hampton Hargate, Peterborough, PE7 8HA",
                    coordinates: "52.5381398,-0.2713853000000199"
                  }
                ]
            }
        ])
        
        const foundPartners = distanceFilter()

        expect(foundPartners).to.have.length(1)
        expect(foundPartners).to.eql([
            {
                organization: "Blue Square 360",
                offices: [
                    {
                        location: "London, UK",
                        address: "St Saviours Wharf, London SE1 2BE",
                        coordinates: "51.5014767,-0.0713608999999451",
                        distanceInKm: 5.069289250892114
                    }
                ]
            },
        ])
    })

})