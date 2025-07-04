# EfficientNet for Tomato Disease Classification (Inference Only)
import torch
import torch.nn as nn
import timm
from torchvision import transforms
from PIL import Image

# Configuration for inference
class Config:
    MODEL_NAME = "efficientnet_b4"  # or your trained model variant
    NUM_CLASSES = 7
    IMG_SIZE = 224
    PRETRAINED = False  # We load our own weights
    DROPOUT_RATE = 0.3

# EfficientNet Model for inference
class EfficientNetClassifier(nn.Module):
    def __init__(self, model_name, num_classes, pretrained=False, dropout_rate=0.3):
        super(EfficientNetClassifier, self).__init__()
        self.backbone = timm.create_model(model_name, pretrained=pretrained)
        n_features = self.backbone.classifier.in_features
        self.backbone.classifier = nn.Sequential(
            nn.Dropout(dropout_rate),
            nn.Linear(n_features, 512),
            nn.ReLU(),
            nn.Dropout(dropout_rate),
            nn.Linear(512, num_classes)
        )
    def forward(self, x):
        return self.backbone(x)

