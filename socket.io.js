const Express = require('express')
const app = new Express()

const http = require('http').Server(app)

const io = require('socket.io')(http)

const port = 3001

io.on('connection', function (socket) {
  // connected io success
  console.log('connected : ID =>', socket.id)

  socket.on('sendMessage', (msg) => {
    io.emit('sendMessage', msg)
  })
})

http.listen(port, function () {
  console.log('Socket run on port:', port)
})
module.exports = app
