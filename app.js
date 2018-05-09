const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser')
const route = require('./router')

const userList = new Map()

app.use(bodyParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('./static'))

server.listen(3000, () => {
    console.log('server running at 127.0.0.1:3000');
})

const register = (name) => (socketId) => {
    userList.set(socketId, name)
}

let username = ''
app.use('/', route)
app.post('/chat', (req, res) => {
    username = req.body.name
    return res.end('success')
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