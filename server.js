const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))


app.get('/', function(req, res) {
  var mascots = [];
  var tagline = "Our own video chat app. Learning is fun.";
  res.render('pages/index', {
      mascots: mascots,
      tagline: tagline
  });
});

app.get('/about', function(req, res) {
  res.render('pages/about');
});
app.get('/guestroom', function(req, res) {
  res.render('pages/guestroom');
});

app.get('/sharescreen', function(req, res) {
  res.render('pages/sharescreen');
});

app.get('/hostroom', (req, res) => {
  // moving to peer, room rendered after uuid
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('pages/hostroom', { roomId: req.params.room })
})

io.on('connection', socket => {

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userId)
    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})
server.listen(3000);
