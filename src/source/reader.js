const fs = require('fs')

module.exports = {
    read: filePath => fs.readFileSync(filePath, { encoding: 'utf8' })
}