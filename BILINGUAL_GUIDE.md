# DrishtiAI - Bilingual Support Guide

## 🌐 Language Implementation

### Supported Languages
- **English** (en)
- **Hindi** (hi)

### Adding Translations

#### 1. Frontend (React)

Edit `frontend/src/i18n/translations.json`:

```json
{
  "en": {
    "translation": {
      "key": "English text"
    }
  },
  "hi": {
    "translation": {
      "key": "Hindi text (हिंदी)"
    }
  }
}
```

#### 2. Backend (Node.js)

Create language files in `backend/src/locales/`:

```javascript
// backend/src/locales/en.json
{
  "welcome": "Welcome to DrishtiAI",
  "error": "An error occurred"
}

// backend/src/locales/hi.json
{
  "welcome": "DrishtiAI में आपका स्वागत है",
  "error": "एक त्रुटि हुई"
}
```

#### 3. AI Service (Python)

Update `ai-service/voice_generator.py`:

```python
self.english_phrases = {
    'greeting': 'Hello',
    'detection': '{} detected'
}

self.hindi_phrases = {
    'greeting': 'नमस्ते',
    'detection': '{} detected'
}
```

### Using Translations in Components

#### React Component

```javascript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button onClick={() => i18n.changeLanguage('hi')}>
        हिंदी
      </button>
    </div>
  );
};
```

#### Changing Language

```javascript
// Change language programmatically
i18n.changeLanguage('hi');

// Save preference
localStorage.setItem('language', 'hi');

// Get current language
const currentLang = i18n.language;
```

### Voice Output

#### Web Text-to-Speech

```javascript
const speak = (text, language) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
  utterance.rate = 1.0; // Adjust speed
  speechSynthesis.speak(utterance);
};
```

#### Mobile Text-to-Speech

```javascript
import * as Speech from 'expo-speech';

const speak = async (text, language) => {
  await Speech.speak(text, {
    language: language === 'hi' ? 'hi' : 'en',
    rate: 1.0
  });
};
```

### Adding New Language

1. **Update translations.json**
   ```json
   {
     "en": { "translation": { ... } },
     "hi": { "translation": { ... } },
     "es": { "translation": { ... } }  // New language
   }
   ```

2. **Update language selector**
   ```javascript
   <select onChange={(e) => changeLanguage(e.target.value)}>
     <option value="en">English</option>
     <option value="hi">हिंदी</option>
     <option value="es">Español</option>
   </select>
   ```

3. **Update text-to-speech mapping**
   ```javascript
   const languageMap = {
     'en': 'en-US',
     'hi': 'hi-IN',
     'es': 'es-ES'
   };
   ```

## 🎯 Hindi Localization Specifics

### Unicode Characters
- Use UTF-8 encoding
- Hindi: U+0900 - U+097F (Devanagari)
- Common characters: अ, आ, इ, ई, उ, ऊ, etc.

### Common Phrases

| English | Hindi |
|---------|-------|
| Hello | नमस्ते |
| Thank you | धन्यवाद |
| Yes | हाँ |
| No | नहीं |
| Emergency | आपातकाल |
| Object Detected | वस्तु का पता लगा |
| Please wait | कृपया प्रतीक्षा करें |
| Processing... | प्रक्रिया जारी है... |

### Text Direction
- Hindi is LTR (Left-to-Right) like English
- No special CSS needed for direction

### Number Formatting

```javascript
// English: 1,234.56
// Hindi: 1,234.56 (same as English in most contexts)

const formatNumber = (num, lang) => {
  if (lang === 'hi') {
    return new Intl.NumberFormat('hi-IN').format(num);
  }
  return new Intl.NumberFormat('en-US').format(num);
};
```

### Date Formatting

```javascript
const formatDate = (date, lang) => {
  if (lang === 'hi') {
    return new Intl.DateTimeFormat('hi-IN').format(date);
  }
  return new Intl.DateTimeFormat('en-US').format(date);
};

// Output:
// English: 7/7/2024
// Hindi: 7/7/2024
```

## 🧪 Testing Translations

### 1. Visual Testing
- Switch between languages
- Verify text displays correctly
- Check text wrapping
- Test voice output

### 2. Content Testing
```javascript
// Test all keys exist
const validateTranslations = (translations) => {
  const enKeys = Object.keys(translations.en.translation);
  const hiKeys = Object.keys(translations.hi.translation);
  
  const missing = enKeys.filter(key => !hiKeys.includes(key));
  if (missing.length > 0) {
    console.warn('Missing Hindi translations:', missing);
  }
};
```

### 3. Voice Testing
- Test English pronunciation
- Test Hindi pronunciation
- Verify speed settings
- Check volume levels

## 📱 Mobile Considerations

### Device Language Settings
```javascript
import { getLocales } from 'expo-localization';

const deviceLanguage = getLocales()[0].languageCode;
// Returns: 'en', 'hi', etc.

i18n.changeLanguage(deviceLanguage);
```

### Storage
```javascript
// Save user's language preference
AsyncStorage.setItem('language', 'hi');

// Retrieve on app start
const savedLanguage = await AsyncStorage.getItem('language');
i18n.changeLanguage(savedLanguage || 'en');
```

## 🔧 Troubleshooting

### Missing Translations
```javascript
// Set fallback language
i18n.init({
  fallbackLng: 'en',
  // ...
});
```

### Font Issues
```css
/* Ensure Devanagari font support */
body {
  font-family: 'Noto Sans Devanagari', 'Arial', sans-serif;
}
```

### Voice Output Not Working
```javascript
// Check if Speech API is available
if ('speechSynthesis' in window) {
  // Safe to use
}

// For Expo
if (await Speech.isSpeakingAsync()) {
  // Already speaking
}
```

## 📚 Resources

- [i18next Documentation](https://www.i18next.com/)
- [Expo Speech](https://docs.expo.dev/sdk/speech/)
- [Unicode Devanagari](https://en.wikipedia.org/wiki/Devanagari)
- [Hindi Localization Guide](https://www.w3.org/International/questions/qa-html-language-declarations.hi)

---

**Last Updated**: 2024
**Version**: 1.0
