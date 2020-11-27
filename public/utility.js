function getMeetingId() {
    var dummy = document.createElement('input'), text = window.location.href;
    var uid = retrieveId(text); 
    document.body.appendChild(dummy);
    dummy.value = uid;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  }
 
  function retrieveId(url) {
    let index = url.indexOf("3000", 0);
    var res = url.substr(index+5);
    console.log("Meeting Id:", res);
    return res;
  }
  
  function joinmeeting() {
      var mid = document.getElementById("mid").value;  // get meeting id and send it to host room stream
      var url = "http://localhost:3000/" + mid; // redirect to host room.
      window.location = url; 
  }