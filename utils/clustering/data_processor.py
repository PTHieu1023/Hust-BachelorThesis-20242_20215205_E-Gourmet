from sklearn.preprocessing import StandardScaler

def normalize_data(data):
    scaler = StandardScaler()
    return scaler.fit_transform(data), scaler