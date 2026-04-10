<style>
.formula-block {
text-align: center;
margin: 18px 0;
}

.equation-card {
display: inline-block;
padding: 16px 28px;
background: #f3f3f3;
border-radius: 2px;
box-shadow: inset 0 0 0 1px rgba(0,0,0,0.04);
}

.formula-svg {
display: block;
height: auto;
max-width: 100%;
}

.math-inline {
font-family: "Cambria Math", "Times New Roman", "Georgia", serif;
font-style: italic;
font-size: 1.02em;
white-space: nowrap;
}

.figure-block {
text-align: center;
margin: 24px 0;
}

.figure-block img {
border-radius: 12px;
box-shadow: 0 2px 12px rgba(0,0,0,0.10);
}

.figure-caption {
color: #64748b;
font-size: 0.92rem;
margin-top: 8px;
font-style: italic;
}
</style>

A Random Forest is a supervised ensemble learning algorithm used for both classification and regression tasks. Instead of relying on a single decision tree (which can easily overfit the training data), Random Forest builds many decision trees during training and combines their outputs to produce a more accurate and stable prediction. Each individual tree in the forest may be a relatively weak learner on its own, but when many such trees vote together, the ensemble becomes a strong learner with significantly improved generalisation.

### 1. From a Single Decision Tree to a Forest

A single Decision Tree learns by recursively splitting data on features to create decision rules. While simple and interpretable, it has a key limitation: high variance. Small changes in training data can produce a completely different tree, leading to overfitting. Random Forest addresses this by building an ensemble of many decision trees and aggregating their predictions. The core idea is:

> Many weak learners, each slightly different, can combine to form one strong learner.

The two sources of randomness that make the trees diverse are Bootstrap Sampling (Bagging) and Random Feature Selection, explained below.

<div class="figure-block">
<img src="images/dt_vs_rf.png" alt="Single Decision Tree vs Random Forest" style="max-width:820px; width:100%;"/>
<p class="figure-caption">Figure 1 - A single Decision Tree (left) vs. a Random Forest ensemble (right). Each tree votes independently and the final prediction is made via majority voting.</p>
</div>

### 2. Bootstrap Sampling (Bagging)

Bagging (Bootstrap Aggregating) is the first source of randomness. For each tree in the forest:

1. A bootstrap sample is created by randomly selecting N samples with replacement from the original training set of N samples.
2. On average, each bootstrap sample contains about 63% of unique training samples (since sampling is with replacement, some samples appear more than once and some are left out).
3. The remaining ~37% of samples that are not selected for a given tree are called Out-of-Bag (OOB) samples. These act as a built-in validation set for that tree.

<div class="figure-block">
<img src="images/bootstrap_sampling.png" alt="Bootstrap Sampling" style="max-width:750px; width:100%;"/>
<p class="figure-caption">Figure 2 - Bootstrap sampling: each tree receives a different random subset (with replacement) of the training data. Unselected samples become OOB samples.</p>
</div>

Because each tree is trained on a different subset, the trees learn slightly different patterns, making their errors less correlated. When combined, the variance of the overall model drops significantly.

### 3. Random Feature Selection

The second source of randomness occurs at every split during tree construction. Instead of evaluating all available features to find the best split, each node only considers a random subset of <span class="math-inline">m</span> features (typically <span class="math-inline">m = √p</span> for classification, where <span class="math-inline">p</span> is the total number of features).

This prevents dominant features from appearing at the root of every tree, forcing the forest to explore a wider variety of feature interactions. Without this step, all trees would look very similar despite using different bootstrap samples.

<div class="figure-block">
<img src="images/feature_randomness.png" alt="Feature Randomness at Each Split" style="max-width:750px; width:100%;"/>
<p class="figure-caption">Figure 3 - At each node, only a random subset of features (highlighted) is evaluated. Different nodes and different trees use different subsets.</p>
</div>

### 4. Bagging + Feature Randomness: Working Together

The power of Random Forest comes from combining both sources of randomness:

| Source of Randomness | What it does | Effect |
|---|---|---|
| Bootstrap Sampling | Each tree trains on a different data subset | Reduces variance by decorrelating trees |
| Feature Randomness | Each split considers a random feature subset | Prevents dominant features from making trees similar |
| Combined Effect | Trees are diverse in both data and features | Ensemble is robust, low-variance, and generalises well |

<div class="figure-block">
<img src="images/bagging_plus_feature_randomness.jpg" alt="Bagging + Feature Randomness" style="max-width:820px; width:100%;"/>
<p class="figure-caption">Figure 4 - Random Forest = Bagging (different data subsets) + Feature Randomness (different feature subsets at each split). This dual randomness produces a diverse, high-performing ensemble.</p>
</div>

### 5. Splitting Criteria

At each node, the best split is chosen from the randomly selected feature subset using an impurity measure. The two commonly used criteria are:

Gini Impurity measures the probability of misclassifying a randomly chosen sample:

<div class="formula-block">
<div class="equation-card">
<svg class="formula-svg" width="170" height="68" viewBox="0 0 170 68" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Gini equals 1 minus the summation from i equals 1 to C of p sub i squared">
  <rect width="170" height="68" fill="#f3f3f3"/>
  <text x="10" y="42" font-family="Cambria Math, Times New Roman, Georgia, serif" font-size="22" font-style="italic" fill="#222">Gini</text>
  <text x="57" y="42" font-family="Cambria Math, Times New Roman, Georgia, serif" font-size="22" fill="#222">= 1 −</text>
  <text x="108" y="42" font-family="Cambria Math, Times New Roman, Georgia, serif" font-size="42" fill="#222">∑</text>
  <text x="126" y="11" font-family="Cambria Math, Times New Roman, Georgia, serif" font-size="17" font-style="italic" fill="#222">C</text>
  <text x="121" y="62" font-family="Cambria Math, Times New Roman, Georgia, serif" font-size="14" font-style="italic" fill="#222">i=1</text>
  <text x="139" y="42" font-family="Cambria Math, Times New Roman, Georgia, serif" font-size="22" font-style="italic" fill="#222">p</text>
  <text x="150" y="48" font-family="Cambria Math, Times New Roman, Georgia, serif" font-size="13" font-style="italic" fill="#222">i</text>
  <text x="157" y="28" font-family="Cambria Math, Times New Roman, Georgia, serif" font-size="15" fill="#222">2</text>
</svg>
</div>
</div>

where <span class="math-inline">pᵢ</span> is the proportion of samples belonging to class <span class="math-inline">i</span>, and <span class="math-inline">C</span> is the total number of classes. A Gini value of <span class="math-inline">0</span> indicates a perfectly pure node (all samples belong to one class). Higher values indicate more impurity.

Entropy measures the amount of uncertainty or disorder in a node:

<div class="formula-block">
<div class="equation-card">
<svg class="formula-svg" width="278" height="68" viewBox="0 0 278 68" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Entropy equals minus the summation from i equals 1 to C of p sub i log base 2 of p sub i">
  <rect width="278" height="68" fill="#f3f3f3"/>
  <text x="10" y="42" font-family="Cambria Math, Times New Roman, Georgia, serif" font-size="22" font-style="italic" fill="#222">Entropy</text>
  <text x="92" y="42" font-family="Cambria Math, Times New Roman, Georgia, serif" font-size="22" fill="#222">= −</text>
  <text x="126" y="42" font-family="Cambria Math, Times New Roman, Georgia, serif" font-size="42" fill="#222">∑</text>
  <text x="144" y="11" font-family="Cambria Math, Times New Roman, Georgia, serif" font-size="17" font-style="italic" fill="#222">C</text>
  <text x="139" y="62" font-family="Cambria Math, Times New Roman, Georgia, serif" font-size="14" font-style="italic" fill="#222">i=1</text>
  <text x="157" y="42" font-family="Cambria Math, Times New Roman, Georgia, serif" font-size="22" font-style="italic" fill="#222">p</text>
  <text x="168" y="48" font-family="Cambria Math, Times New Roman, Georgia, serif" font-size="13" font-style="italic" fill="#222">i</text>
  <text x="177" y="42" font-family="Cambria Math, Times New Roman, Georgia, serif" font-size="22" font-style="italic" fill="#222">log</text>
  <text x="209" y="48" font-family="Cambria Math, Times New Roman, Georgia, serif" font-size="13" fill="#222">2</text>
  <text x="216" y="42" font-family="Cambria Math, Times New Roman, Georgia, serif" font-size="22" fill="#222">(</text>
  <text x="223" y="42" font-family="Cambria Math, Times New Roman, Georgia, serif" font-size="22" font-style="italic" fill="#222">p</text>
  <text x="234" y="48" font-family="Cambria Math, Times New Roman, Georgia, serif" font-size="13" font-style="italic" fill="#222">i</text>
  <text x="242" y="42" font-family="Cambria Math, Times New Roman, Georgia, serif" font-size="22" fill="#222">)</text>
</svg>
</div>
</div>

Entropy is <span class="math-inline">0</span> for a pure node and reaches its maximum when classes are equally distributed. Information Gain, which is the reduction in entropy after a split, is used to select the best feature and threshold.

Both criteria generally produce similar trees. Gini is computationally slightly faster (no logarithm), while Entropy tends to produce more balanced splits.

### 6. Prediction Mechanism

Once all trees are trained, a new sample is passed through every tree in the forest:

- Classification: Each tree votes for a class. The class with the majority of votes becomes the final prediction.
- Regression: Each tree outputs a numeric value. The average of all outputs is the final prediction.

<div class="figure-block">
<img src="images/majority_voting.jpg" alt="Majority Voting" style="max-width:750px; width:100%;"/>
<p class="figure-caption">Figure 5 - Prediction via majority voting: each tree votes independently, and the class with the most votes wins.</p>
</div>

#### Example

Suppose a Random Forest contains 5 trees and predicts whether an email is Spam or Not Spam:

| Tree | Prediction |
|------|------------|
| Tree 1 | Spam |
| Tree 2 | Not Spam |
| Tree 3 | Spam |
| Tree 4 | Spam |
| Tree 5 | Not Spam |

Majority vote = Spam (3 out of 5 trees). Even though two trees predicted "Not Spam", the ensemble correctly classifies the email by following the majority.

### 7. Out-of-Bag (OOB) Error Estimation

A unique advantage of Random Forest is built-in cross-validation through OOB samples. Since each tree was trained on only ~63% of the data, the remaining ~37% (OOB samples) can be used to evaluate that tree's performance without needing a separate validation set.

The OOB error is computed by:
1. For each training sample, collecting predictions only from trees where it was not in the bootstrap sample.
2. Using majority voting on those predictions to classify the sample.
3. Computing the overall misclassification rate.

The OOB error is an unbiased estimate of the generalisation error and closely approximates leave-one-out cross-validation.

### 8. Key Hyperparameters

| Parameter | Description | Typical Values |
|---|---|---|
| <span class="math-inline">n_estimators</span> | Number of trees in the forest | <span class="math-inline">100–500</span> (more trees → better accuracy, diminishing returns) |
| <span class="math-inline">max_features</span> | Number of features considered at each split | <span class="math-inline">√p</span> (classification), <span class="math-inline">p/3</span> (regression) |
| <span class="math-inline">max_depth</span> | Maximum depth of each tree | None (grow fully) or limited to prevent overfitting |
| <span class="math-inline">min_samples_split</span> | Minimum samples required to split a node | <span class="math-inline">2–10</span> |
| <span class="math-inline">min_samples_leaf</span> | Minimum samples required at a leaf node | <span class="math-inline">1–5</span> |

Increasing <span class="math-inline">n_estimators</span> generally improves performance but increases computation time. Reducing <span class="math-inline">max_features</span> increases tree diversity but may reduce individual tree accuracy. The balance between these parameters is key to a well-performing Random Forest.

### 9. Algorithm

Step 1: Set parameters:
<span class="math-inline">n</span> = number of trees to build
<span class="math-inline">m</span> = number of features to consider at each split (usually <span class="math-inline">√total_features</span> for classification)

Step 2: For each tree <span class="math-inline">i = 1 to n</span>:

Step 2a: Bootstrap Sampling
Randomly select <span class="math-inline">N</span> samples with replacement from training data
This creates a different dataset for each tree
About <span class="math-inline">37%</span> of original data is left out (Out-of-Bag samples)

Step 2b: Build Decision Tree with Random Feature Selection
At each node:
Randomly select <span class="math-inline">m</span> features from all features
Find the best split using ONLY these <span class="math-inline">m</span> features
Split the node
Grow tree fully (no pruning)

Step 3: Store all n trees

Step 4: For prediction (Classification):
Pass new sample through all trees
Each tree gives one vote
Final prediction = class with majority votes

Step 5: For prediction (Regression):
Pass new sample through all trees
Each tree gives one numeric prediction
Final prediction = average of all tree predictions

Step 6: Evaluate using OOB Error:
For each sample, aggregate predictions from trees that did not include it
Compute misclassification rate as OOB error estimate

Step 7: Calculate Feature Importance:
For each feature, sum up how much it reduced impurity across all trees

### 10. Decision Tree vs. Random Forest

| Aspect | Single Decision Tree | Random Forest |
|---|---|---|
| Model Type | Single model | Ensemble of many trees |
| Variance | High (sensitive to data changes) | Low (averaging reduces variance) |
| Overfitting | Prone to overfitting | Resistant due to bagging + randomness |
| Accuracy | Moderate | Generally higher |
| Interpretability | Easy (one tree to follow) | Harder (many trees) |
| Training Time | Fast | Slower (many trees) |
| Feature Importance | Available but unstable | Stable and reliable |

### 11. Merits of Random Forest

- High Accuracy & Robustness: Combining multiple trees reduces overfitting and usually gives better accuracy than a single decision tree.
- Handles Large & Complex Data: Works well with large datasets and can handle both numerical and categorical features.
- Feature Importance Estimation: Measures the importance of each feature based on impurity reduction, aiding feature selection.
- Built-in Validation: OOB error provides a reliable generalisation estimate without needing a separate validation set.
- Minimal Preprocessing: Does not require feature scaling or normalisation.

### 12. Demerits of Random Forest

- Computationally Expensive: Training many trees requires more time and memory compared to simpler models.
- Less Interpretability: The ensemble nature makes it harder to interpret compared to a single decision tree.
- Not Ideal for Real-Time Prediction: Multiple trees increase prediction latency.
- Large Model Size: Storing hundreds of trees consumes more memory than a single model.
