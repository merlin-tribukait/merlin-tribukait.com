/**
 * MERLIN TRIBUKAIT — PORTFOLIO & ECOSYSTEM INTERACTIVE SCRIPT
 * Cyber-Glass Engine · 3D Parallax · Particle Physics · Web Audio FX · CRT Scanlines
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTypingEffect();
  initMouseSpotlight();
  initBackgroundCanvas();
  init3DCardTilt();
  initScrollReveal();
  initAudioSynthesizer();
  initTerminal();
  initContactAndCopy();
  initHudTelemetry();
});

/* ==============================================================================
   WEB AUDIO API CYBER SYNTHESIZER (OPTIONAL SOUND FX)
   ============================================================================== */
let audioCtx = null;
let soundEnabled = false;

function initAudioSynthesizer() {
  const audioBtn = document.getElementById('audioFxToggle');
  const savedState = localStorage.getItem('mt_sound_fx');
  
  if (savedState === 'enabled') {
    soundEnabled = true;
    if (audioBtn) audioBtn.classList.add('active');
  }

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  window.playCyberSound = function(type) {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'hover') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.linearRampToValueAtTime(660, now + 0.04);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'key') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200 + Math.random() * 300, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.08); // A5
        osc.frequency.setValueAtTime(1174.66, now + 0.16); // D6
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'powerup') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {
      // Ignore audio errors
    }
  };

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      localStorage.setItem('mt_sound_fx', soundEnabled ? 'enabled' : 'disabled');
      audioBtn.classList.toggle('active', soundEnabled);
      
      if (soundEnabled) {
        getAudioContext();
        window.playCyberSound('powerup');
        showToast('Cyber Audio FX Enabled');
      } else {
        showToast('Audio Muted');
      }
    });
  }

  // Attach hover sounds to buttons and cards
  document.querySelectorAll('.btn, .glass-card, .term-quick-btn').forEach(elem => {
    elem.addEventListener('mouseenter', () => window.playCyberSound('hover'));
    elem.addEventListener('click', () => window.playCyberSound('click'));
  });
}

/* ==============================================================================
   MOUSE SPOTLIGHT & PARALLAX TRACKER
   ============================================================================== */
function initMouseSpotlight() {
  window.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    document.documentElement.style.setProperty('--mouse-x', `${x}px`);
    document.documentElement.style.setProperty('--mouse-y', `${y}px`);

    // Update nearest glass cards for dynamic spotlight border
    document.querySelectorAll('.glass-card').forEach(card => {
      const rect = card.getBoundingClientRect();
      if (
        x >= rect.left - 100 && x <= rect.right + 100 &&
        y >= rect.top - 100 && y <= rect.bottom + 100
      ) {
        const cardX = ((x - rect.left) / rect.width) * 100;
        const cardY = ((y - rect.top) / rect.height) * 100;
        card.style.setProperty('--card-mouse-x', `${cardX}%`);
        card.style.setProperty('--card-mouse-y', `${cardY}%`);
      }
    });
  }, { passive: true });
}

/* ==============================================================================
   3D TILT EFFECT ON CARDS
   ============================================================================== */
function init3DCardTilt() {
  if (window.innerWidth < 1024) return; // Desktop only for optimal touch performance

  const cards = document.querySelectorAll('.glass-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ==============================================================================
   SCROLL-DRIVEN REVEAL ANIMATIONS
   ============================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.section-header, .glass-card, .roadmap-item');
  elements.forEach(el => el.classList.add('reveal-on-scroll'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ==============================================================================
   NAVBAR & MOBILE DRAWER
   ============================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');

  let overlay = document.querySelector('.mobile-nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    document.body.appendChild(overlay);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
  }, { passive: true });

  function toggleMenu(open) {
    const isOpen = open !== undefined ? open : !navLinks.classList.contains('open');
    if (isOpen) {
      navLinks.classList.add('open');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      navLinks.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  }

  overlay.addEventListener('click', () => toggleMenu(false));

  links.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 180;

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
      typingSpeed = 28;
    } else {
      typingElem.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 60;
    }

    if (!isDeleting && charIdx === currentPhrase.length) {
      typingSpeed = 2400;
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
   INTERACTIVE PARTICLE CANVAS WITH CURSOR LIGHTNING ARCS
   ============================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let isRunning = true;

  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 18 : 46;
  const maxDistance = isMobile ? 100 : 140;

  let mouseX = -9999;
  let mouseY = -9999;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouseX = -9999;
    mouseY = -9999;
  });

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  document.addEventListener('visibilitychange', () => {
    isRunning = !document.hidden;
    if (isRunning) animate();
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * (isMobile ? 0.25 : 0.45);
      this.vy = (Math.random() - 0.5) * (isMobile ? 0.25 : 0.45);
      this.radius = Math.random() * 1.6 + 0.8;
      this.color = Math.random() > 0.4 ? 'rgba(0, 240, 255,' : 'rgba(157, 78, 221,';
      this.alpha = Math.random() * 0.35 + 0.15;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Mouse repulsion force field
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120 && dist > 0) {
        const force = (120 - dist) / 120;
        this.x += (dx / dist) * force * 1.5;
        this.y += (dy / dist) * force * 1.5;
      }

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
    if (!isRunning) return;

    ctx.clearRect(0, 0, width, height);

    // Connecting lines between particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.1 * (1 - dist / maxDistance)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Mouse interactive lightning connector
      const mdx = particles[i].x - mouseX;
      const mdy = particles[i].y - mouseY;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

      if (mdist < 150) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.25 * (1 - mdist / 150)})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();
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
   LIVE HUD TELEMETRY SIMULATOR
   ============================================================================== */
function initHudTelemetry() {
  const latencyElem = document.getElementById('hudLatency');
  const packetElem = document.getElementById('hudPackets');

  if (!latencyElem && !packetElem) return;

  let packets = 2841920;

  setInterval(() => {
    if (latencyElem) {
      const ping = Math.floor(10 + Math.random() * 8);
      latencyElem.textContent = `${ping}ms`;
    }
    if (packetElem) {
      packets += Math.floor(12 + Math.random() * 25);
      packetElem.textContent = packets.toLocaleString();
    }
  }, 2000);
}

/* ==============================================================================
   INTERACTIVE LIVE CLI TERMINAL (WITH FX & EXPANDED COMMANDS)
   ============================================================================== */
function initTerminal() {
  const terminalBody = document.getElementById('terminalBody');
  const termInput = document.getElementById('termInput');
  const quickBtns = document.querySelectorAll('.term-quick-btn');
  const scanlines = document.querySelector('.scanlines');

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
\x1b[33m[AVAILABLE COMMANDS]\x1b[0m
  - \x1b[36mabout\x1b[0m       : Engineering background & profile summary
  - \x1b[36mnotes\x1b[0m       : Technical field notes & architecture insights
  - \x1b[36mskills\x1b[0m      : Full technical stack & proficiency breakdown
  - \x1b[36mprojects\x1b[0m    : Summary of active systems (GAMES-REBORN, MU3, Docs)
  - \x1b[36mservices\x1b[0m    : What I can program, build, and consult on
  - \x1b[36mroadmap\x1b[0m     : Upcoming releases & future roadmap milestones
  - \x1b[36mspecs\x1b[0m       : Live server telemetry & architecture specifications
  - \x1b[36mscan\x1b[0m        : Execute real-time network and daemon port audit
  - \x1b[36mcrt\x1b[0m         : Toggle retro CRT monitor scanlines overlay
  - \x1b[36maudio\x1b[0m       : Toggle Web Audio synth sound effects
  - \x1b[36mhack\x1b[0m        : Simulate cyber network traceroute
  - \x1b[36mmatrix\x1b[0m      : Stream Matrix digital rain stream
  - \x1b[36mcontact\x1b[0m     : Direct communication channels & email
  - \x1b[36mclear\x1b[0m       : Clear terminal window
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
    notes: () => `
\x1b[35m[ARCHITECTURAL FIELD NOTES]\x1b[0m
  • Note 01 (Reverse Eng): 541 opcodes & 4,221 DTO schemas extracted via Wireshark + IL2CPP metadata.
  • Note 02 (C++17 Core)  : Async epoll/socket loop with worker thread pools isolates DB I/O from 20ms tick.
  • Note 03 (Nginx/DevOps): Dual-stack HTTP/2 & TLS 1.3 on ports 80/443 with Let's Encrypt ECDSA auto-renew.
  • Note 04 (PM2 Cluster) : Micro-apps (portal, admin, mu3) reload with zero downtime via Node cluster mesh.
  • Note 05 (Database)   : MariaDB 10.x parameterized connection pool eliminates SQL injection & lockups.
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
    scan: () => {
      triggerScanAnimation();
      return "Initiating multi-port daemon scan on 85.215.227.241...";
    },
    crt: () => {
      if (scanlines) {
        scanlines.classList.toggle('active');
        const isActive = scanlines.classList.contains('active');
        showToast(isActive ? 'CRT Scanlines Enabled' : 'CRT Scanlines Disabled');
        return `CRT Scanlines: ${isActive ? '\x1b[32m[ENABLED]\x1b[0m' : '\x1b[31m[DISABLED]\x1b[0m'}`;
      }
      return 'CRT overlay element unavailable.';
    },
    audio: () => {
      const audioBtn = document.getElementById('audioFxToggle');
      if (audioBtn) audioBtn.click();
      return `Audio FX: ${soundEnabled ? '\x1b[32m[ENABLED]\x1b[0m' : '\x1b[31m[MUTED]\x1b[0m'}`;
    },
    hack: () => {
      triggerHackAnimation();
      return "Tracing network routing mesh...";
    },
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
      return "Streaming digital Matrix torrent...";
    },
    sudo: () => "Permission granted: you have full root privileges on this guest session.",
    clear: () => {
      terminalBody.innerHTML = '';
      return '';
    }
  };

  printOutput(`
${ASCII_BANNER}
Type \x1b[36m'help'\x1b[0m or tap the quick buttons above to explore systems & FX.
`);

  function executeCommand(inputStr) {
    const rawInput = inputStr.trim();
    if (!rawInput) return;

    history.push(rawInput);
    historyIdx = history.length;

    printLine(`guest@merlin-tribukait:~$ ${rawInput}`);
    if (window.playCyberSound) window.playCyberSound('click');

    const parts = rawInput.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (cmd in commands) {
      const res = commands[cmd](args);
      if (res) printOutput(res);
      if (window.playCyberSound) window.playCyberSound('success');
    } else if (cmd === 'echo') {
      printOutput(args.join(' '));
    } else {
      printOutput(`Command not found: \x1b[31m${cmd}\x1b[0m. Type \x1b[36m'help'\x1b[0m for list.`);
    }

    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  termInput.addEventListener('keydown', (e) => {
    if (window.playCyberSound) window.playCyberSound('key');

    if (e.key === 'Enter') {
      executeCommand(termInput.value);
      termInput.value = '';
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
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const cmd = btn.getAttribute('data-cmd');
      if (cmd && cmd in commands) {
        executeCommand(cmd);
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

  function triggerScanAnimation() {
    const ports = [
      { port: 80, name: 'HTTP Reverse Proxy', status: 'OPEN [301 Redirect]' },
      { port: 443, name: 'HTTPS TLS 1.3 HTTP/2', status: 'OPEN [ECDSA OK]' },
      { port: 3000, name: 'Gitea / Web Hub', status: 'OPEN [Proxy Pass]' },
      { port: 3100, name: 'GAMES-REBORN PM2', status: 'OPEN [Cluster Node]' },
      { port: 3306, name: 'MariaDB Instance', status: 'PROTECTED [127.0.0.1]' },
      { port: 4403, name: 'MU3 Auth Gateway', status: 'OPEN [Daemon Core]' },
      { port: 5222, name: 'MU3 Game Server 01', status: 'OPEN [Asio epoll]' },
      { port: 8088, name: 'MU3 Admin GM API', status: 'PROTECTED [Nginx Auth]' }
    ];

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < ports.length) {
        const p = ports[idx];
        printOutput(`  \x1b[36m[PORT ${p.port}]\x1b[0m ${p.name.padEnd(24)} -> \x1b[32m${p.status}\x1b[0m`);
        terminalBody.scrollTop = terminalBody.scrollHeight;
        if (window.playCyberSound) window.playCyberSound('key');
        idx++;
      } else {
        clearInterval(interval);
        printOutput(`\x1b[32m✔ Port audit completed. All 8 active listeners healthy.\x1b[0m`);
        terminalBody.scrollTop = terminalBody.scrollHeight;
      }
    }, 120);
  }

  function triggerHackAnimation() {
    const hops = [
      'HOP 01: 127.0.0.1 (Local Gateway) - 0.2ms',
      'HOP 02: 85.215.227.241 (Frankfurt Edge Core) - 1.1ms',
      'HOP 03: 10.0.4.1 (PM2 Micro-App Cluster) - 0.4ms',
      'HOP 04: 127.0.0.1:3306 (MariaDB Connection Pool) - 0.3ms',
      'HOP 05: /bin/mu3_server (Asynchronous Game Loop) - 0.1ms'
    ];
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < hops.length) {
        printOutput(`\x1b[33m⚡ ${hops[idx]}\x1b[0m`);
        terminalBody.scrollTop = terminalBody.scrollHeight;
        if (window.playCyberSound) window.playCyberSound('key');
        idx++;
      } else {
        clearInterval(interval);
        printOutput(`\x1b[32m✔ Trace verified: Zero packet loss, 100% throughput integrity.\x1b[0m`);
        terminalBody.scrollTop = terminalBody.scrollHeight;
      }
    }, 150);
  }

  function triggerMatrixEffect() {
    let count = 0;
    const interval = setInterval(() => {
      let line = '';
      for (let i = 0; i < 34; i++) {
        line += String.fromCharCode(33 + Math.floor(Math.random() * 90)) + ' ';
      }
      printOutput(`<span style="color:#00df72; opacity:${0.4 + Math.random()*0.6}">${line}</span>`);
      terminalBody.scrollTop = terminalBody.scrollHeight;
      count++;
      if (count > 9) clearInterval(interval);
    }, 90);
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
        if (window.playCyberSound) window.playCyberSound('success');
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

      const mailtoUrl = `mailto:merlin_felix_@hotmail.com?subject=${encodeURIComponent(subject + ' [via merlin-tribukait.com from ' + name + ']')}&body=${encodeURIComponent(message + '\n\nSender: ' + name + ' (' + email + ')')}`;
      
      showToast('Opening email client for Merlin Tribukait...');
      if (window.playCyberSound) window.playCyberSound('success');
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
  }, 3200);
}
