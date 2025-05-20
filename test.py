import pandas as pd
import ast
from sklearn.preprocessing import StandardScaler, MultiLabelBinarizer, OneHotEncoder

# Load data
df = pd.read_csv("etc/sample_data/sample_dishes.csv")

df["ingradient"] = df["ingradient"].apply(ast.literal_eval)
df["restriction"] = df["restriction"].apply(ast.literal_eval)

# One-hot encode 'cuisine' manually (older sklearn)
cuisine_encoder = OneHotEncoder(handle_unknown='ignore')
cuisine_encoded = cuisine_encoder.fit_transform(df[["cuisine"]])
cuisine_columns = cuisine_encoder.get_feature_names_out(["cuisine"])
cuisine_encoded_df = pd.DataFrame(cuisine_encoded, columns=cuisine_columns)

# Multi-label binarization
mlb_ing = MultiLabelBinarizer()
ingradient_encoded_df = pd.DataFrame(mlb_ing.fit_transform(df["ingradient"]), columns=[f"ing_{x}" for x in mlb_ing.classes_])

mlb_res = MultiLabelBinarizer()
restriction_encoded_df = pd.DataFrame(mlb_res.fit_transform(df["restriction"]), columns=[f"rest_{x}" for x in mlb_res.classes_])

# Normalize numerical features
numerical_features = ["cuisine_w", "lat", "lng", "avg_current_rating", "current_review_count", "avg_all_rating", "total_review_count"]
scaler = StandardScaler()
scaled_numerical_df = pd.DataFrame(scaler.fit_transform(df[numerical_features]), columns=numerical_features)

# Combine all
df_cluster_ready = pd.concat([
    scaled_numerical_df.reset_index(drop=True),
    cuisine_encoded_df.reset_index(drop=True),
    ingradient_encoded_df.reset_index(drop=True),
    restriction_encoded_df.reset_index(drop=True)
], axis=1)

# Check output
print("Prepared dataset shape:", df_cluster_ready.shape)
print(df_cluster_ready.head())
