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
        currentCriterion: null,
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
        activeNodePopup: null, // Node ID for popup display
        // New: pagination, speed, n_estimators
        currentPage: 0,
        speedMultiplier: 1,    // 0.5 = slow, 1 = normal, 2 = fast
        activeNEstimators: null // null = use all trees from data
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
    open(mode, criterion) {
        console.log('[RF_ANIMATOR] Opening:', mode, 'criterion:', criterion);
        this.state.currentMode = mode;
        this.state.currentData = (mode === 'binary') ? RF_DATA_BINARY : RF_DATA_MULTICLASS;
        this.state.currentCriterion = criterion || 'gini';
        this.state.activeNEstimators = this.state.currentData.forestMeta.nTrees;
        this.state.currentPage = 0;
        
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
        document.getElementById('rfTreeCount').textContent = this.state.activeNEstimators + ' Trees';
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
        this.state.currentPage = 0;

        // Render UI
        this.renderCriterionBadge();
        this.renderSamples();
        this.renderInitialTrees();
        this.renderAggregationBars();
        this.renderControls();
        this.renderGuidanceBanner();
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
    // HELPER: ACTIVE TREES (respects n_estimators)
    // ==========================================
    getActiveTrees() {
        const n = this.state.activeNEstimators || this.state.currentData.forestMeta.nTrees;
        return this.state.currentData.trees.slice(0, n);
    },

    getTotalPages() {
        return Math.ceil(this.getActiveTrees().length / this.CONFIG.VISIBLE_TREES);
    },

    getPageTrees() {
        const allActive = this.getActiveTrees();
        const start = this.state.currentPage * this.CONFIG.VISIBLE_TREES;
        return allActive.slice(start, start + this.CONFIG.VISIBLE_TREES);
    },

    getPageTreeGlobalOffset() {
        return this.state.currentPage * this.CONFIG.VISIBLE_TREES;
    },

    // Scaled timing helper (respects speed multiplier)
    scaledDelay(baseMs) {
        return baseMs / this.state.speedMultiplier;
    },

    // ==========================================
    // REJECTED EDGES: Compute unchosen branches
    // ==========================================
    computeRejectedEdges(treeNodes, activePath) {
        const rejected = [];
        if (!activePath || activePath.length < 2) return rejected;
        for (let i = 0; i < activePath.length - 1; i++) {
            const node = treeNodes.find(n => n.id === activePath[i]);
            if (!node || node.is_leaf) continue;
            const nextInPath = activePath[i + 1];
            if (node.left_child === nextInPath && node.right_child !== undefined) {
                rejected.push({ parent: node.id, child: node.right_child });
            } else if (node.right_child === nextInPath && node.left_child !== undefined) {
                rejected.push({ parent: node.id, child: node.left_child });
            }
        }
        return rejected;
    },

    // ==========================================
    // GUIDANCE BANNER: Step-by-step instructions
    // ==========================================
    renderGuidanceBanner() {
        let banner = document.getElementById('rfGuidanceBanner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'rfGuidanceBanner';
            const mainContent = document.querySelector('.rf-main-content');
            const controlsBar = document.getElementById('rfControlsBar');
            if (controlsBar) {
                mainContent.insertBefore(banner, controlsBar);
            } else {
                const gridInfo = document.getElementById('rfGridInfo');
                mainContent.insertBefore(banner, gridInfo);
            }
        }

        let icon, title, detail, phaseClass;
        const hasSample = this.state.selectedSampleIndex !== null;

        if (this.state.phase === 'result') {
            icon = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>';
            title = 'Prediction Complete!';
            detail = 'Click any tree card to explore its decision path in detail, or select another sample.';
            phaseClass = 'phase-done';
            // Pulse the tree grid
            this.togglePulseHint('rfTreeGrid', true);
            this.togglePulseHint('rfRunBtn', false);
        } else if (this.state.isAnimating) {
            icon = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
            title = 'Running Prediction...';
            detail = 'Watch as the sample traverses each decision tree. Blue = chosen path, Red = rejected branch.';
            phaseClass = 'phase-running';
            this.togglePulseHint('rfTreeGrid', false);
            this.togglePulseHint('rfRunBtn', false);
        } else if (hasSample) {
            icon = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
            title = 'Sample Selected — Ready to Run';
            detail = 'Click "Run Prediction" to start the forest animation.';
            phaseClass = 'phase-ready';
            this.togglePulseHint('rfRunBtn', true);
            this.togglePulseHint('rfTreeGrid', false);
        } else {
            icon = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';
            title = 'Step 1: Select a Sample';
            detail = 'Choose a test sample from the sidebar to begin the prediction.';
            phaseClass = 'phase-waiting';
            this.togglePulseHint('rfRunBtn', false);
            this.togglePulseHint('rfTreeGrid', false);
        }

        banner.className = `rf-guidance-banner ${phaseClass}`;
        banner.innerHTML = `
            <div class="rf-guidance-icon">${icon}</div>
            <div class="rf-guidance-text">
                <strong>${title}</strong>
                <span>${detail}</span>
            </div>
        `;
    },

    togglePulseHint(elementId, shouldPulse) {
        const el = document.getElementById(elementId);
        if (el) {
            el.classList.toggle('rf-pulse-hint', shouldPulse);
        }
    },

    // ==========================================
    // CRITERION BADGE: Shows selected criterion
    // ==========================================
    renderCriterionBadge() {
        let badge = document.getElementById('rfCriterionBadge');
        if (!badge) {
            badge = document.createElement('div');
            badge.id = 'rfCriterionBadge';
            badge.className = 'rf-criterion-badge';
            const sidebar = document.querySelector('.rf-sidebar');
            const sampleSection = sidebar.querySelector('.rf-sidebar-section');
            sidebar.insertBefore(badge, sampleSection);
        }

        const criterion = this.state.currentCriterion || 'gini';
        const criterionLabel = criterion === 'both' ? 'Both (Compare)'
            : criterion === 'entropy' ? 'Entropy' : 'Gini Impurity';
        const criterionDesc = criterion === 'both'
            ? 'Comparing Gini & Entropy'
            : criterion === 'entropy'
                ? 'Information Gain criterion'
                : 'Probability-based criterion';

        badge.innerHTML = `
            <div class="rf-criterion-badge-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 3v18m9-9H3"/>
                </svg>
            </div>
            <div class="rf-criterion-badge-text">
                <div class="rf-criterion-badge-label">Split Criterion</div>
                <div class="rf-criterion-badge-value">${criterionLabel}</div>
            </div>
        `;
    },

    // ==========================================
    // CONTROLS: Speed, n_estimators, Pagination
    // ==========================================
    renderControls() {
        let controlsBar = document.getElementById('rfControlsBar');
        if (!controlsBar) {
            // Create controls bar and insert it before the grid info
            controlsBar = document.createElement('div');
            controlsBar.id = 'rfControlsBar';
            controlsBar.className = 'rf-controls-bar';
            const mainContent = document.querySelector('.rf-main-content');
            const gridInfo = document.getElementById('rfGridInfo');
            mainContent.insertBefore(controlsBar, gridInfo);
        }

        const totalTrees = this.state.currentData.forestMeta.nTrees;
        const activeN = this.state.activeNEstimators || totalTrees;
        const totalPages = this.getTotalPages();
        const currentPage = this.state.currentPage;

        controlsBar.innerHTML = `
            <div class="rf-control-group">
                <label class="rf-control-label">Speed</label>
                <div class="rf-speed-btns">
                    <button class="rf-speed-btn ${this.state.speedMultiplier === 0.5 ? 'active' : ''}" data-speed="0.5" title="Slower animation — see each step clearly">Slow</button>
                    <button class="rf-speed-btn ${this.state.speedMultiplier === 1 ? 'active' : ''}" data-speed="1" title="Default animation speed">Normal</button>
                    <button class="rf-speed-btn ${this.state.speedMultiplier === 2 ? 'active' : ''}" data-speed="2" title="Faster animation — quick overview">Fast</button>
                </div>
            </div>
            <div class="rf-control-group">
                <label class="rf-control-label" title="Number of decision trees that vote in the ensemble">Trees (n_estimators)</label>
                <div class="rf-nestimators-control">
                    <input type="range" class="rf-nestimators-slider" id="rfNEstimatorsSlider"
                        min="10" max="${totalTrees}" step="10" value="${activeN}"
                        title="Drag to change how many trees vote — more trees generally improve accuracy">
                    <span class="rf-nestimators-value" id="rfNEstimatorsValue">${activeN}</span>
                </div>
            </div>
            <div class="rf-control-group">
                <label class="rf-control-label">Page ${currentPage + 1} / ${totalPages}</label>
                <div class="rf-pagination-btns">
                    <button class="rf-page-btn" id="rfPagePrev" ${currentPage === 0 ? 'disabled' : ''} title="Previous page of trees">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <button class="rf-page-btn" id="rfPageNext" ${currentPage >= totalPages - 1 ? 'disabled' : ''} title="Next page of trees">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                </div>
            </div>
        `;

        // Speed button handlers
        controlsBar.querySelectorAll('.rf-speed-btn').forEach(btn => {
            btn.onclick = () => {
                if (this.state.isAnimating) return;
                this.state.speedMultiplier = parseFloat(btn.dataset.speed);
                this.renderControls();
            };
        });

        // n_estimators slider handler
        const slider = document.getElementById('rfNEstimatorsSlider');
        const valueLabel = document.getElementById('rfNEstimatorsValue');
        slider.oninput = () => {
            valueLabel.textContent = slider.value;
        };
        slider.onchange = () => {
            if (this.state.isAnimating) return;
            this.state.activeNEstimators = parseInt(slider.value);
            this.state.currentPage = 0;
            document.getElementById('rfTreeCount').textContent = this.state.activeNEstimators + ' Trees';
            // Reset animation state
            this.state.phase = 'waiting';
            this.resetVotes();
            this.state.treePredictions = new Map();
            this.state.activeTreePaths = new Map();
            this.state.finalResult = null;
            this.state.showSample = false;
            this.state.showChips = false;
            this.renderInitialTrees();
            this.renderAggregationBars();
            this.renderControls();
            this.renderGuidanceBanner();
            this.updateRunButton();
        };

        // Pagination handlers
        document.getElementById('rfPagePrev').onclick = () => {
            if (this.state.currentPage > 0) {
                this.state.currentPage--;
                this.renderInitialTrees();
                this.renderControls();
            }
        };
        document.getElementById('rfPageNext').onclick = () => {
            if (this.state.currentPage < totalPages - 1) {
                this.state.currentPage++;
                this.renderInitialTrees();
                this.renderControls();
            }
        };
    },

    // ==========================================
    // SAMPLE RENDERING
    // ==========================================
    renderSamples() {
        const container = document.getElementById('rfSampleList');
        container.innerHTML = '';

        // Inline hint above sample buttons
        const hint = document.createElement('div');
        hint.className = 'rf-sample-hint';
        hint.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5"/></svg> Pick a sample below to begin`;
        container.appendChild(hint);

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
        this.state.currentPage = 0;
        this.resetVotes();
        this.state.treePredictions = new Map();
        this.state.activeTreePaths = new Map();
        this.state.finalResult = null;
        this.state.showSample = false;
        this.state.showChips = false;
        
        this.renderSamples();
        this.renderInitialTrees();
        this.renderAggregationBars();
        this.renderControls();
        this.renderGuidanceBanner();
        this.updateRunButton();
    },

    // ==========================================
    // TREE GRID RENDERING
    // ==========================================
    renderInitialTrees() {
        const grid = document.getElementById('rfTreeGrid');
        grid.innerHTML = '';
        
        const trees = this.getPageTrees();
        const offset = this.getPageTreeGlobalOffset();
        
        trees.forEach((tree, i) => {
            const globalIndex = offset + i;
            const card = document.createElement('div');
            card.className = 'rf-tree-card';
            card.id = `rf-tree-card-${globalIndex}`;
            card.title = 'Click to explore this tree\'s decision path';
            card.onclick = () => this.openTreeModal(globalIndex);
            
            card.innerHTML = `
                <div class="rf-tree-id">T${globalIndex + 1}</div>
                <div class="rf-tree-svg-container" id="rf-tree-svg-${globalIndex}">
                    ${this.renderMiniTreeSVG(tree, globalIndex)}
                </div>
                <div class="rf-tree-prediction-chip" id="rf-tree-chip-${globalIndex}"></div>
                ${this.state.selectedSampleIndex === null ? '<div class="rf-tree-card-empty">Select a Sample</div>' : ''}
            `;
            grid.appendChild(card);

            // Restore prediction state when paginating after animation
            const existingPrediction = this.state.treePredictions.get(tree.treeId);
            if (existingPrediction) {
                this.showTreePrediction(globalIndex, existingPrediction);
            }
        });
        
        const activeN = this.state.activeNEstimators || this.state.currentData.forestMeta.nTrees;
        document.getElementById('rfGridInfo').textContent = 
            `Showing trees ${offset + 1}–${offset + trees.length} of ${activeN} · Click any tree for details`;
    },

    renderMiniTreeSVG(tree, treeIndex) {
        const nodes = tree.decisionTree;
        const activePath = this.state.activeTreePaths.get(tree.treeId) || [];
        const rejectedEdges = this.computeRejectedEdges(nodes, activePath);
        const hasPath = activePath.length > 0;
        
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
        
        // Render edges: when path exists, only show active + rejected edges;
        // when no path, show all edges as faint background structure
        nodes.forEach(node => {
            if (node.is_leaf) return;
            const left = nodes.find(n => n.id === node.left_child);
            const right = nodes.find(n => n.id === node.right_child);
            
            if (left) {
                const isActive = activePath.includes(node.id) && activePath.includes(left.id);
                const isRejected = rejectedEdges.some(e => e.parent === node.id && e.child === left.id);
                // Skip background edges when path is active — only show chosen/rejected
                if (!hasPath || isActive || isRejected) {
                    edgesHTML += `<line id="edge-${treeIndex}-${node.id}-${left.id}" x1="${node.x}" y1="${node.y}" x2="${left.x}" y2="${left.y}" 
                        vector-effect="non-scaling-stroke"
                        class="rf-tree-edge ${isActive ? 'active' : ''} ${isRejected ? 'rejected' : ''} ${!hasPath ? 'bg' : ''}" />`;
                }
            }
            if (right) {
                const isActive = activePath.includes(node.id) && activePath.includes(right.id);
                const isRejected = rejectedEdges.some(e => e.parent === node.id && e.child === right.id);
                if (!hasPath || isActive || isRejected) {
                    edgesHTML += `<line id="edge-${treeIndex}-${node.id}-${right.id}" x1="${node.x}" y1="${node.y}" x2="${right.x}" y2="${right.y}" 
                        vector-effect="non-scaling-stroke"
                        class="rf-tree-edge ${isActive ? 'active' : ''} ${isRejected ? 'rejected' : ''} ${!hasPath ? 'bg' : ''}" />`;
                }
            }
        });
        
        // Render nodes: when path exists, only show nodes on the path;
        // when no path, show all nodes faintly
        nodes.forEach(node => {
            const isActive = activePath.includes(node.id);
            const isLeaf = node.is_leaf;
            const style = isLeaf ? this.getClassStyle(node.class) : null;
            
            if (!hasPath || isActive) {
                nodesHTML += `<circle id="node-${treeIndex}-${node.id}" cx="${node.x}" cy="${node.y}" 
                    r="${isLeaf ? 8 : 5}" 
                    fill="${isLeaf ? style.hex : (isActive ? '#3b82f6' : '#cbd5e1')}"
                    stroke="${isLeaf ? style.hex : (isActive ? '#1e40af' : '#94a3b8')}"
                    stroke-width="${isActive ? 2 : 1}"
                    vector-effect="non-scaling-stroke"
                    class="rf-tree-node-circle ${isActive ? 'active' : ''}" />`;
            }
        });
        
        return `<svg viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet">${edgesHTML}${nodesHTML}</svg>`;
    },

    // Update tree path in-place — full re-render since we conditionally omit edges/nodes
    updateMiniTree(treeIndex, path) {
        const tree = this.state.currentData.trees[treeIndex];
        const svgContainer = document.getElementById(`rf-tree-svg-${treeIndex}`);
        if (!svgContainer) return;
        // Re-render because we filter which edges/nodes to show based on path
        svgContainer.innerHTML = this.renderMiniTreeSVG(tree, treeIndex);
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

        // Add explanation hint if not already present
        let aggHint = document.getElementById('rfAggregationHint');
        if (!aggHint) {
            aggHint = document.createElement('div');
            aggHint.id = 'rfAggregationHint';
            aggHint.className = 'rf-aggregation-hint';
            aggHint.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg> Each tree votes for a class. The class with the most votes wins — that's <b>majority voting</b>.`;
            container.parentElement.insertBefore(aggHint, container);
        }

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
                <div class="rf-vote-count">${count} <span class="rf-vote-pct">${totalVotes > 0 ? '(' + pct.toFixed(1) + '%)' : ''}</span></div>
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
        this.state.currentPage = 0;
        this.resetVotes();
        this.state.treePredictions = new Map();
        this.state.activeTreePaths = new Map();
        this.state.finalResult = null;
        this.state.showSample = false;
        this.state.showChips = false;
        this.state.isAnimating = false;
        
        this.renderInitialTrees();
        this.renderAggregationBars();
        this.renderControls();
        this.renderGuidanceBanner();
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
        
        const wait = ms => new Promise(r => setTimeout(r, this.scaledDelay(ms)));
        const isCancelled = () => this.state.animationId !== animationId;
        
        // Reset to page 0 for animation
        this.state.currentPage = 0;
        this.state.phase = 'waiting';
        this.resetVotes();
        this.state.treePredictions = new Map();
        this.state.activeTreePaths = new Map();
        this.state.finalResult = null;
        this.state.showSample = false;
        this.state.showChips = false;
        
        this.renderInitialTrees();
        this.renderAggregationBars();
        this.renderControls();
        this.renderGuidanceBanner();
        this.updateRunButton();
        
        await wait(300);
        if (isCancelled()) return;
        
        // Inject sample
        this.state.phase = 'injecting';
        this.state.showSample = true;
        this.renderFeaturesPanel();
        this.renderGuidanceBanner();
        this.updateRunButton();
        
        await wait(800);
        if (isCancelled()) return;
        
        // Dispatch
        this.state.phase = 'dispatching';
        await wait(this.CONFIG.SAMPLE_DISPATCH_DURATION);
        if (isCancelled()) return;
        
        // Traversal - animate only page 0 visible trees
        this.state.phase = 'traversing';
        this.renderGuidanceBanner();
        this.updateRunButton();
        
        const visibleTrees = this.getPageTrees();
        const offset = this.getPageTreeGlobalOffset();
        
        const traversalPromises = visibleTrees.map(async (tree, localIndex) => {
            const globalIndex = offset + localIndex;
            await wait(localIndex * this.CONFIG.TREE_STAGGER_DELAY);
            if (isCancelled()) return;
            
            const path = this.computePath(tree.decisionTree, sample);
            
            for (let i = 0; i < path.length; i++) {
                if (isCancelled()) return;
                
                this.state.activeTreePaths.set(tree.treeId, path.slice(0, i + 1));
                this.updateMiniTree(globalIndex, path.slice(0, i + 1));
                
                await wait(this.CONFIG.TRAVERSAL_STEP_DURATION);
            }
            
            const prediction = this.getTreePrediction(tree, sample.id);
            this.state.treePredictions.set(tree.treeId, prediction);
            this.showTreePrediction(globalIndex, prediction);
        });
        
        await Promise.all(traversalPromises);
        if (isCancelled()) return;
        
        // Show chips
        this.state.showChips = true;
        await wait(this.CONFIG.CHIP_EMERGE_DELAY);
        if (isCancelled()) return;
        
        // Aggregation - count visible trees first
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
        
        // Populate predictions AND paths for ALL active trees (not just visible page)
        // so pagination shows colored chips + chosen path on every page
        const activeTrees = this.getActiveTrees();
        activeTrees.forEach(tree => {
            if (!this.state.treePredictions.has(tree.treeId)) {
                const prediction = this.getTreePrediction(tree, sample.id);
                this.state.treePredictions.set(tree.treeId, prediction);
            }
            if (!this.state.activeTreePaths.has(tree.treeId)) {
                const path = this.computePath(tree.decisionTree, sample);
                this.state.activeTreePaths.set(tree.treeId, path);
            }
        });

        // Full aggregation (uses activeNEstimators trees)
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
        this.renderControls();
        this.renderGuidanceBanner();
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
        
        const activeTrees = this.getActiveTrees();
        activeTrees.forEach(tree => {
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
            // Auto-fit will be calculated after rendering
            this.state.viewState = { x: 0, y: 0, scale: 1 };
            this.renderVisualTree();
            this.autoFitVisualTree();
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

        // Add guide banner at top of steps
        const guide = document.createElement('div');
        guide.className = 'rf-path-guide';
        guide.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <div>
                <strong>How to read this path</strong>
                <span>Each step below shows a decision the tree made. At each node, a feature is compared against a threshold. 
                <b style="color:#059669">Green (Yes → Left)</b> means the condition was true. 
                <b style="color:#dc2626">Red (No → Right)</b> means it was false. 
                The final step shows the leaf node prediction.</span>
            </div>
        `;
        stepsContainer.appendChild(guide);
        
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
                        <div style="display:flex;gap:10px;font-size:0.875rem;">
                            <div style="background:#f1f5f9;padding:4px 10px;border-radius:6px;color:#475569;">
                                Value: <b>${typeof featureValue === 'number' ? featureValue.toFixed(2) : featureValue}</b>
                            </div>
                            <div class="rf-path-step-result ${goesLeft ? 'left' : 'right'}">
                                ${goesLeft
                                    ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>'
                                    : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'}
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
        let rejectedEdgesHTML = '';
        let pathEdgesHTML = '';
        let nodesHTML = '';
        
        // Compute rejected edges (branches not taken at each decision point)
        const rejectedEdges = this.computeRejectedEdges(nodes, fullPath);
        
        // Helper: shorten a point towards a source point by `r` pixels
        const shortenEnd = (sx, sy, ex, ey, r) => {
            const dx = ex - sx, dy = ey - sy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist === 0) return { x: ex, y: ey };
            return { x: ex - (dx / dist) * r, y: ey - (dy / dist) * r };
        };

        // All edges (faded) + rejected edges (red)
        nodes.forEach(node => {
            if (node.is_leaf) return;
            const left = nodes.find(n => n.id === node.left_child);
            const right = nodes.find(n => n.id === node.right_child);
            const parentR = node.is_leaf ? 32 : 26;
            let sx = node.x + offsetX, sy = node.y + offsetY;
            
            if (left) {
                const childR = left.is_leaf ? 32 : 26;
                let ex = left.x + offsetX, ey = left.y + offsetY;
                // Shorten start away from parent circle, end away from child circle
                const s = shortenEnd(ex, ey, sx, sy, parentR);
                const e = shortenEnd(sx, sy, ex, ey, childR);
                const isRejected = rejectedEdges.some(re => re.parent === node.id && re.child === left.id);
                if (isRejected) {
                    rejectedEdgesHTML += `<path d="M${s.x},${s.y} C${s.x},${s.y + 40} ${e.x},${e.y - 40} ${e.x},${e.y}" 
                        stroke="#dc2626" stroke-width="3" fill="none" opacity="0.85" stroke-dasharray="6,4"
                        style="filter:drop-shadow(0 0 4px rgba(220,38,38,0.4))"/>`;
                } else {
                    edgesHTML += `<path d="M${s.x},${s.y} C${s.x},${s.y + 40} ${e.x},${e.y - 40} ${e.x},${e.y}" 
                        stroke="#64748b" stroke-width="2.5" fill="none" opacity="0.85"/>`;
                }
            }
            if (right) {
                const childR = right.is_leaf ? 32 : 26;
                let ex = right.x + offsetX, ey = right.y + offsetY;
                const s = shortenEnd(ex, ey, sx, sy, parentR);
                const e = shortenEnd(sx, sy, ex, ey, childR);
                const isRejected = rejectedEdges.some(re => re.parent === node.id && re.child === right.id);
                if (isRejected) {
                    rejectedEdgesHTML += `<path d="M${s.x},${s.y} C${s.x},${s.y + 40} ${e.x},${e.y - 40} ${e.x},${e.y}" 
                        stroke="#dc2626" stroke-width="3" fill="none" opacity="0.85" stroke-dasharray="6,4"
                        style="filter:drop-shadow(0 0 4px rgba(220,38,38,0.4))"/>`;
                } else {
                    edgesHTML += `<path d="M${s.x},${s.y} C${s.x},${s.y + 40} ${e.x},${e.y - 40} ${e.x},${e.y}" 
                        stroke="#64748b" stroke-width="2.5" fill="none" opacity="0.85"/>`;
                }
            }
        });
        
        // Active path edges (will animate) - stop at edge of every node circle
        let pathD = '';
        if (fullPath.length > 0) {
            const first = nodes.find(n => n.id === fullPath[0]);
            if (first) {
                for (let i = 0; i < fullPath.length - 1; i++) {
                    const n1 = nodes.find(n => n.id === fullPath[i]);
                    const n2 = nodes.find(n => n.id === fullPath[i + 1]);
                    if (n1 && n2) {
                        const cx1 = n1.x + offsetX, cy1 = n1.y + offsetY;
                        const cx2 = n2.x + offsetX, cy2 = n2.y + offsetY;
                        const r1 = n1.is_leaf ? 32 : 26;
                        const r2 = n2.is_leaf ? 32 : 26;
                        // Shorten start from parent circle edge, end at child circle edge
                        const s = shortenEnd(cx2, cy2, cx1, cy1, r1);
                        const e = shortenEnd(cx1, cy1, cx2, cy2, r2);
                        
                        if (i === 0) {
                            pathD += `M${s.x},${s.y}`;
                        } else {
                            pathD += ` M${s.x},${s.y}`;
                        }
                        pathD += ` C${s.x},${s.y + 40} ${e.x},${e.y - 40} ${e.x},${e.y}`;
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
                <title>${isLeaf ? 'Leaf Node #' + node.id + ' — Predicts: ' + node.class + ' (click for details)' : 'Node #' + node.id + ' — ' + (node.feature || '') + ' (click for details)'}</title>
                <circle cx="${x}" cy="${y}" r="${isLeaf ? 32 : 26}" 
                    fill="${isLeaf ? style.hex + '20' : '#e2e8f0'}" 
                    stroke="${isLeaf ? style.hex : (isActive ? '#2563eb' : '#475569')}" 
                    stroke-width="${isActive ? 3 : 2}"
                    class="rf-node-circle"/>
                ${isLeaf 
                    ? `<text x="${x}" y="${y + 6}" text-anchor="middle" font-size="16" font-weight="700" fill="${style.hex}">${node.id}</text>`
                    : `<text x="${x}" y="${y + 6}" text-anchor="middle" font-size="16" font-weight="600" fill="#475569">${node.id}</text>`
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
                ${rejectedEdgesHTML}
                ${pathEdgesHTML}
                ${nodesHTML}
            </svg>
        `;

        // Add color legend
        let legend = document.getElementById('rfVisualTreeLegend');
        if (!legend) {
            legend = document.createElement('div');
            legend.id = 'rfVisualTreeLegend';
            legend.className = 'rf-visual-tree-legend';
            document.getElementById('rfVisualTreeView').appendChild(legend);
        }
        legend.innerHTML = `
            <div class="rf-legend-title">Color Guide</div>
            <div class="rf-legend-item"><span class="rf-legend-line" style="background:#3b82f6;"></span> Chosen Path (sample's route)</div>
            <div class="rf-legend-item"><span class="rf-legend-line rf-legend-dashed" style="background:#dc2626;"></span> Rejected Branch (not taken)</div>
            <div class="rf-legend-item"><span class="rf-legend-line" style="background:#94a3b8;"></span> Other Branches</div>
            <div class="rf-legend-item"><svg width="14" height="14" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="none" stroke="#475569" stroke-width="2"/></svg> Decision Node (click for details)</div>
            <div class="rf-legend-item"><svg width="14" height="14" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="#10b98120" stroke="#10b981" stroke-width="2"/></svg> Leaf Node (prediction class)</div>
        `;

        // Add interaction hint overlay (auto-fades)
        let interHint = document.getElementById('rfTreeInteractionHint');
        if (!interHint) {
            interHint = document.createElement('div');
            interHint.id = 'rfTreeInteractionHint';
            interHint.className = 'rf-tree-interaction-hint';
            document.getElementById('rfVisualTreeView').appendChild(interHint);
        }
        interHint.innerHTML = `
            <div class="rf-interaction-row">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="2"/><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <span>Scroll to zoom in/out</span>
            </div>
            <div class="rf-interaction-row">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 9l4-4 4 4"/><path d="M9 5v14"/><path d="M19 15l-4 4-4-4"/><path d="M15 19V5"/></svg>
                <span>Drag to pan around</span>
            </div>
            <div class="rf-interaction-row">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 15l-2 5L9 9l11 4-5 2z"/></svg>
                <span>Click any node for details</span>
            </div>
        `;
        interHint.classList.remove('fade-out');
        interHint.style.display = 'flex';
        // Auto-fade after 5 seconds
        clearTimeout(this._interHintTimer);
        this._interHintTimer = setTimeout(() => {
            interHint.classList.add('fade-out');
        }, 5000);
        
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

    // Auto-fit the visual tree SVG to the viewport so the whole tree is visible
    autoFitVisualTree() {
        const canvas = document.getElementById('rfTreeCanvas');
        const view = document.getElementById('rfVisualTreeView');
        if (!canvas || !view) return;

        const svg = canvas.querySelector('svg');
        if (!svg) return;

        const viewRect = view.getBoundingClientRect();
        const svgWidth = parseFloat(svg.getAttribute('width'));
        const svgHeight = parseFloat(svg.getAttribute('height'));

        if (!svgWidth || !svgHeight || !viewRect.width || !viewRect.height) return;

        const pad = 40; // Padding around edges
        const scaleX = (viewRect.width - pad * 2) / svgWidth;
        const scaleY = (viewRect.height - pad * 2) / svgHeight;
        const scale = Math.min(scaleX, scaleY, 1); // Don't zoom in beyond 1

        // Center the tree
        const scaledW = svgWidth * scale;
        const scaledH = svgHeight * scale;
        const x = (viewRect.width - scaledW) / 2;
        const y = (viewRect.height - scaledH) / 2;

        this.state.viewState = { x, y, scale };
        canvas.style.transition = 'none';
        canvas.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;

        // Restore transition after initial placement
        requestAnimationFrame(() => {
            canvas.style.transition = 'transform 0.1s ease-out';
        });
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
