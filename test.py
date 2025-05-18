import numpy as np
from scipy.spatial.distance import cdist

from utils.clustering.ssfcm import ssfcm, calc_membership

df = [[-2, 1.5],[-2, 1], [-2.3, 2], [-2.5, 1.2], [-3.5, -1.5], [-3, -1.5], [-4.5, -1.5], [-4, -1], [0.5, 1.5], [1, 1.5], [1.5, 1], [-0.2, 1.8]]
supervised = [[0, 0, 0], [0, 0 , 0], [0, 0 ,0], [0, 0 ,0], [0, 0, 0], [0, 0,0], [0,0,0], [0, 0, 0], [0, 0, 0], [0, 0, 0.5], [0,0,0],[0,0,0]]
supervised = np.array(supervised)
df = np.array(df)  # Convert DataFrame to ndarray

u, v = ssfcm(x=df, c=3)
print(df)
print(u)
print(v)

p = np.array([-1,2])
print(p.shape)

u1 = calc_membership(p, v, np.array([0.5,0,0]), 2)
print(u1)