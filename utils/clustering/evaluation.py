import numpy as np
from scipy.spatial.distance import cdist


def euclidean_distance(point, centroid):
    return np.sqrt(np.sum((point - centroid) ** 2))


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
        self.centroids = np.random.rand(self.no_clusters, self.no_features)
        self.membership = np.random.dirichlet(np.ones(self.no_clusters), size=self.no_samples)
        self.m = m
        self.eps = epsilon
        self.alpha = alpha

    def update_centroids(self):
        centroids = np.zeros((self.no_clusters, self.no_features))
        for k in range(self.no_clusters):
            denom = np.sum(self.membership[:, k] ** self.m)
            if denom < 1e-10:
                denom = 1e-10
            centroids[k] = np.sum((self.membership[:, k] ** self.m)[:, np.newaxis] * self.data, axis=0) / denom
        return centroids

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

    def do_ssfcm(self, max_iter: int = 1000):
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