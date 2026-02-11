A Random Forest is a supervised ensemble learning algorithm used for both classification and regression tasks. It builds multiple decision trees during training and combines their outputs to produce a more accurate and stable prediction. Instead of relying on a single tree, Random Forest aggregates the results of many trees to reduce overfitting and improve generalization.

### 1. Main Components of a Random Forest
The main components of a Random Forest are:
- **Decision Trees**: Individual models trained on different subsets of data.
- **Bootstrap Samples**: Random subsets of the original dataset selected with replacement.
- **Feature Randomness**: A random subset of features is considered at each split to ensure diversity among trees.

Each tree in the forest makes a prediction, and the final output is determined by majority voting (for classification) or averaging (for regression).

### 2. How Random Forest Works
A Random Forest works by constructing multiple decision trees using different bootstrap samples of the training data. For each tree, at every node, only a random subset of features is considered when selecting the best split. This randomness ensures that the trees are diverse and not highly correlated.

### 3. Splitting Criteria
The splitting criteria commonly used include Gini Index and Entropy. The Gini Index measures the impurity of a node, representing the probability of incorrectly classifying a randomly chosen sample if it were labeled according to the class distribution in the node. The Gini Index is calculated as:

<div align="center" style="font-size: 1.2rem; margin: 20px 0;">
    <strong>Gini = Σ<sub>i=1</sub><sup>n</sup> p<sub>i</sub><sup>2</sup></strong>
</div>

Lower Gini values indicate purer nodes, with a value of zero when all samples belong to one class. However, it is slightly biased toward dominant classes.

Entropy, on the other hand, measures the amount of uncertainty or disorder in a node and is used to calculate Information Gain. It is computed as:

<div align="center" style="font-size: 1.2rem; margin: 20px 0;">
    <strong>Entropy = − Σ<sub>i=1</sub><sup>n</sup> p<sub>i</sub> log<sub>2</sub>(p<sub>i</sub>)</strong>
</div>

Entropy is zero for a perfectly pure node, with higher values indicating greater disorder. It is sensitive to small changes in class distribution and often produces balanced and informative splits.

### 4. Prediction Mechanism
Once all trees are trained, predictions are made by combining the outputs of individual trees. In classification, the class predicted by the majority of trees is selected, while in regression, the average of all tree predictions is taken as the final output. By combining multiple trees, Random Forest reduces variance, minimizes overfitting, and provides higher accuracy compared to a single decision tree.

### 5. Merits of Random Forest
- **High Accuracy & Robustness**: By combining multiple decision trees, Random Forest reduces overfitting and usually gives better accuracy than a single decision tree.
- **Handles Large & Complex Data**: It works well with large datasets and can handle both numerical and categorical features effectively.
- **Feature Importance Estimation**: Random Forest can measure the importance of each feature, helping in feature selection and understanding the model.

### 6. Demerits of Random Forest
- **Computationally Expensive**: Training many trees requires more time and memory compared to simpler models.
- **Less Interpretability**: The ensemble nature makes it difficult to interpret compared to a single decision tree.
- **Not Ideal for Real-Time Prediction**: Due to multiple trees, prediction can be slower, making it less suitable for time-critical applications.

### 7. Algorithm

1. **Step 1:** Set parameters:
    - n = number of trees to build
    - m = number of features to consider at each split (usually √total_features)
2. **Step 2:** For each tree i = 1 to n:
    - **Step 2a: Bootstrap Sampling**
        - Randomly select N samples with replacement from training data
        - This creates a different dataset for each tree
        - About 37% of original data is left out (Out-of-Bag samples)
    - **Step 2b: Build Decision Tree with Random Feature Selection**
        - At each node:
            - Randomly select m features from all features
            - Find the best split using **ONLY** these m features
            - Split the node
        - Grow tree fully (no pruning)
3. **Step 3:** Store all n trees
4. **Step 4:** For prediction (**Classification**):
    - Pass new sample through all trees
    - Each tree gives one vote
    - Final prediction = class with majority votes
5. **Step 5:** For prediction (**Regression**):
    - Pass new sample through all trees
    - Each tree gives one numeric prediction
    - Final prediction is calculated as the average of all tree predictions
6. **Step 6:** Calculate Feature Importance:
    - For each feature, sum up how much it reduced impurity across all trees
    - Normalize to get importance scores