// ==========================================
// CLASSIFICATION TYPE SELECTOR
// ==========================================

let CLASSIFICATION_TYPE = null; // 'binary' or 'multiclass'

// ==========================================
// TRAINING STEPS DATA - MULTI-CLASS
// ==========================================

const STEPS_MULTICLASS = [
    {
        title: "Importing Libraries",
        blocks: [{
            code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.metrics import accuracy_score, confusion_matrix
from sklearn.preprocessing import LabelEncoder
print("Libraries imported successfully!")`,
            output: "Libraries imported successfully!"
        }]
    },
    {
        title: "Loading Data",
        blocks: [
            {
                code: `data = pd.read_csv('ObesityDataSet_raw_and_data_sinthetic.csv')
print("Dataset loaded successfully")`,
                output: "Dataset loaded successfully"
            },
            {
                code: `print("Data Shape:")
print(data.shape)`,
                output: "Data Shape:<br>(2111, 17)"
            },
            {
                code: `print("First 5 rows of the dataset:")
data.head()`,
                output: `<div class="table-container"><table class="data-table"><thead><tr><th>Gender</th><th>Age</th><th>Height</th><th>Weight</th><th>family_history_with_overweight</th><th>FAVC</th><th>FCVC</th><th>NCP</th><th>CAEC</th><th>SMOKE</th><th>CH2O</th><th>SCC</th><th>FAF</th><th>TUE</th><th>CALC</th><th>MTRANS</th><th>NObeyesdad</th></tr></thead><tbody><tr><td>Female</td><td>21.0</td><td>1.62</td><td>64.0</td><td>yes</td><td>no</td><td>2.0</td><td>3.0</td><td>Sometimes</td><td>no</td><td>2.0</td><td>no</td><td>0.0</td><td>1.0</td><td>no</td><td>Public_Transportation</td><td>Normal_Weight</td></tr><tr><td>Female</td><td>21.0</td><td>1.52</td><td>56.0</td><td>yes</td><td>no</td><td>3.0</td><td>3.0</td><td>Sometimes</td><td>yes</td><td>3.0</td><td>yes</td><td>3.0</td><td>0.0</td><td>Sometimes</td><td>Public_Transportation</td><td>Normal_Weight</td></tr><tr><td>Male</td><td>23.0</td><td>1.80</td><td>77.0</td><td>yes</td><td>no</td><td>2.0</td><td>3.0</td><td>Sometimes</td><td>no</td><td>2.0</td><td>no</td><td>2.0</td><td>1.0</td><td>Frequently</td><td>Public_Transportation</td><td>Normal_Weight</td></tr><tr><td>Male</td><td>27.0</td><td>1.80</td><td>87.0</td><td>no</td><td>no</td><td>3.0</td><td>3.0</td><td>Sometimes</td><td>no</td><td>2.0</td><td>no</td><td>2.0</td><td>0.0</td><td>Frequently</td><td>Walking</td><td>Overweight_Level_I</td></tr><tr><td>Male</td><td>22.0</td><td>1.78</td><td>89.8</td><td>no</td><td>no</td><td>2.0</td><td>1.0</td><td>Sometimes</td><td>no</td><td>2.0</td><td>no</td><td>0.0</td><td>0.0</td><td>Sometimes</td><td>Public_Transportation</td><td>Overweight_Level_II</td></tr></tbody></table></div>`
            }
        ]
    },
    {
        title: "Preprocessing",
        blocks: [
            {
                code: `print("Statistical summary of the dataset:")
data.describe()`,
                output: "Statistical summary of the dataset:<br><br>[Table with count, mean, std, min, 25%, 50%, 75%, max for numeric columns like Age, Height, Weight...]"
            },
            {
                code: "# Initialize LabelEncoder\nle = LabelEncoder()\ntarget_names = []\nprint(\"LabelEncoder initialized\")",
                output: "LabelEncoder initialized"
            },
            {
                code: "# Apply encoding to categorical columns\nfor col in data.columns:\n    if data[col].dtype == 'object':\n        data[col] = le.fit_transform(data[col])\n        if col == 'NObeyesdad':\n            target_names = list(le.classes_)\nprint(\"Categorical variables encoded\")",
                output: "Categorical variables encoded"
            },
            {
                code: "# Split data into training and testing sets\nX = data.drop('NObeyesdad', axis=1)\ny = data['NObeyesdad']\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\nprint(\"Data split complete\")",
                output: "Data split complete"
            }
        ]
    },
    {
        title: "Training (Gini)",
        blocks: [
            {
                code: "# Initialize and train Decision Tree with Gini impurity\nmodel = DecisionTreeClassifier(criterion='gini')\nmodel.fit(X_train, y_train)\nprint(\"Model trained using Gini impurity\")",
                output: "Model trained using Gini impurity"
            },
            {
                code: "# Evaluate Gini model\ny_pred = model.predict(X_test)\nprint(\"Accuracy (Gini, Full Tree):\", accuracy_score(y_test, y_pred))\nprint(\"\\nConfusion Matrix (Gini, Full Tree):\\n\", confusion_matrix(y_test, y_pred))",
                output: "Accuracy (Gini, Full Tree): 0.9456<br><br>Confusion Matrix (Gini, Full Tree):<br>[[52  3  0  1  0  0  0]<br> [ 4 56  0  0  0  0  0]<br> ...<br> [ 0  0  0  2 60  1  0]]"
            },
            {
                 code: "# Plot confusion matrix (Gini)\nprint(\"Displaying plot...\")\nplt.figure(figsize=(8,6))\nsns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=target_names, yticklabels=target_names)\nplt.title('Confusion Matrix (Gini)')\nplt.show()",
                 output: `<img src="./images/confusion_matrix_gini.png" style="max-width:100%; height:auto; border: 1px solid #ddd; padding: 5px;">`
            },
            {
                 code: "# Visualize the Gini Decision Tree\nprint(\"Plotting the Decision Tree (Gini)...\")\nplt.figure(figsize=(20,10))\nplot_tree(model, feature_names=X.columns, class_names=target_names, filled=True, rounded=True)\nplt.show()",
                 output: `<img src="./images/full_tree_gini.png" style="max-width:100%; height:auto; border: 1px solid #ddd;">`
            }
        ]
    },
    {
        title: "Training (Entropy)",
        blocks: [
            {
                code: "# Train and evaluate Decision Tree with Entropy\nmodel_entropy = DecisionTreeClassifier(criterion='entropy')\nmodel_entropy.fit(X_train, y_train)\ny_pred_entropy = model_entropy.predict(X_test)\nprint(\"Accuracy (Entropy, Full Tree):\", accuracy_score(y_test, y_pred_entropy))",
                output: "Accuracy (Entropy, Full Tree): 0.9387"
            },
            {
                 code: "# Plot confusion matrix (Entropy)\nprint(\"Displaying plot...\")\nplt.figure(figsize=(8,6))\nsns.heatmap(cm_entropy, annot=True, fmt='d', cmap='Greens', xticklabels=target_names, yticklabels=target_names)\nplt.show()",
                 output: `<img src="./images/confusion_matrix_entropy.png" style="max-width:100%; height:auto; border: 1px solid #ddd; padding: 5px;">`
            },
            {
                 code: "# Visualize the Entropy Decision Tree\nprint(\"Plotting the Decision Tree (Entropy)...\")\nplot_tree(model_entropy, feature_names=X.columns, class_names=target_names, filled=True, rounded=True)\nplt.show()",
                 output: `<img src="./images/full_tree_entropy.png" style="max-width:100%; height:auto; border: 1px solid #ddd;">`
            }
        ]
    },
    {
        title: "Model Evaluation",
        blocks: [
            {
                code: "# Analyze Decision Tree with Max Depth = 2\nd = 2\nclf = DecisionTreeClassifier(max_depth=d, criterion='gini', random_state=42)\nclf.fit(X_train, y_train)\nacc = accuracy_score(y_test, clf.predict(X_test))\nprint(f\"Max Depth: {d}, Accuracy: {acc:.4f}\")\nplot_tree(clf, feature_names=X.columns, class_names=target_names, filled=True, rounded=True)\nplt.show()",
                output: `Max Depth: 2, Accuracy: 0.5432<br><br><img src="./images/decision_tree_depth_2_gini.png" style="max-width:100%; height:auto; border: 1px solid #ddd;">`
            },
             {
                code: "# Analyze Decision Tree with Max Depth = 4\nd = 4\nclf = DecisionTreeClassifier(max_depth=d, criterion='gini', random_state=42)\nclf.fit(X_train, y_train)\nacc = accuracy_score(y_test, clf.predict(X_test))\nprint(f\"Max Depth: {d}, Accuracy: {acc:.4f}\")\nplot_tree(clf, feature_names=X.columns, class_names=target_names, filled=True, rounded=True)\nplt.show()",
                output: `Max Depth: 4, Accuracy: 0.7541<br><br><img src="./images/decision_tree_depth_4_gini.png" style="max-width:100%; height:auto; border: 1px solid #ddd;">`
            },
            {
                 code: "# Analyze Decision Tree with Max Depth = 2 (Entropy)\nd = 2\nclf = DecisionTreeClassifier(max_depth=d, criterion='entropy', random_state=42)\n# ... (fit/predict)\nprint(f\"Max Depth (Entropy): {d}, Accuracy: {acc:.4f}\")",
                 output: `Max Depth (Entropy): 2, Accuracy: 0.5211<br><br><img src="./images/decision_tree_depth_2_entropy.png" style="max-width:100%; height:auto; border: 1px solid #ddd;">`
            },
            {
                 code: "# Analyze Decision Tree with Max Depth = 4 (Entropy)\nd = 4\nclf = DecisionTreeClassifier(max_depth=d, criterion='entropy', random_state=42)\nclf.fit(X_train, y_train)\nacc = accuracy_score(y_test, clf.predict(X_test))\nprint(f\"Max Depth (Entropy): {d}, Accuracy: {acc:.4f}\")\nplot_tree(clf, feature_names=X.columns, class_names=target_names, filled=True, rounded=True)\nplt.show()",
                 output: `Max Depth (Entropy): 4, Accuracy: 0.7400<br><br><img src="./images/decision_tree_depth_4_entropy.png" style="max-width:100%; height:auto; border: 1px solid #ddd;">`
            }
        ]
    }
];

// Binary classification steps (placeholder - you can customize)
const STEPS_BINARY = [
    {
        title: "Importing Libraries",
        blocks: [{
            code: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
print("Libraries imported successfully!")`,
            output: "Libraries imported successfully!"
        }]
    },
    {
        title: "Binary Classification",
        blocks: [{
            code: `# Binary classification example
print("Binary classification implementation")`,
            output: "Binary classification implementation"
        }]
    }
];

// ==========================================
// FEATURE DESCRIPTIONS
// ==========================================

const FEATURE_DESCRIPTIONS = {
    "FAVC": "High Caloric Food",
    "FCVC": "Vegetable Consumption",
    "NCP": "Number of Main Meals",
    "CAEC": "Food Between Meals",
    "SMOKE": "Smokes",
    "CH2O": "Water Consumption",
    "SCC": "Calorie Monitoring",
    "FAF": "Physical Activity",
    "TUE": "Technology Use Time",
    "CALC": "Alcohol Consumption",
    "MTRANS": "Transportation",
    "Age": "Age",
    "Height": "Height",
    "Weight": "Weight",
    "Gender": "Gender",
    "family_history_with_overweight": "Family History"
};

// ==========================================
// GLOBAL STATE
// ==========================================

let TREE_DATA = null;
let currentStepIndex = 0;
let currentBlockIndex = 0;
let STEPS = []; // Will be set based on classification type

let animState = {
    currentStep: -1,
    isAnimating: false,
    isComplete: false,
    camera: { x: 0, y: 0, scale: 1 },
    isDragging: false,
    lastMouse: { x: 0, y: 0 },
    speed: 1.0,
    animationTimeout: null
};

let currentConfig = {
    depth: '4',
    criterion: 'gini',
    sampleIndex: 0
};

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    showClassificationSelector();
    loadTreeData();
});

function showClassificationSelector() {
    const selector = document.getElementById('classificationSelector');
    if (selector) {
        selector.style.display = 'flex';
    }
}

function selectClassificationType(type) {
    CLASSIFICATION_TYPE = type;
    STEPS = type === 'multiclass' ? STEPS_MULTICLASS : STEPS_BINARY;
    
    // Hide selector, show training section
    document.getElementById('classificationSelector').style.display = 'none';
    document.getElementById('trainingSection').style.display = 'flex';
    
    initTrainingSection();
}

function initTrainingSection() {
    const stepsNav = document.getElementById('stepsNav');
    const contentWrapper = document.getElementById('contentWrapper');
    
    // Generate steps
    stepsNav.innerHTML = '';
    STEPS.forEach((step, index) => {
        const div = document.createElement('div');
        div.className = `step-item ${index === 0 ? 'active' : ''}`;
        div.textContent = step.title;
        div.onclick = () => loadStep(index);
        stepsNav.appendChild(div);
    });
    
    // Load first step
    loadStep(0);
}

function loadStep(index) {
    currentStepIndex = index;
    currentBlockIndex = 0;
    
    // Update sidebar
    document.querySelectorAll('.step-item').forEach((item, i) => {
        item.classList.remove('active');
        if (i < index) {
            item.classList.add('completed');
        } else if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('completed');
        }
    });
    
    renderBlock(index, 0);
}

function renderBlock(stepIndex, blockIndex) {
    const contentWrapper = document.getElementById('contentWrapper');
    contentWrapper.innerHTML = '';
    
    const step = STEPS[stepIndex];
    
    // Check if we're done with all steps
    if (blockIndex >= step.blocks.length) {
        if (stepIndex + 1 < STEPS.length) {
            loadStep(stepIndex + 1);
        } else {
            showAnimationEntry();
        }
        return;
    }
    
    const block = step.blocks[blockIndex];
    const blockDiv = document.createElement('div');
    blockDiv.className = 'content-block';
    
    // Code box
    const codeBox = document.createElement('div');
    codeBox.className = 'code-box';
    codeBox.innerHTML = `<button class="run-btn">▶ Run</button><pre>${escapeHtml(block.code)}</pre>`;
    
    // Output box (hidden initially)
    const outputBox = document.createElement('div');
    outputBox.className = 'output-box';
    outputBox.style.display = 'none';
    
    // Loader
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = '<div class="spinner"></div>';
    loader.style.display = 'none';
    
    // Run button logic
    const btn = codeBox.querySelector('.run-btn');
    let isRun = false;
    
    btn.onclick = () => {
        if (!isRun) {
            // Show loader
            loader.style.display = 'flex';
            blockDiv.appendChild(loader);
            
            // Simulate execution delay (like Jupyter)
            setTimeout(() => {
                loader.style.display = 'none';
                outputBox.innerHTML = block.output;
                outputBox.style.display = 'block';
                btn.textContent = 'Next ➔';
                btn.classList.add('next-btn');
                isRun = true;
            }, 800); // 800ms delay to simulate execution
        } else {
            renderBlock(stepIndex, blockIndex + 1);
        }
    };
    
    blockDiv.appendChild(codeBox);
    blockDiv.appendChild(outputBox);
    contentWrapper.appendChild(blockDiv);
}

function showAnimationEntry() {
    const contentWrapper = document.getElementById('contentWrapper');
    contentWrapper.innerHTML = `
        <div style="text-align:center; padding: 60px 20px;">
            <h2 style="font-size: 2rem; margin-bottom: 1rem; color: #1e293b;">Training Complete!</h2>
            <p style="font-size: 1.125rem; color: #64748b; margin-bottom: 2rem;">
                You have successfully trained the Decision Tree model.
            </p>
            <button id="enterAnimationBtn" class="animation-entry-btn">
                Launch Interactive Animation
            </button>
        </div>
    `;
    
    document.getElementById('enterAnimationBtn').onclick = enterAnimation;
}

function enterAnimation() {
    document.getElementById('trainingSection').style.display = 'none';
    document.getElementById('animationSection').style.display = 'flex';
    
    // Initialize animation if not already done
    if (!TREE_DATA) {
        setTimeout(loadTreeData, 100);
    } else {
        updateVisualization();
    }
}

function exitAnimation() {
    document.getElementById('animationSection').style.display = 'none';
    document.getElementById('trainingSection').style.display = 'flex';
}

function escapeHtml(text) {
    if (!text) return text;
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// ==========================================
// ANIMATION SECTION (keeping existing code)
// ==========================================

async function loadTreeData() {
    try {
        const response = await fetch('tree_data.json');
        TREE_DATA = await response.json();
        
        // Generate sample buttons
        generateSampleButtons();
        
        // Setup event listeners
        setupAnimationListeners();
        
        // Initial render
        updateVisualization();
        
    } catch (error) {
        console.error("Failed to load tree data:", error);
    }
}

function generateSampleButtons() {
    const sampleButtons = document.getElementById('sampleButtons');
    if (!sampleButtons) return;
    
    sampleButtons.innerHTML = '';
    TREE_DATA.inputs.forEach((_, index) => {
        const btn = document.createElement('button');
        btn.className = `sample-btn ${index === 0 ? 'active' : ''}`;
        btn.textContent = index + 1;
        btn.onclick = () => selectSample(index);
        sampleButtons.appendChild(btn);
    });
}

function setupAnimationListeners() {
    // Depth buttons
    document.querySelectorAll('.depth-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.depth-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentConfig.depth = btn.dataset.depth;
            updateVisualization();
        });
    });
    
    // Criterion buttons
    document.querySelectorAll('.criterion-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.criterion-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentConfig.criterion = btn.dataset.criterion;
            updateVisualization();
        });
    });
    
    // Speed slider
    const speedSlider = document.getElementById('speedSlider');
    if (speedSlider) {
        speedSlider.addEventListener('input', (e) => {
            animState.speed = parseFloat(e.target.value);
        });
    }
    
    // Replay button
    const replayBtn = document.getElementById('replayBtn');
    if (replayBtn) {
        replayBtn.addEventListener('click', updateVisualization);
    }
    
    // Back button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', exitAnimation);
    }
    
    // Pan/Zoom controls
    const animationArea = document.getElementById('animationArea');
    if (animationArea) {
        animationArea.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        animationArea.addEventListener('wheel', handleWheel, { passive: false });
    }
}

function selectSample(index) {
    currentConfig.sampleIndex = index;
    document.querySelectorAll('.sample-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });
    updateVisualization();
}

function updateVisualization() {
    if (!TREE_DATA) return;
    
    // Stop any ongoing animation
    if (animState.animationTimeout) {
        clearTimeout(animState.animationTimeout);
    }
    
    animState.isAnimating = false;
    animState.isComplete = false;
    animState.currentStep = -1;
    
    const sample = TREE_DATA.inputs[currentConfig.sampleIndex];
    const model = TREE_DATA.models[currentConfig.depth][currentConfig.criterion];
    const path = sample.paths[currentConfig.depth][currentConfig.criterion];
    
    // Update sidebar
    renderFeatureSidebar(sample);
    
    // Update true label
    const trueLabelValue = document.getElementById('trueLabelValue');
    if (trueLabelValue) {
        trueLabelValue.textContent = TREE_DATA.class_names[sample.true_label].replace(/_/g, ' ');
    }
    
    // Render tree
    renderTree(model, path);
    
    // Start animation
    setTimeout(() => startAnimation(sample, model, path), 500);
}

function renderFeatureSidebar(sample) {
    const featuresGrid = document.getElementById('featuresGrid');
    if (!featuresGrid) return;
    
    featuresGrid.innerHTML = '';
    
    Object.entries(sample.features).forEach(([key, value]) => {
        const mapping = TREE_DATA.feature_mappings[key];
        const displayValue = mapping && typeof value === 'number'
            ? mapping[value]
            : (typeof value === 'number' ? value.toFixed(2) : value);
        
        const item = document.createElement('div');
        item.className = 'feature-item';
        item.innerHTML = `
            <div class="feature-label" title="${FEATURE_DESCRIPTIONS[key] || key}">${FEATURE_DESCRIPTIONS[key] || key}</div>
            <div class="feature-value" title="${displayValue}">${displayValue}</div>
        `;
        featuresGrid.appendChild(item);
    });
}

function renderTree(nodes, pathIds) {
    const treeContainer = document.getElementById('treeContainer');
    if (!treeContainer) return;
    
    treeContainer.innerHTML = '';
    
    // Create SVG for edges
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "connections-layer");
    svg.setAttribute("width", "5000");
    svg.setAttribute("height", "5000");
    treeContainer.appendChild(svg);
    
    const pathSet = new Set(pathIds);
    
    // Render edges
    nodes.forEach(node => {
        if (!node.is_leaf) {
            const leftChild = nodes.find(n => n.id === node.left_child);
            const rightChild = nodes.find(n => n.id === node.right_child);
            
            if (leftChild) {
                drawEdge(svg, node, leftChild, pathSet.has(node.id) && pathSet.has(leftChild.id));
            }
            if (rightChild) {
                drawEdge(svg, node, rightChild, pathSet.has(node.id) && pathSet.has(rightChild.id));
            }
        }
    });
    
    // Render nodes
    nodes.forEach(node => {
        const nodeEl = createNodeElement(node, pathSet.has(node.id));
        treeContainer.appendChild(nodeEl);
    });
    
    // Initial camera position
    const rootNode = nodes.find(n => n.id === 0);
    if (rootNode) {
        focusOnNode(rootNode, 1.2, 0);
    }
}

function drawEdge(svg, startNode, endNode, isPath) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", startNode.x);
    line.setAttribute("y1", startNode.y + 40);
    line.setAttribute("x2", endNode.x);
    line.setAttribute("y2", endNode.y - 40);
    line.setAttribute("class", `connection-line ${isPath ? 'path' : ''}`);
    svg.appendChild(line);
}

function createNodeElement(node, isInPath) {
    const div = document.createElement('div');
    div.className = `tree-node ${isInPath ? 'in-path' : ''}`;
    div.id = `node-${node.id}`;
    div.style.left = `${node.x}px`;
    div.style.top = `${node.y}px`;
    
    if (node.is_leaf) {
        div.innerHTML = `
            <div class="node-prediction">PREDICTION</div>
            <div class="node-class">${node.class.replace(/_/g, ' ')}</div>
            <div class="node-samples" style="display:none;">${node.samples} samples</div>
        `;
    } else {
        const featureDesc = FEATURE_DESCRIPTIONS[node.feature] || node.feature;
        div.innerHTML = `
            <div class="node-label">${featureDesc}</div>
            <div class="node-value">&le; ${node.threshold.toFixed(2)}</div>
            <div class="node-feature-value" style="display:none;"></div>
        `;
    }
    
    return div;
}

function startAnimation(sample, model, pathIds) {
    animState.isAnimating = true;
    animState.currentStep = 0;
    
    const sequence = pathIds.map(id => model.find(n => n.id === id));
    
    function animateNextStep() {
        if (animState.currentStep >= sequence.length) {
            animState.isAnimating = false;
            animState.isComplete = true;
            setTimeout(() => fitTreeToScreen(), 1500);
            return;
        }
        
        const node = sequence[animState.currentStep];
        const isLeaf = node.is_leaf;
        
        highlightNode(node.id);
        
        if (!isLeaf) {
            showFeatureValue(node, sample.features[node.feature]);
        } else {
            const nodeEl = document.getElementById(`node-${node.id}`);
            if (nodeEl) {
                const samplesEl = nodeEl.querySelector('.node-samples');
                if (samplesEl) samplesEl.style.display = 'block';
                
                const prediction = TREE_DATA.class_names.indexOf(node.class);
                if (prediction === sample.true_label) {
                    nodeEl.querySelector('.node-class').classList.add('correct');
                }
            }
        }
        
        focusOnNode(node, 1.5, 1000 / animState.speed);
        
        const duration = isLeaf ? 2000 : 1500;
        animState.currentStep++;
        animState.animationTimeout = setTimeout(animateNextStep, duration / animState.speed);
    }
    
    animateNextStep();
}

function highlightNode(nodeId) {
    const nodeEl = document.getElementById(`node-${nodeId}`);
    if (nodeEl) {
        document.querySelectorAll('.tree-node.active').forEach(n => n.classList.remove('active'));
        nodeEl.classList.add('visited', 'active');
    }
}

function showFeatureValue(node, value) {
    const nodeEl = document.getElementById(`node-${node.id}`);
    if (!nodeEl) return;
    
    const valueEl = nodeEl.querySelector('.node-feature-value');
    if (valueEl) {
        const mapping = TREE_DATA.feature_mappings[node.feature];
        const displayValue = mapping && typeof value === 'number'
            ? mapping[value]
            : (typeof value === 'number' ? value.toFixed(2) : value);
        
        valueEl.textContent = `Val: ${displayValue}`;
        valueEl.style.display = 'inline-block';
    }
}

function setCameraTransform(x, y, scale, duration = 0) {
    animState.camera = { x, y, scale };
    const treeContainer = document.getElementById('treeContainer');
    if (!treeContainer) return;
    
    if (duration > 0) {
        treeContainer.style.transition = `transform ${duration}ms cubic-bezier(0.455, 0.030, 0.515, 0.955)`;
    } else {
        treeContainer.style.transition = 'none';
    }
    
    treeContainer.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
}

function focusOnNode(node, targetScale, duration) {
    const animationArea = document.getElementById('animationArea');
    if (!animationArea) return;
    
    const screenW = animationArea.clientWidth;
    const screenH = animationArea.clientHeight;
    
    const targetX = (screenW / 2) - (node.x * targetScale);
    const targetY = (screenH / 2) - (node.y * targetScale);
    
    setCameraTransform(targetX, targetY, targetScale, duration);
}

function fitTreeToScreen() {
    if (!TREE_DATA) return;
    
    const nodes = TREE_DATA.models[currentConfig.depth][currentConfig.criterion];
    
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    nodes.forEach(n => {
        minX = Math.min(minX, n.x);
        maxX = Math.max(maxX, n.x);
        minY = Math.min(minY, n.y);
        maxY = Math.max(maxY, n.y);
    });
    
    const padding = 100;
    const width = maxX - minX + 400;
    const height = maxY - minY + 300;
    
    const animationArea = document.getElementById('animationArea');
    if (!animationArea) return;
    
    const screenW = animationArea.clientWidth;
    const screenH = animationArea.clientHeight;
    
    const scaleX = (screenW - padding) / width;
    const scaleY = (screenH - padding) / height;
    const fitScale = Math.min(scaleX, scaleY, 0.8);
    
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    
    const targetX = (screenW / 2) - (centerX * fitScale);
    const targetY = (screenH / 2) - (centerY * fitScale);
    
    setCameraTransform(targetX, targetY, fitScale, 1500);
}

function handleMouseDown(e) {
    if (!animState.isComplete) return;
    animState.isDragging = true;
    animState.lastMouse = { x: e.clientX, y: e.clientY };
    const treeContainer = document.getElementById('treeContainer');
    if (treeContainer) treeContainer.classList.add('dragging');
}

function handleMouseMove(e) {
    if (!animState.isDragging || !animState.isComplete) return;
    
    const dx = e.clientX - animState.lastMouse.x;
    const dy = e.clientY - animState.lastMouse.y;
    
    setCameraTransform(
        animState.camera.x + dx,
        animState.camera.y + dy,
        animState.camera.scale,
        0
    );
    
    animState.lastMouse = { x: e.clientX, y: e.clientY };
}

function handleMouseUp() {
    animState.isDragging = false;
    const treeContainer = document.getElementById('treeContainer');
    if (treeContainer) treeContainer.classList.remove('dragging');
}

function handleWheel(e) {
    if (!animState.isComplete) return;
    e.preventDefault();
    
    const scaleFactor = 1.1;
    const direction = e.deltaY > 0 ? -1 : 1;
    const newScale = direction > 0
        ? Math.min(animState.camera.scale * scaleFactor, 4)
        : Math.max(animState.camera.scale / scaleFactor, 0.05);
    
    const animationArea = document.getElementById('animationArea');
    if (!animationArea) return;
    
    const rect = animationArea.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const newX = mouseX - (mouseX - animState.camera.x) * (newScale / animState.camera.scale);
    const newY = mouseY - (mouseY - animState.camera.y) * (newScale / animState.camera.scale);
    
    setCameraTransform(newX, newY, newScale, 0);
}
