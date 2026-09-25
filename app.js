/* ========================================
   LOGIC GATE CHALLENGE & FILE VAULT CONTROLLER
   ======================================== */

// ── 3 Challenge Levels ─────────────────────
const LEVELS = [
    {
        id: 1,
        name: "GATE 1: BINARY HANDSHAKE",
        description: "Configure inputs A & B so that the AND gate evaluates to 1.",
        targetOutput: 1,
        inputs: [
            { id: 'A', label: 'A', x: 15, y: 35 },
            { id: 'B', label: 'B', x: 15, y: 65 }
        ],
        gates: [
            { id: 'g1', type: 'AND', inputs: ['A', 'B'], x: 50, y: 50 }
        ],
        output: { source: 'g1', x: 85, y: 50 },
        hint: "AND gate outputs 1 only when BOTH input A and input B are set to 1."
    },
    {
        id: 2,
        name: "GATE 2: SIGNAL DIVERSIFICATION",
        description: "Pass signals through an OR gate and AND gate to produce HIGH (1).",
        targetOutput: 1,
        inputs: [
            { id: 'A', label: 'A', x: 12, y: 25 },
            { id: 'B', label: 'B', x: 12, y: 50 },
            { id: 'C', label: 'C', x: 12, y: 75 }
        ],
        gates: [
            { id: 'g1', type: 'OR', inputs: ['A', 'B'], x: 42, y: 37 },
            { id: 'g2', type: 'AND', inputs: ['g1', 'C'], x: 70, y: 56 }
        ],
        output: { source: 'g2', x: 88, y: 56 },
        hint: "(A OR B) AND C must equal 1. So C must be 1, and at least A or B must be 1."
    },
    {
        id: 3,
        name: "GATE 3: FIREWALL BYPASS",
        description: "Deep circuit authentication. Align 4 inputs across mixed logic gates.",
        targetOutput: 1,
        inputs: [
            { id: 'A', label: 'A', x: 10, y: 20 },
            { id: 'B', label: 'B', x: 10, y: 40 },
            { id: 'C', label: 'C', x: 10, y: 60 },
            { id: 'D', label: 'D', x: 10, y: 80 }
        ],
        gates: [
            { id: 'g1', type: 'AND', inputs: ['A', 'B'], x: 38, y: 30 },
            { id: 'g2', type: 'OR', inputs: ['C', 'D'], x: 38, y: 70 },
            { id: 'g3', type: 'AND', inputs: ['g1', 'g2'], x: 68, y: 50 }
        ],
        output: { source: 'g3', x: 88, y: 50 },
        hint: "(A AND B) AND (C OR D) must equal 1. Both A & B must be 1, plus C or D must be 1."
    }
];

// ── App State ──────────────────────────────
const state = {
    screen: 'explorer', // 'explorer' | 'challenge' | 'file'
    currentLevel: 0,
    inputValues: {},
    completedLevels: new Set(),
    fileUnlocked: false
};

// ── DOM References ─────────────────────────
const DOM = {};

function cacheDOM() {
    DOM.screenExplorer = document.getElementById('screenExplorer');
    DOM.screenChallenge = document.getElementById('screenChallenge');
    DOM.screenFile = document.getElementById('screenFile');

    DOM.lockedFile = document.getElementById('lockedFile');
    DOM.fileReadme = document.getElementById('fileReadme');
    DOM.folderPublic = document.getElementById('folderPublic');
    DOM.currentTime = document.getElementById('currentTime');

    DOM.backToExplorer = document.getElementById('backToExplorer');
    DOM.chLevelNum = document.getElementById('chLevelNum');
    DOM.chMissionTitle = document.getElementById('chMissionTitle');
    DOM.chMissionDesc = document.getElementById('chMissionDesc');
    DOM.chTargetVal = document.getElementById('chTargetVal');
    DOM.chCurrentVal = document.getElementById('chCurrentVal');
    DOM.chHintText = document.getElementById('chHintText');
    DOM.chProgressDots = document.getElementById('chProgressDots');

    DOM.chCircuit = document.getElementById('chCircuit');
    DOM.chWireLayer = document.getElementById('chWireLayer');
    DOM.chComponents = document.getElementById('chComponents');
    DOM.chTruthBody = document.getElementById('chTruthBody');

    DOM.chResetBtn = document.getElementById('chResetBtn');
    DOM.chVerifyBtn = document.getElementById('chVerifyBtn');

    DOM.modalOverlay = document.getElementById('modalOverlay');
    DOM.modalTitle = document.getElementById('modalTitle');
    DOM.modalMessage = document.getElementById('modalMessage');
    DOM.modalBtn = document.getElementById('modalBtn');
    DOM.particleCanvas = document.getElementById('particleCanvas');

    DOM.viewerBackBtn = document.getElementById('viewerBackBtn');
}

// ── Clock ──────────────────────────────────
function updateClock() {
    const now = new Date();
    DOM.currentTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ── Screen Navigation ──────────────────────
function switchScreen(targetScreen) {
    state.screen = targetScreen;
    DOM.screenExplorer.classList.remove('active');
    DOM.screenChallenge.classList.remove('active');
    DOM.screenFile.classList.remove('active');

    if (targetScreen === 'explorer') {
        DOM.screenExplorer.classList.add('active');
    } else if (targetScreen === 'challenge') {
        DOM.screenChallenge.classList.add('active');
        renderChallengeLevel();
    } else if (targetScreen === 'file') {
        DOM.screenFile.classList.add('active');
    }
}

// ── Logic Gate Engine ──────────────────────
function evaluateGate(type, inputA, inputB) {
    if (type === 'AND') return inputA & inputB;
    if (type === 'OR') return inputA | inputB;
    return 0;
}

function evaluateCircuit(level) {
    const values = {};
    level.inputs.forEach(inp => {
        values[inp.id] = state.inputValues[inp.id] || 0;
    });
    level.gates.forEach(gate => {
        const a = values[gate.inputs[0]] || 0;
        const b = values[gate.inputs[1]] || 0;
        values[gate.id] = evaluateGate(gate.type, a, b);
    });
    return values;
}

// ── Render Challenge Level ─────────────────
function renderChallengeLevel() {
    const level = LEVELS[state.currentLevel];

    DOM.chLevelNum.textContent = level.id;
    DOM.chMissionTitle.textContent = level.name;
    DOM.chMissionDesc.textContent = level.description;
    DOM.chTargetVal.textContent = level.targetOutput;
    DOM.chHintText.textContent = level.hint;

    // Default input values to 0 if not set
    level.inputs.forEach(inp => {
        if (state.inputValues[inp.id] === undefined) {
            state.inputValues[inp.id] = 0;
        }
    });

    renderProgressDots();
    renderCircuitComponents();
    renderTruthTable();
}

function renderProgressDots() {
    DOM.chProgressDots.innerHTML = '';
    LEVELS.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = 'ch-progress-dot';
        if (idx === state.currentLevel) dot.classList.add('active');
        if (state.completedLevels.has(idx)) dot.classList.add('done');
        DOM.chProgressDots.appendChild(dot);
    });
}

function renderCircuitComponents() {
    const level = LEVELS[state.currentLevel];
    const values = evaluateCircuit(level);
    const outputVal = values[level.output.source];

    DOM.chCurrentVal.textContent = outputVal;
    DOM.chComponents.innerHTML = '';

    // Clear svg except defs
    const defs = DOM.chWireLayer.querySelector('defs');
    DOM.chWireLayer.innerHTML = '';
    if (defs) DOM.chWireLayer.appendChild(defs);

    // Render inputs
    level.inputs.forEach(inp => {
        const isActive = state.inputValues[inp.id] === 1;
        const el = document.createElement('div');
        el.className = `circuit-input${isActive ? ' active' : ''}`;
        el.style.left = `${inp.x}%`;
        el.style.top = `${inp.y}%`;
        el.id = `comp-${inp.id}`;
        el.innerHTML = `
            <span class="input-label">${inp.label}</span>
            <div class="switch" data-input="${inp.id}">
                <div class="switch-thumb"></div>
            </div>
            <span class="input-value">${isActive ? '1' : '0'}</span>
        `;
        el.querySelector('.switch').addEventListener('click', () => {
            state.inputValues[inp.id] = state.inputValues[inp.id] === 1 ? 0 : 1;
            renderCircuitComponents();
            renderTruthTable();
        });
        DOM.chComponents.appendChild(el);
    });

    // Render gates
    level.gates.forEach(gate => {
        const isActive = values[gate.id] === 1;
        const el = document.createElement('div');
        el.className = `circuit-gate${isActive ? ' active' : ''}`;
        el.style.left = `${gate.x}%`;
        el.style.top = `${gate.y}%`;
        el.id = `comp-${gate.id}`;
        el.innerHTML = `
            <div class="gate-body">
                <div class="gate-type">${gate.type}</div>
                <div class="gate-value">out: ${values[gate.id]}</div>
            </div>
        `;
        DOM.chComponents.appendChild(el);
    });

    // Render Output Indicator
    const isOutActive = outputVal === 1;
    const outEl = document.createElement('div');
    outEl.className = `circuit-output${isOutActive ? ' active' : ''}`;
    outEl.style.left = `${level.output.x}%`;
    outEl.style.top = `${level.output.y}%`;
    outEl.id = 'comp-output';
    outEl.innerHTML = `
        <div class="output-led"></div>
        <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--text-secondary)">OUT</span>
    `;
    DOM.chComponents.appendChild(outEl);

    requestAnimationFrame(() => drawWires(level, values));
}

function drawWires(level, values) {
    const containerRect = DOM.chCircuit.getBoundingClientRect();

    function getPos(id, isOutput) {
        const el = document.getElementById(`comp-${id}`);
        if (!el) return { x: 0, y: 0 };
        const rect = el.getBoundingClientRect();
        const x = isOutput ? rect.right - containerRect.left : rect.left - containerRect.left;
        const y = rect.top + rect.height / 2 - containerRect.top;
        return { x, y };
    }

    const wires = [];
    level.gates.forEach(gate => {
        gate.inputs.forEach(inpId => {
            wires.push({
                from: inpId,
                to: gate.id,
                val: values[inpId] || 0
            });
        });
    });
    wires.push({
        from: level.output.source,
        to: 'output',
        val: values[level.output.source] || 0
    });

    wires.forEach(w => {
        const p1 = getPos(w.from, true);
        const p2 = getPos(w.to, false);
        const midX = (p1.x + p2.x) / 2;
        const d = `M ${p1.x} ${p1.y} C ${midX} ${p1.y}, ${midX} ${p2.y}, ${p2.x} ${p2.y}`;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        path.setAttribute('class', `wire ${w.val ? 'on' : 'off'}`);
        DOM.chWireLayer.appendChild(path);
    });
}

function renderTruthTable() {
    const level = LEVELS[state.currentLevel];
    const inputIds = level.inputs.map(i => i.id);
    const numInputs = inputIds.length;
    const totalRows = Math.pow(2, numInputs);

    let html = '<table class="truth-table"><thead><tr>';
    inputIds.forEach(id => { html += `<th>${id}</th>`; });
    html += '<th>OUT</th></tr></thead><tbody>';

    const currentCombo = inputIds.map(id => state.inputValues[id] || 0).join('');

    for (let i = 0; i < totalRows; i++) {
        const bits = [];
        for (let j = numInputs - 1; j >= 0; j--) bits.push((i >> j) & 1);

        const temp = {};
        inputIds.forEach((id, idx) => { temp[id] = bits[idx]; });
        level.gates.forEach(g => {
            temp[g.id] = evaluateGate(g.type, temp[g.inputs[0]] || 0, temp[g.inputs[1]] || 0);
        });
        const outVal = temp[level.output.source];

        const isCurrent = bits.join('') === currentCombo;
        html += `<tr class="${isCurrent ? 'active-row' : ''}">`;
        bits.forEach(b => { html += `<td class="${b ? 'val-1' : ''}">${b}</td>`; });
        html += `<td class="${outVal ? 'out-1' : ''}">${outVal}</td></tr>`;
    }

    html += '</tbody></table>';
    DOM.chTruthBody.innerHTML = html;
}

// ── Level Verification & Unlock Flow ───────
function verifyLevel() {
    const level = LEVELS[state.currentLevel];
    const values = evaluateCircuit(level);
    const outputVal = values[level.output.source];

    if (outputVal === level.targetOutput) {
        state.completedLevels.add(state.currentLevel);

        if (state.currentLevel < LEVELS.length - 1) {
            // Next level
            showModal("LEVEL COMPLETE", `Gate ${state.currentLevel + 1} passed! Circuit verified.`, "NEXT GATE →", () => {
                state.currentLevel++;
                state.inputValues = {};
                hideModal();
                renderChallengeLevel();
            });
        } else {
            // Final Unlock!
            state.fileUnlocked = true;
            showModal("SECURITY BYPASSED", "All logic gates solved! encrypted_intel.dat unlocked.", "VIEW DECRYPTED FILE 🔓", () => {
                hideModal();
                updateExplorerUnlockedState();
                switchScreen('file');
            });
            startParticles();
        }
    } else {
        DOM.chCircuit.classList.add('shake');
        setTimeout(() => DOM.chCircuit.classList.remove('shake'), 400);
    }
}

function updateExplorerUnlockedState() {
    if (state.fileUnlocked) {
        DOM.lockedFile.classList.remove('locked-file');
        DOM.lockedFile.style.borderColor = 'var(--accent-green)';
        DOM.lockedFile.style.background = 'rgba(0, 255, 136, 0.08)';

        const badge = DOM.lockedFile.querySelector('.locked-badge');
        if (badge) {
            badge.style.background = 'rgba(0, 255, 136, 0.2)';
            badge.style.borderColor = 'var(--accent-green)';
            badge.style.color = 'var(--accent-green)';
            badge.innerHTML = '<span>UNLOCKED</span>';
        }

        const name = DOM.lockedFile.querySelector('.file-name');
        if (name) name.style.color = 'var(--accent-green)';

        const meta = DOM.lockedFile.querySelector('.file-meta');
        if (meta) meta.textContent = 'Decrypted • Click to View';
    }
}

// ── Modal Helpers ──────────────────────────
function showModal(title, msg, btnText, callback) {
    DOM.modalTitle.textContent = title;
    DOM.modalMessage.textContent = msg;
    DOM.modalBtn.textContent = btnText;
    DOM.modalOverlay.classList.add('active');

    DOM.modalBtn.onclick = callback;
}

function hideModal() {
    DOM.modalOverlay.classList.remove('active');
}

// ── Particle Celebration FX ────────────────
function startParticles() {
    const canvas = DOM.particleCanvas;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const particles = [];
    for (let i = 0; i < 40; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            color: ['#00ff88', '#00f0ff', '#ff3366'][Math.floor(Math.random() * 3)],
            radius: Math.random() * 3 + 1,
            alpha: 1
        });
    }

    function anim() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = false;
        particles.forEach(p => {
            if (p.alpha > 0) {
                active = true;
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= 0.02;
                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(0, p.alpha);
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        if (active) requestAnimationFrame(anim);
    }
    anim();
}

// ── Initialization ─────────────────────────
function init() {
    cacheDOM();

    // Clock
    updateClock();
    setInterval(updateClock, 1000);

    // Explorer handlers
    DOM.lockedFile.addEventListener('click', () => {
        if (state.fileUnlocked) {
            switchScreen('file');
        } else {
            switchScreen('challenge');
        }
    });

    DOM.fileReadme.addEventListener('click', () => {
        alert("readme.txt:\n\nSecurity Notice:\nclassified_intel.dat requires 3-stage logic gate authentication.\nSolve the logic circuits to bypass encryption.");
    });

    DOM.folderPublic.addEventListener('click', () => {
        alert("public_reports:\n\nContains unclassified public vulnerability assessments.");
    });

    // Challenge screen handlers
    DOM.backToExplorer.addEventListener('click', () => switchScreen('explorer'));
    DOM.chResetBtn.addEventListener('click', () => {
        state.inputValues = {};
        renderChallengeLevel();
    });
    DOM.chVerifyBtn.addEventListener('click', verifyLevel);

    // File viewer back
    DOM.viewerBackBtn.addEventListener('click', () => switchScreen('explorer'));

    window.addEventListener('resize', () => {
        if (state.screen === 'challenge') renderCircuitComponents();
    });
}

document.addEventListener('DOMContentLoaded', init);
