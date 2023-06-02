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

let performanceTime = 0.000000001;

// Define the performance time values for different screen sizes
const laptopScreenTime = 0.00000001;
const tabletScreenTime = 0.0001;
const smartphoneScreenTime = 100000;

// Function to calculate performance time based on screen size
const calculatePerformanceTime = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 768) {
        // Tablet screen size or smaller
        performanceTime = smartphoneScreenTime;
    } else if (screenWidth <= 1024) {
        // Laptop/Computer screen size
        performanceTime = tabletScreenTime;
    } else {
        // Larger screens (e.g., desktop)
        performanceTime = laptopScreenTime;
    }
};

handTrack.startVideo(video)
    .then((status) => {
        if (status) {
            navigator.getUserMedia({ video: {} }, stream => {
                video.srcObject = stream;
                calculatePerformanceTime();
                setInterval(runDetection, performanceTime);
            }, err => console.log(err));
        }
    });

const runDetection = () => {
    model.detect(video)
        .then(predictions => {
            console.log(predictions);

            if (predictions.length > 0) {
                model.renderPredictions(predictions, canvas, context, video);

                if (predictions[1] && predictions[1].label !== 'face') {
                    audio.play();
                }
            
                if (predictions[0] && predictions[0].label !== 'face') {
                    audio.play();
                }
            }
        })
        .catch(error => {
            // Handle any errors that occur during detection
            console.error('Error during detection:', error);
        });
};

handTrack.load(modelParams)
    .then((lmodel) => {
        model = lmodel;
    });
