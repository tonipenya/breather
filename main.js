const params = new URLSearchParams(window.location.search);

const breathSeconds = params.get("breath_duration_s")
    ? Number(params.get("breath_duration_s"))
    : 5;
const sessionSeconds = params.get("session_duration_m")
    ? Number(params.get("session_duration_m")) * 60
    : 5 * 60;

let breathElement = document.getElementById("breath");
let progressElement = document.getElementById("progress");

function inhale() {
    console.info("Inhale");
    breathElement.classList.add("breath-in");
    breathElement.classList.remove("breath-out");
}

function exhale() {
    console.info("Exhale");
    breathElement.classList.add("breath-out");
    breathElement.classList.remove("breath-in");
}

class Breather {
    constructor(breathSeconds, sessionSeconds) {
        console.info(
            `Created Breather with breathSeconds=${breathSeconds}, sessionSeconds=${sessionSeconds}`
        );
        this.breathSeconds = breathSeconds;
        this.sessionSeconds = sessionSeconds;
        this.isInhaling = true;
        this.intervalId = null;
        this.timeoutId = null;
        this.startTime = null;
        breathElement.style.transitionDuration = `${this.breathSeconds}s`;
        progressElement.style.transitionDuration = `${this.breathSeconds}s`;
    }

    start() {
        this.stop(); // Prevent starting multiple sessions
        this.startTime = Date.now();
        this.updateProgress();
        breathElement.classList.remove("breath-off");
        inhale();

        this.intervalId = setInterval(() => {
            this.isInhaling = !this.isInhaling;
            this.isInhaling ? inhale() : exhale();
            this.updateProgress();
        }, this.breathSeconds * 1000);

        this.timeoutId = setTimeout(() => {
            console.info("Session complete");
            this.stop();
        }, this.sessionSeconds * 1000);
    }

    updateProgress() {
        const elapsed = (Date.now() - this.startTime) / 1000;
        const elapsed_after_animation = elapsed + this.breathSeconds;
        const progress = Math.min(
            (elapsed_after_animation / this.sessionSeconds) * 100,
            100
        );
        progressElement.style.width = `${progress}%`;
    }

    stop() {
        clearInterval(this.intervalId);
        clearTimeout(this.timeoutId);
        breathElement.classList.add("breath-off");
        breathElement.classList.remove("breath-in");
        breathElement.classList.remove("breath-out");
    }
}

let breather = new Breather(breathSeconds, sessionSeconds);
breather.start();
