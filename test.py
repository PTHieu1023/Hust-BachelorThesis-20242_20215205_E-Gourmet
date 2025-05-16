from utils.data_processor import DataProcess
from utils.ssfcm.ssfcm import ssfcm
from utils.ssfcm.criterion_metrics import metric_criteria

import pandas
import numpy as np

data_processor = DataProcess()
df = [[-2, 1.5],[-2, 1], [-2.3, 2], [-2.5, 1.2], [-3.5, -1.5], [-3, -1.5], [-4.5, -1.5], [-4, -1], [0.5, 1.5], [1, 1.5], [1.5, 1], [-0.2, 1.8]]
supervised = [[0.5, 0, 0], [0.5, 0 , 0], [0.5, 0 ,0], [0, 0 ,0], [0, 0.5, 0], [0, 0.5,0], [0,0,0], [0, 0.5, 0], [0, 0, 0.5], [0, 0, 0.5], [0,0,0],[0,0,0]]
supervised = np.array(supervised)
df = pandas.DataFrame(df)
data = data_processor.preprocess_data(df)
u, v, d = ssfcm(data, 3, 2, 10000, 0.0001, np.zeros((data.shape[0], 3)))
print(u)
print(data_processor.reverse_scale_data(v))
print(metric_criteria(data, u, data_processor.reverse_scale_data(v), 3))