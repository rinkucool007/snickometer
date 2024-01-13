document.addEventListener('DOMContentLoaded', () => {
    const camera1 = document.getElementById('camera1');
    const camera2 = document.getElementById('camera2');
    const audioGraph = document.getElementById('audioGraph');

    // Access the user's microphone
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);

            // Connect the microphone source to the analyser
            source.connect(analyser);

            // Set up the audio graph visualization
            analyser.fftSize = 2048;
            const bufferLength = analyser.fftSize;
            const dataArray = new Uint8Array(bufferLength);

            const canvasCtx = audioGraph.getContext('2d');
            canvasCtx.fillStyle = '#3498db'; // Example color

            function drawAudioGraph() {
                analyser.getByteTimeDomainData(dataArray);

                canvasCtx.clearRect(0, 0, audioGraph.width, audioGraph.height);

                const sliceWidth = audioGraph.width / bufferLength;
                let x = 0;

                canvasCtx.beginPath();

                for (let i = 0; i < bufferLength; i++) {
                    const v = dataArray[i] / 128.0;
                    const y = (v * audioGraph.height) / 2;

                    if (i === 0) {
                        canvasCtx.moveTo(x, y);
                    } else {
                        canvasCtx.lineTo(x, y);
                    }

                    x += sliceWidth;
                }

                canvasCtx.lineTo(audioGraph.width, audioGraph.height / 2);
                canvasCtx.stroke();

                requestAnimationFrame(drawAudioGraph);
            }

            drawAudioGraph();
        })
        .catch((error) => {
            console.error('Error accessing microphone:', error);
        });

    // Example camera stream setup (adjust as needed)
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            camera1.srcObject = stream;
            return navigator.mediaDevices.getUserMedia({ video: true });
        })
        .then((stream) => {
            camera2.srcObject = stream;
        })
        .catch((error) => {
            console.error('Error accessing camera:', error);
        });
});