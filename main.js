const params = new URLSearchParams(window.location.search);

const breathSeconds = params.get("breath_duration_s")
    ? Number(params.get("breath_duration_s"))
    : 5;
const sessionSeconds = params.get("session_duration_m")
    ? Number(params.get("session_duration_m")) * 60
    : 5 * 60;

let breathElement = document.getElementById("breath");
let progressElement = document.getElementById("progress");

class Breather {
    constructor(breathSeconds, sessionSeconds) {
        console.info(
            `Created Breather with breathSeconds=${breathSeconds}, sessionSeconds=${sessionSeconds}`
        );
        this.sessionSeconds = sessionSeconds;

        document.documentElement.style.setProperty(
            "--breath-duration",
            `${breathSeconds}s`
        );
        document.documentElement.style.setProperty(
            "--session-duration",
            `${this.sessionSeconds}s`
        );
    }

    start() {
        progressElement.style.width = "100%"; // Trigger CSS animation
        breathElement.classList.remove("paused");

        setTimeout(() => {
            console.info("Session complete");
            breathElement.classList.add("paused");
        }, this.sessionSeconds * 1000);
    }
}

let breather = new Breather(breathSeconds, sessionSeconds);
breather.start();
