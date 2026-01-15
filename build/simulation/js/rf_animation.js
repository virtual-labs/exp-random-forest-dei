/**
 * Random Forest Interactive Animation Logic (Vanilla JS)
 */

const RF_ANIMATOR = {
    currentData: null,
    selectedSampleId: 0,
    isAnimating: false,
    votes: {},
    visibleTrees: 12,
    treePredictions: {}, // { treeId: { class, probabilities, path } }
    currentPhase: 'idle', // 'idle', 'animating', 'completed'
    
    // Class Color Mapping
    CLASS_COLORS: {
        'Approved': { 
            bg: 'bg-emerald-500', 
            text: 'text-emerald-600', 
            lightBg: 'bg-emerald-50', 
            hex: '#10b981',
            border: 'border-emerald-200'
        },
        'Rejected': { 
            bg: 'bg-rose-500', 
            text: 'text-rose-600', 
            lightBg: 'bg-rose-50', 
            hex: '#ef4444',
            border: 'border-rose-200'
        },
        'Kama': { 
            bg: 'bg-blue-500', 
            text: 'text-blue-600', 
            lightBg: 'bg-blue-50', 
            hex: '#3b82f6',
            border: 'border-blue-200'
        },
        'Rosa': { 
            bg: 'bg-amber-500', 
            text: 'text-amber-600', 
            lightBg: 'bg-amber-50', 
            hex: '#f59e0b',
            border: 'border-amber-200'
        },
        'Canadian': { 
            bg: 'bg-indigo-500', 
            text: 'text-indigo-600', 
            lightBg: 'bg-indigo-50', 
            hex: '#6366f1',
            border: 'border-indigo-200'
        }
    },

    getClassStyle(className) {
        return this.CLASS_COLORS[className] || { 
            bg: 'bg-slate-500', 
            text: 'text-slate-600', 
            lightBg: 'bg-slate-50', 
            hex: '#64748b',
            border: 'border-slate-200'
        };
    },

    /**
     * Entry point from main.js
     */
    open(mode) {
        console.log("Opening RF Animation:", mode);
        this.currentData = (mode === 'binary') ? RF_DATA_BINARY : RF_DATA_MULTICLASS;
        
        // Switch section visibility
        document.getElementById('trainingSection').style.display = 'none';
        document.getElementById('rfAnimationSection').style.display = 'block';
        
        // Update labels
        document.getElementById('rfTitle').innerText = (mode === 'binary') 
            ? "Random Forest: Binary Classification" 
            : "Random Forest: Multi-Class Classification";
        document.getElementById('rfSubtitle').innerText = (mode === 'binary')
            ? "Loan Approval Prediction Analysis"
            : "Wheat Seed Variety Classification";

        this.init();
    },

    init() {
        this.selectedSampleId = 0;
        this.isAnimating = false;
        this.currentPhase = 'idle';
        this.resetVotes();
        this.renderSamples();
        this.renderInitialTrees();
        this.updateUI();
        
        // Attach listeners
        document.getElementById('rfRunBtn').onclick = () => this.startAnimation();
        document.getElementById('rfBackBtn').onclick = () => this.close();
        document.getElementById('rfCloseModal').onclick = () => this.closeModal();
        
        // Tab listeners
        document.querySelectorAll('.modal-tab').forEach(tab => {
            tab.onclick = (e) => this.switchModalTab(e.target.dataset.tab);
        });
    },

    close() {
        document.getElementById('rfAnimationSection').style.display = 'none';
        document.getElementById('trainingSection').style.display = 'block';
    },

    resetVotes() {
        this.votes = {};
        this.currentData.forestMeta.classes.forEach(c => this.votes[c] = 0);
        this.treePredictions = {};
    },

    renderSamples() {
        const container = document.getElementById('rfSampleList');
        container.innerHTML = '';
        
        this.currentData.dataset.samples.forEach(sample => {
            const style = this.getClassStyle(sample.true_label);
            const div = document.createElement('div');
            div.className = `sample-item ${this.selectedSampleId === sample.id ? 'active' : ''}`;
            div.onclick = () => {
                if (this.isAnimating) return;
                this.selectedSampleId = sample.id;
                this.resetVotes();
                this.renderSamples();
                this.renderInitialTrees();
                this.updateUI();
            };
            
            div.innerHTML = `
                <span class="sample-label">Sample #${sample.id + 1}</span>
                <span class="sample-class-pill ${style.bg}">${sample.true_label}</span>
            `;
            container.appendChild(div);
        });
    },

    renderInitialTrees() {
        const grid = document.getElementById('rfTreesGrid');
        grid.innerHTML = '';
        
        for (let i = 0; i < this.visibleTrees; i++) {
            const card = document.createElement('div');
            card.className = 'tree-card';
            card.id = `tree-card-${i}`;
            card.innerHTML = `
                <div class="tree-id">Tree #${i + 1}</div>
                <div class="tree-visual-mini" style="height:100%; display:flex; align-items:center; justify-content:center; opacity:0.1;">
                     <svg width="60" height="40" viewBox="0 0 60 40">
                         <circle cx="30" cy="10" r="4" fill="#cbd5e1"/>
                         <line x1="30" y1="10" x2="15" y2="30" stroke="#cbd5e1" stroke-width="2"/>
                         <line x1="30" y1="10" x2="45" y2="30" stroke="#cbd5e1" stroke-width="2"/>
                         <circle cx="15" cy="30" r="4" fill="#cbd5e1"/>
                         <circle cx="45" cy="30" r="4" fill="#cbd5e1"/>
                     </svg>
                </div>
            `;
            grid.appendChild(card);
        }
    },

    async startAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.currentPhase = 'animating';
        this.resetVotes();
        this.updateUI();
        
        const runBtn = document.getElementById('rfRunBtn');
        runBtn.disabled = true;
        runBtn.innerHTML = '<svg class="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Assembling Forest...';

        for (let i = 0; i < this.visibleTrees; i++) {
            await this.processTree(i);
            await new Promise(r => setTimeout(r, 400));
        }

        this.isAnimating = false;
        this.currentPhase = 'completed';
        this.updateUI();
        
        runBtn.disabled = false;
        runBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg> Re-run Simulation';
    },

    async processTree(treeIdx) {
        const tree = this.currentData.trees[treeIdx];
        const sample = this.currentData.dataset.samples.find(s => s.id === this.selectedSampleId);
        
        // Calculate prediction path logic
        const { prediction, path } = this.computeTreePrediction(tree, sample);
        
        // Update internal state
        this.votes[prediction]++;
        this.treePredictions[treeIdx] = { class: prediction, path };

        // Update UI Card
        const card = document.getElementById(`tree-card-${treeIdx}`);
        const style = this.getClassStyle(prediction);
        
        card.className = `tree-card active class-${prediction}`;
        card.onclick = () => this.openTreeModal(treeIdx);
        
        // Add prediction chip
        const chip = document.createElement('div');
        chip.style.cssText = `position:absolute; bottom:8px; right:8px; padding:2px 8px; border-radius:10px; font-size:10px; font-weight:800; color:white; background:${style.hex};`;
        chip.innerText = prediction.charAt(0);
        card.appendChild(chip);

        // Update Aggregation Bars
        this.updateAggregation();
    },

    computeTreePrediction(tree, sample) {
        let currentNodeId = 0;
        const path = [0];
        
        while (true) {
            const node = tree.decisionTree.find(n => n.id === currentNodeId);
            if (!node || node.is_leaf) {
                return { prediction: node.class, path };
            }
            
            const featureValue = sample.features[node.feature];
            if (featureValue <= node.threshold) {
                currentNodeId = node.left_child;
            } else {
                currentNodeId = node.right_child;
            }
            path.push(currentNodeId);
        }
    },

    updateAggregation() {
        const votesContainer = document.getElementById('rfVoteBars');
        votesContainer.innerHTML = '';
        
        const classes = this.currentData.forestMeta.classes;
        const totalVotes = Object.values(this.votes).reduce((a, b) => a + b, 0);

        classes.forEach(cls => {
            const count = this.votes[cls];
            const pct = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
            const style = this.getClassStyle(cls);
            
            const row = document.createElement('div');
            row.className = 'vote-row';
            row.innerHTML = `
                <div class="vote-class-label">${cls}</div>
                <div class="vote-bar-container">
                    <div class="vote-bar-fill" style="width:${pct}%; background-color:${style.hex};"></div>
                </div>
                <div class="vote-count">${count}</div>
            `;
            votesContainer.appendChild(row);
        });

        // Update Final Prediction
        const finalPredEl = document.getElementById('rfFinalPrediction');
        const statusEl = document.getElementById('rfPredictionStatus');
        
        if (totalVotes === 0) {
            finalPredEl.innerText = '-';
            statusEl.classList.remove('visible');
        } else {
            // Find majority
            let majorityClass = classes[0];
            classes.forEach(c => {
                if (this.votes[c] > this.votes[majorityClass]) majorityClass = c;
            });
            
            const style = this.getClassStyle(majorityClass);
            finalPredEl.innerText = majorityClass;
            finalPredEl.style.color = style.hex;
            
            // Check if correct
            const sample = this.currentData.dataset.samples.find(s => s.id === this.selectedSampleId);
            const isCorrect = majorityClass === sample.true_label;
            
            statusEl.className = `prediction-status visible ${isCorrect ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`;
            statusEl.innerHTML = isCorrect 
                ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> CORRECT MATCH'
                : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> INCORRECT MATCH';
        }
    },

    updateUI() {
        // Force update aggregation even if 0 votes
        this.updateAggregation();
    },

    // --- Modal Logic ---
    openTreeModal(treeIdx) {
        const modal = document.getElementById('rfModal');
        const prediction = this.treePredictions[treeIdx];
        if (!prediction) return;

        document.getElementById('modalTreeTitle').innerText = `Tree #${treeIdx + 1} Decision Logic`;
        document.getElementById('modalTreeSubtitle').innerText = `Sample resulted in "${prediction.class}" prediction`;
        
        this.renderFeaturePreview();
        this.renderLogicPath(treeIdx);
        this.renderVisualTree(treeIdx);
        
        modal.classList.add('active');
        this.switchModalTab('logic');
    },

    closeModal() {
        document.getElementById('rfModal').classList.remove('active');
    },

    switchModalTab(tabId) {
        document.querySelectorAll('.modal-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
        document.getElementById('logicView').style.display = tabId === 'logic' ? 'block' : 'none';
        document.getElementById('visualView').style.display = tabId === 'visual' ? 'block' : 'none';
    },

    renderFeaturePreview() {
        const container = document.getElementById('rfFeaturePreview');
        const sample = this.currentData.dataset.samples.find(s => s.id === this.selectedSampleId);
        container.innerHTML = '<h3>INPUT FEATURES</h3>';
        
        Object.entries(sample.features).forEach(([key, val]) => {
            if (typeof val === 'boolean') return; // Skip encoded flags
            const div = document.createElement('div');
            div.className = 'feature-item';
            div.innerHTML = `
                <div class="feature-name">${key.replace(/_/g, ' ')}</div>
                <div class="feature-value">${typeof val === 'number' ? val.toLocaleString() : val}</div>
            `;
            container.appendChild(div);
        });
    },

    renderLogicPath(treeIdx) {
        const container = document.getElementById('logicView');
        container.innerHTML = '';
        
        const tree = this.currentData.trees[treeIdx];
        const prediction = this.treePredictions[treeIdx];
        const sample = this.currentData.dataset.samples.find(s => s.id === this.selectedSampleId);

        prediction.path.forEach((nodeId, idx) => {
            const node = tree.decisionTree.find(n => n.id === nodeId);
            const div = document.createElement('div');
            div.className = `path-step ${node.is_leaf ? 'leaf' : ''}`;
            
            if (node.is_leaf) {
                const style = this.getClassStyle(node.class);
                div.innerHTML = `
                    <div class="step-badge">${idx + 1}</div>
                    <div style="font-weight:700; color:#64748b; font-size:0.65rem; text-transform:uppercase;">Result Reached</div>
                    <div style="font-size:1.5rem; font-weight:900; color:${style.hex};">
                        Predicted: ${node.class}
                    </div>
                `;
            } else {
                const featureVal = sample.features[node.feature];
                const isLeft = featureVal <= node.threshold;
                div.innerHTML = `
                    <div class="step-badge">${idx + 1}</div>
                    <div style="font-weight:700; color:#64748b; font-size:0.65rem; text-transform:uppercase;">Decision Node</div>
                    <div style="font-size:1.1rem; font-weight:600; color:#1e293b;">
                        Is ${node.feature.replace(/_/g, ' ')} (<b>${featureVal}</b>) ≤ ${node.threshold}?
                    </div>
                    <div style="margin-top:8px; display:flex; align-items:center; gap:8px; font-weight:700; color:${isLeft ? '#10b981' : '#3b82f6'};">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        ${isLeft ? 'YES (Going Left)' : 'NO (Going Right)'}
                    </div>
                `;
            }
            container.appendChild(div);
        });
    },

    renderVisualTree(treeIdx) {
        const container = document.getElementById('rfTreeVisual');
        container.innerHTML = '';
        
        const tree = this.currentData.trees[treeIdx];
        const prediction = this.treePredictions[treeIdx];
        
        // Simple SVG rendering for the visual tree
        // We'll use a fixed layout or simple tree positioning logic
        const nodes = tree.decisionTree;
        
        // Calculate bounds
        let minX = 0, maxX = 0, minY = 0, maxY = 0;
        nodes.forEach(n => {
            minX = Math.min(minX, n.x);
            maxX = Math.max(maxX, n.x);
            minY = Math.min(minY, n.y);
            maxY = Math.max(maxY, n.y);
        });

        const width = Math.max(800, maxX - minX + 200);
        const height = maxY - minY + 200;
        const offsetX = -minX + 100;
        const offsetY = 50;

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        svg.style.cursor = 'grab';

        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        svg.appendChild(g);

        // Draw Links
        nodes.forEach(node => {
            if (!node.is_leaf) {
                const leftChild = nodes.find(n => n.id === node.left_child);
                const rightChild = nodes.find(n => n.id === node.right_child);
                
                if (leftChild) this.drawLink(g, node, leftChild, offsetX, offsetY, prediction.path);
                if (rightChild) this.drawLink(g, node, rightChild, offsetX, offsetY, prediction.path);
            }
        });

        // Draw Nodes
        nodes.forEach(node => {
            this.drawNode(g, node, offsetX, offsetY, prediction.path);
        });

        container.appendChild(svg);
        
        // Add pan/zoom if needed (simplified)
        let isDragging = false;
        let startX, startY;
        let translateX = 0, translateY = 0;

        svg.onmousedown = (e) => {
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
        };
        window.onmousemove = (e) => {
            if (!isDragging) return;
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            g.setAttribute("transform", `translate(${translateX},${translateY})`);
        };
        window.onmouseup = () => isDragging = false;
    },

    drawLink(g, parent, child, ox, oy, path) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        const isActive = path.includes(parent.id) && path.includes(child.id);
        
        line.setAttribute("x1", parent.x + ox);
        line.setAttribute("y1", parent.y + oy);
        line.setAttribute("x2", child.x + ox);
        line.setAttribute("y2", child.y + oy);
        line.setAttribute("stroke", isActive ? "#3b82f6" : "#e2e8f0");
        line.setAttribute("stroke-width", isActive ? "4" : "2");
        if (isActive) line.setAttribute("stroke-linecap", "round");
        g.appendChild(line);
    },

    drawNode(g, node, ox, oy, path) {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        const isActive = path.includes(node.id);
        const style = node.is_leaf ? this.getClassStyle(node.class) : null;

        circle.setAttribute("cx", node.x + ox);
        circle.setAttribute("cy", node.y + oy);
        circle.setAttribute("r", node.is_leaf ? "10" : "6");
        circle.setAttribute("fill", node.is_leaf ? style.hex : (isActive ? "#3b82f6" : "white"));
        circle.setAttribute("stroke", isActive ? "#1e40af" : "#cbd5e1");
        circle.setAttribute("stroke-width", "2");
        
        g.appendChild(circle);
        
        if (node.is_leaf) {
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", node.x + ox);
            text.setAttribute("y", node.y + oy + 25);
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("font-size", "10px");
            text.setAttribute("font-weight", "800");
            text.setAttribute("fill", style.hex);
            text.textContent = node.class;
            g.appendChild(text);
        }
    }
};

window.RF_ANIMATOR = RF_ANIMATOR;
