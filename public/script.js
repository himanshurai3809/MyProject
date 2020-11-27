
const ROOM_ID = "<%= roomId %>"; // Host Id

const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

// const peer = new Peer([id], [options]);
const peer = new Peer(undefined, { host: '/', port: '8002' });
const peers = {};
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
    addVideoStream(myVideo, stream);
    peer.on('call', call => {
      // if call conn-> answer and embed.
      call.answer(stream);
      const video = document.createElement('video');  // adding guest video stream on host's window
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
      })
    });
    socket.on('user-connected', userId => {
      console.log('My peer ID is: ' + userId);
      connectToNewUser(userId, stream);
    })
});

function connectToNewUser(userId, stream) {
  const call = peer.call(userId, stream);
  
  if(call) console.log("Calling Peer: ", userId);
  
  const video = document.createElement('video');
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })
  window.alert("New Guest Joined. Id: ", userId);
  peers[userId] = call;
}

socket.on('user-disconnected', userId => {
  if (peers[userId]) 
    peers[userId].close();
})

peer.on('open', id => {
  console.log('Host and peer ID is: ', ROOM_ID, id);
  socket.emit('join-room', ROOM_ID, id)
})

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video);
}
