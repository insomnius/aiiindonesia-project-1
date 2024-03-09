from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.inception_v3 import preprocess_input
import numpy as np
from io import BytesIO
import uuid
import tempfile

from PIL import ImageFile
ImageFile.LOAD_TRUNCATED_IMAGES = True

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# Load the saved InceptionV3 model
saved_model = load_model("model_saved/inception-v3-30%-test-size-epoch-20.h5")

@app.route('/predict', methods=['POST'])
def predict_gender():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    file_extension = file.filename.rsplit('.', 1)[1] if '.' in file.filename else 'jpg'


    with tempfile.NamedTemporaryFile(suffix='.'+file_extension, delete=False) as temp_file:
        file.save(temp_file)
        print("Temp file name:", temp_file.name)
        img = image.load_img(temp_file.name, target_size=(299, 299))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)

        prediction = saved_model.predict(img_array)

        result = "Female"
        # Interpret the prediction result
        if prediction[0][0] > 0.5:
            result = "Male"


        return jsonify({'gender': result})

if __name__ == '__main__':
    app.run(debug=True)
