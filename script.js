const moodValues = {
    "😄": 5,
    "🙂": 4,
    "😐": 3,
    "😟": 2,
    "😣": 1
};

const tips = {
    "😄": "Keep spreading positivity!",
    "🙂": "Nice! Maintain this good mood.",
    "😐": "Try a quick 1-minute breathing break.",
    "😟": "Take 3 slow deep breaths.",
    "😣": "Relax for a minute. Hydrate and breathe."
};

/* ============================
   LOAD SAVED DATA
============================ */
let moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
let journalNotes = JSON.parse(localStorage.getItem("journal")) || [];

/* ============================
   MOOD BUTTONS (CLICK HANDLER)
============================ */
document.querySelectorAll('.mood').forEach(mood => {
    mood.addEventListener('click', () => {
        const selected = mood.textContent;

        // Show tip
        const tipBox = document.getElementById('tip-box');
        tipBox.textContent = tips[selected];

        // Save last mood emoji
        localStorage.setItem("lastMood", selected);

        // Save mood value to history
        moodHistory.push(moodValues[selected]);

        // keep a maximum of 7 entries
        if (moodHistory.length > 7) moodHistory.shift();

        // Save history
        localStorage.setItem("moodHistory", JSON.stringify(moodHistory));

        // Update graph
        updateGraph();

        // Soft glow effect (optional)
        tipBox.style.transform = "scale(1.06)";
        setTimeout(() => tipBox.style.transform = "scale(1)", 200);
    });
});

/* ============================
   SHOW LAST MOOD ON LOAD
============================ */
window.onload = () => {
    let last = localStorage.getItem("lastMood");
    if (last) {
        document.getElementById("tip-box").textContent =
            `Last time you felt: ${last}`;
    }
    updateGraph();
    loadJournal();
};

/* ============================
   CHART SETUP (Better Labels)
============================ */
let ctx = document.getElementById("moodChart").getContext("2d");

let moodChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: ["Day 1","Day 2","Day 3","Day 4","Day 5","Day 6","Day 7"],
        datasets: [{
            label: "Mood Levels",
            data: moodHistory,
            borderColor: "#7aa2ff",
            backgroundColor: "rgba(122,162,255,0.3)",
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: "#ff7ee5"
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                min: 1,
                max: 5,
                ticks: { stepSize: 1 }
            }
        }
    }
});
function updateGraph() {
    moodChart.data.datasets[0].data = moodHistory;
    moodChart.update();
}

let music = new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_6a42af5175.mp3");
music.loop = true;
let isMusicPlaying = false;

document.getElementById("toggleMusic").onclick = () => {
    let btn = document.getElementById("toggleMusic");
    if (!isMusicPlaying) {
        music.play();
        isMusicPlaying = true;
        btn.textContent = "Pause Music ⏸️";
    } else {
        music.pause();
        isMusicPlaying = false;
        btn.textContent = "Play Music 🎧";
    }
};
function saveJournal() {
    let text = document.getElementById("journalInput").value.trim();
    if (!text) return;

    journalNotes.push({
        date: new Date().toLocaleDateString(),
        text
    });

    localStorage.setItem("journal", JSON.stringify(journalNotes));
    loadJournal();
    document.getElementById("journalInput").value = "";
}

function loadJournal() {
    let container = document.getElementById("journalList");
    container.innerHTML = "";

    journalNotes.slice().reverse().forEach(entry => {
        let div = document.createElement("div");
        div.className = "journal-entry";
        div.innerHTML = `<strong>${entry.date}:</strong> ${entry.text}`;
        container.appendChild(div);
    });
}
