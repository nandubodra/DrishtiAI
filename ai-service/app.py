from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from PIL import Image
import io
import base64
import time
from config import Config
from detectors import ObjectDetector, TextDetector, CurrencyDetector, TrafficSignalDetector
from voice_generator import VoiceResponseGenerator

app = Flask(__name__)
CORS(app)

# Initialize detectors
object_detector = ObjectDetector()
text_detector = TextDetector()
currency_detector = CurrencyDetector()
traffic_detector = TrafficSignalDetector()
voice_gen = VoiceResponseGenerator()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'OK',
        'message': 'DrishtiAI AI Service is running'
    })

@app.route('/detect', methods=['POST'])
def detect():
    try:
        data = request.json
        frame_base64 = data.get('frame')
        
        if not frame_base64:
            return jsonify({'error': 'No frame provided'}), 400
        
        # Decode base64 frame
        frame_data = base64.b64decode(frame_base64.split(',')[1])
        nparr = np.frombuffer(frame_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            return jsonify({'error': 'Invalid frame'}), 400
        
        start_time = time.time()
        detections = []
        voice_responses = {'en': '', 'hi': ''}
        
        # Object Detection
        obj_results = object_detector.detect(frame)
        if obj_results:
            detections.extend(obj_results)
            voice_responses['en'] += obj_results[0].get('voiceResponse', {}).get('en', '') + '. '
            voice_responses['hi'] += obj_results[0].get('voiceResponse', {}).get('hi', '') + '. '
        
        # Text Detection (OCR)
        text_results = text_detector.detect(frame)
        if text_results:
            detections.extend(text_results)
            if text_results[0].get('textContent'):
                voice_responses['en'] += f"Text found: {text_results[0]['textContent']}. "
                voice_responses['hi'] += f"पाठ मिला: {text_results[0]['textContent']}. "
        
        # Currency Detection
        currency_results = currency_detector.detect(frame)
        if currency_results:
            detections.extend(currency_results)
            if currency_results[0].get('currency'):
                voice_responses['en'] += f"Found {currency_results[0]['currency']}. "
                voice_responses['hi'] += f"{currency_results[0]['currency']} मिला. "
        
        # Traffic Signal Detection
        traffic_results = traffic_detector.detect(frame)
        if traffic_results:
            detections.extend(traffic_results)
            if traffic_results[0].get('signal'):
                voice_responses['en'] += f"{traffic_results[0]['signal']} signal. "
                voice_responses['hi'] += f"{traffic_results[0]['signal']} सिग्नल. "
        
        processing_time = time.time() - start_time
        
        return jsonify({
            'success': True,
            'detections': detections,
            'voiceResponses': voice_responses,
            'processingTime': processing_time
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/models/status', methods=['GET'])
def model_status():
    return jsonify({
        'objectDetection': 'YOLOv8n',
        'textDetection': 'Tesseract OCR',
        'currencyDetection': 'Custom CNN',
        'trafficSignalDetection': 'YOLOv8n',
        'status': 'Ready'
    })

if __name__ == '__main__':
    app.run(host=Config.API_HOST, port=Config.API_PORT, debug=Config.DEBUG)
