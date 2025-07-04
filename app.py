from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import torch
import torchvision.transforms as transforms
from rembg import remove
import numpy as np
from model_efficientnet import EfficientNetClassifier, Config

app = Flask(__name__)
CORS(app)

# Load EfficientNet model and weights
model = EfficientNetClassifier(
    model_name=Config.MODEL_NAME,
    num_classes=Config.NUM_CLASSES,
    pretrained=False,  # We load our own weights
    dropout_rate=Config.DROPOUT_RATE
)
model.load_state_dict(torch.load('efficientnet_weights.pth', map_location='cpu'))
model.eval()

# Class names (update if needed)
CLASS_NAMES = [
    'Bacterial Spot', 'Early Blight', 'Healthy', 'Late Blight',
    'Leaf Miner Flies', 'Magnesium Deficiency', 'Yellow Leaf Curl Virus'
]

# Preprocessing pipeline: background removal -> resize -> normalize
imagenet_mean = [0.485, 0.456, 0.406]
imagenet_std = [0.229, 0.224, 0.225]

def preprocess_image(image_bytes):
    # 1. Background removal
    input_image = Image.open(io.BytesIO(image_bytes)).convert('RGBA')
    no_bg = remove(input_image)
    # Convert to RGB after background removal
    no_bg = no_bg.convert('RGB')
    # 2. Resize
    resized = no_bg.resize((224, 224))
    # 3. Normalize
    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize(mean=imagenet_mean, std=imagenet_std)
    ])
    tensor = transform(resized).unsqueeze(0)  # Add batch dimension
    return tensor

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    image = request.files['image'].read()
    input_tensor = preprocess_image(image)
    with torch.no_grad():
        outputs = model(input_tensor)
        probs = torch.softmax(outputs, dim=1).cpu().numpy()[0]
        predictions = [
            {'class': CLASS_NAMES[i], 'confidence': float(probs[i])}
            for i in range(len(CLASS_NAMES))
        ]
        predictions.sort(key=lambda x: x['confidence'], reverse=True)
    return jsonify({'predictions': predictions})

if __name__ == '__main__':
    app.run(debug=True) 