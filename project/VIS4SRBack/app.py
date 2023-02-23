from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import pandas as pd
from PIL import Image
import base64
import io

FILE_ABS_PATH = os.path.dirname(__file__)

app = Flask(__name__)
CORS(app)



FILE_ABS_PATH = os.path.dirname(__file__)
PROCESS_DATA_FOLDER = os.path.join(FILE_ABS_PATH, 'data/ImageNet_SR')
DATA_FOLDER = "E:\imageNet\\"
RESULT_FOLDER = os.path.join(DATA_FOLDER, 'sr')

RAW_FOLDER =  os.path.join(DATA_FOLDER, '50000_N_N_224')
BICUBIC_FOLDER = os.path.join(RESULT_FOLDER, '50000_DS-bicubic_N_224')
VDSR_FOLDER = os.path.join(RESULT_FOLDER, '50000_DS-bicubic_VDSR-1_224')
SRResnet_FOLDER = os.path.join(RESULT_FOLDER, '50000_DS-bicubic_SRResNet-4_224')
HCFlow_FOLDER = os.path.join(RESULT_FOLDER, '50000_DS-bicubic_HCFlow-4_224')

data_configs = [
    {'model': 'bicubic', 'folder': BICUBIC_FOLDER},
    {'model': 'vdsr', 'folder': VDSR_FOLDER},
    {'model': 'srresnet', 'folder': SRResnet_FOLDER},
    {'model': 'hcflow', 'folder': HCFlow_FOLDER},
    {'model': 'raw', 'folder': RAW_FOLDER}
]
DATA_PATH = os.path.abspath(os.path.join(FILE_ABS_PATH, 'data'))

@app.route('/api/SR/loadSRMetrics/', methods=['POST'])
def fetch_sr_metrics():
    label_df = pd.read_csv(os.path.join(PROCESS_DATA_FOLDER,  'ImageNet_label.csv'))
    metric_df = pd.read_csv(os.path.join(PROCESS_DATA_FOLDER, 'metrics.csv'))
    merge_df = metric_df.merge(label_df, on='imnames')
    return jsonify(merge_df.to_dict('records')[:100]), 200, {"Content-Type": "application/json"}


@app.route('/api/SR/loadSRModels/', methods=['POST'])
def load_sr_models():
    return jsonify(['vdsr', 'srResNet', 'hcflow']), 200, {"Content-Type": "application/json"}



# @app.route('/api/SR/loadClassificationModels/', methods=['POST'])
# def load_classification_models():
#     return ['googlenet', 'alexnet', 'vgg19', 'resnet50', 'swin_b', 'convnext_large']
#
# @app.route('/api/SR/datasetIds/', methods=['POST'])
# def load_dataset_ids():
#     return ['bicubic_224', 'vdsr', 'srResNet', 'hcflow', 'crop_raw']



def load_model_performance():
    return ['vdsr', 'srResNet', 'hcflow']
    data_path = os.path.join(DATA_PATH, 'classification.csv')
    df = pd.read_csv(data_path)
    resp = df.to_dict('records')
    # resp = resp[:100]
    for r in resp:
        r['id'] = int(r['imname'].split('.')[0].split('_')[-1])
    print("Total number records: ", len(resp))

    map_path = os.path.join(DATA_PATH, 'label2name.json')
    with open(map_path, 'r') as input_file:
        label2Name = json.load(input_file)
    return jsonify({
        'results': resp,
        'label2Name': label2Name
    }), 200, {"Content-Type": "application/json"}

if __name__ == '__main__':
    app.run()


