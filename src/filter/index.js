const adapter = require('../source')

const R = 6371 // km
const MAX_DISTANCE_ALLOWED = 100 // km
const CENTRAL_LONDON_COORD = { lat: 51.515419, lng: -0.141099 }

const toRad = num => {
    return num * Math.PI / 180
}

const calculateDistance = (lat1, lng1) =>
    (office) => {
        // extracts coordinates from string
        const [ lat2, lng2 ] = office.coordinates.split(',')

        // Small tweak: as each lat/lng degree is ~110km long, we could
        // test here if any deltas are greater than 1 and return
        // false right away (given that the 100km parameter remains the same)
        // Didn't add it though because it would make the fn less flexible

        // converts angles to radians
        const deltaLat = toRad(lat2 - lat1)
        const deltaLon = toRad(lng2 - lng1)
        const radLat1 = toRad(lat1)
        const radLat2 = toRad(lat2)
        
        // haversine formula
        // a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
        const a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLon/2), 2)

        // c = 2 ⋅ atan2( √a, √(1−a) )
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

        // d = R ⋅ c
        return { ...office, distanceInKm: R * c }
    }

const filterByDistance = target => actual => actual <= target

const distanceFilter = () => {
    // initializes filterByDistance curried fn
    const isWithinDistance = filterByDistance(MAX_DISTANCE_ALLOWED)
    // initizalizes distance from office curried fn
    const addDistanceFromOffice = calculateDistance(CENTRAL_LONDON_COORD.lat, CENTRAL_LONDON_COORD.lng)
    // get partners
    return adapter.getPartners()
        // iterates over partners and return the offices when they're within range
        // or undefined if they're not
        .map(({ organization, offices }) => {
            // adds the distance to each office
            const calculatedDistancesOffices = offices.map(addDistanceFromOffice)
            // filters out offices farther than 100km
            const officesWithinDistance = calculatedDistancesOffices.filter(
                ({ distanceInKm }) => isWithinDistance(distanceInKm)
            )
            // returns company and offices within distance only
            if (officesWithinDistance.length > 0) return { organization, offices: officesWithinDistance }
        })
        // filters out undefined values (companies with offices outside range)
        .filter(Boolean)
}

module.exports = distanceFilter
