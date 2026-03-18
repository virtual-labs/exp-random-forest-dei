## Part 1: Binary Classification (Bank Marketing Dataset)

The objective of this part is to classify bank customers into two categories (subscribed / not subscribed to a term deposit) using a Random Forest classifier, compare its performance against a single Decision Tree, and explore how key hyperparameters affect accuracy and generalisation.

**Step 1:** Import the required libraries: `numpy`, `pandas`, `matplotlib`, `seaborn`, and the relevant modules from `sklearn` (tree, ensemble, model_selection, metrics).

**Step 2:** Load the Bank Marketing dataset (`bank_marketing.csv`). The dataset contains approximately 45,211 records from direct phone-based marketing campaigns by a Portuguese bank. It includes 20 feature columns describing customer demographics, financial status, and campaign details, along with a binary target variable indicating subscription outcome (yes/no).

**Step 3:** Perform Exploratory Data Analysis:
- Use `head()`, `info()`, `describe()`, and `isnull().sum()` to understand the structure and quality of the data.
- Check the class distribution of the target variable using `value_counts()` to identify any class imbalance.

**Step 4:** Define Features and Target:
- **Features (X):** age, job, marital, education, default, housing, loan, contact, month, day_of_week, duration, campaign, pdays, previous, poutcome, emp.var.rate, cons.price.idx, cons.conf.idx, euribor3m, nr.employed.
- **Target (Y):** subscription outcome (yes / no).
- Encode categorical features using `LabelEncoder` or `pd.get_dummies()`.

**Step 5:** Split the dataset into 80% Training Set and 20% Testing Set using `train_test_split()` with a fixed `random_state` for reproducibility.

**Step 6:** Train a Single Decision Tree as Baseline:
- Initialize a `DecisionTreeClassifier` with `max_depth=5` and `criterion='gini'`.
- Fit on the training data and record its test accuracy. This serves as a baseline to compare against the Random Forest.

**Step 7:** Train a Random Forest Classifier:
- Initialize `RandomForestClassifier` with `n_estimators=100`, `criterion='gini'`, and `random_state=42`.
- Fit on the training data and record test accuracy.
- Compare the Random Forest accuracy with the single Decision Tree from Step 6 to observe the ensemble improvement.

**Step 8:** Hyperparameter Exploration:
- **Vary `n_estimators`** (e.g., 10, 50, 100, 200, 500): Train a Random Forest for each value, record the test accuracy, and plot accuracy vs. number of trees to observe diminishing returns.
- **Vary `max_depth`** (e.g., 3, 5, 10, 20, None): Observe the trade-off between underfitting and overfitting.
- **Vary `max_features`** (e.g., 'sqrt', 'log2', 0.5, 1.0): Observe how feature randomness affects performance and tree diversity.

**Step 9:** OOB Score Analysis:
- Train a `RandomForestClassifier` with `oob_score=True` and access `oob_score_` after fitting.
- Compare the OOB score with the test set accuracy to verify that OOB provides a reliable estimate of generalisation without a separate validation set.

**Step 10:** Feature Importance Visualisation:
- Extract `feature_importances_` from the trained Random Forest.
- Plot a horizontal bar chart to show the relative importance of each feature.
- Identify which features contribute most to the classification and discuss how this aids interpretation.

**Step 11:** Evaluate Model Performance:
- Generate predictions on the test set using the best Random Forest configuration.
- Compute Accuracy, Precision, Recall, and F1-Score.
- Plot a Confusion Matrix heatmap to visualise true positives, true negatives, false positives, and false negatives.
- Display the full Classification Report using `classification_report()`.

---

## Part 2: Multi-Class Classification (Seeds Dataset)

The objective of this part is to classify wheat seeds into three varieties (Kama, Rosa, and Canadian) based on geometric measurements, using a Random Forest classifier. This part reinforces ensemble concepts in a multi-class setting and includes comparative analysis and hyperparameter tuning.

**Step 1:** Import the required libraries: `numpy`, `pandas`, `matplotlib`, `seaborn`, and the relevant modules from `sklearn`.

**Step 2:** Load the Seeds dataset (`Seeds_Dataset.csv`). The dataset contains 210 wheat seed samples with 7 numerical features (Area, Perimeter, Compactness, Length of Kernel, Width of Kernel, Asymmetry Coefficient, Length of Kernel Groove) and a class label identifying the seed variety (1, 2, or 3).

**Step 3:** Perform Exploratory Data Analysis:
- Use `head()`, `info()`, `describe()`, and `isnull().sum()` to inspect the data.
- Check class distribution using `value_counts()`.
- Plot pairwise scatter plots or histograms to visualise feature distributions across the three classes.

**Step 4:** Define Features and Target:
- **Features (X):** Area, Perimeter, Compactness, Length of Kernel, Width of Kernel, Asymmetry Coefficient, Length of Kernel Groove.
- **Target (Y):** Class (1, 2, or 3).

**Step 5:** Split the dataset into 80% Training Set and 20% Testing Set using `train_test_split()` with stratified sampling to preserve class proportions.

**Step 6:** Train a Single Decision Tree as Baseline:
- Initialize a `DecisionTreeClassifier` with `criterion='gini'`.
- Fit on the training data and record test accuracy for comparison.

**Step 7:** Train a Random Forest Classifier:
- Initialize `RandomForestClassifier` with `n_estimators=150`, `criterion='gini'`, and `random_state=42`.
- Fit on the training data, record test accuracy, and compare with the Decision Tree baseline.

**Step 8:** Hyperparameter Exploration:
- **Vary `n_estimators`** (e.g., 10, 50, 100, 150, 300): Plot accuracy vs. number of trees.
- **Vary `max_depth`** (e.g., 3, 5, 10, None): Observe the impact on multi-class performance.
- **Vary `criterion`** ('gini' vs. 'entropy'): Compare the two splitting strategies and note any differences in accuracy or tree structure.

**Step 9:** OOB Score Analysis:
- Enable `oob_score=True` and compare `oob_score_` with test accuracy.
- Discuss how OOB eliminates the need for cross-validation and provides a quick generalisation estimate.

**Step 10:** Feature Importance Visualisation:
- Extract and plot `feature_importances_` as a bar chart.
- Identify which geometric measurements are most influential in distinguishing the three seed varieties.

**Step 11:** Evaluate Model Performance:
- Generate predictions on the test set.
- Compute Accuracy, Precision (macro), Recall (macro), and F1-Score (macro).
- Plot a Confusion Matrix heatmap to visualise per-class performance.
- Display the full Classification Report with per-class precision, recall, and F1-Score.