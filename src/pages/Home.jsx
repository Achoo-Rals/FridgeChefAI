console.log("JS LOADED");
let seconds = 0;
let minutes = 0;
let timer = null;

const minDisplay =
document.getElementById("min");
const secDisplay =
document.getElementById("sec");

const startBtn =
document.getElementById("startBtn");
const stopBtn =
document.getElementById("stopBtn");
const resetBtn =
document.getElementById("resetBtn");

function updateDisplay( ){
    minDisplay.textContent =
String(minutes).padStart(2, "0");
    secDisplay.textContent =
String(seconds).padStart(2, "0");
}

startBtn.addEventListener("click", ( ) => {
    if (timer !== null) return;

    timer = setInterval(() => {
        seconds++;

        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        updateDisplay( );
    }, 1000);
});

stopBtn.addEventListener("click", ( ) => {
    clearInterval(timer);
    timer=null;
});

resetBtn.addEventListener("click", ( ) => {
    clearInterval(timer);
    timer = null;
    seconds = 0;
    minutes = 0;

    updateDisplay( );
})
