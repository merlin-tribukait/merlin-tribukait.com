/**
 * MERLIN TRIBUKAIT — PORTFOLIO & ECOSYSTEM INTERACTIVE SCRIPT
 * Cyber-Glass High Performance JS Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTypingEffect();
  initBackgroundCanvas();
  initTerminal();
  initContactAndCopy();
});

/* ==============================================================================
   NAVBAR & SCROLL
   ============================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');

  // Scroll detection for navbar background
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
  });

  // Mobile menu toggle
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Close mobile menu on click
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks) navLinks.classList.remove('open');
    });
  });

  // Active section tracker
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 200;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        links.forEach(l => {
          l.classList.remove('active');
          if (l.getAttribute('href') === `#${id}`) {
            l.classList.add('active');
          }
        });
      }
    });
  }
}

/* ==============================================================================
   HERO TYPING EFFECT
   ============================================================================== */
function initTypingEffect() {
  const typingElem = document.getElementById('heroTyping');
  if (!typingElem) return;

  const phrases = [
    'Full-Stack Systems Architect & Game Core Engineer',
    'Low-Level Protocol Reverse Engineer (541+ Opcodes)',
    'Distributed Cloud & Zero-Downtime DevOps Specialist',
    'C++17 MMORPG Daemons & High-Concurrency Networks',
    'Next-Gen Web Platforms & Real-Time Telemetry'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 65;

  function typeLoop() {
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      typingElem.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 30;
    } else {
      typingElem.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 65;
    }

    if (!isDeleting && charIdx === currentPhrase.length) {
      // Pause at full word
      typingSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(typeLoop, typingSpeed);
  }

  typeLoop();
}

/* ==============================================================================
   PARTICLE NETWORK CANVAS
   ============================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 45;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.5 + 0.8;
      this.color = Math.random() > 0.5 ? 'rgba(0, 240, 255,' : 'rgba(157, 78, 221,';
      this.alpha = Math.random() * 0.4 + 0.15;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.12 * (1 - dist / 140)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==============================================================================
   INTERACTIVE LIVE CLI TERMINAL
   ============================================================================== */
function initTerminal() {
  const terminalBody = document.getElementById('terminalBody');
  const termInput = document.getElementById('termInput');
  const quickBtns = document.querySelectorAll('.term-quick-btn');

  if (!terminalBody || !termInput) return;

  const history = [];
  let historyIdx = -1;

  const ASCII_BANNER = `
  __  __ _____ ____  _     ___ _   _   _____ ____  ___ ____  _   _ _  __    _  _____ 
 |  \\/  | ____|  _ \\| |   |_ _| \\ | | |_   _|  _ \\|_ _| __ )| | | | |/ /   / \\|_   _|
 | |\\/| |  _| | |_) | |    | ||  \\| |   | | | |_) || ||  _ \\| | | | ' /   / _ \\ | |  
 | |  | | |___|  _ <| |___ | || |\\  |   | | |  _ < | || |_) | |_| | . \\  / ___ \\| |  
 |_|  |_|_____|_| \\_\\_____|___|_| \\_|   |_| |_| \\_\\___|____/ \\___/|_|\\_\\/_/   \\_\\_|  
  `;

  const commands = {
    help: () => `
Available Commands:
  - \x1b[36mabout\x1b[0m       : Engineering background & profile summary
  - \x1b[36mskills\x1b[0m      : Full technical stack & proficiency breakdown
  - \x1b[36mprojects\x1b[0m    : Summary of active systems (GAMES-REBORN, MU3, Docs)
  - \x1b[36mservices\x1b[0m    : What I can program, build, and consult on
  - \x1b[36mroadmap\x1b[0m     : Upcoming releases & upcoming milestones
  - \x1b[36mspecs\x1b[0m       : Live server telemetry & architecture specifications
  - \x1b[36mcontact\x1b[0m     : Direct communication channels & email
  - \x1b[36mbanner\x1b[0m      : Display ASCII developer banner
  - \x1b[36mmatrix\x1b[0m      : Activate Matrix cyber stream
  - \x1b[36mclear\x1b[0m       : Clear terminal window
  - \x1b[36mdate\x1b[0m        : Show current UTC date and server timestamp
`,
    about: () => `
\x1b[32m[DEVELOPER IDENTITY]\x1b[0m
  Name      : Merlin Felix Tribukait
  Role      : Full-Stack Systems Architect & Game Core Engineer
  Specialty : Low-Level Network Protocol Reverse Engineering & C++ MMORPG Cores
  Location  : Frankfurt am Main / Remote
  Status    : Open to Select Technical Architecture & Engineering Contracts

\x1b[34m[CORE ETHOS]\x1b[0m
  "Engineered for speed, built on provable resilience, and zero-downtime high concurrency."
`,
    skills: () => `
\x1b[33m[CORE ARSENAL]\x1b[0m
  - Low-Level & Core   : C++17/20, TypeScript, Python 3.12+, SQL (MariaDB), Bash, C#
  - Protocol Engineering: Wireshark, Ghidra, IL2CPP, 541 Opcodes, 4,221 DTO Schemas
  - Backend & Mesh      : Node.js, PM2 Zero-Downtime Cluster, MariaDB Pooling, Redis, WebSockets
  - Frontend & Web      : Next.js, React, Tailwind CSS, Primer Tokens, Real-Time GM UI
  - DevOps & Infra      : Linux Kernel Tuning, Nginx Load Balancing, Let's Encrypt TLS 1.3
  - Mobile & Client     : Android SDK, Custom Launchers (Avalonia), SHA-256 Delta Patchers
`,
    projects: () => `
\x1b[36m[ACTIVE ECOSYSTEM PROJECTS]\x1b[0m
  1. GAMES-REBORN Platform  : Multi-realm MMORPG platform (https://games-reborn.com)
  2. MU3-Server Core (C++17): 541 Opcodes, 4221 DTOs, 85 Systems (github.com/merlin-tribukait/mu3-server)
  3. Protocol Intel Hub     : Enterprise specs & security blueprints (https://docs.merlin-tribukait.com)
  4. OurNuts Client Manager : Client spoofing & Android SDK tooling suite
  5. Brand Design System    : 3D emblems & SVG design tokens (https://brands.games-reborn.com)
`,
    services: () => `
\x1b[35m[WHAT I CAN PROGRAM & PROVIDE]\x1b[0m
  ✔ Custom MMORPG & Game Server Daemon Architecture (C++17 / Node.js)
  ✔ Network Protocol Reverse Engineering & Binary DTO Extraction
  ✔ High-Concurrency Web Portals & Real-Time GM Telemetry Suites
  ✔ Cross-Platform Desktop & Android Game Launchers (Auto-Patcher)
  ✔ MariaDB Performance Tuning & Zero-Downtime Infrastructure
  ✔ Automation CLI Tools & Custom MCP (Model Context Protocol) Agents
`,
    roadmap: () => `
\x1b[32m[WHAT'S COMING NEXT]\x1b[0m
  - Q4 2026 : GAMES-REBORN Multi-Realm Public Beta Launch
  - Q4 2026 : MU Origin 3 Core v2.0 (PvP Arena & Cross-Server Clusters)
  - Q1 2027 : Interactive Web Protocol Disassembler & DTO Code Generator
  - Q1 2027 : Universal Cross-Platform Game Launcher v3.0 (PC/Mobile)
  - Q2 2027 : AI-Powered Real-Time Game Telemetry & Anti-Cheat Agent
`,
    specs: () => `
\x1b[34m[SYSTEM TELEMETRY SPECIFICATIONS]\x1b[0m
  Host IP       : 85.215.227.241 (Frankfurt, EU)
  Web Server    : Nginx 1.24.0 (Dual-Stack IPv4/IPv6, HTTP/2, TLS 1.3)
  Active Ports  : 80 (HTTP), 443 (HTTPS), 8080, 8444, 3000, 3100, 3306, 8081, 8088
  Database Engine: MariaDB 10.x with Parameterized Connection Pooling
  Process Mesh  : PM2 v7.0.4 God Daemon + C++17 Asynchronous Game Daemons
  TLS Encryption: Let's Encrypt ECDSA Automated Renewal (Valid)
`,
    contact: () => `
\x1b[32m[DIRECT CONTACT]\x1b[0m
  Email   : merlin_felix_@hotmail.com
  GitHub  : https://github.com/merlin-tribukait
  Portal  : https://merlin-tribukait.com
  Docs    : https://docs.merlin-tribukait.com
`,
    banner: () => ASCII_BANNER,
    date: () => new Date().toUTCString(),
    matrix: () => {
      triggerMatrixEffect();
      return "Initializing Matrix digital stream...";
    },
    sudo: () => "Permission denied: you are already running as superuser in guest sandbox mode.",
    clear: () => {
      terminalBody.innerHTML = '';
      return '';
    }
  };

  // Run initial welcome banner
  printOutput(`
${ASCII_BANNER}
Type \x1b[36m'help'\x1b[0m or click quick action buttons above to inspect systems.
`);

  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawInput = termInput.value.trim();
      termInput.value = '';

      if (!rawInput) return;

      history.push(rawInput);
      historyIdx = history.length;

      printLine(`guest@merlin-tribukait:~$ ${rawInput}`);

      const parts = rawInput.split(' ');
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);

      if (cmd in commands) {
        const res = commands[cmd](args);
        if (res) printOutput(res);
      } else if (cmd === 'echo') {
        printOutput(args.join(' '));
      } else {
        printOutput(`Command not found: \x1b[31m${cmd}\x1b[0m. Type \x1b[36m'help'\x1b[0m for list.`);
      }

      terminalBody.scrollTop = terminalBody.scrollHeight;
    } else if (e.key === 'ArrowUp') {
      if (historyIdx > 0) {
        historyIdx--;
        termInput.value = history[historyIdx];
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (historyIdx < history.length - 1) {
        historyIdx++;
        termInput.value = history[historyIdx];
      } else {
        historyIdx = history.length;
        termInput.value = '';
      }
      e.preventDefault();
    }
  });

  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd && cmd in commands) {
        printLine(`guest@merlin-tribukait:~$ ${cmd}`);
        const res = commands[cmd]();
        if (res) printOutput(res);
        terminalBody.scrollTop = terminalBody.scrollHeight;
      }
    });
  });

  function printLine(text) {
    const p = document.createElement('div');
    p.className = 'term-line';
    p.style.color = '#00f0ff';
    p.textContent = text;
    terminalBody.appendChild(p);
  }

  function printOutput(text) {
    const div = document.createElement('div');
    div.className = 'term-output';
    div.innerHTML = formatAnsi(text);
    terminalBody.appendChild(div);
  }

  function formatAnsi(txt) {
    return txt
      .replace(/\x1b\[31m/g, '<span style="color: #ff3366">')
      .replace(/\x1b\[32m/g, '<span style="color: #00df72">')
      .replace(/\x1b\[33m/g, '<span style="color: #ffb703">')
      .replace(/\x1b\[34m/g, '<span style="color: #00a8ff">')
      .replace(/\x1b\[35m/g, '<span style="color: #9d4edd">')
      .replace(/\x1b\[36m/g, '<span style="color: #00f0ff">')
      .replace(/\x1b\[0m/g, '</span>');
  }

  function triggerMatrixEffect() {
    let count = 0;
    const interval = setInterval(() => {
      let line = '';
      for (let i = 0; i < 40; i++) {
        line += String.fromCharCode(33 + Math.floor(Math.random() * 90)) + ' ';
      }
      printOutput(`<span style="color:#00df72; opacity:${0.4 + Math.random()*0.6}">${line}</span>`);
      terminalBody.scrollTop = terminalBody.scrollHeight;
      count++;
      if (count > 10) clearInterval(interval);
    }, 100);
  }
}

/* ==============================================================================
   CONTACT & CLIPBOARD COPY
   ============================================================================== */
function initContactAndCopy() {
  const copyBtns = document.querySelectorAll('.copy-btn');
  const contactForm = document.getElementById('contactForm');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy') || 'merlin_felix_@hotmail.com';
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied "${textToCopy}" to clipboard!`);
      }).catch(() => {
        showToast('Direct copy failed. Use merlin_felix_@hotmail.com');
      });
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('formName').value;
      const email = document.getElementById('formEmail').value;
      const subject = document.getElementById('formSubject').value;
      const message = document.getElementById('formMessage').value;

      // Construct mailto link
      const mailtoUrl = `mailto:merlin_felix_@hotmail.com?subject=${encodeURIComponent(subject + ' [via merlin-tribukait.com from ' + name + ']')}&body=${encodeURIComponent(message + '\n\nSender: ' + name + ' (' + email + ')')}`;
      
      showToast('Opening email client for Merlin Tribukait...');
      window.location.href = mailtoUrl;
    });
  }
}

function showToast(msg) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>⚡</span> <span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
