const path = require('path')
const express = require('express')
const http = require('http')
const socket = require('socket.io')


const app = express()
const server = http.createServer(app)

// setup socke.io
const io = socket(server)

// Run when a client connect to the server
io.on('connection', socket => {
    console.log('WS connection......');
})

// set static folder
app.use(express.static(path.join(__dirname, 'public')))



// run server
const PORT = 3000 || process.env.PORT
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))