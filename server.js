const path = require('path')
const express = require('express')
const http = require('http')
const socket = require('socket.io')
const formatMassge = require('./utils/message')
const
{userJoin,
getCurrentUser,
userLeave,
allRoomUsers
} = require('./utils/users')


const app = express()
const server = http.createServer(app)

// setup socke.io
const io = socket(server)

const chatBot = 'chatBot'

// Run when a client connect to the server
io.on('connection', socket => {

    // listen for join room
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room)
        socket.join(user.room)

        // notify the current user
        socket.emit('message', formatMassge(chatBot, `welocme ${user.username} to the chatCord`))


        // notify all the users except the current one
        socket.broadcast
            .to(user.room)
            .emit('message', formatMassge(chatBot, `${user.username} has joind the ${user.room} room`))

        // send room and users info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: allRoomUsers(user.room)
        })

    })



    // listen for messages from the user
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id)
        if(user){
            io.to(user.room).emit('message', formatMassge(user.username, msg))
        }
    })

    // listen for disconnect
    socket.on('disconnect', () => {
        // notify all the users
        const user = userLeave(socket.id)
        if(user){
            io
            .to(user.room)
            .emit('message', formatMassge(chatBot, `${user.username} has left the ${user.room} room`))
        }
    })

})

// set static folder
app.use(express.static(path.join(__dirname, 'public')))



// run server
const PORT = 3000 || process.env.PORT
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))