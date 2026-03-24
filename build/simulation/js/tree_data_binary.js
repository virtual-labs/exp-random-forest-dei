const TREE_DATA_BINARY = {
  "class_names": [
    "Approved",
    "Rejected"
  ],
  "feature_mappings": {
    "education": {
      "0": "Graduate",
      "1": "Not Graduate"
    },
    "self_employed": {
      "0": "No",
      "1": "Yes"
    }
  },
  "inputs": [
    {
      "id": 2647,
      "features": {
        "no_of_dependents": 4,
        "education": 0,
        "self_employed": 1,
        "income_annum": 300000,
        "loan_amount": 1100000,
        "loan_term": 12,
        "cibil_score": 674,
        "residential_assets_value": 600000,
        "commercial_assets_value": 0,
        "luxury_assets_value": 800000,
        "bank_asset_value": 200000
      },
      "true_label": 0,
      "paths": {
        "3": {
          "gini": [
            0,
            6,
            10,
            11
          ],
          "entropy": [
            0,
            6,
            7,
            8
          ]
        },
        "5": {
          "gini": [
            0,
            16,
            24,
            25,
            26,
            27
          ],
          "entropy": [
            0,
            14,
            15,
            16,
            17,
            19
          ]
        },
        "7": {
          "gini": [
            0,
            32,
            44,
            45,
            46,
            47,
            48,
            50
          ],
          "entropy": [
            0,
            20,
            21,
            22,
            23,
            29
          ]
        }
      }
    },
    {
      "id": 3602,
      "features": {
        "no_of_dependents": 0,
        "education": 1,
        "self_employed": 1,
        "income_annum": 1900000,
        "loan_amount": 6400000,
        "loan_term": 20,
        "cibil_score": 704,
        "residential_assets_value": 900000,
        "commercial_assets_value": 3400000,
        "luxury_assets_value": 5300000,
        "bank_asset_value": 1900000
      },
      "true_label": 0,
      "paths": {
        "3": {
          "gini": [
            0,
            6,
            10,
            11
          ],
          "entropy": [
            0,
            6,
            7,
            9
          ]
        },
        "5": {
          "gini": [
            0,
            16,
            24,
            25,
            26,
            28
          ],
          "entropy": [
            0,
            14,
            15,
            23
          ]
        },
        "7": {
          "gini": [
            0,
            32,
            44,
            45,
            46,
            54,
            56,
            58
          ],
          "entropy": [
            0,
            20,
            21,
            39
          ]
        }
      }
    },
    {
      "id": 3579,
      "features": {
        "no_of_dependents": 2,
        "education": 1,
        "self_employed": 0,
        "income_annum": 8900000,
        "loan_amount": 23100000,
        "loan_term": 4,
        "cibil_score": 519,
        "residential_assets_value": 22800000,
        "commercial_assets_value": 500000,
        "luxury_assets_value": 25200000,
        "bank_asset_value": 4700000
      },
      "true_label": 1,
      "paths": {
        "3": {
          "gini": [
            0,
            1,
            2,
            3
          ],
          "entropy": [
            0,
            1,
            2,
            3
          ]
        },
        "5": {
          "gini": [
            0,
            1,
            2,
            3,
            7,
            9
          ],
          "entropy": [
            0,
            1,
            2,
            3,
            7
          ]
        },
        "7": {
          "gini": [
            0,
            1,
            2,
            3,
            19,
            21,
            23,
            25
          ],
          "entropy": [
            0,
            1,
            2,
            3,
            13
          ]
        }
      }
    },
    {
      "id": 4062,
      "features": {
        "no_of_dependents": 4,
        "education": 0,
        "self_employed": 0,
        "income_annum": 8300000,
        "loan_amount": 24600000,
        "loan_term": 2,
        "cibil_score": 382,
        "residential_assets_value": 1400000,
        "commercial_assets_value": 1200000,
        "luxury_assets_value": 16700000,
        "bank_asset_value": 6600000
      },
      "true_label": 1,
      "paths": {
        "3": {
          "gini": [
            0,
            1,
            2,
            3
          ],
          "entropy": [
            0,
            1,
            2,
            3
          ]
        },
        "5": {
          "gini": [
            0,
            1,
            2,
            3,
            7,
            9
          ],
          "entropy": [
            0,
            1,
            2,
            3,
            7
          ]
        },
        "7": {
          "gini": [
            0,
            1,
            2,
            3,
            19,
            21,
            23,
            25
          ],
          "entropy": [
            0,
            1,
            2,
            3,
            13
          ]
        }
      }
    }
  ],
  "models": {
    "3": {
      "gini": [
        {
          "id": 0,
          "x": 1181.25,
          "y": 0,
          "impurity": 0.47081924761355576,
          "samples": 3415,
          "is_leaf": false,
          "feature": "cibil_score",
          "threshold": 549.5,
          "left_child": 1,
          "right_child": 6
        },
        {
          "id": 1,
          "x": 612.5,
          "y": 250,
          "impurity": 0.1864476374020786,
          "samples": 1432,
          "is_leaf": false,
          "feature": "loan_term",
          "threshold": 5.0,
          "left_child": 2,
          "right_child": 5
        },
        {
          "id": 2,
          "x": 350.0,
          "y": 500,
          "impurity": 0.498595312714605,
          "samples": 283,
          "is_leaf": false,
          "feature": "loan_amount",
          "threshold": 26250000.0,
          "left_child": 3,
          "right_child": 4
        },
        {
          "id": 3,
          "x": 175.0,
          "y": 750,
          "impurity": 0.4955206692746702,
          "samples": 243,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.45267489711934156,
            0.5473251028806584
          ]
        },
        {
          "id": 4,
          "x": 525.0,
          "y": 750,
          "impurity": 0.04874999999999996,
          "samples": 40,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            0.975,
            0.025
          ]
        },
        {
          "id": 5,
          "x": 875.0,
          "y": 500,
          "impurity": 0.0,
          "samples": 1149,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.0,
            1.0
          ]
        },
        {
          "id": 6,
          "x": 1750.0,
          "y": 250,
          "impurity": 0.01202963464791118,
          "samples": 1983,
          "is_leaf": false,
          "feature": "residential_assets_value",
          "threshold": 50000.0,
          "left_child": 7,
          "right_child": 10
        },
        {
          "id": 7,
          "x": 1400.0,
          "y": 500,
          "impurity": 0.21875,
          "samples": 40,
          "is_leaf": false,
          "feature": "loan_amount",
          "threshold": 600000.0,
          "left_child": 8,
          "right_child": 9
        },
        {
          "id": 8,
          "x": 1225.0,
          "y": 750,
          "impurity": 0.0,
          "samples": 1,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.0,
            1.0
          ]
        },
        {
          "id": 9,
          "x": 1575.0,
          "y": 750,
          "impurity": 0.1840894148586456,
          "samples": 39,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            0.8974358974358975,
            0.10256410256410256
          ]
        },
        {
          "id": 10,
          "x": 2100.0,
          "y": 500,
          "impurity": 0.007179393994939165,
          "samples": 1943,
          "is_leaf": false,
          "feature": "residential_assets_value",
          "threshold": 950000.0,
          "left_child": 11,
          "right_child": 12
        },
        {
          "id": 11,
          "x": 1925.0,
          "y": 750,
          "impurity": 0.056403987534649924,
          "samples": 241,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            0.970954356846473,
            0.029045643153526972
          ]
        },
        {
          "id": 12,
          "x": 2275.0,
          "y": 750,
          "impurity": 0.0,
          "samples": 1702,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        }
      ],
      "entropy": [
        {
          "id": 0,
          "x": 1137.5,
          "y": 0,
          "impurity": 0.9574817108294552,
          "samples": 3415,
          "is_leaf": false,
          "feature": "cibil_score",
          "threshold": 549.5,
          "left_child": 1,
          "right_child": 6
        },
        {
          "id": 1,
          "x": 612.5,
          "y": 250,
          "impurity": 0.4817047378585828,
          "samples": 1432,
          "is_leaf": false,
          "feature": "loan_term",
          "threshold": 5.0,
          "left_child": 2,
          "right_child": 5
        },
        {
          "id": 2,
          "x": 350.0,
          "y": 500,
          "impurity": 0.9979725146686187,
          "samples": 283,
          "is_leaf": false,
          "feature": "loan_amount",
          "threshold": 26250000.0,
          "left_child": 3,
          "right_child": 4
        },
        {
          "id": 3,
          "x": 175.0,
          "y": 750,
          "impurity": 0.993528008093967,
          "samples": 243,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.45267489711934156,
            0.5473251028806584
          ]
        },
        {
          "id": 4,
          "x": 525.0,
          "y": 750,
          "impurity": 0.16866093149667025,
          "samples": 40,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            0.975,
            0.025
          ]
        },
        {
          "id": 5,
          "x": 875.0,
          "y": 500,
          "impurity": 0.0,
          "samples": 1149,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.0,
            1.0
          ]
        },
        {
          "id": 6,
          "x": 1662.5,
          "y": 250,
          "impurity": 0.05329396357763028,
          "samples": 1983,
          "is_leaf": false,
          "feature": "residential_assets_value",
          "threshold": 950000.0,
          "left_child": 7,
          "right_child": 10
        },
        {
          "id": 7,
          "x": 1400.0,
          "y": 500,
          "impurity": 0.2545582578138593,
          "samples": 281,
          "is_leaf": false,
          "feature": "commercial_assets_value",
          "threshold": 1850000.0,
          "left_child": 8,
          "right_child": 9
        },
        {
          "id": 8,
          "x": 1225.0,
          "y": 750,
          "impurity": 0.3547757389859291,
          "samples": 179,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            0.9329608938547486,
            0.0670391061452514
          ]
        },
        {
          "id": 9,
          "x": 1575.0,
          "y": 750,
          "impurity": 0.0,
          "samples": 102,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 10,
          "x": 1925.0,
          "y": 500,
          "impurity": 0.0,
          "samples": 1702,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        }
      ]
    },
    "5": {
      "gini": [
        {
          "id": 0,
          "x": 3150.0,
          "y": 0,
          "impurity": 0.47081924761355576,
          "samples": 3415,
          "is_leaf": false,
          "feature": "cibil_score",
          "threshold": 549.5,
          "left_child": 1,
          "right_child": 16
        },
        {
          "id": 1,
          "x": 1946.875,
          "y": 250,
          "impurity": 0.1864476374020786,
          "samples": 1432,
          "is_leaf": false,
          "feature": "loan_term",
          "threshold": 5.0,
          "left_child": 2,
          "right_child": 15
        },
        {
          "id": 2,
          "x": 1268.75,
          "y": 500,
          "impurity": 0.498595312714605,
          "samples": 283,
          "is_leaf": false,
          "feature": "loan_amount",
          "threshold": 26250000.0,
          "left_child": 3,
          "right_child": 10
        },
        {
          "id": 3,
          "x": 700.0,
          "y": 750,
          "impurity": 0.4955206692746702,
          "samples": 243,
          "is_leaf": false,
          "feature": "income_annum",
          "threshold": 7050000.0,
          "left_child": 4,
          "right_child": 7
        },
        {
          "id": 4,
          "x": 350.0,
          "y": 1000,
          "impurity": 0.4961998685075608,
          "samples": 195,
          "is_leaf": false,
          "feature": "loan_amount",
          "threshold": 16050000.0,
          "left_child": 5,
          "right_child": 6
        },
        {
          "id": 5,
          "x": 175.0,
          "y": 1250,
          "impurity": 0.49431111111111115,
          "samples": 150,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.44666666666666666,
            0.5533333333333333
          ]
        },
        {
          "id": 6,
          "x": 525.0,
          "y": 1250,
          "impurity": 0.23111111111111116,
          "samples": 45,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            0.8666666666666667,
            0.13333333333333333
          ]
        },
        {
          "id": 7,
          "x": 1050.0,
          "y": 1000,
          "impurity": 0.1527777777777778,
          "samples": 48,
          "is_leaf": false,
          "feature": "cibil_score",
          "threshold": 318.5,
          "left_child": 8,
          "right_child": 9
        },
        {
          "id": 8,
          "x": 875.0,
          "y": 1250,
          "impurity": 0.0,
          "samples": 2,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 9,
          "x": 1225.0,
          "y": 1250,
          "impurity": 0.08317580340264652,
          "samples": 46,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.043478260869565216,
            0.9565217391304348
          ]
        },
        {
          "id": 10,
          "x": 1837.5,
          "y": 750,
          "impurity": 0.04874999999999996,
          "samples": 40,
          "is_leaf": false,
          "feature": "income_annum",
          "threshold": 9650000.0,
          "left_child": 11,
          "right_child": 12
        },
        {
          "id": 11,
          "x": 1575.0,
          "y": 1000,
          "impurity": 0.0,
          "samples": 34,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 12,
          "x": 2100.0,
          "y": 1000,
          "impurity": 0.2777777777777778,
          "samples": 6,
          "is_leaf": false,
          "feature": "no_of_dependents",
          "threshold": 4.5,
          "left_child": 13,
          "right_child": 14
        },
        {
          "id": 13,
          "x": 1925.0,
          "y": 1250,
          "impurity": 0.0,
          "samples": 5,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 14,
          "x": 2275.0,
          "y": 1250,
          "impurity": 0.0,
          "samples": 1,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.0,
            1.0
          ]
        },
        {
          "id": 15,
          "x": 2625.0,
          "y": 500,
          "impurity": 0.0,
          "samples": 1149,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.0,
            1.0
          ]
        },
        {
          "id": 16,
          "x": 4353.125,
          "y": 250,
          "impurity": 0.01202963464791118,
          "samples": 1983,
          "is_leaf": false,
          "feature": "residential_assets_value",
          "threshold": 50000.0,
          "left_child": 17,
          "right_child": 24
        },
        {
          "id": 17,
          "x": 3368.75,
          "y": 500,
          "impurity": 0.21875,
          "samples": 40,
          "is_leaf": false,
          "feature": "loan_amount",
          "threshold": 600000.0,
          "left_child": 18,
          "right_child": 19
        },
        {
          "id": 18,
          "x": 2975.0,
          "y": 750,
          "impurity": 0.0,
          "samples": 1,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.0,
            1.0
          ]
        },
        {
          "id": 19,
          "x": 3762.5,
          "y": 750,
          "impurity": 0.1840894148586456,
          "samples": 39,
          "is_leaf": false,
          "feature": "cibil_score",
          "threshold": 683.5,
          "left_child": 20,
          "right_child": 23
        },
        {
          "id": 20,
          "x": 3500.0,
          "y": 1000,
          "impurity": 0.3911111111111111,
          "samples": 15,
          "is_leaf": false,
          "feature": "cibil_score",
          "threshold": 660.5,
          "left_child": 21,
          "right_child": 22
        },
        {
          "id": 21,
          "x": 3325.0,
          "y": 1250,
          "impurity": 0.2603550295857988,
          "samples": 13,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            0.8461538461538461,
            0.15384615384615385
          ]
        },
        {
          "id": 22,
          "x": 3675.0,
          "y": 1250,
          "impurity": 0.0,
          "samples": 2,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.0,
            1.0
          ]
        },
        {
          "id": 23,
          "x": 4025.0,
          "y": 1000,
          "impurity": 0.0,
          "samples": 24,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 24,
          "x": 5337.5,
          "y": 500,
          "impurity": 0.007179393994939165,
          "samples": 1943,
          "is_leaf": false,
          "feature": "residential_assets_value",
          "threshold": 950000.0,
          "left_child": 25,
          "right_child": 32
        },
        {
          "id": 25,
          "x": 4900.0,
          "y": 750,
          "impurity": 0.056403987534649924,
          "samples": 241,
          "is_leaf": false,
          "feature": "loan_amount",
          "threshold": 30950000.0,
          "left_child": 26,
          "right_child": 29
        },
        {
          "id": 26,
          "x": 4550.0,
          "y": 1000,
          "impurity": 0.04914907139326319,
          "samples": 238,
          "is_leaf": false,
          "feature": "commercial_assets_value",
          "threshold": 450000.0,
          "left_child": 27,
          "right_child": 28
        },
        {
          "id": 27,
          "x": 4375.0,
          "y": 1250,
          "impurity": 0.11583600060966315,
          "samples": 81,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            0.9382716049382716,
            0.06172839506172839
          ]
        },
        {
          "id": 28,
          "x": 4725.0,
          "y": 1250,
          "impurity": 0.01265771430889695,
          "samples": 157,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            0.9936305732484076,
            0.006369426751592357
          ]
        },
        {
          "id": 29,
          "x": 5250.0,
          "y": 1000,
          "impurity": 0.4444444444444444,
          "samples": 3,
          "is_leaf": false,
          "feature": "commercial_assets_value",
          "threshold": 2450000.0,
          "left_child": 30,
          "right_child": 31
        },
        {
          "id": 30,
          "x": 5075.0,
          "y": 1250,
          "impurity": 0.0,
          "samples": 1,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.0,
            1.0
          ]
        },
        {
          "id": 31,
          "x": 5425.0,
          "y": 1250,
          "impurity": 0.0,
          "samples": 2,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 32,
          "x": 5775.0,
          "y": 750,
          "impurity": 0.0,
          "samples": 1702,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        }
      ],
      "entropy": [
        {
          "id": 0,
          "x": 2843.75,
          "y": 0,
          "impurity": 0.9574817108294552,
          "samples": 3415,
          "is_leaf": false,
          "feature": "cibil_score",
          "threshold": 549.5,
          "left_child": 1,
          "right_child": 14
        },
        {
          "id": 1,
          "x": 1706.25,
          "y": 250,
          "impurity": 0.4817047378585828,
          "samples": 1432,
          "is_leaf": false,
          "feature": "loan_term",
          "threshold": 5.0,
          "left_child": 2,
          "right_child": 13
        },
        {
          "id": 2,
          "x": 1137.5,
          "y": 500,
          "impurity": 0.9979725146686187,
          "samples": 283,
          "is_leaf": false,
          "feature": "loan_amount",
          "threshold": 26250000.0,
          "left_child": 3,
          "right_child": 8
        },
        {
          "id": 3,
          "x": 612.5,
          "y": 750,
          "impurity": 0.993528008093967,
          "samples": 243,
          "is_leaf": false,
          "feature": "income_annum",
          "threshold": 8050000.0,
          "left_child": 4,
          "right_child": 7
        },
        {
          "id": 4,
          "x": 350.0,
          "y": 1000,
          "impurity": 0.9989725613141185,
          "samples": 212,
          "is_leaf": false,
          "feature": "loan_amount",
          "threshold": 18400000.0,
          "left_child": 5,
          "right_child": 6
        },
        {
          "id": 5,
          "x": 175.0,
          "y": 1250,
          "impurity": 0.9912715083767959,
          "samples": 182,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.44505494505494503,
            0.554945054945055
          ]
        },
        {
          "id": 6,
          "x": 525.0,
          "y": 1250,
          "impurity": 0.21084230031853213,
          "samples": 30,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            0.9666666666666667,
            0.03333333333333333
          ]
        },
        {
          "id": 7,
          "x": 875.0,
          "y": 1000,
          "impurity": 0.0,
          "samples": 31,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.0,
            1.0
          ]
        },
        {
          "id": 8,
          "x": 1662.5,
          "y": 750,
          "impurity": 0.16866093149667025,
          "samples": 40,
          "is_leaf": false,
          "feature": "residential_assets_value",
          "threshold": 5400000.0,
          "left_child": 9,
          "right_child": 12
        },
        {
          "id": 9,
          "x": 1400.0,
          "y": 1000,
          "impurity": 0.6500224216483541,
          "samples": 6,
          "is_leaf": false,
          "feature": "residential_assets_value",
          "threshold": 5000000.0,
          "left_child": 10,
          "right_child": 11
        },
        {
          "id": 10,
          "x": 1225.0,
          "y": 1250,
          "impurity": 0.0,
          "samples": 5,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 11,
          "x": 1575.0,
          "y": 1250,
          "impurity": 0.0,
          "samples": 1,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.0,
            1.0
          ]
        },
        {
          "id": 12,
          "x": 1925.0,
          "y": 1000,
          "impurity": 0.0,
          "samples": 34,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 13,
          "x": 2275.0,
          "y": 500,
          "impurity": 0.0,
          "samples": 1149,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.0,
            1.0
          ]
        },
        {
          "id": 14,
          "x": 3981.25,
          "y": 250,
          "impurity": 0.05329396357763028,
          "samples": 1983,
          "is_leaf": false,
          "feature": "residential_assets_value",
          "threshold": 950000.0,
          "left_child": 15,
          "right_child": 24
        },
        {
          "id": 15,
          "x": 3587.5,
          "y": 500,
          "impurity": 0.2545582578138593,
          "samples": 281,
          "is_leaf": false,
          "feature": "commercial_assets_value",
          "threshold": 1850000.0,
          "left_child": 16,
          "right_child": 23
        },
        {
          "id": 16,
          "x": 3150.0,
          "y": 750,
          "impurity": 0.3547757389859291,
          "samples": 179,
          "is_leaf": false,
          "feature": "loan_amount",
          "threshold": 3100000.0,
          "left_child": 17,
          "right_child": 20
        },
        {
          "id": 17,
          "x": 2800.0,
          "y": 1000,
          "impurity": 0.16866093149667025,
          "samples": 120,
          "is_leaf": false,
          "feature": "residential_assets_value",
          "threshold": 150000.0,
          "left_child": 18,
          "right_child": 19
        },
        {
          "id": 18,
          "x": 2625.0,
          "y": 1250,
          "impurity": 0.5586293734521992,
          "samples": 23,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            0.8695652173913043,
            0.13043478260869565
          ]
        },
        {
          "id": 19,
          "x": 2975.0,
          "y": 1250,
          "impurity": 0.0,
          "samples": 97,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 20,
          "x": 3500.0,
          "y": 1000,
          "impurity": 0.6161661934005356,
          "samples": 59,
          "is_leaf": false,
          "feature": "income_annum",
          "threshold": 950000.0,
          "left_child": 21,
          "right_child": 22
        },
        {
          "id": 21,
          "x": 3325.0,
          "y": 1250,
          "impurity": 0.9182958340544896,
          "samples": 3,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.3333333333333333,
            0.6666666666666666
          ]
        },
        {
          "id": 22,
          "x": 3675.0,
          "y": 1250,
          "impurity": 0.5435644431995964,
          "samples": 56,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            0.875,
            0.125
          ]
        },
        {
          "id": 23,
          "x": 4025.0,
          "y": 750,
          "impurity": 0.0,
          "samples": 102,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 24,
          "x": 4375.0,
          "y": 500,
          "impurity": 0.0,
          "samples": 1702,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        }
      ]
    },
    "7": {
      "gini": [
        {
          "id": 0,
          "x": 6444.921875,
          "y": 0,
          "impurity": 0.47081924761355576,
          "samples": 3415,
          "is_leaf": false,
          "feature": "cibil_score",
          "threshold": 549.5,
          "left_child": 1,
          "right_child": 32
        },
        {
          "id": 1,
          "x": 4457.03125,
          "y": 250,
          "impurity": 0.1864476374020786,
          "samples": 1432,
          "is_leaf": false,
          "feature": "loan_term",
          "threshold": 5.0,
          "left_child": 2,
          "right_child": 31
        },
        {
          "id": 2,
          "x": 3489.0625,
          "y": 500,
          "impurity": 0.498595312714605,
          "samples": 283,
          "is_leaf": false,
          "feature": "loan_amount",
          "threshold": 26250000.0,
          "left_child": 3,
          "right_child": 26
        },
        {
          "id": 3,
          "x": 2340.625,
          "y": 750,
          "impurity": 0.4955206692746702,
          "samples": 243,
          "is_leaf": false,
          "feature": "income_annum",
          "threshold": 7050000.0,
          "left_child": 4,
          "right_child": 19
        },
        {
          "id": 4,
          "x": 1400.0,
          "y": 1000,
          "impurity": 0.4961998685075608,
          "samples": 195,
          "is_leaf": false,
          "feature": "loan_amount",
          "threshold": 16050000.0,
          "left_child": 5,
          "right_child": 12
        },
        {
          "id": 5,
          "x": 700.0,
          "y": 1250,
          "impurity": 0.49431111111111115,
          "samples": 150,
          "is_leaf": false,
          "feature": "income_annum",
          "threshold": 3850000.0,
          "left_child": 6,
          "right_child": 9
        },
        {
          "id": 6,
          "x": 350.0,
          "y": 1500,
          "impurity": 0.4750683382034122,
          "samples": 103,
          "is_leaf": false,
          "feature": "loan_amount",
          "threshold": 10300000.0,
          "left_child": 7,
          "right_child": 8
        },
        {
          "id": 7,
          "x": 175.0,
          "y": 1750,
          "impurity": 0.49881023200475905,
          "samples": 82,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            0.524390243902439,
            0.47560975609756095
          ]
        },
        {
          "id": 8,
          "x": 525.0,
          "y": 1750,
          "impurity": 0.09070294784580502,
          "samples": 21,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            0.9523809523809523,
            0.047619047619047616
          ]
        },
        {
          "id": 9,
          "x": 1050.0,
          "y": 1500,
          "impurity": 0.15572657311000448,
          "samples": 47,
          "is_leaf": false,
          "feature": "residential_assets_value",
          "threshold": 250000.0,
          "left_child": 10,
          "right_child": 11
        },
        {
          "id": 10,
          "x": 875.0,
          "y": 1750,
          "impurity": 0.0,
          "samples": 1,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 11,
          "x": 1225.0,
          "y": 1750,
          "impurity": 0.12192816635160686,
          "samples": 46,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.06521739130434782,
            0.9347826086956522
          ]
        },
        {
          "id": 12,
          "x": 2100.0,
          "y": 1250,
          "impurity": 0.23111111111111116,
          "samples": 45,
          "is_leaf": false,
          "feature": "luxury_assets_value",
          "threshold": 21450000.0,
          "left_child": 13,
          "right_child": 16
        },
        {
          "id": 13,
          "x": 1750.0,
          "y": 1500,
          "impurity": 0.05709342560553632,
          "samples": 34,
          "is_leaf": false,
          "feature": "cibil_score",
          "threshold": 540.5,
          "left_child": 14,
          "right_child": 15
        },
        {
          "id": 14,
          "x": 1575.0,
          "y": 1750,
          "impurity": 0.0,
          "samples": 33,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 15,
          "x": 1925.0,
          "y": 1750,
          "impurity": 0.0,
          "samples": 1,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.0,
            1.0
          ]
        },
        {
          "id": 16,
          "x": 2450.0,
          "y": 1500,
          "impurity": 0.49586776859504134,
          "samples": 11,
          "is_leaf": false,
          "feature": "loan_amount",
          "threshold": 19600000.0,
          "left_child": 17,
          "right_child": 18
        },
        {
          "id": 17,
          "x": 2275.0,
          "y": 1750,
          "impurity": 0.0,
          "samples": 5,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.0,
            1.0
          ]
        },
        {
          "id": 18,
          "x": 2625.0,
          "y": 1750,
          "impurity": 0.0,
          "samples": 6,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 19,
          "x": 3281.25,
          "y": 1000,
          "impurity": 0.1527777777777778,
          "samples": 48,
          "is_leaf": false,
          "feature": "cibil_score",
          "threshold": 318.5,
          "left_child": 20,
          "right_child": 21
        },
        {
          "id": 20,
          "x": 2975.0,
          "y": 1250,
          "impurity": 0.0,
          "samples": 2,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 21,
          "x": 3587.5,
          "y": 1250,
          "impurity": 0.08317580340264652,
          "samples": 46,
          "is_leaf": false,
          "feature": "luxury_assets_value",
          "threshold": 16300000.0,
          "left_child": 22,
          "right_child": 23
        },
        {
          "id": 22,
          "x": 3325.0,
          "y": 1500,
          "impurity": 0.0,
          "samples": 1,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 23,
          "x": 3850.0,
          "y": 1500,
          "impurity": 0.04345679012345682,
          "samples": 45,
          "is_leaf": false,
          "feature": "income_annum",
          "threshold": 7250000.0,
          "left_child": 24,
          "right_child": 25
        },
        {
          "id": 24,
          "x": 3675.0,
          "y": 1750,
          "impurity": 0.375,
          "samples": 4,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.25,
            0.75
          ]
        },
        {
          "id": 25,
          "x": 4025.0,
          "y": 1750,
          "impurity": 0.0,
          "samples": 41,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.0,
            1.0
          ]
        },
        {
          "id": 26,
          "x": 4637.5,
          "y": 750,
          "impurity": 0.04874999999999996,
          "samples": 40,
          "is_leaf": false,
          "feature": "income_annum",
          "threshold": 9650000.0,
          "left_child": 27,
          "right_child": 28
        },
        {
          "id": 27,
          "x": 4375.0,
          "y": 1000,
          "impurity": 0.0,
          "samples": 34,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 28,
          "x": 4900.0,
          "y": 1000,
          "impurity": 0.2777777777777778,
          "samples": 6,
          "is_leaf": false,
          "feature": "loan_amount",
          "threshold": 29050000.0,
          "left_child": 29,
          "right_child": 30
        },
        {
          "id": 29,
          "x": 4725.0,
          "y": 1250,
          "impurity": 0.0,
          "samples": 1,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.0,
            1.0
          ]
        },
        {
          "id": 30,
          "x": 5075.0,
          "y": 1250,
          "impurity": 0.0,
          "samples": 5,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 31,
          "x": 5425.0,
          "y": 500,
          "impurity": 0.0,
          "samples": 1149,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.0,
            1.0
          ]
        },
        {
          "id": 32,
          "x": 8432.8125,
          "y": 250,
          "impurity": 0.01202963464791118,
          "samples": 1983,
          "is_leaf": false,
          "feature": "residential_assets_value",
          "threshold": 50000.0,
          "left_child": 33,
          "right_child": 44
        },
        {
          "id": 33,
          "x": 6485.9375,
          "y": 500,
          "impurity": 0.21875,
          "samples": 40,
          "is_leaf": false,
          "feature": "luxury_assets_value",
          "threshold": 350000.0,
          "left_child": 34,
          "right_child": 35
        },
        {
          "id": 34,
          "x": 5775.0,
          "y": 750,
          "impurity": 0.0,
          "samples": 1,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.0,
            1.0
          ]
        },
        {
          "id": 35,
          "x": 7196.875,
          "y": 750,
          "impurity": 0.1840894148586456,
          "samples": 39,
          "is_leaf": false,
          "feature": "cibil_score",
          "threshold": 683.5,
          "left_child": 36,
          "right_child": 43
        },
        {
          "id": 36,
          "x": 6868.75,
          "y": 1000,
          "impurity": 0.3911111111111111,
          "samples": 15,
          "is_leaf": false,
          "feature": "cibil_score",
          "threshold": 660.5,
          "left_child": 37,
          "right_child": 42
        },
        {
          "id": 37,
          "x": 6562.5,
          "y": 1250,
          "impurity": 0.2603550295857988,
          "samples": 13,
          "is_leaf": false,
          "feature": "commercial_assets_value",
          "threshold": 300000.0,
          "left_child": 38,
          "right_child": 41
        },
        {
          "id": 38,
          "x": 6300.0,
          "y": 1500,
          "impurity": 0.4444444444444444,
          "samples": 3,
          "is_leaf": false,
          "feature": "no_of_dependents",
          "threshold": 3.0,
          "left_child": 39,
          "right_child": 40
        },
        {
          "id": 39,
          "x": 6125.0,
          "y": 1750,
          "impurity": 0.0,
          "samples": 2,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.0,
            1.0
          ]
        },
        {
          "id": 40,
          "x": 6475.0,
          "y": 1750,
          "impurity": 0.0,
          "samples": 1,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 41,
          "x": 6825.0,
          "y": 1500,
          "impurity": 0.0,
          "samples": 10,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 42,
          "x": 7175.0,
          "y": 1250,
          "impurity": 0.0,
          "samples": 2,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.0,
            1.0
          ]
        },
        {
          "id": 43,
          "x": 7525.0,
          "y": 1000,
          "impurity": 0.0,
          "samples": 24,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 44,
          "x": 10379.6875,
          "y": 500,
          "impurity": 0.007179393994939165,
          "samples": 1943,
          "is_leaf": false,
          "feature": "residential_assets_value",
          "threshold": 950000.0,
          "left_child": 45,
          "right_child": 62
        },
        {
          "id": 45,
          "x": 9734.375,
          "y": 750,
          "impurity": 0.056403987534649924,
          "samples": 241,
          "is_leaf": false,
          "feature": "loan_amount",
          "threshold": 30950000.0,
          "left_child": 46,
          "right_child": 59
        },
        {
          "id": 46,
          "x": 8968.75,
          "y": 1000,
          "impurity": 0.04914907139326319,
          "samples": 238,
          "is_leaf": false,
          "feature": "commercial_assets_value",
          "threshold": 450000.0,
          "left_child": 47,
          "right_child": 54
        },
        {
          "id": 47,
          "x": 8400.0,
          "y": 1250,
          "impurity": 0.11583600060966315,
          "samples": 81,
          "is_leaf": false,
          "feature": "loan_amount",
          "threshold": 3350000.0,
          "left_child": 48,
          "right_child": 51
        },
        {
          "id": 48,
          "x": 8050.0,
          "y": 1500,
          "impurity": 0.02856542743121193,
          "samples": 69,
          "is_leaf": false,
          "feature": "residential_assets_value",
          "threshold": 150000.0,
          "left_child": 49,
          "right_child": 50
        },
        {
          "id": 49,
          "x": 7875.0,
          "y": 1750,
          "impurity": 0.2777777777777778,
          "samples": 6,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            0.8333333333333334,
            0.16666666666666666
          ]
        },
        {
          "id": 50,
          "x": 8225.0,
          "y": 1750,
          "impurity": 0.0,
          "samples": 63,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 51,
          "x": 8750.0,
          "y": 1500,
          "impurity": 0.4444444444444444,
          "samples": 12,
          "is_leaf": false,
          "feature": "no_of_dependents",
          "threshold": 1.5,
          "left_child": 52,
          "right_child": 53
        },
        {
          "id": 52,
          "x": 8575.0,
          "y": 1750,
          "impurity": 0.0,
          "samples": 3,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.0,
            1.0
          ]
        },
        {
          "id": 53,
          "x": 8925.0,
          "y": 1750,
          "impurity": 0.19753086419753085,
          "samples": 9,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            0.8888888888888888,
            0.1111111111111111
          ]
        },
        {
          "id": 54,
          "x": 9537.5,
          "y": 1250,
          "impurity": 0.01265771430889695,
          "samples": 157,
          "is_leaf": false,
          "feature": "loan_term",
          "threshold": 19.0,
          "left_child": 55,
          "right_child": 56
        },
        {
          "id": 55,
          "x": 9275.0,
          "y": 1500,
          "impurity": 0.0,
          "samples": 142,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 56,
          "x": 9800.0,
          "y": 1500,
          "impurity": 0.12444444444444447,
          "samples": 15,
          "is_leaf": false,
          "feature": "residential_assets_value",
          "threshold": 250000.0,
          "left_child": 57,
          "right_child": 58
        },
        {
          "id": 57,
          "x": 9625.0,
          "y": 1750,
          "impurity": 0.5,
          "samples": 2,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            0.5,
            0.5
          ]
        },
        {
          "id": 58,
          "x": 9975.0,
          "y": 1750,
          "impurity": 0.0,
          "samples": 13,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 59,
          "x": 10500.0,
          "y": 1000,
          "impurity": 0.4444444444444444,
          "samples": 3,
          "is_leaf": false,
          "feature": "loan_amount",
          "threshold": 33100000.0,
          "left_child": 60,
          "right_child": 61
        },
        {
          "id": 60,
          "x": 10325.0,
          "y": 1250,
          "impurity": 0.0,
          "samples": 1,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.0,
            1.0
          ]
        },
        {
          "id": 61,
          "x": 10675.0,
          "y": 1250,
          "impurity": 0.0,
          "samples": 2,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 62,
          "x": 11025.0,
          "y": 750,
          "impurity": 0.0,
          "samples": 1702,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        }
      ],
      "entropy": [
        {
          "id": 0,
          "x": 4607.421875,
          "y": 0,
          "impurity": 0.9574817108294552,
          "samples": 3415,
          "is_leaf": false,
          "feature": "cibil_score",
          "threshold": 549.5,
          "left_child": 1,
          "right_child": 20
        },
        {
          "id": 1,
          "x": 2663.28125,
          "y": 250,
          "impurity": 0.4817047378585828,
          "samples": 1432,
          "is_leaf": false,
          "feature": "loan_term",
          "threshold": 5.0,
          "left_child": 2,
          "right_child": 19
        },
        {
          "id": 2,
          "x": 2001.5625,
          "y": 500,
          "impurity": 0.9979725146686187,
          "samples": 283,
          "is_leaf": false,
          "feature": "loan_amount",
          "threshold": 26250000.0,
          "left_child": 3,
          "right_child": 14
        },
        {
          "id": 3,
          "x": 1465.625,
          "y": 750,
          "impurity": 0.993528008093967,
          "samples": 243,
          "is_leaf": false,
          "feature": "income_annum",
          "threshold": 8050000.0,
          "left_child": 4,
          "right_child": 13
        },
        {
          "id": 4,
          "x": 1006.25,
          "y": 1000,
          "impurity": 0.9989725613141185,
          "samples": 212,
          "is_leaf": false,
          "feature": "loan_amount",
          "threshold": 18400000.0,
          "left_child": 5,
          "right_child": 10
        },
        {
          "id": 5,
          "x": 612.5,
          "y": 1250,
          "impurity": 0.9912715083767959,
          "samples": 182,
          "is_leaf": false,
          "feature": "income_annum",
          "threshold": 5800000.0,
          "left_child": 6,
          "right_child": 9
        },
        {
          "id": 6,
          "x": 350.0,
          "y": 1500,
          "impurity": 0.9935356224240488,
          "samples": 148,
          "is_leaf": false,
          "feature": "loan_amount",
          "threshold": 16050000.0,
          "left_child": 7,
          "right_child": 8
        },
        {
          "id": 7,
          "x": 175.0,
          "y": 1750,
          "impurity": 1.0,
          "samples": 134,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            0.5,
            0.5
          ]
        },
        {
          "id": 8,
          "x": 525.0,
          "y": 1750,
          "impurity": 0.0,
          "samples": 14,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 9,
          "x": 875.0,
          "y": 1500,
          "impurity": 0.0,
          "samples": 34,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.0,
            1.0
          ]
        },
        {
          "id": 10,
          "x": 1400.0,
          "y": 1250,
          "impurity": 0.21084230031853213,
          "samples": 30,
          "is_leaf": false,
          "feature": "luxury_assets_value",
          "threshold": 29250000.0,
          "left_child": 11,
          "right_child": 12
        },
        {
          "id": 11,
          "x": 1225.0,
          "y": 1500,
          "impurity": 0.0,
          "samples": 29,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 12,
          "x": 1575.0,
          "y": 1500,
          "impurity": 0.0,
          "samples": 1,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.0,
            1.0
          ]
        },
        {
          "id": 13,
          "x": 1925.0,
          "y": 1000,
          "impurity": 0.0,
          "samples": 31,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.0,
            1.0
          ]
        },
        {
          "id": 14,
          "x": 2537.5,
          "y": 750,
          "impurity": 0.16866093149667025,
          "samples": 40,
          "is_leaf": false,
          "feature": "income_annum",
          "threshold": 9650000.0,
          "left_child": 15,
          "right_child": 16
        },
        {
          "id": 15,
          "x": 2275.0,
          "y": 1000,
          "impurity": 0.0,
          "samples": 34,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 16,
          "x": 2800.0,
          "y": 1000,
          "impurity": 0.6500224216483541,
          "samples": 6,
          "is_leaf": false,
          "feature": "no_of_dependents",
          "threshold": 4.5,
          "left_child": 17,
          "right_child": 18
        },
        {
          "id": 17,
          "x": 2625.0,
          "y": 1250,
          "impurity": 0.0,
          "samples": 5,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 18,
          "x": 2975.0,
          "y": 1250,
          "impurity": 0.0,
          "samples": 1,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.0,
            1.0
          ]
        },
        {
          "id": 19,
          "x": 3325.0,
          "y": 500,
          "impurity": 0.0,
          "samples": 1149,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.0,
            1.0
          ]
        },
        {
          "id": 20,
          "x": 6551.5625,
          "y": 250,
          "impurity": 0.05329396357763028,
          "samples": 1983,
          "is_leaf": false,
          "feature": "residential_assets_value",
          "threshold": 950000.0,
          "left_child": 21,
          "right_child": 40
        },
        {
          "id": 21,
          "x": 5928.125,
          "y": 500,
          "impurity": 0.2545582578138593,
          "samples": 281,
          "is_leaf": false,
          "feature": "commercial_assets_value",
          "threshold": 1850000.0,
          "left_child": 22,
          "right_child": 39
        },
        {
          "id": 22,
          "x": 5031.25,
          "y": 750,
          "impurity": 0.3547757389859291,
          "samples": 179,
          "is_leaf": false,
          "feature": "loan_amount",
          "threshold": 3100000.0,
          "left_child": 23,
          "right_child": 30
        },
        {
          "id": 23,
          "x": 4418.75,
          "y": 1000,
          "impurity": 0.16866093149667025,
          "samples": 120,
          "is_leaf": false,
          "feature": "residential_assets_value",
          "threshold": 150000.0,
          "left_child": 24,
          "right_child": 29
        },
        {
          "id": 24,
          "x": 4112.5,
          "y": 1250,
          "impurity": 0.5586293734521992,
          "samples": 23,
          "is_leaf": false,
          "feature": "luxury_assets_value",
          "threshold": 800000.0,
          "left_child": 25,
          "right_child": 28
        },
        {
          "id": 25,
          "x": 3850.0,
          "y": 1500,
          "impurity": 0.9709505944546686,
          "samples": 5,
          "is_leaf": false,
          "feature": "no_of_dependents",
          "threshold": 2.5,
          "left_child": 26,
          "right_child": 27
        },
        {
          "id": 26,
          "x": 3675.0,
          "y": 1750,
          "impurity": 0.0,
          "samples": 3,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.0,
            1.0
          ]
        },
        {
          "id": 27,
          "x": 4025.0,
          "y": 1750,
          "impurity": 0.0,
          "samples": 2,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 28,
          "x": 4375.0,
          "y": 1500,
          "impurity": 0.0,
          "samples": 18,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 29,
          "x": 4725.0,
          "y": 1250,
          "impurity": 0.0,
          "samples": 97,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 30,
          "x": 5643.75,
          "y": 1000,
          "impurity": 0.6161661934005356,
          "samples": 59,
          "is_leaf": false,
          "feature": "luxury_assets_value",
          "threshold": 2200000.0,
          "left_child": 31,
          "right_child": 34
        },
        {
          "id": 31,
          "x": 5250.0,
          "y": 1250,
          "impurity": 0.9182958340544896,
          "samples": 3,
          "is_leaf": false,
          "feature": "self_employed",
          "threshold": 0.5,
          "left_child": 32,
          "right_child": 33
        },
        {
          "id": 32,
          "x": 5075.0,
          "y": 1500,
          "impurity": 0.0,
          "samples": 1,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 33,
          "x": 5425.0,
          "y": 1500,
          "impurity": 0.0,
          "samples": 2,
          "is_leaf": true,
          "class": "Rejected",
          "class_counts": [
            0.0,
            1.0
          ]
        },
        {
          "id": 34,
          "x": 6037.5,
          "y": 1250,
          "impurity": 0.5435644431995964,
          "samples": 56,
          "is_leaf": false,
          "feature": "loan_amount",
          "threshold": 4750000.0,
          "left_child": 35,
          "right_child": 36
        },
        {
          "id": 35,
          "x": 5775.0,
          "y": 1500,
          "impurity": 0.0,
          "samples": 20,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 36,
          "x": 6300.0,
          "y": 1500,
          "impurity": 0.710676853856123,
          "samples": 36,
          "is_leaf": false,
          "feature": "cibil_score",
          "threshold": 660.0,
          "left_child": 37,
          "right_child": 38
        },
        {
          "id": 37,
          "x": 6125.0,
          "y": 1750,
          "impurity": 0.0,
          "samples": 12,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 38,
          "x": 6475.0,
          "y": 1750,
          "impurity": 0.8708644692353646,
          "samples": 24,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            0.7083333333333334,
            0.2916666666666667
          ]
        },
        {
          "id": 39,
          "x": 6825.0,
          "y": 750,
          "impurity": 0.0,
          "samples": 102,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        },
        {
          "id": 40,
          "x": 7175.0,
          "y": 500,
          "impurity": 0.0,
          "samples": 1702,
          "is_leaf": true,
          "class": "Approved",
          "class_counts": [
            1.0,
            0.0
          ]
        }
      ]
    }
  }
};