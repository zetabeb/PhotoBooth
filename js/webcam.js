'use strict';

const video = document.getElementById('video'); //video Stream hidden
const canvas = document.getElementById('canvas'); //video Stream Visible
const capture = document.getElementById('capture'); //Canvas of photo capture
const photoBooth = document.getElementById('photoBooth'); //Image PhotoBooth
//Camera error Message
const errorMsgElement = document.querySelector('span#errorMsg'); 
//Buttons
const snap = document.getElementById("snap"); //Capture
const save = document.getElementById("save"); //Photo Save
const back = document.getElementById("back"); //Back

//Photo location
var foto = {
  url: "Images/FOTOBOTH.png"
};

foto.imagen = new Image();
foto.imagen.src = foto.url;

var fondoCapture = {
  url: "Images/fondoCapture.png"
};

fondoCapture.imagen = new Image();
fondoCapture.imagen.src = fondoCapture.url;

//Video Data
const constraints = {
    audio: false,
    video: {
        width: 1024, height: 664
    }
};

// Access webcam
async function init() {
    save.style.visibility = "hidden";
    back.style.visibility = "hidden";
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
    context.drawImage(video, 80, 181, 520, 321);
    context.drawImage(foto.imagen, 0, 0, 1024, 664);
}

// Load init
init();

// Draw image
var cxt = capture.getContext('2d');
snap.addEventListener("click", function() {
    cxt.drawImage(fondoCapture.imagen, 0, 0, 1300, 684);
    cxt.drawImage(video, 90, 189, 520, 321);
    cxt.drawImage(foto.imagen, 11, 8, 1024, 664);
    snap.style.visibility = "hidden";
    save.style.visibility = "visible";
    back.style.visibility = "visible";
});

//Download Image
save.addEventListener("click", function(){
    let filename = prompt("Recuerda enviarnos tu foto a webinar@lanzamientorevestive.com \n \n Guardar como...",""),
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
    snap.style.visibility = "visible";
    capture.width = capture.width;
})


