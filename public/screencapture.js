
const ScreenROOM_ID = "<%= roomId %>"
const stopElem = document.getElementById("stop");
const screengrid = document.getElementById("screen-sharing");
const videoElem = document.getElementById("screenvideo");



const socket = io('/');
const peer = new Peer(undefined, { host: '/', port: '8002' });

async function startCapture() {
    try {
      videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      // get the Screen share stream here
      
      navigator.mediaDevices.getDisplayMedia(displayMediaOptions).then(stream => {
      
        peer.on('call', call => {
          call.answer(stream);
          const guestvideo = document.createElement('video');  // adding guest video stream on host's window
          call.on('stream', userScreenStream => {
            addVideoStream(video, userScreenStream);
          })
        });
        socket.on('user-connected', ScreenROOM_ID => {
          // connectToNewUser(ScreenROOM_ID, stream);
        })
      })
      console.log(" Source Object: ", videoElem.srcObject);
    } catch(err) {
      console.error("Error: " + err);
    }
  }

function stopCapture(evt) {
    let tracks = videoElem.srcObject.getTracks();  
    tracks.forEach(track => track.stop());
    videoElem.srcObject = null;
}
   

stopElem.addEventListener("click", function(evt) {
    stopCapture();
  }, false);

  
function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  screengrid.append(video);
}
