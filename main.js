// Configuration - EmailJS IDs
const EMAILJS_USER_ID = "6p5mbCBvasINF48hx";
const EMAILJS_SERVICE_ID = "service_zyu9cv9";
const EMAILJS_TEMPLATE_ID = "template_lv8nkvf";

// Initialize EmailJS
if (window.emailjs) {
	try {
		emailjs.init(EMAILJS_USER_ID);
	} catch (e) {
		try {
			emailjs.init({ publicKey: EMAILJS_USER_ID });
		} catch (err) {
			console.warn("EmailJS init warning:", err);
		}
	}
}

// Set copyright year
const yrEl = document.getElementById("yr");
if (yrEl) {
	yrEl.textContent = new Date().getFullYear();
}

// Navbar scroll background toggle
const navbar = document.getElementById("navbar");
if (navbar) {
	window.addEventListener("scroll", () => {
		navbar.classList.toggle("scrolled", window.scrollY > 40);
	});
}

// Mobile menu toggle & click-outside handling
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

if (navToggle && navMenu) {
	navToggle.addEventListener("click", (e) => {
		e.stopPropagation();
		navToggle.classList.toggle("active");
		navMenu.classList.toggle("open");
	});

	// Close mobile menu when clicking any nav link
	const navItems = navMenu.querySelectorAll("a");
	navItems.forEach((link) => {
		link.addEventListener("click", () => {
			navToggle.classList.remove("active");
			navMenu.classList.remove("open");
		});
	});

	// Close mobile menu when clicking outside
	document.addEventListener("click", (e) => {
		if (navMenu.classList.contains("open") && !navbar.contains(e.target)) {
			navToggle.classList.remove("active");
			navMenu.classList.remove("open");
		}
	});
}

// Active nav link highlight on scroll
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
		{ rootMargin: "-30% 0px -60% 0px" },
	);
	sections.forEach((s) => observer.observe(s));
}

// Project accordion toggle
function toggleProj(id) {
	const item = document.getElementById(id);
	if (item) {
		const isOpen = item.classList.contains("open");
		item.classList.toggle("open");
		const head = item.querySelector(".proj-head");
		if (head) {
			head.setAttribute("aria-expanded", !isOpen);
		}
	}
}

// Skill bars animation on view
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

// Scroll reveal animations (observing .reveal elements)
const revealEls = document.querySelectorAll(".reveal");
if (revealEls.length) {
	const revealObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((e) => {
				if (e.isIntersecting) {
					e.target.classList.add("visible");
				}
			});
		},
		{ threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
	);
	revealEls.forEach((el) => revealObserver.observe(el));
}

// Toast Notification helper
function showToast(title, lines = [], timeout = 6000, isError = false) {
	// Remove existing toast if any
	const existingToast = document.querySelector(".toast");
	if (existingToast) existingToast.remove();

	const toast = document.createElement("div");
	toast.className = `toast ${isError ? "toast-error" : ""}`;
	const content = document.createElement("div");
	content.className = "toast-content";
	const icon = isError ? "✕" : "✓";
	content.innerHTML = `<div class="toast-title" style="color: ${isError ? "var(--red)" : "var(--green)"}">${icon} ${title}</div>` +
		(lines.length ? `<div class="toast-lines">${lines.map((l) => `<div>${l}</div>`).join("")}</div>` : "");
	toast.appendChild(content);
	document.body.appendChild(toast);

	requestAnimationFrame(() => toast.classList.add("visible"));
	setTimeout(() => {
		toast.classList.remove("visible");
		setTimeout(() => toast.remove(), 400);
	}, timeout);
}

// Contact form handling with validation & EmailJS integration
const contactForm = document.getElementById("contactForm");
if (contactForm) {
	contactForm.addEventListener("submit", function (e) {
		e.preventDefault();

		const nameInput = document.getElementById("fname");
		const emailInput = document.getElementById("femail");
		const subjectInput = document.getElementById("fsubject");
		const messageInput = document.getElementById("fmessage");

		const name = nameInput ? nameInput.value.trim() : "";
		const email = emailInput ? emailInput.value.trim() : "";
		const subject = subjectInput ? subjectInput.value.trim() : "";
		const message = messageInput ? messageInput.value.trim() : "";

		// Basic validation
		if (!name || !email || !subject || !message) {
			showToast("Missing Information", ["Please fill out all form fields before sending."], 4000, true);
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			showToast("Invalid Email", ["Please provide a valid email address."], 4000, true);
			return;
		}

		const btn = document.getElementById("submitBtn") || this.querySelector('button[type="submit"]');
		if (!btn) return;
		const origHtml = btn.innerHTML;
		btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending...';
		btn.disabled = true;

		// Exact templateParams requested for EmailJS template
		const templateParams = {
			name: name,
			title: subject,
			message: `From: ${email}\n\n${message}`,
			time: new Date().toLocaleString("en-US", {
				dateStyle: "medium",
				timeStyle: "short"
			}),
			email: email,
		};

		// Send via EmailJS using 3-argument signature
		if (window.emailjs) {
			emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
				.then((response) => {
					console.log("EmailJS SUCCESS!", response.status, response.text);
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
				.catch((err) => {
					console.error("EmailJS send failed:", err);
					btn.innerHTML = origHtml;
					btn.disabled = false;

					let errDetails = "Please email directly at mirjajajijmilon@gmail.com";
					if (err && err.text) {
						errDetails = `EmailJS Error: ${err.text}`;
					} else if (err && err.message) {
						errDetails = `Error: ${err.message}`;
					}

					showToast("Message Failed to Send", [errDetails], 7000, true);
				});
		} else {
			btn.innerHTML = origHtml;
			btn.disabled = false;
			showToast("EmailJS Not Loaded", ["Please check your internet connection or EmailJS CDN."], 5000, true);
		}
	});
}



