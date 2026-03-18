"""
Generate Random Forest animation data with REAL OOB tracking.
Outputs: js/rf_data_binary.js  and  js/rf_data_multiclass.js

Usage:
    F:/conda-envs/py310/python.exe -u generate_rf_data.py
"""

import json
import os
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import _tree
from sklearn.utils import resample

# ============================================================
# CONFIGURATION
# ============================================================
BINARY_CONFIG = {
    "data_path": "F:/ML Virtual Labs/loan_approval_dataset.csv",
    "output_path": "js/rf_data_binary.js",
    "var_name": "RF_DATA_BINARY",
    "n_trees": 200,
    "max_depth": 5,
    "n_samples_viz": 8,           # 4 Approved + 4 Rejected
    "random_state": 42,
    "criterion": "gini",
    "class_names": ["Approved", "Rejected"],
}

MULTICLASS_CONFIG = {
    "data_path": "F:/ML Virtual Labs/seeds_dataset.txt",
    "output_path": "js/rf_data_multiclass.js",
    "var_name": "RF_DATA_MULTICLASS",
    "n_trees": 150,
    "max_depth": 5,
    "n_samples_viz": 6,           # 2 per class
    "random_state": 42,
    "criterion": "gini",
    "class_names": ["Canadian", "Kama", "Rosa"],
}


# ============================================================
# TREE STRUCTURE EXTRACTION (layout with proper spacing)
# ============================================================
def extract_tree_structure(estimator, feature_names, class_names):
    """Extract tree nodes with x/y layout coordinates."""
    tree_ = estimator.tree_

    feature_name = [
        feature_names[i] if i != _tree.TREE_UNDEFINED else None
        for i in tree_.feature
    ]

    nodes = []

    def recurse(node_id, depth, x, y, dx):
        if node_id < 0:
            return
        # TREE_LEAF = -1 (leaf marker), TREE_UNDEFINED = -2 (no feature)
        is_leaf = (tree_.children_left[node_id] == _tree.TREE_LEAF)

        node_data = {
            "id": int(node_id),
            "x": round(x, 2),
            "y": round(y, 2),
            "is_leaf": bool(is_leaf),
            "impurity": round(float(tree_.impurity[node_id]), 6),
            "samples": int(tree_.n_node_samples[node_id]),
        }

        if is_leaf:
            value = tree_.value[node_id][0]
            total = value.sum()
            probs = (value / total).tolist()
            best_idx = int(np.argmax(value))
            node_data["class"] = class_names[best_idx]
            node_data["probabilities"] = [round(p, 6) for p in probs]
        else:
            node_data["feature"] = feature_name[node_id]
            node_data["threshold"] = round(float(tree_.threshold[node_id]), 4)
            node_data["left_child"] = int(tree_.children_left[node_id])
            node_data["right_child"] = int(tree_.children_right[node_id])

            left_id = tree_.children_left[node_id]
            right_id = tree_.children_right[node_id]
            if depth > 20:
                return
            if left_id != _tree.TREE_LEAF:
                recurse(left_id, depth + 1, x - dx, y + 80, dx / 2)
            if right_id != _tree.TREE_LEAF:
                recurse(right_id, depth + 1, x + dx, y + 80, dx / 2)

        nodes.append(node_data)

    # Wider initial dx for deeper trees
    initial_dx = 200 * (2 ** min(estimator.get_depth(), 5) / 2)
    recurse(0, 0, 0, 0, initial_dx)
    return nodes


# ============================================================
# REAL OOB COMPUTATION
# ============================================================
def get_real_oob_indices(rf, X, n_samples):
    """
    Recover the actual bootstrap sample indices for each tree
    and derive real OOB indices.

    sklearn stores random_state per estimator. We re-draw the same
    bootstrap indices that sklearn used during fit.
    """
    oob_per_tree = []
    bootstrap_per_tree = []

    for estimator in rf.estimators_:
        # Each estimator has its own random_state set during fit
        tree_rs = estimator.random_state
        rng = np.random.RandomState(tree_rs)
        # sklearn draws n_samples indices with replacement
        bootstrap_indices = rng.randint(0, n_samples, n_samples)
        in_bag = set(bootstrap_indices.tolist())
        oob = sorted(set(range(n_samples)) - in_bag)
        oob_per_tree.append(oob)
        bootstrap_per_tree.append(sorted(in_bag))

    return bootstrap_per_tree, oob_per_tree


# ============================================================
# BINARY DATA GENERATION (Loan Approval)
# ============================================================
def generate_binary():
    cfg = BINARY_CONFIG
    print(f"\n{'='*60}")
    print(f"BINARY: Loading {cfg['data_path']}...")

    df = pd.read_csv(cfg["data_path"])
    # Clean whitespace from column names and string values
    df.columns = [c.strip() for c in df.columns]
    for col in df.columns:
        if df[col].dtype == object:
            df[col] = df[col].str.strip()

    # Drop loan_id
    if "loan_id" in df.columns:
        df = df.drop("loan_id", axis=1)

    # Target
    target_col = "loan_status"
    y_raw = df[target_col].copy()

    # Separate numeric and categorical
    cat_cols = df.select_dtypes(include="object").columns.tolist()
    if target_col in cat_cols:
        cat_cols.remove(target_col)
    num_cols = [c for c in df.columns if c not in cat_cols and c != target_col]

    # One-hot encode categorical (education, self_employed)
    df_encoded = pd.get_dummies(df[cat_cols], drop_first=False)
    X = pd.concat([df[num_cols], df_encoded], axis=1)

    # Encode target: Approved=0, Rejected=1  →  class_names[0]="Approved", class_names[1]="Rejected"
    le_y = LabelEncoder()
    le_y.fit(["Approved", "Rejected"])
    y = le_y.transform(y_raw)

    feature_names = X.columns.tolist()
    # Feature names used in the display (exclude one-hot booleans from display list)
    display_features = num_cols   # just numeric cols for the display panel

    print(f"  Shape: {X.shape}, classes: {np.unique(y)}, features: {len(feature_names)}")

    # Pick visualization samples: stratified, diverse
    np.random.seed(cfg["random_state"])
    n_per_class = cfg["n_samples_viz"] // 2
    viz_indices = []
    for cls in [0, 1]:
        pool = np.where(y == cls)[0]
        chosen = np.random.choice(pool, size=n_per_class, replace=False)
        viz_indices.extend(chosen.tolist())
    viz_indices.sort()
    print(f"  Visualization samples (row indices): {viz_indices}")

    # Train
    print(f"  Training RF with {cfg['n_trees']} trees, max_depth={cfg['max_depth']}...")
    rf = RandomForestClassifier(
        n_estimators=cfg["n_trees"],
        max_depth=cfg["max_depth"],
        criterion=cfg["criterion"],
        random_state=cfg["random_state"],
        bootstrap=True,
        oob_score=True,
        n_jobs=-1,
    )
    rf.fit(X, y)
    print(f"  OOB score: {rf.oob_score_:.4f}")

    # Real OOB
    bootstrap_per_tree, oob_per_tree = get_real_oob_indices(rf, X, len(X))

    # Map viz_indices → sequential IDs 0..N-1
    idx_to_viz_id = {idx: i for i, idx in enumerate(viz_indices)}

    # Build samples
    samples = []
    for viz_id, row_idx in enumerate(viz_indices):
        row = df.iloc[row_idx]
        feats = {}
        for col in num_cols:
            val = row[col]
            feats[col] = int(val) if float(val) == int(val) else round(float(val), 4)
        for col in cat_cols:
            feats[col] = str(row[col])
        # Add one-hot booleans
        for col in df_encoded.columns:
            feats[col] = bool(df_encoded.iloc[row_idx][col])

        samples.append({
            "id": viz_id,
            "true_label": cfg["class_names"][int(y[row_idx])],
            "features": feats,
        })

    # Build trees
    trees = []
    for t_idx, estimator in enumerate(rf.estimators_):
        tree_struct = extract_tree_structure(estimator, feature_names, cfg["class_names"])

        # OOB for viz samples: which viz samples are OOB in this tree?
        full_oob = set(oob_per_tree[t_idx])
        oob_viz_ids = sorted([idx_to_viz_id[ri] for ri in viz_indices if ri in full_oob])

        # Bootstrap viz sample IDs that are in-bag
        full_bag = set(bootstrap_per_tree[t_idx])
        bag_viz_ids = sorted([idx_to_viz_id[ri] for ri in viz_indices if ri in full_bag])

        # Predictions for viz samples
        preds = {}
        for viz_id, row_idx in enumerate(viz_indices):
            sample_X = X.iloc[[row_idx]]
            prob = estimator.predict_proba(sample_X)[0]
            prob_dict = {}
            for ci, cn in enumerate(cfg["class_names"]):
                prob_dict[cn] = round(float(prob[ci]), 6) if ci < len(prob) else 0.0
            pred_class = cfg["class_names"][int(np.argmax(prob))]
            preds[str(viz_id)] = {"class": pred_class, "probabilities": prob_dict}

        # Used features (features actually used in this tree)
        used_feat_indices = set()
        tree_obj = estimator.tree_
        for i in range(tree_obj.node_count):
            if tree_obj.feature[i] != _tree.TREE_UNDEFINED:
                used_feat_indices.add(tree_obj.feature[i])
        used_feats = [feature_names[fi] for fi in sorted(used_feat_indices)]

        trees.append({
            "treeId": t_idx,
            "usedFeatures": used_feats,
            "bootstrapSampleIds": bag_viz_ids,
            "oobSampleIds": oob_viz_ids,
            "decisionTree": tree_struct,
            "predictions": preds,
        })

    # Count how many trees have non-empty OOB
    oob_populated = sum(1 for t in trees if len(t["oobSampleIds"]) > 0)
    print(f"  Trees with populated OOB: {oob_populated}/{len(trees)}")

    data = {
        "forestMeta": {
            "taskType": "classification",
            "nTrees": cfg["n_trees"],
            "featureStrategy": "sqrt",
            "votingStrategy": "majority",
            "classes": cfg["class_names"],
            "oobScore": round(rf.oob_score_, 4),
        },
        "dataset": {
            "features": display_features,
            "samples": samples,
        },
        "trees": trees,
    }

    write_js(data, cfg["output_path"], cfg["var_name"])
    print(f"  OK Written to {cfg['output_path']}")


# ============================================================
# MULTICLASS DATA GENERATION (Seeds)
# ============================================================
def generate_multiclass():
    cfg = MULTICLASS_CONFIG
    print(f"\n{'='*60}")
    print(f"MULTICLASS: Loading {cfg['data_path']}...")

    col_names = [
        "area", "perimeter", "compactness", "length_kernel",
        "width_kernel", "asymmetry_coeff", "length_groove", "class"
    ]
    df = pd.read_csv(cfg["data_path"], sep=r"\s+", header=None, names=col_names)
    print(f"  Shape: {df.shape}")

    target_col = "class"
    feature_cols = [c for c in col_names if c != target_col]

    # Map class labels: 1→Canadian, 2→Kama, 3→Rosa
    label_map = {1: "Canadian", 2: "Kama", 3: "Rosa"}
    df["class_name"] = df[target_col].map(label_map)

    X = df[feature_cols].copy()
    le_y = LabelEncoder()
    le_y.fit(cfg["class_names"])  # Canadian=0, Kama=1, Rosa=2
    y = le_y.transform(df["class_name"])

    # Pick viz samples: 2 per class
    np.random.seed(cfg["random_state"])
    n_per_class = cfg["n_samples_viz"] // 3
    viz_indices = []
    for cls_idx in range(3):
        pool = np.where(y == cls_idx)[0]
        chosen = np.random.choice(pool, size=n_per_class, replace=False)
        viz_indices.extend(chosen.tolist())
    viz_indices.sort()
    print(f"  Visualization samples: {viz_indices}")

    # Train
    print(f"  Training RF with {cfg['n_trees']} trees, max_depth={cfg['max_depth']}...")
    rf = RandomForestClassifier(
        n_estimators=cfg["n_trees"],
        max_depth=cfg["max_depth"],
        criterion=cfg["criterion"],
        random_state=cfg["random_state"],
        bootstrap=True,
        oob_score=True,
        n_jobs=-1,
    )
    rf.fit(X, y)
    print(f"  OOB score: {rf.oob_score_:.4f}")

    # Real OOB
    bootstrap_per_tree, oob_per_tree = get_real_oob_indices(rf, X, len(X))

    idx_to_viz_id = {idx: i for i, idx in enumerate(viz_indices)}

    # Samples
    samples = []
    for viz_id, row_idx in enumerate(viz_indices):
        row = df.iloc[row_idx]
        feats = {}
        for col in feature_cols:
            feats[col] = round(float(row[col]), 4)
        samples.append({
            "id": viz_id,
            "true_label": cfg["class_names"][int(y[row_idx])],
            "features": feats,
        })

    # Trees
    trees = []
    for t_idx, estimator in enumerate(rf.estimators_):
        tree_struct = extract_tree_structure(estimator, feature_cols, cfg["class_names"])

        full_oob = set(oob_per_tree[t_idx])
        oob_viz_ids = sorted([idx_to_viz_id[ri] for ri in viz_indices if ri in full_oob])

        full_bag = set(bootstrap_per_tree[t_idx])
        bag_viz_ids = sorted([idx_to_viz_id[ri] for ri in viz_indices if ri in full_bag])

        preds = {}
        for viz_id, row_idx in enumerate(viz_indices):
            sample_X = X.iloc[[row_idx]]
            prob = estimator.predict_proba(sample_X)[0]
            prob_dict = {}
            for ci, cn in enumerate(cfg["class_names"]):
                prob_dict[cn] = round(float(prob[ci]), 6) if ci < len(prob) else 0.0
            pred_class = cfg["class_names"][int(np.argmax(prob))]
            preds[str(viz_id)] = {"class": pred_class, "probabilities": prob_dict}

        used_feat_indices = set()
        tree_obj = estimator.tree_
        for i in range(tree_obj.node_count):
            if tree_obj.feature[i] != _tree.TREE_UNDEFINED:
                used_feat_indices.add(tree_obj.feature[i])
        used_feats = [feature_cols[fi] for fi in sorted(used_feat_indices)]

        trees.append({
            "treeId": t_idx,
            "usedFeatures": used_feats,
            "bootstrapSampleIds": bag_viz_ids,
            "oobSampleIds": oob_viz_ids,
            "decisionTree": tree_struct,
            "predictions": preds,
        })

    oob_populated = sum(1 for t in trees if len(t["oobSampleIds"]) > 0)
    print(f"  Trees with populated OOB: {oob_populated}/{len(trees)}")

    data = {
        "forestMeta": {
            "taskType": "classification",
            "nTrees": cfg["n_trees"],
            "featureStrategy": "sqrt",
            "votingStrategy": "majority",
            "classes": cfg["class_names"],
            "oobScore": round(rf.oob_score_, 4),
        },
        "dataset": {
            "features": feature_cols,
            "samples": samples,
        },
        "trees": trees,
    }

    write_js(data, cfg["output_path"], cfg["var_name"])
    print(f"  OK Written to {cfg['output_path']}")


# ============================================================
# WRITE JS FILE
# ============================================================
def write_js(data, output_path, var_name):
    """Write data as a JS file: const VAR_NAME = {...};"""
    json_str = json.dumps(data, separators=(",", ":"))  # compact
    js_content = f"const {var_name} = {json_str};\n"
    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(js_content)
    size_kb = os.path.getsize(output_path) / 1024
    print(f"  File size: {size_kb:.0f} KB")


# ============================================================
# MAIN
# ============================================================
if __name__ == "__main__":
    generate_binary()
    generate_multiclass()
    print(f"\n{'='*60}")
    print("Done! Both data files generated.")
