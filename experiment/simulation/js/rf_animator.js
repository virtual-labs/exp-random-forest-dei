/**
 * RF ANIMATOR - Complete Vanilla JS Implementation
 * 1:1 Port from React ForestAnimator.tsx
 */

const RF_ANIMATOR = {
    // ==========================================
    // CONFIGURATION
    // ==========================================
    CONFIG: {
        VISIBLE_TREES: 12,
        TREE_STAGGER_DELAY: 80,
        SAMPLE_DISPATCH_DURATION: 500,
        TRAVERSAL_STEP_DURATION: 250,
        CHIP_EMERGE_DELAY: 300,
        MINI_TREE_WIDTH: 110,
        MINI_TREE_HEIGHT: 90,
        NODE_RADIUS: 6
    },

    // ==========================================
    // STATE
    // ==========================================
    state: {
        currentMode: null,
        currentData: null,
        selectedSampleIndex: null,
        phase: 'waiting',
        votes: {},
        treePredictions: new Map(),
        activeTreePaths: new Map(),
        finalResult: null,
        showSample: false,
        showChips: false,
        isAnimating: false,
        selectedTreeForDetail: null,
        modalTab: 'prediction',
        treeAnimationPath: [],
        treeAnimationStep: 0,
        animationId: 0,
        treeAnimId: 0,
        viewState: { x: 0, y: 0, scale: 1 },
        isDragging: false,
        dragStart: { x: 0, y: 0 },
        activeNodePopup: null // Node ID for popup display
    },

    // ==========================================
    // COLOR HELPERS
    // ==========================================
    CLASS_COLORS: {
        'Approved': { stroke: '#10b981', hex: '#10b981' },
        'Rejected': { stroke: '#f43f5e', hex: '#f43f5e' },
        'Kama': { stroke: '#3b82f6', hex: '#3b82f6' },
        'Rosa': { stroke: '#f59e0b', hex: '#f59e0b' },
        'Canadian': { stroke: '#6366f1', hex: '#6366f1' }
    },

    getClassStyle(className) {
        return this.CLASS_COLORS[className] || { stroke: '#64748b', hex: '#64748b' };
    },

    // ==========================================
    // ENTRY POINTS
    // ==========================================
    open(mode) {
        console.log('[RF_ANIMATOR] Opening:', mode);
        this.state.currentMode = mode;
        this.state.currentData = (mode === 'binary') ? RF_DATA_BINARY : RF_DATA_MULTICLASS;
        
        // Hide training section, show animator
        document.getElementById('trainingSection').style.display = 'none';
        const container = document.getElementById('rfAnimatorContainer');
        container.classList.add('active');
        
        // Update header
        document.getElementById('rfHeaderTitle').textContent = mode === 'binary' 
            ? 'Random Forest: Binary Classification' 
            : 'Random Forest: Multi-Class Classification';
        document.getElementById('rfHeaderSubtitle').textContent = mode === 'binary'
            ? 'BINARY MODE'
            : 'MULTICLASS MODE';
        document.getElementById('rfTreeCount').textContent = this.state.currentData.forestMeta.nTrees + ' Trees';
        document.getElementById('rfSampleCount').textContent = this.state.currentData.dataset.samples.length + ' Samples';
        
        this.init();
    },

    close() {
        document.getElementById('rfAnimatorContainer').classList.remove('active');
        document.getElementById('trainingSection').style.display = 'block';
    },

    init() {
        // Reset state
        this.state.selectedSampleIndex = null;
        this.state.phase = 'waiting';
        this.resetVotes();
        this.state.treePredictions = new Map();
        this.state.activeTreePaths = new Map();
        this.state.finalResult = null;
        this.state.showSample = false;
        this.state.showChips = false;
        this.state.isAnimating = false;
        this.state.selectedTreeForDetail = null;

        // Render UI
        this.renderSamples();
        this.renderInitialTrees();
        this.renderAggregationBars();
        this.updateRunButton();

        // Attach listeners
        document.getElementById('rfBackBtn').onclick = () => this.close();
        document.getElementById('rfRunBtn').onclick = () => this.handleRunClick();
        document.getElementById('rfModalCloseBtn').onclick = () => this.closeModal();
        
        // Modal tabs
        document.querySelectorAll('.rf-modal-tab').forEach(tab => {
            tab.onclick = () => this.switchModalTab(tab.dataset.tab);
        });
    },

    resetVotes() {
        this.state.votes = {};
        if (this.state.currentData) {
            this.state.currentData.forestMeta.classes.forEach(c => this.state.votes[c] = 0);
        }
    },

    // ==========================================
    // SAMPLE RENDERING
    // ==========================================
    renderSamples() {
        const container = document.getElementById('rfSampleList');
        container.innerHTML = '';

        this.state.currentData.dataset.samples.forEach((sample, index) => {
            const style = this.getClassStyle(sample.true_label);
            const isActive = this.state.selectedSampleIndex === index;
            
            const btn = document.createElement('button');
            btn.className = `rf-sample-btn ${isActive ? 'active' : ''} ${this.state.isAnimating ? 'disabled' : ''}`;
            btn.onclick = () => this.handleSampleSelect(index);
            
            btn.innerHTML = `
                <span class="rf-sample-label">Sample #${sample.id + 1}</span>
                <span class="rf-sample-class-pill class-${sample.true_label}" 
                      style="${isActive ? 'background:rgba(255,255,255,0.2);color:white;' : `background:${style.hex}20;color:${style.hex};`}">
                    ${sample.true_label}
                </span>
            `;
            container.appendChild(btn);
        });

        // Update features panel
        this.renderFeaturesPanel();
    },

    renderFeaturesPanel() {
        const panel = document.getElementById('rfFeaturesPanel');
        const sample = this.getCurrentSample();
        
        if (!sample || !this.state.showSample) {
            panel.style.display = 'none';
            return;
        }
        
        panel.style.display = 'block';
        const grid = document.getElementById('rfFeaturesGrid');
        grid.innerHTML = '';
        
        this.state.currentData.dataset.features.forEach(feature => {
            const value = sample.features[feature];
            if (typeof value === 'boolean') return;
            
            const row = document.createElement('div');
            row.className = 'rf-feature-row';
            row.innerHTML = `
                <span class="rf-feature-name">${feature}</span>
                <span class="rf-feature-value">${typeof value === 'number' ? value.toLocaleString() : value}</span>
            `;
            grid.appendChild(row);
        });
    },

    getCurrentSample() {
        if (this.state.selectedSampleIndex === null || !this.state.currentData) return null;
        return this.state.currentData.dataset.samples[this.state.selectedSampleIndex];
    },

    handleSampleSelect(index) {
        if (this.state.isAnimating) return;
        
        this.state.animationId++;
        this.state.selectedSampleIndex = index;
        this.state.phase = 'waiting';
        this.resetVotes();
        this.state.treePredictions = new Map();
        this.state.activeTreePaths = new Map();
        this.state.finalResult = null;
        this.state.showSample = false;
        this.state.showChips = false;
        
        this.renderSamples();
        this.renderInitialTrees();
        this.renderAggregationBars();
        this.updateRunButton();
    },

    // ==========================================
    // TREE GRID RENDERING
    // ==========================================
    renderInitialTrees() {
        const grid = document.getElementById('rfTreeGrid');
        grid.innerHTML = '';
        
        const trees = this.state.currentData.trees.slice(0, this.CONFIG.VISIBLE_TREES);
        
        trees.forEach((tree, i) => {
            const card = document.createElement('div');
            card.className = 'rf-tree-card';
            card.id = `rf-tree-card-${i}`;
            card.onclick = () => this.openTreeModal(i);
            
            card.innerHTML = `
                <div class="rf-tree-id">T${i + 1}</div>
                <div class="rf-tree-svg-container" id="rf-tree-svg-${i}">
                    ${this.renderMiniTreeSVG(tree, i)}
                </div>
                <div class="rf-tree-prediction-chip" id="rf-tree-chip-${i}"></div>
                ${this.state.selectedSampleIndex === null ? '<div class="rf-tree-card-empty">Select a Sample</div>' : ''}
            `;
            grid.appendChild(card);
        });
        
        document.getElementById('rfGridInfo').textContent = 
            `Showing ${this.CONFIG.VISIBLE_TREES} of ${this.state.currentData.forestMeta.nTrees} trees · Click any tree for details`;
    },

    renderMiniTreeSVG(tree, treeIndex) {
        const nodes = tree.decisionTree;
        const activePath = this.state.activeTreePaths.get(tree.treeId) || [];
        
        // Calculate bounds
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        nodes.forEach(n => {
            minX = Math.min(minX, n.x);
            maxX = Math.max(maxX, n.x);
            minY = Math.min(minY, n.y);
            maxY = Math.max(maxY, n.y);
        });
        
        const realWidth = maxX - minX || 100;
        const realHeight = maxY - minY || 100;
        const padding = 15;
        const viewBox = `${minX - padding} ${minY - padding} ${realWidth + padding * 2} ${realHeight + padding * 2}`;
        
        let edgesHTML = '';
        let nodesHTML = '';
        
        // Render edges
        nodes.forEach(node => {
            if (node.is_leaf) return;
            const left = nodes.find(n => n.id === node.left_child);
            const right = nodes.find(n => n.id === node.right_child);
            
            if (left) {
                const isActive = activePath.includes(node.id) && activePath.includes(left.id);
                edgesHTML += `<line x1="${node.x}" y1="${node.y}" x2="${left.x}" y2="${left.y}" 
                    class="rf-tree-edge ${isActive ? 'active' : ''}" />`;
            }
            if (right) {
                const isActive = activePath.includes(node.id) && activePath.includes(right.id);
                edgesHTML += `<line x1="${node.x}" y1="${node.y}" x2="${right.x}" y2="${right.y}" 
                    class="rf-tree-edge ${isActive ? 'active' : ''}" />`;
            }
        });
        
        // Render nodes
        nodes.forEach(node => {
            const isActive = activePath.includes(node.id);
            const isLeaf = node.is_leaf;
            const style = isLeaf ? this.getClassStyle(node.class) : null;
            
            nodesHTML += `<circle cx="${node.x}" cy="${node.y}" 
                r="${isLeaf ? 8 : 5}" 
                fill="${isLeaf ? style.hex : (isActive ? '#3b82f6' : '#f8fafc')}"
                stroke="${isLeaf ? style.hex : (isActive ? '#1e40af' : '#94a3b8')}"
                stroke-width="${isActive ? 2 : 1}"
                class="rf-tree-node-circle ${isActive ? 'active' : ''}" />`;
        });
        
        return `<svg viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet">${edgesHTML}${nodesHTML}</svg>`;
    },

    updateMiniTree(treeIndex, path) {
        const tree = this.state.currentData.trees[treeIndex];
        const svgContainer = document.getElementById(`rf-tree-svg-${treeIndex}`);
        if (svgContainer) {
            svgContainer.innerHTML = this.renderMiniTreeSVG(tree, treeIndex);
        }
    },

    showTreePrediction(treeIndex, prediction) {
        const card = document.getElementById(`rf-tree-card-${treeIndex}`);
        const chip = document.getElementById(`rf-tree-chip-${treeIndex}`);
        
        if (card) {
            card.classList.add('predicted', `class-${prediction}`);
        }
        if (chip) {
            chip.className = `rf-tree-prediction-chip visible class-${prediction}`;
            chip.textContent = prediction.charAt(0);
        }
    },

    // ==========================================
    // AGGREGATION PANEL
    // ==========================================
    renderAggregationBars() {
        const container = document.getElementById('rfVoteBars');
        container.innerHTML = '';
        
        const classes = this.state.currentData.forestMeta.classes;
        const totalVotes = Object.values(this.state.votes).reduce((a, b) => a + b, 0);
        
        classes.forEach(cls => {
            const count = this.state.votes[cls] || 0;
            const pct = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
            
            const row = document.createElement('div');
            row.className = 'rf-vote-row';
            row.innerHTML = `
                <div class="rf-vote-label">${cls}</div>
                <div class="rf-vote-bar-container">
                    <div class="rf-vote-bar-fill class-${cls}" style="width:${pct}%"></div>
                </div>
                <div class="rf-vote-count">${count}</div>
            `;
            container.appendChild(row);
        });
        
        this.updateFinalPrediction();
    },

    updateFinalPrediction() {
        const valueEl = document.getElementById('rfFinalValue');
        const statusEl = document.getElementById('rfFinalStatus');
        const result = this.state.finalResult;
        
        if (!result) {
            valueEl.textContent = '-';
            valueEl.className = 'rf-final-value';
            statusEl.className = 'rf-final-status';
            return;
        }
        
        valueEl.textContent = result.prediction;
        valueEl.className = `rf-final-value class-${result.prediction}`;
        
        const sample = this.getCurrentSample();
        const isCorrect = sample && result.prediction === sample.true_label;
        
        statusEl.className = `rf-final-status visible ${isCorrect ? 'correct' : 'incorrect'}`;
        statusEl.innerHTML = isCorrect 
            ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> CORRECT MATCH`
            : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> INCORRECT`;
    },

    // ==========================================
    // RUN BUTTON
    // ==========================================
    updateRunButton() {
        const btn = document.getElementById('rfRunBtn');
        
        if (this.state.selectedSampleIndex === null) {
            btn.disabled = true;
            btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"/></svg> Select a Sample`;
            return;
        }
        
        if (this.state.isAnimating && this.state.phase !== 'result') {
            btn.disabled = true;
            btn.innerHTML = `<svg class="rf-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"/><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75"/></svg> Running...`;
            return;
        }
        
        if (this.state.phase === 'result') {
            btn.disabled = false;
            btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg> Run Again`;
            return;
        }
        
        btn.disabled = false;
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"/></svg> Run Prediction`;
    },

    handleRunClick() {
        if (this.state.phase === 'result') {
            this.handleRestart();
        } else {
            this.runAnimation();
        }
    },

    handleRestart() {
        this.state.animationId++;
        this.state.phase = 'waiting';
        this.resetVotes();
        this.state.treePredictions = new Map();
        this.state.activeTreePaths = new Map();
        this.state.finalResult = null;
        this.state.showSample = false;
        this.state.showChips = false;
        this.state.isAnimating = false;
        
        this.renderInitialTrees();
        this.renderAggregationBars();
        this.updateRunButton();
        
        setTimeout(() => this.runAnimation(), 100);
    },

    // ==========================================
    // ANIMATION LOGIC
    // ==========================================
    async runAnimation() {
        const sample = this.getCurrentSample();
        if (!sample || this.state.isAnimating) return;
        
        this.state.isAnimating = true;
        const animationId = ++this.state.animationId;
        
        const wait = ms => new Promise(r => setTimeout(r, ms));
        const isCancelled = () => this.state.animationId !== animationId;
        
        // Reset
        this.state.phase = 'waiting';
        this.resetVotes();
        this.state.treePredictions = new Map();
        this.state.activeTreePaths = new Map();
        this.state.finalResult = null;
        this.state.showSample = false;
        this.state.showChips = false;
        
        this.renderInitialTrees();
        this.renderAggregationBars();
        this.updateRunButton();
        
        await wait(300);
        if (isCancelled()) return;
        
        // Inject sample
        this.state.phase = 'injecting';
        this.state.showSample = true;
        this.renderFeaturesPanel();
        this.updateRunButton();
        
        await wait(800);
        if (isCancelled()) return;
        
        // Dispatch
        this.state.phase = 'dispatching';
        await wait(this.CONFIG.SAMPLE_DISPATCH_DURATION);
        if (isCancelled()) return;
        
        // Traversal
        this.state.phase = 'traversing';
        this.updateRunButton();
        
        const visibleTrees = this.state.currentData.trees.slice(0, this.CONFIG.VISIBLE_TREES);
        
        const traversalPromises = visibleTrees.map(async (tree, treeIndex) => {
            await wait(treeIndex * this.CONFIG.TREE_STAGGER_DELAY);
            if (isCancelled()) return;
            
            const path = this.computePath(tree.decisionTree, sample);
            
            for (let i = 0; i < path.length; i++) {
                if (isCancelled()) return;
                
                this.state.activeTreePaths.set(tree.treeId, path.slice(0, i + 1));
                this.updateMiniTree(treeIndex, path.slice(0, i + 1));
                
                await wait(this.CONFIG.TRAVERSAL_STEP_DURATION);
            }
            
            const prediction = this.getTreePrediction(tree, sample.id);
            this.state.treePredictions.set(tree.treeId, prediction);
            this.showTreePrediction(treeIndex, prediction);
        });
        
        await Promise.all(traversalPromises);
        if (isCancelled()) return;
        
        // Show chips
        this.state.showChips = true;
        await wait(this.CONFIG.CHIP_EMERGE_DELAY);
        if (isCancelled()) return;
        
        // Aggregation
        this.state.phase = 'aggregating';
        
        const visibleCounts = {};
        this.state.currentData.forestMeta.classes.forEach(c => visibleCounts[c] = 0);
        
        for (let i = 0; i < visibleTrees.length; i++) {
            if (isCancelled()) return;
            
            const tree = visibleTrees[i];
            const prediction = this.getTreePrediction(tree, sample.id);
            
            if (prediction !== 'Unknown' && visibleCounts[prediction] !== undefined) {
                visibleCounts[prediction]++;
            }
            
            this.state.votes = { ...visibleCounts };
            this.renderAggregationBars();
            
            await wait(50);
        }
        
        await wait(300);
        if (isCancelled()) return;
        
        // Full aggregation
        const fullResult = this.calculateFullAggregation(sample.id);
        
        const steps = 20;
        for (let i = 1; i <= steps; i++) {
            if (isCancelled()) return;
            const progress = i / steps;
            
            const interpolatedVotes = {};
            this.state.currentData.forestMeta.classes.forEach(c => {
                const start = visibleCounts[c] || 0;
                const end = fullResult.counts[c] || 0;
                interpolatedVotes[c] = Math.round(start + (end - start) * progress);
            });
            
            this.state.votes = interpolatedVotes;
            this.renderAggregationBars();
            
            await wait(30);
        }
        
        // Result
        this.state.phase = 'result';
        this.state.finalResult = fullResult;
        this.state.isAnimating = false;
        
        this.renderAggregationBars();
        this.updateRunButton();
    },

    computePath(treeNodes, sample) {
        const path = [];
        let currentId = 0;
        let steps = 0;
        
        while (steps < 20) {
            const node = treeNodes.find(n => n.id === currentId);
            if (!node) break;
            path.push(node.id);
            
            if (node.is_leaf) break;
            
            const featureName = node.feature;
            if (featureName && sample.features[featureName] !== undefined) {
                if (sample.features[featureName] <= (node.threshold || 0)) {
                    currentId = node.left_child;
                } else {
                    currentId = node.right_child;
                }
            } else {
                break;
            }
            steps++;
        }
        return path;
    },

    getTreePrediction(tree, sampleId) {
        const pred = tree.predictions[String(sampleId)];
        return pred?.class || 'Unknown';
    },

    calculateFullAggregation(sampleId) {
        const counts = {};
        this.state.currentData.forestMeta.classes.forEach(c => counts[c] = 0);
        
        this.state.currentData.trees.forEach(tree => {
            const pred = tree.predictions[String(sampleId)];
            if (pred?.class && counts[pred.class] !== undefined) {
                counts[pred.class]++;
            }
        });
        
        let bestClass = this.state.currentData.forestMeta.classes[0];
        let maxVotes = -1;
        this.state.currentData.forestMeta.classes.forEach(c => {
            if (counts[c] > maxVotes) {
                maxVotes = counts[c];
                bestClass = c;
            }
        });
        
        return { counts, prediction: bestClass };
    },

    // ==========================================
    // MODAL LOGIC
    // ==========================================
    openTreeModal(treeIndex) {
        const tree = this.state.currentData.trees[treeIndex];
        const sample = this.getCurrentSample();
        if (!tree || !sample) return;
        
        this.state.selectedTreeForDetail = tree;
        this.state.modalTab = 'prediction';
        this.state.treeAnimationPath = [];
        this.state.treeAnimationStep = 0;
        
        // Update modal header
        document.getElementById('rfModalTreeNum').textContent = `Tree #${treeIndex + 1}`;
        
        // Render content
        this.renderPredictionPath();
        this.switchModalTab('prediction');
        
        // Show modal
        document.getElementById('rfModalOverlay').classList.add('active');
    },

    closeModal() {
        document.getElementById('rfModalOverlay').classList.remove('active');
        this.state.selectedTreeForDetail = null;
        this.state.treeAnimId++;
    },

    switchModalTab(tabName) {
        this.state.modalTab = tabName;
        
        document.querySelectorAll('.rf-modal-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tabName);
        });
        
        document.getElementById('rfPathView').style.display = tabName === 'prediction' ? 'block' : 'none';
        const visualView = document.getElementById('rfVisualTreeView');
        
        if (tabName === 'visual') {
            visualView.classList.add('active');
            this.state.viewState = { x: 0, y: 0, scale: 1 };
            this.renderVisualTree();
            this.startTreeAnimation();
        } else {
            visualView.classList.remove('active');
            this.state.treeAnimId++;
        }
    },

    renderPredictionPath() {
        const tree = this.state.selectedTreeForDetail;
        const sample = this.getCurrentSample();
        if (!tree || !sample) return;
        
        const features = this.state.currentData.dataset.features;
        const path = this.computePath(tree.decisionTree, sample);
        
        // Render features grid
        const featuresGrid = document.getElementById('rfPathFeaturesGrid');
        featuresGrid.innerHTML = '';
        
        features.forEach(feature => {
            const value = sample.features[feature];
            if (typeof value === 'boolean') return;
            
            const item = document.createElement('div');
            item.className = 'rf-path-feature-item';
            item.innerHTML = `
                <div class="rf-path-feature-name">${feature}</div>
                <div class="rf-path-feature-value">${typeof value === 'number' ? value.toLocaleString() : value}</div>
            `;
            featuresGrid.appendChild(item);
        });
        
        // Render decision steps
        const stepsContainer = document.getElementById('rfPathSteps');
        stepsContainer.innerHTML = '';
        
        path.forEach((nodeId, index) => {
            const node = tree.decisionTree.find(n => n.id === nodeId);
            if (!node) return;
            
            const isLeaf = node.is_leaf;
            const className = isLeaf ? node.class : '';
            const featureValue = node.feature ? sample.features[node.feature] : null;
            const goesLeft = featureValue !== null && node.threshold !== undefined && featureValue <= node.threshold;
            
            const step = document.createElement('div');
            step.className = 'rf-path-step';
            
            step.innerHTML = `
                <div class="rf-path-step-badge ${isLeaf ? `leaf-${className}` : 'decision'}">${index + 1}</div>
                <div class="rf-path-step-content ${isLeaf ? 'leaf' : ''}">
                    ${isLeaf ? `
                        <div class="rf-path-step-type">Result Reached</div>
                        <div class="rf-path-step-leaf-result">
                            <div class="rf-path-step-leaf-icon class-${className}">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <div>
                                <div class="rf-path-step-leaf-class class-${className}">${className}</div>
                                <div class="rf-path-step-leaf-meta">Leaf Node · ${node.samples} samples · ${node.impurity.toFixed(3)} impurity</div>
                            </div>
                        </div>
                    ` : `
                        <div class="rf-path-step-type">Decision Node</div>
                        <div class="rf-path-step-condition">
                            Is <b>${node.feature}</b> ≤ ${node.threshold?.toFixed(2)}?
                        </div>
                        <div style="display:flex;gap:10px;font-size:0.75rem;">
                            <div style="background:#f1f5f9;padding:4px 8px;border-radius:6px;color:#475569;">
                                Value: <b>${typeof featureValue === 'number' ? featureValue.toFixed(2) : featureValue}</b>
                            </div>
                            <div class="rf-path-step-result ${goesLeft ? 'left' : 'right'}">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                ${goesLeft ? 'Yes → Goes Left' : 'No → Goes Right'}
                            </div>
                        </div>
                    `}
                </div>
            `;
            stepsContainer.appendChild(step);
        });
    },

    renderVisualTree() {
        const tree = this.state.selectedTreeForDetail;
        const sample = this.getCurrentSample();
        if (!tree || !sample) return;
        
        const canvas = document.getElementById('rfTreeCanvas');
        const fullPath = this.computePath(tree.decisionTree, sample);
        const nodes = tree.decisionTree;
        
        // Calculate bounds
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        nodes.forEach(n => {
            minX = Math.min(minX, n.x);
            maxX = Math.max(maxX, n.x);
            minY = Math.min(minY, n.y);
            maxY = Math.max(maxY, n.y);
        });
        
        const padding = 150;
        const width = maxX - minX + padding * 2;
        const height = maxY - minY + padding * 2;
        const offsetX = -minX + padding;
        const offsetY = -minY + padding;
        
        // Build SVG
        let edgesHTML = '';
        let pathEdgesHTML = '';
        let nodesHTML = '';
        
        // All edges (faded)
        nodes.forEach(node => {
            if (node.is_leaf) return;
            const left = nodes.find(n => n.id === node.left_child);
            const right = nodes.find(n => n.id === node.right_child);
            const x1 = node.x + offsetX, y1 = node.y + offsetY;
            
            if (left) {
                const x2 = left.x + offsetX, y2 = left.y + offsetY;
                edgesHTML += `<path d="M${x1},${y1} C${x1},${y1 + 40} ${x2},${y2 - 40} ${x2},${y2}" 
                    stroke="#cbd5e1" stroke-width="2" fill="none" opacity="0.4"/>`;
            }
            if (right) {
                const x2 = right.x + offsetX, y2 = right.y + offsetY;
                edgesHTML += `<path d="M${x1},${y1} C${x1},${y1 + 40} ${x2},${y2 - 40} ${x2},${y2}" 
                    stroke="#cbd5e1" stroke-width="2" fill="none" opacity="0.4"/>`;
            }
        });
        
        // Active path edges (will animate) - stop at the edge of the final node
        let pathD = '';
        if (fullPath.length > 0) {
            const first = nodes.find(n => n.id === fullPath[0]);
            if (first) {
                pathD += `M${first.x + offsetX},${first.y + offsetY}`;
                for (let i = 0; i < fullPath.length - 1; i++) {
                    const n1 = nodes.find(n => n.id === fullPath[i]);
                    const n2 = nodes.find(n => n.id === fullPath[i + 1]);
                    if (n1 && n2) {
                        const x1 = n1.x + offsetX, y1 = n1.y + offsetY;
                        let x2 = n2.x + offsetX, y2 = n2.y + offsetY;
                        
                        // If this is the last segment, stop at the edge of the target node
                        if (i === fullPath.length - 2) {
                            const nodeRadius = n2.is_leaf ? 20 : 16;
                            // Calculate the direction and stop at the circle edge
                            const dx = x2 - x1;
                            const dy = y2 - y1;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            if (dist > 0) {
                                // Stop at the edge of the circle (subtract radius from endpoint)
                                x2 = x2 - (dx / dist) * nodeRadius;
                                y2 = y2 - (dy / dist) * nodeRadius;
                            }
                        }
                        
                        pathD += ` C${x1},${y1 + 40} ${x2},${y2 - 40} ${x2},${y2}`;
                    }
                }
            }
        }
        
        pathEdgesHTML = `<path id="rfAnimatedPath" d="${pathD}" stroke="#3b82f6" stroke-width="4" fill="none" 
            stroke-linecap="round" style="filter:drop-shadow(0 0 4px rgba(59,130,246,0.5))"/>`;
        
        // Nodes - now clickable with popup
        nodes.forEach(node => {
            const x = node.x + offsetX;
            const y = node.y + offsetY;
            const isLeaf = node.is_leaf;
            const style = isLeaf ? this.getClassStyle(node.class) : null;
            const isActive = fullPath.includes(node.id);
            
            nodesHTML += `<g class="rf-visual-node" data-node-id="${node.id}" style="cursor:pointer;">
                <circle cx="${x}" cy="${y}" r="${isLeaf ? 20 : 16}" 
                    fill="${isLeaf ? style.hex + '20' : '#f8fafc'}" 
                    stroke="${isLeaf ? style.hex : (isActive ? '#3b82f6' : '#94a3b8')}" 
                    stroke-width="${isActive ? 3 : 2}"
                    class="rf-node-circle"/>
                ${isLeaf 
                    ? `<text x="${x}" y="${y + 5}" text-anchor="middle" font-size="12" font-weight="700" fill="${style.hex}">${node.id}</text>`
                    : `<text x="${x}" y="${y + 5}" text-anchor="middle" font-size="12" font-weight="600" fill="#475569">${node.id}</text>`
                }
            </g>`;
        });
        
        canvas.innerHTML = `
            <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow:visible;">
                <defs>
                    <filter id="glow"><feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                </defs>
                ${edgesHTML}
                ${pathEdgesHTML}
                ${nodesHTML}
            </svg>
        `;
        
        // Setup pan controls
        this.setupTreePanZoom();
    },

    startTreeAnimation() {
        const tree = this.state.selectedTreeForDetail;
        const sample = this.getCurrentSample();
        if (!tree || !sample) return;
        
        const animId = ++this.state.treeAnimId;
        const path = this.computePath(tree.decisionTree, sample);
        const pathEl = document.getElementById('rfAnimatedPath');
        if (!pathEl) return;
        
        const pathLength = pathEl.getTotalLength();
        pathEl.style.strokeDasharray = pathLength;
        pathEl.style.strokeDashoffset = pathLength;
        
        let step = 0;
        const animate = () => {
            if (this.state.treeAnimId !== animId) return;
            if (step > path.length) return;
            
            const progress = step / path.length;
            pathEl.style.strokeDashoffset = pathLength * (1 - progress);
            step++;
            
            setTimeout(animate, 400);
        };
        
        setTimeout(animate, 300);
    },

    setupTreePanZoom() {
        const canvas = document.getElementById('rfTreeCanvas');
        const view = document.getElementById('rfVisualTreeView');
        if (!canvas || !view) return;
        
        const update = () => {
            canvas.style.transform = `translate(${this.state.viewState.x}px, ${this.state.viewState.y}px) scale(${this.state.viewState.scale})`;
        };
        
        // Add existing popup container or create new one
        let popupContainer = document.getElementById('rfNodePopup');
        if (!popupContainer) {
            popupContainer = document.createElement('div');
            popupContainer.id = 'rfNodePopup';
            popupContainer.className = 'rf-node-popup';
            view.appendChild(popupContainer);
        }
        
        // Node click handler
        const handleNodeClick = (e) => {
            const nodeEl = e.target.closest('.rf-visual-node');
            if (!nodeEl) {
                // Clicked outside a node - hide popup
                this.state.activeNodePopup = null;
                popupContainer.style.display = 'none';
                return;
            }
            
            e.stopPropagation();
            const nodeId = parseInt(nodeEl.dataset.nodeId);
            
            if (this.state.activeNodePopup === nodeId) {
                // Toggle off
                this.state.activeNodePopup = null;
                popupContainer.style.display = 'none';
                return;
            }
            
            this.state.activeNodePopup = nodeId;
            this.showNodePopup(nodeId, e, popupContainer);
        };
        
        canvas.onclick = handleNodeClick;
        
        let dragStartPos = null;
        
        view.onmousedown = e => {
            if (e.target.closest('.rf-visual-node')) return; // Don't drag when clicking node
            dragStartPos = { x: e.clientX, y: e.clientY };
            this.state.isDragging = false; // Will become true on move
            this.state.dragStart = { x: e.clientX - this.state.viewState.x, y: e.clientY - this.state.viewState.y };
            canvas.style.transition = 'none';
        };
        
        view.onmousemove = e => {
            if (dragStartPos === null) return;
            
            const dx = Math.abs(e.clientX - dragStartPos.x);
            const dy = Math.abs(e.clientY - dragStartPos.y);
            
            if (dx > 5 || dy > 5) {
                this.state.isDragging = true;
            }
            
            if (this.state.isDragging) {
                this.state.viewState.x = e.clientX - this.state.dragStart.x;
                this.state.viewState.y = e.clientY - this.state.dragStart.y;
                update();
                
                // Hide popup while dragging
                popupContainer.style.display = 'none';
            }
        };
        
        view.onmouseup = () => {
            dragStartPos = null;
            this.state.isDragging = false;
            canvas.style.transition = 'transform 0.1s ease-out';
        };
        view.onmouseleave = view.onmouseup;
        
        view.onwheel = e => {
            e.preventDefault();
            const delta = -e.deltaY * 0.001;
            this.state.viewState.scale = Math.min(Math.max(0.2, this.state.viewState.scale + delta), 4);
            update();
            
            // Hide popup on zoom
            popupContainer.style.display = 'none';
            this.state.activeNodePopup = null;
        };
        
        // Control buttons
        document.getElementById('rfZoomIn').onclick = () => {
            this.state.viewState.scale = Math.min(this.state.viewState.scale + 0.2, 4);
            update();
        };
        document.getElementById('rfZoomOut').onclick = () => {
            this.state.viewState.scale = Math.max(this.state.viewState.scale - 0.2, 0.2);
            update();
        };
    },

    showNodePopup(nodeId, event, popupContainer) {
        const tree = this.state.selectedTreeForDetail;
        if (!tree) return;
        
        const node = tree.decisionTree.find(n => n.id === nodeId);
        if (!node) return;
        
        const isLeaf = node.is_leaf;
        const style = isLeaf ? this.getClassStyle(node.class) : null;
        
        // Get the clicked element's position (the node circle)
        const clickedNode = event.target.closest('.rf-visual-node');
        if (!clickedNode) return;
        
        const nodeRect = clickedNode.getBoundingClientRect();
        const viewRect = document.getElementById('rfVisualTreeView').getBoundingClientRect();
        
        // Position popup centered below the node
        const popupWidth = 160;
        const x = nodeRect.left + nodeRect.width / 2 - viewRect.left - (popupWidth / 2);
        const y = nodeRect.bottom - viewRect.top + 12; // 12px gap below node
        
        popupContainer.style.display = 'block';
        popupContainer.style.left = `${x}px`;
        popupContainer.style.top = `${y}px`;
        popupContainer.style.width = `${popupWidth}px`;
        
        if (isLeaf) {
            popupContainer.innerHTML = `
                <div class="rf-popup-arrow"></div>
                <div class="rf-popup-content">
                    <div class="rf-popup-header">
                        <span class="rf-popup-node-id">Node ${node.id}</span>
                        <span class="rf-popup-samples">${node.samples} smp</span>
                    </div>
                    <div class="rf-popup-class" style="color:${style.hex};">${node.class}</div>
                    <div class="rf-popup-impurity">Impurity: ${node.impurity.toFixed(3)}</div>
                </div>
            `;
        } else {
            popupContainer.innerHTML = `
                <div class="rf-popup-arrow"></div>
                <div class="rf-popup-content">
                    <div class="rf-popup-header">
                        <span class="rf-popup-node-id">Node ${node.id}</span>
                        <span class="rf-popup-samples">${node.samples} smp</span>
                    </div>
                    <div class="rf-popup-feature">${node.feature}</div>
                    <div class="rf-popup-threshold">≤ ${node.threshold?.toFixed(2)}</div>
                    <div class="rf-popup-impurity">Impurity: ${node.impurity.toFixed(3)}</div>
                </div>
            `;
        }
    }

};

// Expose globally
window.RF_ANIMATOR = RF_ANIMATOR;
