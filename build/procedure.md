## Binary Classification

The objective of this experiment is to classify bank customers into two categories—subscribed and not subscribed to a term deposit—based on a set of demographic, financial, and marketing campaign features. The input to the model consists of multiple independent variables describing customer characteristics and past interactions, while the output is a binary dependent variable indicating whether the customer subscribes to the term deposit or not.

1. **Import Required Libraries**: Import the essential Python libraries: `pandas` and `numpy`.
2. **Load the Dataset**: Load `bank_marketing.csv`. The Bank Marketing dataset contains data from direct phone-based marketing campaigns by a Portuguese bank with about 45,211 customer records and 17 feature columns plus a binary target indicating whether the client subscribed to a term deposit (yes/no).
3. **Perform Data Analysis**: Analyze the dataset using `head()`, `tail()`, `info()`, `describe()`, and `isnull().sum()`.
4. **Define Features X and Y**:
    - **Features (X)**: age, job, marital, education, default, housing, loan, contact, month, day_of_week, duration, campaign, pdays, previous, poutcome, emp.var.rate, cons.price.idx, cons.conf.idx, euribor3m, nr.employed.
    - **Target (Y)**: customer subscription behavior.
5. **Split the Dataset**: Split into 80% Training Set and 20% Testing Set.
6. **Train the Decision Tree Classifier**: Initialize and configure the Decision Tree Classifier by setting important parameters such as the splitting criteria and the maximum depth (`max_depth`) of the tree. Train the classifier using the training dataset.
7. **Make Predictions on Test Data**: Using the trained Decision Tree model, make predictions on the test dataset and compare with actual values to evaluate performance.

---

## Multi-Class Classification

The objective of this experiment is to classify wheat seeds into three different varieties based on a set of geometric measurements. The input to the model consists of multiple independent variables representing seed features (such as area, perimeter, and kernel dimensions), while the output is a categorical dependent variable indicating the seed's variety (Class 1, 2, or 3).

1. **Import Required Libraries**: Import the essential Python libraries: `pandas` and `numpy`.
2. **Load the Dataset**: Load `Seeds_Dataset.csv`. The Seeds dataset contains geometric measurements of 210 wheat seed samples belonging to three different varieties. It includes 7 numerical features related to seed shape and size, with one class label used for classification tasks.
3. **Perform Data Analysis**: Analyze the dataset using `head()`, `tail()`, `info()`, `describe()`, and `isnull().sum()`.
4. **Define Features X and Y**:
    - **Features (X)**: Area, Perimeter, Compactness, Length of Kernel, Width of Kernel, Asymmetry Coefficient, Length of Kernel Groove.
    - **Target (Y)**: Class (1, 2, or 3).
5. **Split the Dataset**: Split into 80% Training Set and 20% Testing Set.
6. **Train the Random Forest Classifier**: Initialize and configure the Random Forest Classifier by setting important parameters such as the splitting criteria and the number of trees in the forest. Train the classifier using the training dataset.
7. **Make Predictions on Test Data**: Using the trained Random Forest model, predict outcomes for the test dataset by passing its features as input.
8. **Evaluate Model Performance**: Evaluate the Random Forest model using the accuracy score to measure overall correctness, the confusion matrix to show true and false predictions, and the classification report to summarize precision, recall, and F1-score for each class.