const modelParams = {
    flipHorizontal: true,
    imageScaleFactor: 0.5,
    maxNumBoxes: 20,
    iouThreshold: 0.5,
    scoreThreshold: 0.79,
};

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

// Select everything in my HTML
const video = document.querySelector('#video');
const audio = document.querySelector('#audio');
const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');
let model;

handTrack.startVideo(video)
    .then((status) => {
        if (status) {
            navigator.getUserMedia({ video: {} }, stream => {
                video.srcObject = stream;
                setInterval(runDetection, 100);
            }, err => console.log(err));
        }
    });

const runDetection = () => {
    model.detect(video)
        .then(predictions => {
            console.log(predictions);
            model.renderPredictions(predictions, canvas, context, video);
            if (predictions[1].label !== 'face') {
                audio.play();
            }            
            if (predictions[0].label !== 'face') {
                audio.play();
            }
        });
};

handTrack.load(modelParams)
    .then((lmodel) => {
        model = lmodel;
    });