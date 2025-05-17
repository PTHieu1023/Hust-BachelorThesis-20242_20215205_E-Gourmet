import numpy as np
from numpy import ndarray
from scipy.spatial.distance import cdist


def euclidean_distance(x, y):
    return np.sqrt(np.sum((x - y) ** 2))

def subtract_matrix(m1: np.ndarray, m2: np.ndarray)->np.ndarray:
    return abs(m1-m2)



class SsFuzzyCMeans:
    def __init__(self, data, supervise_matrix, epsilon: float = 1e-6, m: float = 2.0, alpha: float = 0.5):
        if m <= 1:
            raise ValueError("Fuzzy index m must be greater than 1")
        if epsilon <= 0:
            raise ValueError("Epsilon must be positive")
        if alpha < 0 or alpha > 1:
            raise ValueError("Alpha must be between 0 and 1")

        self.no_samples, self.no_features = data.shape
        self.no_clusters = supervise_matrix.shape[1]
        if supervise_matrix.shape[0] != self.no_samples:
            raise ValueError("Supervise matrix must have same number of samples as data")

        self.data = data
        self.supervise_matrix = supervise_matrix
        self.labeled_indices = np.nonzero(np.sum(supervise_matrix, axis=1) > 0)[0]
        generator = np.random.default_rng(seed=42)
        self.centroids = generator.uniform(low=np.min(data, axis=0), high=np.max(data, axis=0), size=(self.no_clusters, self.no_features))
        self.membership = generator.dirichlet(np.ones(self.no_clusters), size=self.no_samples)
        self.m = m
        self.eps = epsilon
        self.alpha = alpha

    def update_centroids(self):
        diff_u = subtract_matrix(self.membership, self.supervise_matrix)
        for k in range(self.no_clusters):
            self.centroids[k, :] = (np.sum((diff_u[:, k] ** self.m)[:, np.newaxis] * self.data, axis=0) /
                               np.sum(diff_u[:, k] ** self.m))

    def update_membership_matrix(self):
        u_matrix = np.zeros((self.no_samples, self.no_clusters))
        for i in range(self.no_clusters):
            u_matrix[:, i] = np.linalg.norm(self.data - self.centroids[i, :], axis=1)
        u_matrix = 1 / (u_matrix ** (2 / (self.m - 1)) * np.sum((1 / u_matrix) ** (2 / (self.m - 1)), axis=1)[:, np.newaxis])
        sum_supervised = [np.sum(r) for r in self.supervise_matrix]
        for i in range(u_matrix.shape[0]):
            u_matrix[i, :] *= (1 - sum_supervised[i])
        u_matrix += self.supervise_matrix
        return u_matrix

    def update_membership(self):
        distances = cdist(self.data, self.centroids, metric='euclidean')
        distances = np.maximum(distances, 1e-10)
        power = 2 / (self.m - 1)
        dist_ratio = distances[:, :, np.newaxis] / distances[:, np.newaxis, :]
        sum_term = np.sum(dist_ratio ** power, axis=2)
        u_new = 1 / np.maximum(sum_term, 1e-10)

        for i in self.labeled_indices:
            u_new[i] = (1 - self.alpha) * u_new[i] + self.alpha * self.supervise_matrix[i]
        return u_new

    def do_clustering(self, max_iter: int = 1000):
        for _ in range(max_iter):
            pre_membership = self.membership.copy()
            self.centroids = self.update_centroids()
            self.membership = self.update_membership()
            if np.sum((self.membership - pre_membership) ** 2) < self.eps:
                break
        return self.membership, self.centroids

    def predict(self, membership):
        distances = cdist(membership, self.centroids, metric='euclidean')
        distances = np.maximum(distances, 1e-10)
        power = 2 / (self.m - 1)
        dist_ratio = distances[:, :, np.newaxis] / distances[:, np.newaxis, :]
        sum_term = np.sum(dist_ratio ** power, axis=2)
        return 1 / np.maximum(sum_term, 1e-10)