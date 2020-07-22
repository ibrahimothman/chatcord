const chatForm = document.querySelector('#chat-form')
const messages = document.querySelector('.chat-messages')
const roomName = document.querySelector('#room-name')
const usersList = document.querySelector('#users')

const socket = io()

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

socket.emit('joinRoom', {
    username,
    room,
})


// listen for room and users info
socket.on('roomUsers', ({ room, users }) => {
    addRoom(room)
    addUsers(users)
})

// listen to the server
socket.on('message', msg => {
    addMessage(msg);

    // scroll to the bottom
    messages.scrollTop = messages.scrollHeight
})

// listen to form submission
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = e.target.elements.msg.value

    socket.emit('chatMessage', message)

    // clear the input
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

function addMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message')

    div.innerHTML = `
        <p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
            ${message.text}
        </p>`

    document.querySelector('.chat-messages')
            .appendChild(div);
}

function addRoom(room){
    roomName.innerHTML = room
}

function addUsers(users){
    usersList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}

