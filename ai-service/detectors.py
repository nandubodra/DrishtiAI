import cv2
import numpy as np
from ultralytics import YOLO
import pytesseract
from PIL import Image
import io
import base64

class ObjectDetector:
    def __init__(self):
        self.model = YOLO('yolov8n.pt')
        self.class_names = self.model.names
    
    def detect(self, frame):
        results = self.model(frame, verbose=False)
        detections = []
        
        for result in results:
            boxes = result.boxes
            for box in boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                confidence = float(box.conf[0])
                class_id = int(box.cls[0])
                class_name = self.class_names[class_id]
                
                # Calculate distance (rough estimate based on bounding box)
                height = y2 - y1
                distance = max(0.5, 5 - (height / 100))
                
                # Generate Hindi and English voice responses
                voice_en = f"{class_name} detected at {distance:.1f} meters"
                voice_hi = f"{self._english_to_hindi(class_name)} {distance:.1f} meter par detected"
                
                detections.append({
                    'type': 'object',
                    'objectName': class_name,
                    'confidence': confidence,
                    'distance': round(distance, 2),
                    'coordinates': {'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2},
                    'voiceResponse': {
                        'en': voice_en,
                        'hi': voice_hi
                    }
                })
        
        return detections
    
    @staticmethod
    def _english_to_hindi(text):
        # Simple mapping - in production use proper translation service
        mapping = {
            'person': 'vyakti',
            'car': 'car',
            'dog': 'kutte',
            'cat': 'bilali',
            'bicycle': 'cycle',
            'chair': 'kursi',
            'table': 'table',
            'phone': 'phone'
        }
        return mapping.get(text.lower(), text)

class TextDetector:
    def detect(self, frame):
        try:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            text = pytesseract.image_to_string(gray)
            
            if text.strip():
                return [{
                    'type': 'text',
                    'textContent': text.strip(),
                    'voiceResponse': {
                        'en': f'Text: {text}',
                        'hi': f'Paath: {text}'
                    }
                }]
        except Exception as e:
            print(f'OCR Error: {e}')
        
        return []

class CurrencyDetector:
    def detect(self, frame):
        # Placeholder for currency detection
        # In production, train a CNN model on currency images
        detections = []
        
        # This is a simplified version - implement actual currency detection
        # using color and shape analysis or trained model
        
        return detections

class TrafficSignalDetector:
    def __init__(self):
        self.model = YOLO('yolov8n.pt')  # Can be fine-tuned on traffic signals
    
    def detect(self, frame):
        results = self.model(frame, verbose=False)
        detections = []
        
        for result in results:
            boxes = result.boxes
            for box in boxes:
                class_id = int(box.cls[0])
                class_name = self.model.names[class_id]
                
                # Look for traffic light related detections
                if 'traffic' in class_name.lower() or 'light' in class_name.lower():
                    # Determine color by analyzing the region
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    roi = frame[y1:y2, x1:x2]
                    signal_color = self._detect_signal_color(roi)
                    
                    detections.append({
                        'type': 'traffic_signal',
                        'signal': signal_color,
                        'confidence': float(box.conf[0]),
                        'voiceResponse': {
                            'en': f'{signal_color} signal',
                            'hi': f'{signal_color} signal'
                        }
                    })
        
        return detections
    
    @staticmethod
    def _detect_signal_color(roi):
        # Convert to HSV for better color detection
        hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
        
        # Define color ranges
        red_lower = np.array([0, 50, 50])
        red_upper = np.array([10, 255, 255])
        green_lower = np.array([40, 40, 40])
        green_upper = np.array([80, 255, 255])
        yellow_lower = np.array([20, 100, 100])
        yellow_upper = np.array([30, 255, 255])
        
        red_mask = cv2.inRange(hsv, red_lower, red_upper)
        green_mask = cv2.inRange(hsv, green_lower, green_upper)
        yellow_mask = cv2.inRange(hsv, yellow_lower, yellow_upper)
        
        red_count = cv2.countNonZero(red_mask)
        green_count = cv2.countNonZero(green_mask)
        yellow_count = cv2.countNonZero(yellow_mask)
        
        max_count = max(red_count, green_count, yellow_count)
        
        if max_count == red_count:
            return 'Red'
        elif max_count == green_count:
            return 'Green'
        elif max_count == yellow_count:
            return 'Yellow'
        else:
            return 'Unknown'
