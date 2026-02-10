// ==========================================
// GLOBAL STATE
// ==========================================
let STATE = {
    currentStep: 0,
    currentBlockIndex: 0, // Track which block within a step is currently active
    currentMode: null, // 'binary' or 'multiclass'
    currentCriterion: null, // 'gini' or 'entropy' (selected after step 4)
    activeSteps: [], // The array of steps currently being used
    stepsStatus: [] // { unlocked: boolean, completed: boolean }
};

// Classification Selector Logic (Initial Screen)
window.selectClassificationType = function (type) {
    console.log("Selection clicked:", type);

    STATE.currentMode = type;
    const selector = document.getElementById('classificationSelector');
    const training = document.getElementById('trainingSection');

    if (!selector || !training) {
        console.error("Critical Error: Elements not found", { selector, training });
        return;
    }

    selector.style.display = 'none';
    training.style.display = 'block';

    // STRICT 7 STEPS STRUCTURE
    // Initial load: Steps 1-4 common, 5-7 placeholders
    if (type === 'binary') {
        STATE.activeSteps = [
            ...BINARY_STEPS_COMMON,
            { title: "Model Training", code: "", output: "", comment: "Waiting for criterion selection...", placeholder: true },
            { title: "Model Evaluation", code: "", output: "", comment: "Waiting for model training...", placeholder: true },
            { title: "Model Simulation", code: "", output: "", comment: "Waiting for evaluation...", placeholder: true }
        ];
    } else {
        STATE.activeSteps = [
            ...MULTICLASS_STEPS_COMMON,
            { title: "Model Training", code: "", output: "", comment: "Waiting for criterion selection...", placeholder: true },
            { title: "Model Evaluation", code: "", output: "", comment: "Waiting for model training...", placeholder: true },
            { title: "Model Simulation", code: "", output: "", comment: "Waiting for evaluation...", placeholder: true }
        ];
    }

    // Initialize steps status
    STATE.stepsStatus = STATE.activeSteps.map((_, i) => ({
        unlocked: i === 0,
        completed: false
    }));

    STATE.currentStep = 0;
    STATE.currentBlockIndex = 0;

    try {
        renderSidebar();
        loadStep(0);
    } catch (e) {
        console.error("Error rendering steps:", e);
        alert("Error rendering steps: " + e.message);
    }
}

// Function to Show Criterion Selector (Called after Step 4 Next click)
function showCriterionSelector() {
    // Hide Code and Output Panes
    document.querySelector('.top-pane').style.display = 'none';
    document.querySelector('.bottom-pane').style.display = 'none';

    // Show Selector Pane
    const selectorPane = document.getElementById('criterionSelectorPane');
    selectorPane.style.display = 'flex';
}

// Criterion Selector Logic (Triggered from new Selector Pane)
window.selectCriterion = function (criterion) {
    console.log("Selected Criterion:", criterion);
    STATE.currentCriterion = criterion;

    // Hide Selector Pane
    const selectorPane = document.getElementById('criterionSelectorPane');
    selectorPane.style.display = 'none';

    // Show Code and Output Panes
    document.querySelector('.top-pane').style.display = 'block';
    document.querySelector('.bottom-pane').style.display = 'flex';

    // Replace placeholders with specific steps
    if (STATE.currentMode === 'binary') {
        const specificSteps = (criterion === 'gini') ? BINARY_STEPS_GINI_SPECIFIC : BINARY_STEPS_ENTROPY_SPECIFIC;
        STATE.activeSteps = [...BINARY_STEPS_COMMON, ...specificSteps];
    } else {
        const specificSteps = (criterion === 'gini') ? MULTICLASS_STEPS_GINI_SPECIFIC : MULTICLASS_STEPS_ENTROPY_SPECIFIC;
        STATE.activeSteps = [...MULTICLASS_STEPS_COMMON, ...specificSteps];
    }

    // Update statuses for new steps
    const oldStatus = [...STATE.stepsStatus];
    STATE.stepsStatus = STATE.activeSteps.map((_, i) => ({
        unlocked: i <= 4 || (oldStatus[i] && oldStatus[i].unlocked),
        completed: i < 4 && oldStatus[i] ? oldStatus[i].completed : false
    }));

    STATE.currentStep = 4;
    STATE.currentBlockIndex = 0;
    renderSidebar();
    loadStep(STATE.currentStep);
}

// Simple Python Syntax Highlighter
function highlightCode(code) {
    if (!code) return '';

    // Escape HTML first
    let text = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Unified Regex for Tokenization (One-Pass)
    // 1. Strings: ("|')(?:\\.|(?!\1).)*\1
    // 2. Comments: (#.*)
    // 3. Keywords: \b(import|...)\b
    // 4. Functions: (\w+)(?=\()
    // 5. Numbers: \b\d+\b
    const tokenRegex = /("|')(?:\\.|(?!\1).)*\1|(#.*)|(\b(?:import|from|as|def|return|if|else|elif|for|while|break|continue|class|try|except|print)\b)|(\w+)(?=\()|(\b\d+\b)/g;

    return text.replace(tokenRegex, (match, quote, comment, keyword, func, number) => {
        if (quote) return `<span class="string">${match}</span>`;
        if (comment) return `<span class="comment">${match}</span>`;
        if (keyword) return `<span class="keyword">${match}</span>`;
        if (func) return `<span class="function">${match}</span>`;
        if (number) return `<span class="number">${match}</span>`;
        return match;
    });
}

// ==========================================
// STEPS DATA - STRICT 7 STEPS
// ==========================================

// --- BINARY CLASSIFICATION (Bank Marketing) ---
const BINARY_STEPS_COMMON = [
    {
        title: "Importing Libraries",
        code: `import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

print("Libraries imported successfully")`,
        output: '<div class="output-success">Libraries imported successfully</div>',
        comment: "Import necessary libraries"
    },
    {
        title: "Loading Dataset",
        code: `df = pd.read_csv("bank_marketing.csv", sep=';')

print("Dataset loaded successfully")`,
        output: '<div class="output-text">Dataset loaded successfully</div>',
        comment: "Load the dataset"
    },
    {
        title: "Data Analysis",
        comment: "Check dataset shape and preview",
        blocks: [
            {
                comment: "Check dataset dimensions",
                code: `print("Dataset shape:", df.shape)`,
                output: '<div class="output-text">Dataset shape: (41188, 21)</div>'
            },
            {
                comment: "Preview first 5 records of the dataset",
                code: `print("First 5 rows:")
print(df.head())`,
                output: `<div class="output-text">First 5 rows:
<table class="dataframe-table">
<thead><tr><th></th><th>age</th><th>job</th><th>marital</th><th>education</th><th>default</th><th>housing</th><th>loan</th><th>contact</th><th>...</th></tr></thead>
<tbody>
<tr><td>0</td><td>56</td><td>housemaid</td><td>married</td><td>basic.4y</td><td>no</td><td>no</td><td>no</td><td>telephone</td><td>...</td></tr>
<tr><td>1</td><td>57</td><td>services</td><td>married</td><td>high.school</td><td>unknown</td><td>no</td><td>no</td><td>telephone</td><td>...</td></tr>
<tr><td>2</td><td>37</td><td>services</td><td>married</td><td>high.school</td><td>no</td><td>yes</td><td>no</td><td>telephone</td><td>...</td></tr>
<tr><td>3</td><td>40</td><td>admin.</td><td>married</td><td>basic.6y</td><td>no</td><td>no</td><td>no</td><td>telephone</td><td>...</td></tr>
<tr><td>4</td><td>56</td><td>services</td><td>married</td><td>high.school</td><td>no</td><td>no</td><td>yes</td><td>telephone</td><td>...</td></tr>
</tbody>
</table>
[5 rows x 21 columns]</div>`
            },
            {
                comment: "Check dataset information and types",
                code: `print("Dataset information:")
df.info()`,
                output: `<div class="output-text">Dataset information:
<pre>&lt;class 'pandas.core.frame.DataFrame'&gt;
RangeIndex: 41188 entries, 0 to 41187
Data columns (total 21 columns):
 #   Column          Non-Null Count  Dtype  
---  ------          --------------  -----  
 0   age             41188 non-null  int64  
 1   job             41188 non-null  object 
 2   marital         41188 non-null  object 
 3   education       41188 non-null  object 
 4   default         41188 non-null  object 
 5   housing         41188 non-null  object 
 6   loan            41188 non-null  object 
 7   contact         41188 non-null  object 
 8   month           41188 non-null  object 
 9   day_of_week     41188 non-null  object 
 10  duration        41188 non-null  int64  
 11  campaign        41188 non-null  int64  
 12  pdays           41188 non-null  int64  
 13  previous        41188 non-null  int64  
 14  poutcome        41188 non-null  object 
 15  emp.var.rate    41188 non-null  float64
 16  cons.price.idx  41188 non-null  float64
 17  cons.conf.idx   41188 non-null  float64
 18  euribor3m       41188 non-null  float64
 19  nr.employed     41188 non-null  float64
 20  y               41188 non-null  object 
dtypes: float64(5), int64(5), object(11)
memory usage: 6.6+ MB</pre></div>`
            }
        ]
    },
    {
        title: "Data Preprocessing",
        blocks: [
            {
                comment: "Perform Label Encoding on categorical variables",
                code: `df_encoded = df.copy()
le = LabelEncoder()

for col in df_encoded.columns:
    if df_encoded[col].dtype == 'object':
        df_encoded[col] = le.fit_transform(df_encoded[col])
        print(f"Encoded column: {col}")

print("\\nCategorical encoding completed")`,
                output: `<div class="output-text">Encoded column: job<br>Encoded column: marital<br>Encoded column: education<br>Encoded column: default<br>Encoded column: housing<br>Encoded column: loan<br>Encoded column: contact<br>Encoded column: month<br>Encoded column: day_of_week<br>Encoded column: poutcome<br>Encoded column: y<br><br>Categorical encoding completed</div>`
            },
            {
                comment: "Separate independent and dependent variables",
                code: `X = df_encoded.drop('y', axis=1)
y = df_encoded['y']

print("Features and target separated")`,
                output: '<div class="output-text">Features and target separated</div>'
            },
            {
                comment: "Split data into Training and Testing sets",
                code: `X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"Training set: {len(X_train)} samples")
print(f"Testing set: {len(X_test)} samples")`,
                output: '<div class="output-text">Training set: 32950 samples<br>Testing set: 8238 samples</div>'
            }
        ]
    }
];

const BINARY_STEPS_GINI_SPECIFIC = [
    {
        title: "Model Training",
        comment: "Train Random Forest (Gini)",
        blocks: [
            {
                comment: "Initialize Random Forest classifier with Gini criterion",
                code: `rf_model = RandomForestClassifier(
    n_estimators=200,
    max_depth=15,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)

print("Random Forest model initialized with Gini criterion")`,
                output: '<div class="output-success">Random Forest model initialized with Gini criterion</div>'
            },
            {
                comment: "Fit the model on training data",
                code: `rf_model.fit(X_train, y_train)

print("Model training completed")
print(rf_model)`,
                output: '<div class="output-success">Model training completed<br>RandomForestClassifier(max_depth=15, min_samples_leaf=2, min_samples_split=5, n_estimators=200, n_jobs=-1, random_state=42)</div>'
            }
        ]
    },
    {
        title: "Model Evaluation",
        comment: "Evaluate model performance",
        blocks: [
            {
                comment: "Generate predictions on test data",
                code: `y_pred = rf_model.predict(X_test)

print(f"Predictions generated for {len(y_pred)} test samples")`,
                output: '<div class="output-success">Predictions generated for 8238 test samples</div>'
            },
            {
                comment: "Calculate overall accuracy of the model",
                code: `accuracy = accuracy_score(y_test, y_pred)

print(f"Accuracy of Random Forest model: {accuracy}")`,
                output: '<div class="output-text">Accuracy of Random Forest model: 0.9225540179655256</div>'
            },
            {
                comment: "Display detailed classification report",
                code: `print(classification_report(y_test, y_pred))`,
                output: `<div class="output-text">Classification Report:
<pre>               precision    recall  f1-score   support

           0       0.94      0.97      0.96      7310
           1       0.71      0.53      0.61       928

    accuracy                           0.92      8238
   macro avg       0.83      0.75      0.78      8238
weighted avg       0.92      0.92      0.92      8238</pre></div>`
            },
            {
                code: `cm = confusion_matrix(y_test, y_pred)

plt.figure(figsize=(6, 4))
sns.heatmap(
    cm,
    annot=True,
    fmt='d',
    cmap='Blues',
    xticklabels=['No', 'Yes'],
    yticklabels=['No', 'Yes']
)
plt.xlabel("Predicted Label")
plt.ylabel("True Label")
plt.title("Confusion Matrix Heatmap (Random Forest)")
plt.show()`,
                output: '<img src="./images/binary_confusion_matrix_gini.png" style="max-width:100%; height:auto; border: 1px solid #ddd;">'
            }
        ]
    },
    {
        title: "Model Simulation",
        comment: "Test prediction on sample data",
        blocks: [
            {
                code: `sample_data = [[56, 1, 1, 0, 0, 0, 0, 1, 0, 0, 261, 1, 999, 0, 0, 1.1, 93.994, -36.4, 4.857, 5191.0]]

prediction = rf_model.predict(sample_data)

if prediction[0] == 0:
    print("Prediction: No (Customer will NOT subscribe)")
else:
    print("Prediction: Yes (Customer will subscribe)")`,
                output: '<div class="output-text">Prediction: No (Customer will NOT subscribe)</div>'
            }
        ]
    }
];

const BINARY_STEPS_ENTROPY_SPECIFIC = [
    {
        title: "Model Training",
        comment: "Train Random Forest (Entropy)",
        blocks: [
            {
                comment: "Initialize Random Forest classifier with Entropy criterion",
                code: `rf_entropy = RandomForestClassifier(
    criterion='entropy',
    random_state=42,
    n_estimators=200,
    max_depth=15,
    min_samples_split=5,
    min_samples_leaf=2,
    n_jobs=-1
)

print("Random Forest model initialized with Entropy criterion")`,
                output: '<div class="output-success">Random Forest model initialized with Entropy criterion</div>'
            },
            {
                comment: "Fit the model on training data",
                code: `rf_entropy.fit(X_train, y_train)

print("Model training completed")`,
                output: '<div class="output-success">Model training completed</div>'
            }
        ]
    },
    {
        title: "Model Evaluation",
        comment: "Evaluate model performance",
        blocks: [
            {
                comment: "Generate predictions on test data",
                code: `y_pred = rf_entropy.predict(X_test)

print(f"Predictions generated for {len(y_pred)} test samples")`,
                output: '<div class="output-success">Predictions generated for 8238 test samples</div>'
            },
            {
                comment: "Calculate overall model accuracy",
                code: `accuracy = accuracy_score(y_test, y_pred)

print(f"Overall Accuracy: {accuracy:.4f}")`,
                output: '<div class="output-text">Overall Accuracy: 0.9226</div>'
            },
            {
                comment: "Display detailed classification report",
                code: `print(classification_report(y_test, y_pred))`,
                output: `<div class="output-text">Classification Report:
<pre>               precision    recall  f1-score   support

           0       0.94      0.98      0.96      7310
           1       0.72      0.51      0.60       928

    accuracy                           0.92      8238
   macro avg       0.83      0.74      0.78      8238
weighted avg       0.92      0.92      0.92      8238</pre></div>`
            },
            {
                code: `cm = confusion_matrix(y_test, y_pred)

plt.figure(figsize=(8, 6))
sns.heatmap(
    cm,
    annot=True,
    fmt='d',
    cmap='Blues',
    xticklabels=['No', 'Yes'],
    yticklabels=['No', 'Yes']
)
plt.xlabel("Predicted Class")
plt.ylabel("Actual Class")
plt.title("Confusion Matrix - Random Forest Classifier")
plt.show()`,
                output: '<img src="./images/binary_confusion_matrix_entropy.png" style="max-width:100%; height:auto; border: 1px solid #ddd;">'
            }
        ]
    },
    {
        title: "Model Simulation",
        comment: "Test prediction on sample data",
        blocks: [
            {
                code: `sample_data = [[56, 1, 1, 0, 0, 0, 0, 1, 0, 0, 261, 1, 999, 0, 0, 1.1, 93.994, -36.4, 4.857, 5191.0]]

prediction = rf_entropy.predict(sample_data)

if prediction[0] == 0:
    print("Prediction: No (Customer will NOT subscribe)")
else:
    print("Prediction: Yes (Customer will subscribe)")`,
                output: '<div class="output-text">Prediction: No (Customer will NOT subscribe)</div>'
            }
        ]
    }
];

// --- MULTI-CLASS CLASSIFICATION (Seeds Dataset) ---
const MULTICLASS_STEPS_COMMON = [
    {
        title: "Importing Libraries",
        blocks: [
            {
                comment: "Import core data handling libraries",
                code: `import pandas as pd
import numpy as np

print("Pandas and Numpy imported")`,
                output: '<div class="output-success">Pandas and Numpy imported</div>'
            },
            {
                comment: "Import machine learning models and utilities",
                code: `from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

print("Scikit-learn modules imported")`,
                output: '<div class="output-success">Scikit-learn modules imported</div>'
            },
            {
                comment: "Import visualization tools",
                code: `import matplotlib.pyplot as plt
import seaborn as sns

print("Visualization libraries imported")`,
                output: '<div class="output-success">Visualization libraries imported</div>'
            }
        ]
    },
    {
        title: "Loading Dataset",
        blocks: [
            {
                comment: "Define dataset column names",
                code: `column_names = [
    "Area", "Perimeter", "Compactness", 
    "Length_of_kernel", "Width_of_kernel", 
    "Asymmetry_coefficient", "Length_of_kernel_groove", "Class"
]

print("Column names defined:", column_names)`,
                output: '<div class="output-text">Column names defined: ["Area", "Perimeter", "Compactness", "Length_of_kernel", "Width_of_kernel", "Asymmetry_coefficient", "Length_of_kernel_groove", "Class"]</div>'
            },
            {
                comment: "Load Seeds dataset from local file",
                code: `df = pd.read_csv("seeds_dataset.txt", sep=r"\\s+", header=None, names=column_names)

print("Dataset loaded from seeds_dataset.txt")`,
                output: '<div class="output-success">Dataset loaded from seeds_dataset.txt</div>'
            }
        ]
    },
    {
        title: "Data Analysis",
        blocks: [
            {
                comment: "Check dataset dimensions",
                code: `print("Dataset shape:", df.shape)`,
                output: '<div class="output-text">Dataset shape: (210, 8)</div>'
            },
            {
                comment: "Preview first 5 records of the dataset",
                code: `print("First 5 rows:")
print(df.head())`,
                output: `<div class="output-text">First 5 rows:
<table class="dataframe-table">
    <thead>
        <tr><th></th><th>Area</th><th>Perimeter</th><th>Compactness</th><th>Length_of_kernel</th><th>Width_of_kernel</th><th>Asymmetry_coefficient</th><th>Length_of_kernel_groove</th><th>Class</th></tr>
    </thead>
    <tbody>
        <tr><th>0</th><td>15.26</td><td>14.84</td><td>0.8710</td><td>5.763</td><td>3.312</td><td>2.221</td><td>5.220</td><td>1</td></tr>
        <tr><th>1</th><td>14.88</td><td>14.57</td><td>0.8811</td><td>5.554</td><td>3.333</td><td>1.018</td><td>4.956</td><td>1</td></tr>
        <tr><th>2</th><td>14.29</td><td>14.09</td><td>0.9050</td><td>5.291</td><td>3.337</td><td>2.699</td><td>4.825</td><td>1</td></tr>
        <tr><th>3</th><td>13.84</td><td>13.94</td><td>0.8955</td><td>5.324</td><td>3.379</td><td>2.259</td><td>4.805</td><td>1</td></tr>
        <tr><th>4</th><td>16.14</td><td>14.99</td><td>0.9034</td><td>5.658</td><td>3.562</td><td>1.355</td><td>5.175</td><td>1</td></tr>
    </tbody>
</table></div>`
            },
            {
                comment: "Check the distribution of target classes",
                code: `print("Class distribution:")
print(df["Class"].value_counts())`,
                output: `<div class="output-text">Class distribution:<br>
1    70<br>
2    70<br>
3    70<br>
Name: Class, dtype: int64</div>`
            },
            {
                comment: "Generate descriptive statistical summary",
                code: `print("Statistical summary:")
print(df.describe())`,
                output: `<div class="output-text">Statistical summary:
<div class="table-wrapper"><div class="table-scroll-container"><table class="dataframe-table">
    <thead>
        <tr><th></th><th>Area</th><th>Perimeter</th><th>Compactness</th><th>Length_of_kernel</th><th>Width_of_kernel</th><th>Asymmetry_coefficient</th><th>Length_of_kernel_groove</th><th>Class</th></tr>
    </thead>
    <tbody>
        <tr><th>count</th><td>210.000000</td><td>210.000000</td><td>210.000000</td><td>210.000000</td><td>210.000000</td><td>210.000000</td><td>210.000000</td><td>210.000000</td></tr>
        <tr><th>mean</th><td>14.847524</td><td>14.559286</td><td>0.870999</td><td>5.628533</td><td>3.258605</td><td>3.700201</td><td>5.408071</td><td>2.000000</td></tr>
        <tr><th>std</th><td>2.909699</td><td>1.305959</td><td>0.023629</td><td>0.443063</td><td>0.377714</td><td>1.503557</td><td>0.491480</td><td>0.818448</td></tr>
        <tr><th>min</th><td>10.590000</td><td>12.410000</td><td>0.808100</td><td>4.899000</td><td>2.630000</td><td>0.765100</td><td>4.519000</td><td>1.000000</td></tr>
        <tr><th>25%</th><td>12.270000</td><td>13.450000</td><td>0.856900</td><td>5.262250</td><td>2.944000</td><td>2.561500</td><td>5.045000</td><td>1.000000</td></tr>
        <tr><th>50%</th><td>14.355000</td><td>14.320000</td><td>0.873450</td><td>5.523500</td><td>3.237000</td><td>3.599000</td><td>5.223000</td><td>2.000000</td></tr>
        <tr><th>75%</th><td>17.305000</td><td>15.715000</td><td>0.887775</td><td>5.979750</td><td>3.561750</td><td>4.768750</td><td>5.877000</td><td>3.000000</td></tr>
        <tr><th>max</th><td>21.180000</td><td>17.250000</td><td>0.918300</td><td>6.675000</td><td>4.033000</td><td>8.456000</td><td>6.550000</td><td>3.000000</td></tr>
    </tbody>
</table></div></div></div>`
            }
        ]
    },
    {
        title: "Data Preprocessing",
        blocks: [
            {
                comment: "Separate features and target variable",
                code: `X = df.drop("Class", axis=1)
y = df["Class"]

print("Features and target separated")`,
                output: '<div class="output-text">Features and target separated</div>'
            },
            {
                comment: "Split data into training (75%) and testing (25%) sets",
                code: `X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y
)

print(f"Training set: {len(X_train)} samples")
print(f"Testing set: {len(X_test)} samples")`,
                output: '<div class="output-text">Training set: 157 samples<br>Testing set: 53 samples</div>'
            }
        ]
    }
];

const MULTICLASS_STEPS_GINI_SPECIFIC = [
    {
        title: "Model Training",
        blocks: [
            {
                comment: "Initialize Random Forest with GINI criterion",
                code: `rf_gini = RandomForestClassifier(n_estimators=100, criterion="gini", random_state=42)

print("Random Forest model (Gini) initialized")`,
                output: '<div class="output-text">Random Forest model (Gini) initialized</div>'
            },
            {
                comment: "Train Random Forest model using GINI",
                code: `rf_gini.fit(X_train, y_train)

print("Model training completed")
print(rf_gini)`,
                output: '<div class="output-success">Model training completed<br>RandomForestClassifier(random_state=42)</div>'
            }
        ]
    },
    {
        title: "Model Evaluation",
        blocks: [
            {
                comment: "Calculate and display GINI model accuracy",
                code: `accuracy = accuracy_score(y_test, rf_gini.predict(X_test))

print(f"Model accuracy: {accuracy}")`,
                output: '<div class="output-text">Model accuracy: 0.9056603773584906</div>'
            },
            {
                comment: "Display detailed classification report for GINI model",
                code: `print(classification_report(y_test, rf_gini.predict(X_test)))`,
                output: `<div class="output-text">
<pre>              precision    recall  f1-score   support

           1       0.93      0.76      0.84        17
           2       0.95      1.00      0.97        18
           3       0.85      0.94      0.89        18

    accuracy                           0.91        53
   macro avg       0.91      0.90      0.90        53
weighted avg       0.91      0.91      0.90        53</pre></div>`
            },
            {
                comment: "Plot confusion matrix for GINI model predictions",
                code: `cm_gini = confusion_matrix(y_test, rf_gini.predict(X_test))
sns.heatmap(cm_gini, annot=True, fmt="d", cmap="Blues")
plt.title("Confusion Matrix - GINI")
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.show()`,
                output: '<img src="./images/confusion_matrix_gini.png" style="max-width:100%; height:auto; border: 1px solid #ddd;">'
            }
        ]
    },
    {
        title: "Model Simulation",
        blocks: [
            {
                comment: "Select sample test indices representing different classes",
                code: `sample_idx = [0, 20, 40]

print("Sample indices selected:", sample_idx)`,
                output: '<div class="output-text">Sample indices selected: [0, 20, 40]</div>'
            },
            {
                comment: "Perform manual prediction and compare with true labels",
                code: `samples = X_test.iloc[sample_idx]
true_labels = y_test.iloc[sample_idx]
preds = rf_gini.predict(samples)

for i in range(len(sample_idx)):
    print(f"Sample {i+1} Prediction: {preds[i]} (True: {true_labels.iloc[i]})")`,
                output: `<div class="output-text"><pre>Sample 1 Prediction: 1 (True: 1)
Sample 2 Prediction: 2 (True: 2)
Sample 3 Prediction: 3 (True: 3)</pre></div>`
            }
        ]
    }
];

const MULTICLASS_STEPS_ENTROPY_SPECIFIC = [
    {
        title: "Model Training",
        blocks: [
            {
                comment: "Initialize Random Forest with ENTROPY criterion",
                code: `rf_entropy = RandomForestClassifier(n_estimators=100, criterion="entropy", random_state=42)

print("Random Forest model (Entropy) initialized")`,
                output: '<div class="output-text">Random Forest model (Entropy) initialized</div>'
            },
            {
                comment: "Train Random Forest model using ENTROPY",
                code: `rf_entropy.fit(X_train, y_train)

print("Model training completed")
print(rf_entropy)`,
                output: `<div class="output-success">Model training completed<br>RandomForestClassifier(criterion='entropy', random_state=42)</div>`
            }
        ]
    },
    {
        title: "Model Evaluation",
        blocks: [
            {
                comment: "Calculate and display ENTROPY model accuracy",
                code: `accuracy = accuracy_score(y_test, rf_entropy.predict(X_test))

print(f"Model accuracy: {accuracy}")`,
                output: '<div class="output-text">Model accuracy: 0.8867924528301887</div>'
            },
            {
                comment: "Display detailed classification report for ENTROPY model",
                code: `print(classification_report(y_test, rf_entropy.predict(X_test)))`,
                output: `<div class="output-text">Classification Report:
<pre>              precision    recall  f1-score   support

           1       0.88      0.82      0.85        17
           2       0.95      1.00      0.97        18
           3       0.84      0.83      0.83        18

    accuracy                           0.89        53
   macro avg       0.89      0.89      0.88        53
weighted avg       0.89      0.89      0.89        53</pre></div>`
            },
            {
                comment: "Plot confusion matrix for ENTROPY model predictions",
                code: `cm_entropy = confusion_matrix(y_test, rf_entropy.predict(X_test))
sns.heatmap(cm_entropy, annot=True, fmt="d", cmap="Blues")
plt.title("Confusion Matrix - ENTROPY")
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.show()`,
                output: '<img src="./images/confusion_matrix_entropy.png" style="max-width:100%; height:auto; border: 1px solid #ddd;">'
            }
        ]
    },
    {
        title: "Model Simulation",
        blocks: [
            {
                comment: "Select sample test indices representing different classes",
                code: `sample_idx = [0, 20, 40]

print("Sample indices selected:", sample_idx)`,
                output: '<div class="output-text">Sample indices selected: [0, 20, 40]</div>'
            },
            {
                comment: "Perform manual prediction and compare with true labels",
                code: `samples = X_test.iloc[sample_idx]
true_labels = y_test.iloc[sample_idx]
preds = rf_entropy.predict(samples)

for i in range(len(sample_idx)):
    print(f"Sample {i+1} Prediction: {preds[i]} (True: {true_labels.iloc[i]})")`,
                output: `<div class="output-text"><pre>Sample 1 Prediction: 1 (True: 1)
Sample 2 Prediction: 2 (True: 2)
Sample 3 Prediction: 3 (True: 3)</pre></div>`
            }
        ]
    }
];


// ==========================================
// RENDER & NAVIGATION LOGIC
// ==========================================

function updateUI() {
    const runBtn = document.getElementById('runBtn');
    const headerBar = document.getElementById('codeHeaderBar');

    // Safety check for activeSteps
    if (!STATE.activeSteps || STATE.activeSteps.length === 0) return;

    // Update Header Bar - Handle Blocks and Steps
    const currentStepObj = STATE.activeSteps[STATE.currentStep];
    let headerComment = "";

    if (currentStepObj) {
        // Prefer block-level comment if in blocks mode
        if (currentStepObj.blocks && currentStepObj.blocks[STATE.currentBlockIndex]) {
            headerComment = currentStepObj.blocks[STATE.currentBlockIndex].comment || currentStepObj.comment || "";
        } else {
            headerComment = currentStepObj.comment || "";
        }
    }

    if (headerBar) {
        if (headerComment) {
            headerBar.innerText = "# " + headerComment;
            headerBar.style.display = 'block';
        } else {
            headerBar.style.display = 'none';
        }
    }

    // Reset Run Button to default Play state
    if (runBtn) {
        runBtn.style.display = 'flex';
        runBtn.classList.remove('completed', 'arrow-mode');
        runBtn.style.backgroundColor = '#F57C2A'; // Orange default
        runBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
        runBtn.disabled = false;
        runBtn.onclick = () => runStep(STATE.currentStep);
    }
}

function renderSidebar() {
    const container = document.getElementById('stepsContainer');
    container.innerHTML = '';

    STATE.activeSteps.forEach((step, index) => {
        const btn = document.createElement('button');
        btn.className = 'step-btn';
        const status = STATE.stepsStatus[index];

        // Status Styling
        if (status && status.completed) {
            btn.classList.add('completed');
            // Add active class to current completed step for black border
            if (index === STATE.currentStep) {
                btn.classList.add('active');
            }
            btn.innerHTML = `✓ ${step.title}`;
        } else if (index === STATE.currentStep) {
            btn.classList.add('active');
            btn.innerHTML = `${index + 1}. ${step.title}`;
        } else if (status && status.unlocked) {
            btn.classList.add('unlocked');
            btn.innerHTML = `${index + 1}. ${step.title}`;
        } else {
            btn.classList.add('disabled');
            btn.innerHTML = `${index + 1}. ${step.title}`;
        }

        // Click to navigate
        if (status && status.unlocked) {
            btn.onclick = () => loadStep(index);
            btn.style.cursor = 'pointer';
        } else {
            btn.disabled = true;
        }

        container.appendChild(btn);
    });

    // Add Restart Button at the end (Matched to Decision Trees)
    const restartBtn = document.createElement('button');
    restartBtn.classList.add('step-btn');
    restartBtn.classList.add('restart-btn');
    restartBtn.innerText = "Restart Experiment";
    restartBtn.style.textAlign = 'center';
    restartBtn.style.marginTop = "auto"; // Critical for layout
    restartBtn.onclick = () => selectClassificationType(STATE.currentMode);
    container.appendChild(restartBtn);

    // Add Download Button below Restart (Matched to Decision Trees)
    const downloadBtn = document.createElement('button');
    downloadBtn.classList.add('step-btn');
    downloadBtn.classList.add('download-btn');
    downloadBtn.style.textAlign = 'center';
    downloadBtn.style.marginTop = "10px";
    downloadBtn.style.marginBottom = "20px";
    downloadBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" style="margin-right:8px; vertical-align: middle;">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Download Experiment
    `;
    
    // Check if all steps are completed
    const allCompleted = checkAllStepsCompleted();
    if (allCompleted) {
        downloadBtn.style.backgroundColor = "#F57C2A";
        downloadBtn.style.color = "white";
        downloadBtn.style.opacity = "1";
        downloadBtn.style.cursor = "pointer";
        downloadBtn.disabled = false;
        downloadBtn.onclick = downloadTrainingAsPDF;
    } else {
        downloadBtn.style.backgroundColor = "#ccc";
        downloadBtn.style.color = "#666";
        downloadBtn.style.opacity = "0.7";
        downloadBtn.style.cursor = "not-allowed";
        downloadBtn.disabled = true;
        downloadBtn.title = "Complete all steps to download the report";
    }
    container.appendChild(downloadBtn);
}

// Function to check if all steps are completed
function checkAllStepsCompleted() {
    return STATE.stepsStatus.every(status => status.completed);
}

function loadStep(index, blockIdx = 0) {
    if (!STATE.activeSteps || index >= STATE.activeSteps.length) return;

    const step = STATE.activeSteps[index];
    const codeDisplay = document.getElementById('codeDisplay');
    const outputDisplay = document.getElementById('outputDisplay');

    // ENSURE CODE/OUTPUT PANES ARE VISIBLE (and Selector is hidden)
    document.querySelector('.top-pane').style.display = 'block';
    document.querySelector('.bottom-pane').style.display = 'flex';
    document.getElementById('criterionSelectorPane').style.display = 'none';

    // Update current step and block index
    STATE.currentStep = index;
    STATE.currentBlockIndex = blockIdx;

    // Handle blocks array structure OR legacy single code/output
    if (codeDisplay) {
        if (step.blocks && Array.isArray(step.blocks) && step.blocks.length > 0) {
            const currentBlock = step.blocks[STATE.currentBlockIndex];
            if (currentBlock) {
                codeDisplay.innerHTML = highlightCode(currentBlock.code);
            }
        } else if (step.code) {
            codeDisplay.innerHTML = highlightCode(step.code);
        }
    }

    // Clear Output (placeholder) and reset active styling
    const bottomPane = document.querySelector('.bottom-pane');
    if (bottomPane) {
        bottomPane.classList.remove('active-output');
    }
    if (outputDisplay) {
        outputDisplay.innerHTML = '<div class="placeholder-text">Click the Run button to execute...</div>';
    }

    // Update UI (header bar and button)
    updateUI();

    // Update sidebar to reflect current step
    renderSidebar();
}

function runStep(index) {
    const step = STATE.activeSteps[index];
    const outputDisplay = document.getElementById('outputDisplay');
    const runBtn = document.getElementById('runBtn');

    // Check if this step has blocks
    const hasBlocks = step.blocks && Array.isArray(step.blocks) && step.blocks.length > 0;
    const totalBlocks = hasBlocks ? step.blocks.length : 1;
    const isLastBlock = STATE.currentBlockIndex >= totalBlocks - 1;

    // 1. Loading State
    outputDisplay.innerHTML = '<div class="loading-spinner">Running code...</div>';
    runBtn.disabled = true;

    // 2. Simulated Delay
    setTimeout(() => {
        // 3. Show Output
        if (hasBlocks) {
            const currentBlock = step.blocks[STATE.currentBlockIndex];
            if (currentBlock) {
                outputDisplay.innerHTML = currentBlock.output;
            }
        } else if (step.output) {
            outputDisplay.innerHTML = step.output;
        }
        outputDisplay.scrollTop = outputDisplay.scrollHeight;

        // Apply active output styling (light blue background + green border)
        const bottomPane = document.querySelector('.bottom-pane');
        if (bottomPane) {
            bottomPane.classList.add('active-output');
        }

        // 4. Update Button State to Checkmark (Success)
        runBtn.classList.add('completed');
        runBtn.style.backgroundColor = '#A6CE63'; // Green
        runBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

        // Mark partial status if needed (optional here)
        renderSidebar();

        // 5. Handle Next Logic after delay
        setTimeout(() => {
            // Step 4 (Preprocessing) Special Logic for Branching
            if (index === 3 && isLastBlock) {
                runBtn.style.backgroundColor = '#5FA8E4'; // Blue
                runBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
                runBtn.disabled = false;
                runBtn.onclick = () => {
                    STATE.stepsStatus[index].completed = true;
                    showCriterionSelector();
                };
                return;
            }

            // If more blocks in this step
            if (!isLastBlock) {
                runBtn.style.backgroundColor = '#5FA8E4'; // Blue
                runBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
                runBtn.disabled = false;
                runBtn.onclick = () => {
                    STATE.currentBlockIndex++;
                    loadStep(STATE.currentStep, STATE.currentBlockIndex);
                };
            } else {
                // Step Fully Completed
                STATE.stepsStatus[index].completed = true;
                if (index < STATE.activeSteps.length - 1) {
                    STATE.stepsStatus[index + 1].unlocked = true;
                }
                renderSidebar();

                if (index < STATE.activeSteps.length - 1) {
                    runBtn.style.backgroundColor = '#5FA8E4'; // Blue
                    runBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
                    runBtn.disabled = false;
                    runBtn.onclick = () => {
                        loadStep(STATE.currentStep + 1, 0);
                    };
                } else {
                    // Final finish
                    runBtn.style.backgroundColor = '#5FA8E4';
                    runBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
                    runBtn.disabled = false;
                    runBtn.onclick = showCompletionMessage;
                }
            }
        }, 500);
    }, 500);
}

function showCompletionMessage() {
    const outputDisplay = document.getElementById('outputDisplay');
    const runBtn = document.getElementById('runBtn');

    outputDisplay.innerHTML = `
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; min-height: 50vh; text-align: center; gap: 20px;">
            <div>
                <h2 style="color: #3d8b8b; font-family: 'Courier New', monospace; font-size: 2rem; font-weight: bold; margin-bottom: 10px;">
                    Experiment Completed! 
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b5b95" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-left: 5px;">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </h2>
                <p style="color: #555; font-size: 1.1rem; font-family: 'Courier New', monospace;">You have completed random forest successfully!</p>
            </div>

            <button onclick="RF_ANIMATOR.open(STATE.currentMode)" style="
                background: #1e293b;
                color: white;
                border: none;
                padding: 16px 32px;
                border-radius: 12px;
                font-weight: 700;
                font-size: 1rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 12px;
                transition: all 0.2s;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            " onmouseover="this.style.background='#334155'; this.style.transform='translateY(-2px)'" 
               onmouseout="this.style.background='#1e293b'; this.style.transform='translateY(0)'">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Enter Interactive Animation
            </button>
        </div>
    `;
    runBtn.disabled = true;
    runBtn.style.backgroundColor = '#ccc';
    runBtn.style.cursor = 'default';
}

// PDF Download (Simplified from LR/DT)
function downloadTrainingAsPDF() {
    try {
        // Download the pre-built PDF shipped with the experiment.
        const pdfPath = './exp-random-forest.pdf';
        const a = document.createElement('a');
        a.href = pdfPath;
        a.download = 'exp-random-forest.pdf';
        // For browsers that require the element in DOM
        document.body.appendChild(a);
        a.click();
        a.remove();
    } catch (e) {
        console.error('Download Error:', e);
        alert('Could not download the experiment PDF.');
    }
}
// End of file
