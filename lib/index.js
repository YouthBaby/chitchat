const userList = new Map()

const util = {
    register: (name) => (socketId) => {
        userList.set(socketId, name)
    }
}

module.exports = util