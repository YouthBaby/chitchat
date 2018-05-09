const path = require('path')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser')
const form = require('formidable').IncomingForm()
const userList = new Map()

form.uploadDir = './static/images'

app.use(express.static('./static'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

server.listen(3000, () => {
    console.log('server running at 127.0.0.1:3000');
})

const register = (name) => (socketId) => {
    userList.set(socketId, name)
}

let username = ''

app.post('/chat', (req, res) => {
    username = req.body.name
    res.json('success')
})

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html')
})

app.post('/sendimg', (req, res, next) => {
    form.parse(req, (err, fields, files) => {
        res.json({
            "errno": err === null ? 0 : 1,
            "data": Object.keys(files).map(name => `/images/${name}`)
        })
    })
    form.on('fileBegin', (name, file) => {
        file.path = path.join(__dirname, `./static/images/${file.name}`)
    })
})

io.on('connection', (socket) => {
    socket.on('adduser', (data) => {
        register(username)(socket.id)
        socket.emit('receiveMsg', {
            name: '系统',
            msg: `添加用户: ${username} 成功`
        })
    })
    socket.on('sendMsg', (data) => {
        data.name = userList.get(data.id)
        io.emit('receiveMsg', data)
    })
})