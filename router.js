const express = require('express')
const router = express.Router()

router.get('/chat', (req, res) => {
    return res.sendFile(__dirname + '/index.html')
})

router.get('/', (req, res) => {
    return res.sendFile(__dirname + '/login.html')
})

router.post('/sendimg', require('./routes/sendimg.js'))

module.exports = router