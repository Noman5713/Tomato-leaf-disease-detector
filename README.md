# 🍅 Tomato Leaf Disease Detector

A web application that uses Transfer learning to detect diseases in tomato leaves from images. Users can upload a photo of a tomato leaf, and the app will analyze it and provide a diagnosis, including disease information and treatment suggestions.

---

## Features
- Upload tomato leaf images (JPG, PNG, WebP)
- Automatic background removal, resizing, and normalization
- Disease detection using a trained EfficientNet model
- Displays disease name, confidence, and treatment info
- Modern, responsive web interface

---


## Usage
1. Open the web app in your browser.
2. Upload a clear image of a tomato leaf.
3. Click "Analyze Image".
4. View the predicted disease, confidence, and treatment info.

---

## Dependencies
- Python 3.7+
- Flask
- Flask-CORS
- Pillow
- torch
- torchvision
- timm
- rembg
- numpy

---

- Classes: Bacterial Spot, Early Blight, Healthy, Late Blight, Leaf Miner Flies, Magnesium Deficiency, Yellow Leaf Curl Virus

---
