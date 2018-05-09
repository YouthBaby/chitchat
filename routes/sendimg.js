const path = require('path')
const form = require('formidable').IncomingForm()
form.uploadDir = '../static/images'
form.keepExtensions = true
form.encoding = 'utf-8'

module.exports = async (req, res) => {
    form.on('fileBegin', (name, file) => {
        file.path = path.join(__dirname, `../static/images/${file.name}`)
    })
    res.json(await new Promise((resolve) => {
        form.parse(req, (err, fields, files) => {
            resolve({
                "errno": err === null ? 0 : 1,
                "data": Object.keys(files).map(name => `/images/${name}`)
            })
        })
    }))
}
