import numpy as np
from numpy import ndarray
from scipy.spatial.distance import cdist
from sklearn.metrics import silhouette_score, davies_bouldin_score

"""
Symbol for Supervised Fuzzy C-Means (SSFCM) clustering algorithm.
x: Input data
c: Number of clusters
m: Fuzziness parameter
max_iter: Maximum number of iterations
eps: Convergence threshold
u_bar: Supervised membership matrix
u: Membership matrix
v: Centroids matrix
p: Number of features
d: Distance from data point to centroids matrix
delta_u: Difference between membership matrix and supervised membership matrix
"""


def calc_centroid(x, u, u_bar, v, m) -> ndarray:
    delta_u = abs(u - u_bar)
    for i in range(u.shape[1]):
        v[i, :] = (np.sum((delta_u[:, i] ** m)[:, np.newaxis] * x, axis=0) /
                           np.sum(delta_u[:, i] ** m))
    return v

def calc_membership(x: ndarray, v: ndarray, u_bar: ndarray, m: float) -> ndarray:
    if x.shape == (v.shape[1],):
        x = np.array([x])
        u_bar = np.array(u_bar)
    d = cdist(x, v, metric='euclidean') # d: distance from data point to centroids matrix
    optimal_u = 1 / (d ** (1 / (m - 1)) * np.sum((1 / d) ** (1 / (m - 1)), axis=1)[:, np.newaxis])

    sum_u_bar = [np.sum(r) for r in u_bar]
    for i in range(optimal_u.shape[0]):
        optimal_u[i, :] *= (1 - sum_u_bar[i])
    optimal_u += u_bar
    return optimal_u


def ssfcm(x: ndarray, c: int, m: float = 2, max_iter: int = 10000, eps: float = 1e-5, u_bar: np.ndarray = None) -> tuple[np.ndarray, np.ndarray]:
    n = x.shape[0] # n: number of samples
    p = x.shape[1] # p: number of features
    if u_bar is None:
        u_bar = np.zeros((n, c))
    generator = np.random.default_rng(seed=42)
    v = generator.uniform(low=np.min(x, axis=0), high=np.max(x, axis=0), size=(c, p))
    u = generator.dirichlet(np.ones(c), size=n)
    for _ in range(max_iter):
        pre_u = u
        u = calc_membership(x, v, u_bar, m)
        v = calc_centroid(x, u, u_bar, v, m)
        delta = np.linalg.norm(pre_u - u)
        if delta < eps:
            return u, v
    return u, v

def evaluate_clustering(data, labels):
    try:
        if len(np.unique(labels)) < 2:
            return {
                "silhouette": None,
                "davies_bouldin": None
            }
            
        silhouette = silhouette_score(data, labels)
      
        db_index = davies_bouldin_score(data, labels)
  
        
        return {
            "silhouette": silhouette,
            "davies_bouldin": db_index
        }
    except Exception as e:
        print(f"Error computing cluster evaluation metrics: {e}")
        return {
            "silhouette": None,
            "davies_bouldin": None
        }