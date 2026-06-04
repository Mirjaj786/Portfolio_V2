// Configuration - replace SERVICE_ID and TEMPLATE_ID with your EmailJS IDs
const EMAILJS_USER_ID = "XuPhETaBjrHHD8u6a"; // already used in original file
const EMAILJS_SERVICE_ID = "service_t316bxi"; // <-- replace with your service ID
const EMAILJS_TEMPLATE_ID = "template_zbf70nl"; // <-- replace with your template ID

// Initialize EmailJS
if (window.emailjs) {
	emailjs.init(EMAILJS_USER_ID);
}

// Year
document.getElementById("yr").textContent = new Date().getFullYear();

// Nav scroll
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
	navbar.classList.toggle("scrolled", window.scrollY > 40);
});

// Mobile menu
const navToggle = document.getElementById("navToggle");
if (navToggle) {
	navToggle.addEventListener("click", () => {
		document.getElementById("navMenu").classList.toggle("open");
	});
}

// Active nav link
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");
if (sections.length && navLinks.length) {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((e) => {
				if (e.isIntersecting) {
					navLinks.forEach((l) => l.classList.remove("active"));
					const active = document.querySelector('.nav-link[href="#' + e.target.id + '"]');
					if (active) active.classList.add("active");
				}
			});
		},
		{ rootMargin: "-40% 0px -55% 0px" },
	);
	sections.forEach((s) => observer.observe(s));
}

// Project accordion toggle used by HTML onclick attributes
function toggleProj(id) {
	const item = document.getElementById(id);
	if (item) item.classList.toggle("open");
}

// Skill bars animation — select actual fill class used in HTML
const skillsSection = document.getElementById("skills");
const skillBars = document.querySelectorAll(".sk-fill");

function animateBars() {
	skillBars.forEach((bar, i) => {
		const level = bar.getAttribute("data-level") || "0";
		setTimeout(() => {
			bar.style.width = level + "%";
		}, i * 60);
	});
}

if ("IntersectionObserver" in window && skillsSection) {
	const barObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((e) => {
				if (e.isIntersecting) {
					animateBars();
					barObserver.disconnect();
				}
			});
		},
		{ threshold: 0.1, rootMargin: "0px 0px -60px 0px" },
	);
	barObserver.observe(skillsSection);
} else {
	animateBars();
}

// Fade-up animations
const fadeEls = document.querySelectorAll(".fade-up");
if (fadeEls.length) {
	const fadeObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((e) => {
				if (e.isIntersecting) e.target.classList.add("visible");
			});
		},
		{ threshold: 0.1 },
	);
	fadeEls.forEach((el) => fadeObserver.observe(el));
}

// Toast helper
function showToast(title, lines = [], timeout = 6000) {
	const toast = document.createElement("div");
	toast.className = "toast";
	const content = document.createElement("div");
	content.className = "toast-content";
	content.innerHTML = `<div class="toast-title">✓ ${title}</div>` +
		(lines.length ? `<div class="toast-lines">${lines.map(l => `<div>${l}</div>`).join("")}</div>` : "");
	toast.appendChild(content);
	document.body.appendChild(toast);
	// enter
	requestAnimationFrame(() => toast.classList.add("visible"));
	setTimeout(() => {
		toast.classList.remove("visible");
		setTimeout(() => toast.remove(), 400);
	}, timeout);
}

// Contact form handling
const contactForm = document.getElementById("contactForm");
if (contactForm) {
	contactForm.addEventListener("submit", function (e) {
		e.preventDefault();
		const btn = document.getElementById("submitBtn") || this.querySelector('button[type="submit"]');
		if (!btn) return;
		const origHtml = btn.innerHTML;
		btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending...';
		btn.disabled = true;

		const templateParams = {
			from_name: document.getElementById("fname").value,
			from_email: document.getElementById("femail").value,
			subject: document.getElementById("fsubject").value,
			message: document.getElementById("fmessage").value,
		};

		// Send via EmailJS
		if (window.emailjs && EMAILJS_SERVICE_ID !== "service_xxx" && EMAILJS_TEMPLATE_ID !== "template_xxx") {
			emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
				.then(() => {
					btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
					btn.style.background = "var(--green)";
					showToast("Message Sent Successfully!", [
						"Thank you for reaching out.",
						"I'll get back to you within 24 hours.",
					], 6000);
					setTimeout(() => {
						btn.innerHTML = origHtml;
						btn.style.background = "";
						btn.disabled = false;
						contactForm.reset();
					}, 2500);
				})
				.catch(() => {
					btn.innerHTML = origHtml;
					btn.disabled = false;
					showToast("Message failed to send", ["Please email directly at mirjajajijmilon@gmail.com"], 5000);
				});
		} else {
			// If EmailJS is not configured, fallback: show success toast and reset (for local testing)
			console.warn("EmailJS service/template not configured. Replace placeholder IDs in main.js.");
			showToast("Message Sent Successfully!", [
				"Thank you for reaching out.",
				"I'll get back to you within 24 hours.",
			], 6000);
			setTimeout(() => {
				btn.innerHTML = origHtml;
				btn.disabled = false;
				contactForm.reset();
			}, 1000);
		}
	});
}
