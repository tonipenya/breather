const params = new URLSearchParams(window.location.search);

const breathSeconds = params.get("breath_duration_s")
    ? Number(params.get("breath_duration_s"))
    : 5;
const sessionSeconds = params.get("session_duration_m")
    ? Number(params.get("session_duration_m")) * 60
    : 5 * 60;
const autoplay = params.get("autoplay") === "true";

document.querySelector('input[name="session_duration_m"]').value = sessionSeconds / 60;
document.querySelector('input[name="breath_duration_s"]').value = breathSeconds;

const breathElement = document.getElementById("breath");
const progressElement = document.getElementById("progress");

class Breather {
    constructor(breathSeconds, sessionSeconds, autoplay) {
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
        this.isPlaying = false;
        this.remaining = this.sessionSeconds * 1000;

        if (autoplay) {
            this.play();
        }
    }

    play() {
        this.isPlaying = true;
        progressElement.classList.remove("paused");
        breathElement.classList.remove("paused");

        this.startTime = Date.now();
        this.timeout = setTimeout(() => {
            console.info("Session complete");
            breathElement.classList.add("paused");
        }, this.remaining);
    }

    pause() {
        this.isPlaying = false;
        progressElement.classList.add("paused");
        breathElement.classList.add("paused");

        this.remaining -= Date.now() - this.startTime;
        clearTimeout(this.timeout);
    }
}

const breather = new Breather(breathSeconds, sessionSeconds, autoplay);

breathElement.addEventListener("click", () => {
    if (breather.isPlaying) {
        breather.pause();
        releaseWakeLock();
    } else {
        breather.play();
        requestWakeLock();
    }
});

let wakeLock = null;
async function requestWakeLock() {
    try {
        wakeLock = await navigator.wakeLock.request("screen");
    } catch (e) {
        console.log("wakelock err:", e);
    }
}

async function releaseWakeLock() {
    try {
        await wakeLock.release();
    } catch (e) {
        console.log("wakelock err:", e);
    }
}

const menuToggle = document.getElementById("menu-toggle");
const settingsAside = document.getElementById("settings");

menuToggle.addEventListener("click", () => {
    settingsAside.classList.toggle("open");
});
// Hide when clicking outside
document.addEventListener("click", (e) => {
    if (!menuToggle.contains(e.target) && !settingsAside.contains(e.target)) {
        settingsAside.classList.remove("open");
    }
});
