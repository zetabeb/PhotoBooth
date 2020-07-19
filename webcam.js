'use strict';

const video = document.getElementById('video'); //video Stream hidden
const canvas = document.getElementById('canvas'); //video Stream Visible
const capture = document.getElementById('capture'); //Canvas of photo capture
const snap = document.getElementById("snap"); //Button Capture
const photoBooth = document.getElementById('photoBooth'); //Image PhotoBooth
const errorMsgElement = document.querySelector('span#errorMsg'); //Camera error Message

//Photo location
var foto = {
  url: "FOTOBOTH.png"
};

foto.imagen = new Image();
foto.imagen.src = foto.url;

//Video Data
const constraints = {
    audio: false,
    video: {
        width: 1280, height: 720
    }
};

// Access webcam
async function init() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);

        video.addEventListener('loadeddata', () => {
            foto.width = video.videoWidth;
            foto.height = video.videoHeight;
            setInterval(() => {
                photoKey();
            }, 20)
        });

    } catch (e) {
        errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
    }
}

// Success
function handleSuccess(stream) {
    window.stream = stream;
    video.srcObject = stream;
}

function photoKey(){    
    var context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, 1280, 720);
    context.drawImage(foto.imagen, 0, 0, 1280, 720);
}

// Load init
init();

// Draw image
var cxt = capture.getContext('2d');
snap.addEventListener("click", function() {
    cxt.drawImage(video, 0, 0, 640, 480);
    cxt.drawImage(foto.imagen, 0, 0, 640, 480);
});

//Download Image
function descargar(){
    let filename = prompt("Guardar como",""),
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
    
}