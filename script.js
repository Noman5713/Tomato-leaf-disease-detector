// Disease information database
const diseaseInfo = {
    'Bacterial Spot': {
        description: 'Bacterial spot is caused by Xanthomonas bacteria. It creates small, dark spots on leaves and fruit.',
        treatment: 'Use copper-based fungicides, improve air circulation, and avoid overhead watering.'
    },
    'Early Blight': {
        description: 'Early blight is a fungal disease that causes brown spots with concentric rings on leaves.',
        treatment: 'Apply fungicides, remove infected leaves, and ensure proper spacing between plants.'
    },
    'Healthy': {
        description: 'Your tomato plant appears healthy! No disease symptoms detected.',
        treatment: 'Continue regular care: proper watering, fertilizing, and monitoring for any changes.'
    },
    'Late Blight': {
        description: 'Late blight is a serious fungal disease that can quickly destroy tomato plants.',
        treatment: 'Apply fungicides immediately, improve ventilation, and remove infected plants.'
    },
    'Leaf Miner Flies': {
        description: 'Leaf miners are small insects whose larvae create tunnels in leaves.',
        treatment: 'Use yellow sticky traps, beneficial insects, or appropriate insecticides.'
    },
    'Magnesium Deficiency': {
        description: 'Magnesium deficiency causes yellowing between leaf veins while veins remain green.',
        treatment: 'Apply magnesium sulfate (Epsom salt) or magnesium-rich fertilizer.'
    },
    'Yellow Leaf Curl Virus': {
        description: 'A viral disease spread by whiteflies that causes leaves to curl and yellow.',
        treatment: 'Control whiteflies, remove infected plants, and use virus-resistant varieties.'
    }
};
// DOM elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('previewContainer');
const imagePreview = document.getElementById('imagePreview');
const predictBtn = document.getElementById('predictBtn');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const predictions = document.getElementById('predictions');
const diseaseInfoDiv = document.getElementById('diseaseInfo');
// Only EfficientNet is available, so no need for model selection logic
let selectedFile = null;
// File upload handling
uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('dragover', handleDragOver);
uploadArea.addEventListener('dragleave', handleDragLeave);
uploadArea.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
}
function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
}
function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}
function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
    }
    selectedFile = file;
    const reader = new FileReader();
    reader.onload = function(e) {
        imagePreview.src = e.target.result;
        previewContainer.style.display = 'block';
        predictBtn.disabled = false;
        results.style.display = 'none';
    };
    reader.readAsDataURL(file);
}
// Prediction handling
predictBtn.addEventListener('click', performPrediction);
function performPrediction() {
    if (!selectedFile) return;
    // Only EfficientNet is used
    const selectedModel = 'efficientnet';
    loading.style.display = 'block';
    predictBtn.disabled = true;
    results.style.display = 'none';
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('model', selectedModel);
    fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        displayResults({ predictions: data.predictions });
        loading.style.display = 'none';
        predictBtn.disabled = false;
        results.style.display = 'block';
    })
    .catch(error => {
        alert('Prediction failed: ' + error);
        loading.style.display = 'none';
        predictBtn.disabled = false;
    });
}
function displayResults(result) {
    predictions.innerHTML = '';
    result.predictions.forEach((pred, index) => {
        const predictionItem = document.createElement('div');
        predictionItem.className = `prediction-item ${index === 0 ? 'top-prediction' : ''}`;
        const confidence = (pred.confidence * 100).toFixed(1);
        predictionItem.innerHTML = `
            <div>
                <div class="disease-name">${pred.class}</div>
                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: ${confidence}%"></div>
                </div>
            </div>
            <div class="confidence">${confidence}%</div>
        `;
        predictions.appendChild(predictionItem);
    });
    // Show disease information for top prediction
    const topPrediction = result.predictions[0];
    if (topPrediction.confidence < 0.5) {
        diseaseInfoDiv.innerHTML = `<h4>Unrecognized Image</h4><p>This image may not be a tomato leaf. Please upload a clear tomato leaf image.</p>`;
        diseaseInfoDiv.className = 'disease-info disease-result';
        return;
    }
    const info = diseaseInfo[topPrediction.class];
    diseaseInfoDiv.innerHTML = `
        <h4>${topPrediction.class}</h4>
        <p><strong>Description:</strong> ${info.description}</p>
        <p><strong>Treatment:</strong> ${info.treatment}</p>
    `;
    // Add appropriate styling based on result
    if (topPrediction.class === 'Healthy') {
        diseaseInfoDiv.className = 'disease-info healthy-result';
    } else {
        diseaseInfoDiv.className = 'disease-info disease-result';
    }
}
// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tomato Disease Detector initialized');
}); 