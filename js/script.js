// collect DOMs
const recordBtn = document.getElementById("record");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("close-icon");
const textareaInput = document.getElementById("text-area");
const startBtn = document.getElementById("start-recording");
const stopBtn = document.getElementById("stop-recording");
const recodingText = document.getElementById("text");
const infoText = document.getElementById("info");
const modalAudio = document.getElementById("modal-audio");
const generateBtn = document.getElementById("generate-btn");
const uploadedFile = document.getElementById("uploaded-file");

let mediaRecorder,
    chunks = [],
    userText = "";
audioURL = "";

document.addEventListener("DOMContentLoaded", () => {
    recordBtn.addEventListener("click", function () {
        modal.classList.add("show");
    });

    closeBtn.addEventListener("click", function () {
        modal.classList.remove("show");
    });

    textareaInput.addEventListener("change", function (e) {
        userText = e.target.value;
    });

    startBtn.addEventListener("click", function () {
        stopBtn.classList.remove("hidden");
        startBtn.classList.add("hidden");
        recodingText.classList.remove("hidden");
        mediaRecorder.start();
    });

    stopBtn.addEventListener("click", function () {
        startBtn.classList.remove("hidden");
        stopBtn.classList.add("hidden");
        recodingText.classList.add("hidden");
        mediaRecorder.stop();
    });

    uploadedFile.addEventListener("change", function () {
        const blob = fileInput.files[0];
        audioURL = window.URL.createObjectURL(blob);
    });

    // mediaRecorder setup for audio
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log("mediaDevices supported..");

        navigator.mediaDevices
            .getUserMedia({
                audio: true,
            })
            .then((stream) => {
                mediaRecorder = new MediaRecorder(stream);

                mediaRecorder.ondataavailable = (e) => {
                    chunks.push(e.data);
                };

                mediaRecorder.onstop = () => {
                    const blob = new Blob(chunks, { type: "audio/wav; codecs=opus" });
                    chunks = [];
                    audioURL = window.URL.createObjectURL(blob);
                    modalAudio.classList.remove("hidden");
                    modalAudio.src = audioURL;
                    if (audioURL) {
                        infoText.classList.remove("hidden");
                    }
                };
            })
            .catch((error) => {
                console.log("Following error has occured : ", error);
            });
    } else {
        console.log("Please enable audio and sound on your website...");
    }

    generateBtn.addEventListener("click", async () => {
        const requestUrl = "/generate_audio";

        try {
            const response = await fetch(requestUrl, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                headers: {
                    "Content-Type": "application/json",
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify({ wav_file: audioURL, text_prompt: userText }), // body data type must match "Content-Type" header
            });
            console.log("response:", response.json());
        } catch (e) {
            console.log("error: ", e);
        }
    });
});
