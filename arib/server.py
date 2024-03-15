from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.inception_v3 import preprocess_input
import numpy as np
from io import BytesIO
import uuid
import tempfile
import os

from PIL import ImageFile
ImageFile.LOAD_TRUNCATED_IMAGES = True

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://aiindonesia-project-1.insomnius.dev", "https://aiindonesia-project-1.insomnius.dev"])

list_model_dirs = os.listdir('model_saved')

list_models = {}

for dir in list_model_dirs:
    # only load model saved
    if '.h5' in dir:
        list_models[dir] = load_model(f"model_saved/{dir}")

list_available_models = list(list_models.keys())

print("list models", list_models)
print("list available models", list_available_models)

@app.route('/models', methods=['GET'])
def models():
    return jsonify({'models': list_available_models})

@app.route('/predict', methods=['POST'])
def predict_gender():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    if request.form.get('model') == '':
        return jsonify({'error': 'Parameter model cannot be empty'}), 400

    model = request.form.get('model')
    print("Model used for the request", model)
    if model not in list_available_models :
        return jsonify({'error': 'Model is invalid type'}), 400

    saved_model = list_models[model]

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    file_extension = file.filename.rsplit('.', 1)[1] if '.' in file.filename else 'jpg'


    with tempfile.NamedTemporaryFile(suffix='.'+file_extension, delete=False) as temp_file:
        file.save(temp_file)
        print("Temp file name:", temp_file.name)
        img = image.load_img(temp_file.name, target_size=(saved_model.input_shape[1], saved_model.input_shape[2]))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)

        prediction = saved_model.predict(img_array)
        print("prediction", prediction)
        result = "Female"
        # Interpret the prediction result
        if prediction[0][0] > 0.5:
            result = "Male"


        return jsonify({'gender': result})

if __name__ == '__main__':
    app.run(debug=True)
