const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const form = require('formidable').IncomingForm()
const userList = new Map()

form.uploadDir = './static/images'

app.use(express.static('./static'))

server.listen(3000, () => {
    console.log('server running at 127.0.0.1:3000');
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
app.post('/sendimg', (req, res, next) => {
    let imgname = null
    form.parse(req, (err, fields, files) => {
        res.send(imgname)
    })
    form.on('fileBegin', (name, file) => {
        file.path = path.join(__dirname, `./static/images/${file.name}`)
        imgname = file.name
    })
})

// let group1 = io.of('/group1')
// let group2 = io.of('/group2')

// group1.on('connection', (socket) => {
//     socket.on('sendMsg', (data) => {
//         data.id = socket.id
//         group1.emit('receiveMsg', data)
//     })
// })

// group2.on('connection', (socket) => {
//     socket.on('sendMsg', (data) => {
//         data.id = socket.id
//         group2.emit('receiveMsg', data)
//     })
// })  

io.on('connection', (socket) => {
    socket.on('adduser', (data) => {
        userList.set(data.name, socket.id)
        socket.emit('receiveMsg', {
            from: '系统',
            msg: `添加${data.name}成功`
        })
    })
    socket.on('compose', (data) => {
        let id = userList.get(data.to)
        let tosocket = io.sockets.sockets[id]
        tosocket.emit('receiveMsg', data)
    })
})