/*

>> kasperkamperman.com - 2018-04-18
>> kasperkamperman.com - 2020-05-17
>> https://www.kasperkamperman.com/blog/camera-template/

*/

//var takeSnapshotUI = createClickFeedbackUI();

var video;
var takePhotoButton;
var toggleFullScreenButton;
var switchCameraButton;
var amountOfCameras = 0;
var currentFacingMode = 'environment';
var es_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
var es_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
//is Mobile??
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

const canvas = document.getElementById('canvas'); //video Stream Visible
const capture = document.getElementById('capture'); //Canvas of photo capture
const photoBooth = document.getElementById('photoBooth'); //Image PhotoBooth
//const snap = document.getElementById("snap"); //Capture
const save = document.getElementById("save"); //Photo Save
const back = document.getElementById("back"); //Back
const share = document.getElementById("share");

const imgConverted = document.getElementById("imgConverted");

const buttonPose = document.getElementById("buttonPose");
const changeFoto5 = document.getElementById("foto5");
const changeFoto10 = document.getElementById("foto10");
const changeFoto15 = document.getElementById("foto15");
const changeFoto20 = document.getElementById("foto20");
const changeFoto25 = document.getElementById("foto25");
const changeFoto30 = document.getElementById("foto30");
const changeFoto35 = document.getElementById("foto35");
const changeFoto40 = document.getElementById("foto40");

var context = canvas.getContext('2d');

var foto ={
};
var foto5 = {
  url: "Images/5a1.png"
};
var foto10 = {
  url: "Images/10a1.png"
};
var foto15 = {
  url: "Images/15a1.png"
};
var foto20 = {
  url: "Images/20a1.png"
};
var foto25 = {
  url: "Images/25a1.png"
};
var foto30 = {
  url: "Images/30a1.png"
};
var foto35 = {
  url: "Images/35a1.png"
};
var foto40 = {
  url: "Images/40a1.png"
};

foto.imagen = new Image();
foto.imagen.src = foto5.url;

var fondoCapture = {
  url: "Images/fondoCapture.png"
};
var intervalPhotoBooth = null;
fondoCapture.imagen = new Image();
fondoCapture.imagen.src = fondoCapture.url;

// this function counts the amount of video inputs
// it replaces DetectRTC that was previously implemented.
function deviceCount() {
  return new Promise(function (resolve) {
    var videoInCount = 0;

    navigator.mediaDevices
      .enumerateDevices()
      .then(function (devices) {
        devices.forEach(function (device) {
          if (device.kind === 'video') {
            device.kind = 'videoinput';
          }

          if (device.kind === 'videoinput') {
            videoInCount++;
            console.log('videocam: ' + device.label);
          }
        });

        resolve(videoInCount);
      })
      .catch(function (err) {
        console.log(err.name + ': ' + err.message);
        resolve(0);
      });
  });
}

document.addEventListener('DOMContentLoaded', function (event) {
  save.style.visibility = "hidden";
    back.style.visibility = "hidden";
    if(share != null)share.style.visibility = "hidden";
  intervalPhotoBooth = setInterval(() => {
                context.drawImage(foto.imagen, 0, 0, 1024, 664);
            }, 200)
  

  // check if mediaDevices is supported
  if (
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia &&
    navigator.mediaDevices.enumerateDevices
  ) {
    // first we call getUserMedia to trigger permissions
    // we need this before deviceCount, otherwise Safari doesn't return all the cameras
    // we need to have the number in order to display the switch front/back button
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: true,
      })
      .then(function (stream) {
        stream.getTracks().forEach(function (track) {
          track.stop();
        });

        deviceCount().then(function (deviceCount) {
          amountOfCameras = deviceCount;

          // init the UI and the camera stream
          initCameraUI();
          initCameraStream();
        });
      })
      .catch(function (error) {
        //https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
        if (error === 'PermissionDeniedError') {
          alert('Permission denied. Please refresh and give permission.');
        }

        console.error('getUserMedia() error: ', error);
      });
  } else {
    alert(
      'Mobile camera is not supported by browser, or there is no camera detected/connected',
    );
  }
  //clearInterval(intervalPhotoBooth);
});

var  camX1 = 300;
var  camY1 = 40;
var  camX2 = 540;
var  camY2 = 530;


function initCameraUI() {
  

  video = document.getElementById('video');

  takePhotoButton = document.getElementById('snap');
  toggleFullScreenButton = document.getElementById('toggleFullScreenButton');
  switchCameraButton = document.getElementById('switchCameraButton');

  video.addEventListener('loadeddata', () => {
            foto.width = video.videoWidth;
            foto.height = video.videoHeight;
            
            setInterval(() => {
                photoKey(camX1,camY1,camX2,camY2);
            }, 20)
        });

  // https://developer.mozilla.org/nl/docs/Web/HTML/Element/button
  // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_button_role

  takePhotoButton.addEventListener('click', function () {
    //takeSnapshotUI();
    takeSnapshot();
  });

  // -- fullscreen part

  function fullScreenChange() {
    if (screenfull.isFullscreen) {
      toggleFullScreenButton.setAttribute('aria-pressed', true);
    } else {
      toggleFullScreenButton.setAttribute('aria-pressed', false);
    }
  }

  if (screenfull.isEnabled) {
    screenfull.on('change', fullScreenChange);

    toggleFullScreenButton.style.display = 'block';

    // set init values
    fullScreenChange();

    toggleFullScreenButton.addEventListener('click', function () {
      screenfull.toggle(document.getElementById('container')).then(function () {
        console.log(
          'Fullscreen mode: ' +
            (screenfull.isFullscreen ? 'enabled' : 'disabled'),
        );
      });
    });
  } else {
    console.log("iOS doesn't support fullscreen (yet)");
  }

  // -- switch camera part
  if (amountOfCameras > 1) {
    switchCameraButton.style.display = 'block';

    switchCameraButton.addEventListener('click', function () {
      if (currentFacingMode === 'environment') currentFacingMode = 'user';
      else currentFacingMode = 'environment';

      initCameraStream();
    });
  }

  // Listen for orientation changes to make sure buttons stay at the side of the
  // physical (and virtual) buttons (opposite of camera) most of the layout change is done by CSS media queries
  // https://www.sitepoint.com/introducing-screen-orientation-api/
  // https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
  window.addEventListener(
    'orientationchange',
    function () {
      // iOS doesn't have screen.orientation, so fallback to window.orientation.
      // screen.orientation will
      if (screen.orientation) angle = screen.orientation.angle;
      else angle = window.orientation;

      var guiControls = document.getElementById('gui_controls').classList;
      var vidContainer = document.getElementById('vid_container').classList;

      if (angle == 270 || angle == -90) {
        guiControls.add('left');
        vidContainer.add('left');
      } else {
        if (guiControls.contains('left')) guiControls.remove('left');
        if (vidContainer.contains('left')) vidContainer.remove('left');
      }

      //0   portrait-primary
      //180 portrait-secondary device is down under
      //90  landscape-primary  buttons at the right
      //270 landscape-secondary buttons at the left
    },
    false,
  );
}

// https://github.com/webrtc/samples/blob/gh-pages/src/content/devices/input-output/js/main.js
function initCameraStream() {
  // stop any active streams in the window
  if (window.stream) {
    window.stream.getTracks().forEach(function (track) {
      console.log(track);
      track.stop();
    });
  }

  // we ask for a square resolution, it will cropped on top (landscape)
  // or cropped at the sides (landscape)
  var size = 1280;

  var constraints = {
    audio: false,
    video: {
      width: { ideal: size },
      height: { ideal: size },
      //width: { min: 1024, ideal: window.innerWidth, max: 1920 },
      //height: { min: 776, ideal: window.innerHeight, max: 1080 },
      facingMode: currentFacingMode,
    },
  };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(handleSuccess)
    .catch(handleError);

  function handleSuccess(stream) {
    window.stream = stream; // make stream available to browser console
    video.srcObject = stream;

    if (constraints.video.facingMode) {
      if (constraints.video.facingMode === 'environment') {
        switchCameraButton.setAttribute('aria-pressed', true);
      } else {
        switchCameraButton.setAttribute('aria-pressed', false);
      }
    }

    const track = window.stream.getVideoTracks()[0];
    const settings = track.getSettings();
    str = JSON.stringify(settings, null, 4);
    console.log('settings ' + str);
  }

  function handleError(error) {
    console.error('getUserMedia() error: ', error);
  }
}

function takeSnapshot() {
  // if you'd like to show the canvas add it to the DOM
  var canvas = document.createElement('canvas');

  var width = video.videoWidth;
  var height = video.videoHeight;

  canvas.width = width;
  canvas.height = height;

  context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, width, height);

  // polyfil if needed https://github.com/blueimp/JavaScript-Canvas-to-Blob

  // https://developers.google.com/web/fundamentals/primers/promises
  // https://stackoverflow.com/questions/42458849/access-blob-value-outside-of-canvas-toblob-async-function
  function getCanvasBlob(canvas) {
    return new Promise(function (resolve, reject) {
      canvas.toBlob(function (blob) {
        resolve(blob);
      }, 'image/jpeg');
    });
  }

  // some API's (like Azure Custom Vision) need a blob with image data
  getCanvasBlob(canvas).then(function (blob) {
    // do something with the image blob
  });
}

// https://hackernoon.com/how-to-use-javascript-closures-with-confidence-85cd1f841a6b
// closure; store this in a variable and call the variable as function
// eg. var takeSnapshotUI = createClickFeedbackUI();
// takeSnapshotUI();

function createClickFeedbackUI() {
  // in order to give feedback that we actually pressed a button.
  // we trigger a almost black overlay
  var overlay = document.getElementById('video_overlay'); //.style.display;

  var overlayVisibility = false;
  var timeOut = 80;

  function setFalseAgain() {
    overlayVisibility = false;
    overlay.style.display = 'none';
  }

  return function () {
    if (overlayVisibility == false) {
      sndClick.play();
      overlayVisibility = true;
      overlay.style.display = 'block';
      setTimeout(setFalseAgain, timeOut);
    }
  };
}

//Change Photo
changeFoto5.addEventListener("click", function(){    
  foto.imagen.src = foto5.url;
  
    camX1 = 300;
    camY1 = 40;
    camX2 = 540;
    camY2 = 530;
   
});
changeFoto10.addEventListener("click", function(){    
  foto.imagen.src = foto10.url;
  
    camX1 = 300;
    camY1 = 40;
    camX2 = 540;
    camY2 = 530;
   
});
changeFoto15.addEventListener("click", function(){    
  foto.imagen.src = foto15.url;
  
    camX1 = 300;
    camY1 = 40;
    camX2 = 540;
    camY2 = 530;
   
});
changeFoto20.addEventListener("click", function(){    
  foto.imagen.src = foto20.url;
  
    camX1 = 75;
    camY1 = 40;
    camX2 = 520;
    camY2 = 530;
   
});
changeFoto25.addEventListener("click", function(){    
    foto.imagen.src = foto25.url;
    
    camX1 = 75;
    camY1 = 40;
    camX2 = 520;
    camY2 = 530;
  
});
changeFoto30.addEventListener("click", function(){    
  foto.imagen.src = foto30.url;
  
    //camX1 = 400;
    //camY1 = 40;
    //camX2 = 520;
    //camY2 = 530;
    if( !isMobile.any() && es_firefox) {
      camX1 = 340;
      camY1 = 40;
      camX2 = 460;
      camY2 = 530;
    }else{
      camX1 = 405;
      camY1 = 40;
      camX2 = 520;
      camY2 = 530;
    }
    
 
});
changeFoto35.addEventListener("click", function(){    
    foto.imagen.src = foto35.url;
    
    if( !isMobile.any() && es_firefox) {
      camX1 = 340;
      camY1 = 40;
      camX2 = 460;
      camY2 = 530;
    }else{
      camX1 = 405;
      camY1 = 40;
      camX2 = 520;
      camY2 = 530;
    }
  });
changeFoto40.addEventListener("click", function(){    
    foto.imagen.src = foto40.url;
    
    if( !isMobile.any() && es_firefox) {
      camX1 = 340;
      camY1 = 40;
      camX2 = 460;
      camY2 = 530;
    }else{
      camX1 = 380;
      camY1 = 40;
      camX2 = 520;
      camY2 = 530;
    }
  });

//Camera ON
function photoKey(x1, y1, x2, y2){    
  //var context = canvas.getContext('2d');
  //context.drawImage(video, 80, 181, 520, 321);
  if( !isMobile.any() && es_firefox) {
    context.drawImage(video, x1-180, y1+10, x2+380, y2-20);
  }else{
    context.drawImage(video, x1, y1, x2, y2);
  }
  clearInterval(intervalPhotoBooth); 
  context.drawImage(foto.imagen, 0, 0, 1024, 664);
}
// Draw image
var cxt = capture.getContext('2d');
snap.addEventListener("click", function() {
    //cxt.drawImage(fondoCapture.imagen, 0, 0, 1300, 684);
    //cxt.drawImage(video, 90, 189, 520, 321);
  if( !isMobile.any() && es_firefox) {
    cxt.drawImage(video, (camX1+10)-180, (camY1+15)+10, (camX2)+380, (camY2)-20);
  }else{
    cxt.drawImage(video, (camX1+10), (camY1+15), (camX2), (camY2));
  }
    cxt.drawImage(foto.imagen, 11, 0, 1024, 684);
    snap.style.visibility = "hidden";
    save.style.visibility = "visible";
    if(share!=null)share.style.visibility = "visible";
    back.style.visibility = "visible";
    toggleFullScreenButton.style.visibility = "hidden";
    switchCameraButton.style.visibility = "hidden";
    buttonPose.style.visibility = "hidden";
    changeFoto5.style.visibility = "hidden";
    changeFoto10.style.visibility = "hidden";
    changeFoto15.style.visibility = "hidden";
    changeFoto20.style.visibility = "hidden";
    changeFoto25.style.visibility = "hidden";
    changeFoto30.style.visibility = "hidden";
    changeFoto35.style.visibility = "hidden";
    changeFoto40.style.visibility = "hidden";
});

//Download Image
save.addEventListener("click", function(){
    let filename = prompt("Recuerda enviarnos tu foto a contacto@aniversariosbolivar2020.com \n \n Guardar como...",""),
    link = document.createElement('a');

    //Option cancel
    if (filename == null){
        return false;
    }
    //Click accept without naming the file
    else if (filename == ""){   
        link.download = "Sin título"; //Name default
        link.href = capture.toDataURL("image/png"); //use the canvas image

    }
    //Option to accept the file with name
    else{
        link.download = filename;
        link.href = capture.toDataURL("image/png");
    }

    link.click();
    
});

back.addEventListener("click", function(){
  save.style.visibility = "hidden";
  back.style.visibility = "hidden";
  if(share != null)share.style.visibility = "hidden";
  switchCameraButton.style.visibility = "visible";
  toggleFullScreenButton.style.visibility = "visible";
  snap.style.visibility = "visible";
  buttonPose.style.visibility = "visible";
  changeFoto5.style.visibility = "visible";
  changeFoto10.style.visibility = "visible";
  changeFoto15.style.visibility = "visible";
  changeFoto20.style.visibility = "visible";
  changeFoto25.style.visibility = "visible";
  changeFoto30.style.visibility = "visible";
  changeFoto35.style.visibility = "visible";
  changeFoto40.style.visibility = "visible";
  capture.width = capture.width;
});

jQuery(document).ready(function($){
    $('.fancybox').fancybox();
});

if(share!=null){
  share.addEventListener("click", function(){
    const dataURI = capture.toDataURL();  
    console.log(dataURI);
    imgConverted.src = dataURI;
    //fbs_click(imgConverted)
  });
}

var Base64Binary = {
  _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  
  /* will return a  Uint8Array type */
  decodeArrayBuffer: function(input) {
    var bytes = (input.length/4) * 3;
    var ab = new ArrayBuffer(bytes);
    this.decode(input, ab);
    
    return ab;
  },

  removePaddingChars: function(input){
    var lkey = this._keyStr.indexOf(input.charAt(input.length - 1));
    if(lkey == 64){
      return input.substring(0,input.length - 1);
    }
    return input;
  },

  decode: function (input, arrayBuffer) {
    //get last chars to see if are valid
    input = this.removePaddingChars(input);
    input = this.removePaddingChars(input);

    var bytes = parseInt((input.length / 4) * 3, 10);
    
    var uarray;
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    var j = 0;
    
    if (arrayBuffer)
      uarray = new Uint8Array(arrayBuffer);
    else
      uarray = new Uint8Array(bytes);
    
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    
    for (i=0; i<bytes; i+=3) {  
      //get the 3 octects in 4 ascii chars
      enc1 = this._keyStr.indexOf(input.charAt(j++));
      enc2 = this._keyStr.indexOf(input.charAt(j++));
      enc3 = this._keyStr.indexOf(input.charAt(j++));
      enc4 = this._keyStr.indexOf(input.charAt(j++));
  
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
  
      uarray[i] = chr1;     
      if (enc3 != 64) uarray[i+1] = chr2;
      if (enc4 != 64) uarray[i+2] = chr3;
    }
  
    return uarray;  
  }
}


function fbs_click(TheImg) {
    u=TheImg.src.replace(/data:image\/png;base64,/,'');
    // t=document.title;
    t=TheImg.getAttribute('alt');
    var uintArray = Base64Binary.decode(u);
var contents="";
for(var j = 0; j <= uintArray.length-1 ; j++)
{
  contents+=uintArray[j];
}
console.log(u);
    var uriencode = encodeURIComponent(u);

    // Chop the front of the image description
    var encodedPng = u.substring(u.indexOf(',')+1,u.length);
    // Decode the image from base64
    var decodedPng = Base64Binary.decode(encodedPng);
   
    
    window.open('http://www.facebook.com/sharer.php?u='+uriencode+'&t='+encodeURIComponent(t),'sharer','toolbar=0,status=0,width=626,height=436');return false;
}

window.fbAsyncInit = function() {
    FB.init({
        appId            : '371612584034186',
        status           : true,
        cookie           : true,
        version          : 'v2.10'                
    });

    $( '.fb-share-image' ).click(function(e){
      console.log("prueba share");
        e.preventDefault();
        var img = "image.jpg";
        var desc = "your caption here";
        var title = 'your title here';
        var link = 'https://zetabeb.github.io/';

        FB.ui(
                {
                    method: 'share',
                    //href: $(location).attr('href') + '?og_img=' + image,
                    action_type: 'og.shares',
                    action_properties: JSON.stringify({
                        object: {
                            'og:url': link,
                            'og:title': title,
                            'og:description': desc,
                            'og:image': img
                        }
                    })
                },
                function (response) {

                }
            );
    })
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

