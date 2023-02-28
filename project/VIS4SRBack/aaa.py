import os
import pandas as pd

FILE_ABS_PATH = os.path.dirname(__file__)
PROCESS_DATA_FOLDER = os.path.join(FILE_ABS_PATH, 'data/ImageNet_SR')
ds = ['bicubic_224', 'hcflow', 'srResNet', 'vdsr']
md = 'vgg19'

file_paths = os.listdir(PROCESS_DATA_FOLDER)



l = process_classification_results(ds, md)
print(l[0])