/* ==========================================================================
   [JS MODULE 1] INITIALIZE SCROLL ANIMATIONS (AOS)
   Kya Karta Hai: Page scroll karne par cards ko fade-up aur zoom-in karta hai.
========================================================================== */
AOS.init({ duration: 800, once: true, offset: 60 });

/* ==========================================================================
   [JS MODULE 2] HERO TERMINAL AUTO-TYPING EFFECT
   Kya Karta Hai: Hero section ke console box mein aapke specializations
   ek-ek akshar karke type aur delete karta hai.
========================================================================== */
const roles = [
    "Aspiring VLSI & Embedded Hardware Engineer",
    "Building 8-Bit CPU in Verilog HDL",
    "4-Layer PCB Layout Designer (KiCad & EasyEDA)",
    "ESP32, Arduino & Wireless RF Prototyper",
    "NIDAR National Finalist (MeitY & DFI)"
];
let roleIdx = 0, charIdx = 0, deleting = false;
const typingEl = document.querySelector(".typing-text");

function typeLoop() {
    if (!typingEl) return;
    const word = roles[roleIdx];
    typingEl.textContent = deleting ? word.substring(0, charIdx--) : word.substring(0, charIdx++);
    let delay = deleting ? 35 : 70;
    if (!deleting && charIdx === word.length + 1) { delay = 1900; deleting = true; }
    else if (deleting && charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; delay = 350; }
    setTimeout(typeLoop, delay);
}
document.addEventListener("DOMContentLoaded", typeLoop);

/* ==========================================================================
   [JS MODULE 3] LIVE HARDWARE SYSTEM CLOCK & DATE WIDGET (IST)
   Kya Karta Hai: Bottom-left corner wale pill mein Kanpur, India ka live
   Date aur Time har 1 second (1000ms) mein update karta hai.
========================================================================== */
function updateHardwareClock() {
    const dateEl = document.getElementById("clk-date");
    const timeEl = document.getElementById("clk-time");
    if (!dateEl || !timeEl) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).toUpperCase();

    const timeStr = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    }).toUpperCase();

    dateEl.textContent = `KANPUR, IN • ${dateStr}`;
    timeEl.textContent = `${timeStr}`;
}
setInterval(updateHardwareClock, 1000);
updateHardwareClock();

/* ==========================================================================
   [JS MODULE 4] DUAL-THEME PCB ROUTING & SILICON WAFER CANVAS
   Kya Karta Hai:
   - Dark Mode mein: Deep Space Stars + Neon Cyan/Violet PCB Traces.
   - Light Mode mein: Royal Cobalt Blue, Emerald & Copper PCB Traces +
     Rotating Hexagonal Silicon Wafer Die Cells.
========================================================================== */
const canvas = document.getElementById("pcb-cosmos-canvas");
const ctx = canvas.getContext("2d");
let w, h, stars = [], traces = [], waferRings = [];

function initCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;

    stars = Array.from({ length: 95 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.4,
        alpha: Math.random()
    }));

    // 32 Multi-Layer PCB Copper Traces with Slow, Smooth Current Flow
    traces = Array.from({ length: 32 }, (_, idx) => {
        const gridStep = 48;
        const startX = Math.floor(Math.random() * (w / gridStep)) * gridStep;
        const startY = Math.floor(Math.random() * (h / gridStep)) * gridStep;
        const seg1 = 60 + Math.floor(Math.random() * 4) * 40;
        const diag = 36;
        const seg2 = 70 + Math.floor(Math.random() * 4) * 40;
        const seg3 = 50 + Math.floor(Math.random() * 3) * 40;
        const dirX = Math.random() > 0.5 ? 1 : -1;
        const dirY = Math.random() > 0.5 ? 1 : -1;

        const pts = [
            { x: startX, y: startY },
            { x: startX + seg1 * dirX, y: startY },
            { x: startX + (seg1 + diag) * dirX, y: startY + diag * dirY },
            { x: startX + (seg1 + diag) * dirX, y: startY + (diag + seg2) * dirY },
            { x: startX + (seg1 + diag + seg3) * dirX, y: startY + (diag + seg2) * dirY }
        ];
        return {
            pts,
            progress: Math.random(),
            speed: 0.00045 + Math.random() * 0.0005,
            layer: idx % 2
        };
    });

    // Rotating Hexagonal Silicon Wafer Cells for Light Mode
    waferRings = Array.from({ length: 14 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 26 + Math.random() * 32,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.0025
    }));
}

function getPointAlongTrace(pts, progress) {
    const totalSegs = pts.length - 1;
    const scaled = Math.max(0, Math.min(0.9999, progress)) * totalSegs;
    const idx = Math.floor(scaled);
    const frac = scaled - idx;
    const p1 = pts[idx];
    const p2 = pts[idx + 1] || pts[0];
    return {
        x: p1.x + (p2.x - p1.x) * frac,
        y: p1.y + (p2.y - p1.y) * frac
    };
}

function drawHexagon(x, y, r, rot) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const a = rot + (i * Math.PI) / 3;
        const px = x + r * Math.cos(a);
        const py = y + r * Math.sin(a);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
}

function renderBackground() {
    ctx.clearRect(0, 0, w, h);
    const isLight = document.body.classList.contains("light-mode");

    if (!isLight) {
        // Dark Mode Cosmic Stars
        stars.forEach(s => {
            s.alpha += (Math.random() - 0.5) * 0.015;
            s.alpha = Math.max(0.15, Math.min(0.85, s.alpha));
            ctx.fillStyle = `rgba(148, 163, 184, ${s.alpha})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
        });
    } else {
        // Light Mode Rotating Silicon Wafer Hexagons
        waferRings.forEach(ring => {
            ring.angle += ring.rotSpeed;
            ctx.strokeStyle = "rgba(37, 99, 235, 0.10)";
            ctx.lineWidth = 1.4;
            drawHexagon(ring.x, ring.y, ring.size, ring.angle);
            ctx.stroke();
        });
    }

    // Draw PCB Traces & Slow Comet-Trail Current in Both Modes
    traces.forEach(t => {
        ctx.strokeStyle = isLight
            ? (t.layer === 0 ? "rgba(37, 99, 235, 0.14)" : "rgba(5, 150, 105, 0.13)")
            : (t.layer === 0 ? "rgba(0, 245, 212, 0.11)" : "rgba(129, 140, 248, 0.11)");
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(t.pts[0].x, t.pts[0].y);
        for (let i = 1; i < t.pts.length; i++) ctx.lineTo(t.pts[i].x, t.pts[i].y);
        ctx.stroke();

        // Via Pads at Endpoints
        [t.pts[0], t.pts[t.pts.length - 1]].forEach(p => {
            ctx.strokeStyle = isLight ? "rgba(37, 99, 235, 0.28)" : "rgba(0, 245, 212, 0.25)";
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3.6, 0, Math.PI * 2);
            ctx.stroke();
        });

        t.progress += t.speed;
        if (t.progress > 1) t.progress = 0;

        const electronColor = isLight
            ? (t.layer === 0 ? "#2563eb" : "#059669")
            : (t.layer === 0 ? "#00f5d4" : "#38bdf8");

        for (let tail = 6; tail >= 0; tail--) {
            let tailProg = t.progress - tail * 0.012;
            if (tailProg < 0) tailProg += 1;
            const pos = getPointAlongTrace(t.pts, tailProg);
            const radius = tail === 0 ? 2.6 : Math.max(0.8, 2.3 - tail * 0.3);
            const opacity = tail === 0 ? 0.95 : (1 - tail / 7) * 0.5;

            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.fillStyle = electronColor;
            if (tail === 0) {
                ctx.shadowColor = electronColor;
                ctx.shadowBlur = isLight ? 6 : 12;
            }
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    });

    requestAnimationFrame(renderBackground);
}
window.addEventListener("resize", initCanvas);
initCanvas();
renderBackground();

/* ==========================================================================
   [JS MODULE 5] INTERACTIVE CURSOR FLARE TRAIL GENERATOR
   Kya Karta Hai: Jab mouse move hota hai toh cursor ke piche glowing
   star-flare particles banata hai jo rotate hokar fade hote hain.
========================================================================== */
const cGlow = document.getElementById("cursor-glow");
const cCore = document.getElementById("cursor-core");
let lastSparkTime = 0;

window.addEventListener("mousemove", e => {
    if (cGlow && cCore) {
        cGlow.style.left = cCore.style.left = `${e.clientX}px`;
        cGlow.style.top = cCore.style.top = `${e.clientY}px`;
    }

    const now = performance.now();
    if (now - lastSparkTime > 28) {
        lastSparkTime = now;
        const spark = document.createElement("div");
        spark.className = "cursor-flare-spark";
        const size = 5 + Math.random() * 6;
        const isLight = document.body.classList.contains("light-mode");
        const colors = isLight
            ? ["#2563eb", "#059669", "#d97706"]
            : ["#00f5d4", "#38bdf8", "#818cf8"];
        const chosen = colors[Math.floor(Math.random() * colors.length)];

        spark.style.width = `${size}px`;
        spark.style.height = `${size}px`;
        spark.style.left = `${e.clientX}px`;
        spark.style.top = `${e.clientY}px`;
        spark.style.background = chosen;
        spark.style.boxShadow = `0 0 12px ${chosen}`;
        spark.style.setProperty("--dx", `${(Math.random() - 0.5) * 44}px`);
        spark.style.setProperty("--dy", `${(Math.random() - 0.5) * 44 + 12}px`);

        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 750);
    }
});

/* ==========================================================================
   [JS MODULE 6] 3D PERSPECTIVE TILT EFFECT ON CARDS
   Kya Karta Hai: Kisi bhi card par mouse le jaane par use 3D angle par tilt karta hai.
========================================================================== */
document.querySelectorAll(".tilt-3d").forEach(el => {
    el.addEventListener("mousemove", e => {
        const r = el.getBoundingClientRect();
        const rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -5;
        const ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 5;
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    el.addEventListener("mouseleave", () => {
        el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    });
});

/* ==========================================================================
   [JS MODULE 7] SMART IMAGE EXTENSION RESOLVER
   Kya Karta Hai: Aapke images/ folder mein KVIMAGE, Project Photos, PSITWEBG
   aur GURUNANAKPUBLICSCHOOLWEBG ke sahi extension (.webp, .jpg, .png) ko
   automatically dhoondh kar load karta hai.
========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const kvImgs = document.querySelectorAll(".kv-profile-img");
    const kvCandidates = [
        "images/KVIMAGE.jpeg",
        "images/KVIMAGE.jpg",
        "images/KVIMAGE.png",
        "images/KVIMAGE.webp",
        "images/KVIMAGE"
    ];
    function resolveKV(imgEl, i = 0) {
        if (i >= kvCandidates.length) return;
        const probe = new Image();
        probe.onload = () => { imgEl.src = kvCandidates[i]; };
        probe.onerror = () => resolveKV(imgEl, i + 1);
        probe.src = kvCandidates[i];
    }
    kvImgs.forEach(img => resolveKV(img));

    document.querySelectorAll(".smart-img").forEach(imgEl => {
        const base = imgEl.getAttribute("data-base");
        if (!base) return;
        const altBase = base.replace(/WEBG$/i, "WEBP");
        const candidates = [
            `${base}.webp`,
            `${base}.jpg`,
            `${base}.jpeg`,
            `${base}.png`,
            `${base}`,
            `${altBase}.webp`,
            `${altBase}.jpg`,
            `${altBase}.png`,
            `${altBase}`
        ];
        function tryImg(idx = 0) {
            if (idx >= candidates.length) return;
            const tester = new Image();
            tester.onload = () => { imgEl.src = candidates[idx]; };
            tester.onerror = () => tryImg(idx + 1);
            tester.src = candidates[idx];
        }
        tryImg();
    });
});

/* ==========================================================================
   [JS MODULE 8] REAL PDF.JS CERTIFICATE JHALAK (THUMBNAIL) ENGINE
   Kya Karta Hai: Aapke certificates/ folder mein rakhi 17 PDF files ka
   First Page scan karke har certificate card ke upar live preview banata hai.
========================================================================== */
if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

document.addEventListener("DOMContentLoaded", () => {
    const certCards = document.querySelectorAll(".cert-split-card");

    certCards.forEach(card => {
        const pdfFile = card.getAttribute("data-pdf");
        const title = card.getAttribute("data-title");
        const canvasEl = card.querySelector(".pdf-preview-canvas");

        const paths = [`certificates/${pdfFile}`, `certficates/${pdfFile}`];

        async function renderPdfJhalak(pathIdx = 0) {
            if (pathIdx >= paths.length || !window.pdfjsLib) return;
            try {
                const loadingTask = pdfjsLib.getDocument(paths[pathIdx]);
                const pdf = await loadingTask.promise;
                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: 0.65 });
                const context = canvasEl.getContext("2d");
                canvasEl.width = viewport.width;
                canvasEl.height = viewport.height;
                await page.render({ canvasContext: context, viewport }).promise;
                card.setAttribute("data-resolved-pdf", paths[pathIdx]);
            } catch (err) {
                renderPdfJhalak(pathIdx + 1);
            }
        }
        renderPdfJhalak();

        card.addEventListener("click", () => {
            const finalPath = card.getAttribute("data-resolved-pdf") || paths[0];
            document.getElementById("c-modal-title").textContent = title;
            document.getElementById("c-modal-iframe").src = finalPath;
            document.getElementById("c-modal-open").href = finalPath;
            document.getElementById("cert-modal").classList.add("open");
        });
    });
});

/* ==========================================================================
   [JS MODULE 9] SKILL POPUP MODAL, CERTIFICATE FILTERS, THEME TOGGLE & FORM
========================================================================== */
window.openSkillModal = function(box) {
    document.getElementById("s-modal-title").textContent = box.getAttribute("data-title");
    document.getElementById("s-modal-cat").textContent = box.getAttribute("data-category");
    document.getElementById("s-modal-role").textContent = box.getAttribute("data-role");
    document.getElementById("s-modal-usage").textContent = box.getAttribute("data-usage");
    document.getElementById("skill-modal").classList.add("open");
};

window.closeModals = function() {
    document.querySelectorAll(".hud-modal").forEach(m => m.classList.remove("open"));
    const iframe = document.getElementById("c-modal-iframe");
    if (iframe) iframe.src = "";
};

window.addEventListener("click", e => {
    if (e.target.classList.contains("hud-modal")) closeModals();
});

document.querySelectorAll(".c-filter").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".c-filter").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const f = btn.getAttribute("data-filter");
        document.querySelectorAll(".cert-split-card").forEach(c => {
            c.style.display = (f === "all" || c.getAttribute("data-category") === f) ? "flex" : "none";
        });
    });
});

const themeBtn = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        themeIcon.classList.toggle("fa-sun");
        themeIcon.classList.toggle("fa-moon");
    });
}

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");
if (menuBtn) menuBtn.addEventListener("click", () => navLinks.classList.toggle("active"));

const contactForm = document.getElementById("contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const name = document.getElementById("sender-name").value;
        const email = document.getElementById("sender-email").value;
        const subject = document.getElementById("sender-subject").value;
        const message = document.getElementById("sender-message").value;

        const mailtoLink = `mailto:krishnav9219@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message)}`;
        window.location.href = mailtoLink;
    });
}