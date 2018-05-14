const path = require('path')
const router = require('express').Router()

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'login.html'))
})
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'))
})
router.post('/login', (req, res) => {
    return res.json({
        name: req.body.name,
        status: 0,
        message: '登录成功'
    })
})

router.post('/sendimg', require('./sendimg'))

module.exports = router