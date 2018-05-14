const path = require('path')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser')
const router = require('./routes')
const util = require('./lib')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('./static'))
app.use('/', router)

server.listen(3000, () => {
    console.log('server running at 127.0.0.1:3000');
})

io.on('connection', (socket) => {
    socket.on('adduser', (data) => {
        util.register(data.name)(socket.id)
        socket.emit('receiveMsg', {
            name: '系统',
            msg: `添加用户: ${data.name} 成功`
        })
    })
    socket.on('sendMsg', (data) => {
        data.name = userList.get(data.id)
        io.emit('receiveMsg', data)
    })
})