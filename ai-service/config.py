import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    DEBUG = FLASK_ENV == 'development'
    
    # AI Model paths
    YOLO_MODEL_PATH = 'models/yolov8n.pt'
    
    # API
    API_HOST = '0.0.0.0'
    API_PORT = 5001
    
    # Processing
    MAX_FRAME_SIZE = 640
    CONFIDENCE_THRESHOLD = 0.5
    IOU_THRESHOLD = 0.45
