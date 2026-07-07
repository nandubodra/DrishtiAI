class VoiceResponseGenerator:
    def __init__(self):
        self.english_phrases = {
            'object': '{} detected at {} meters',
            'text': 'Text: {}',
            'currency': 'Found {} currency',
            'traffic': '{} signal',
            'obstacle': 'Obstacle ahead!',
            'safe': 'Area is safe'
        }
        
        self.hindi_phrases = {
            'object': '{} {} meter par detected hai',
            'text': 'Paath: {}',
            'currency': '{} mudra mila',
            'traffic': '{} signal',
            'obstacle': 'Aage rasta nahi hai!',
            'safe': 'Yaha surakshit hai'
        }
    
    def generate_en(self, detection_type, *args):
        template = self.english_phrases.get(detection_type, '{}')
        return template.format(*args)
    
    def generate_hi(self, detection_type, *args):
        template = self.hindi_phrases.get(detection_type, '{}')
        return template.format(*args)
