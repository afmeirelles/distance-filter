const path = require('path')
const reader = require('./reader')

module.exports = {
    getPartners: () => {
        try {
            const filePath = path.join(__dirname, 'partners.json')
            const partners = reader.read(filePath)
            return JSON.parse(partners)
        } catch (error) {
            return []
        }
    }
}