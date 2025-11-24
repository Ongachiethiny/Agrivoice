# AgriVoice Frontend PWA

Mobile-first Progressive Web App for farmers to diagnose crop health.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev

# App runs at http://localhost:5173
```

## 📱 Features

- **📸 Camera Capture**: Take photos using device camera
- **🎤 Voice Input**: Record audio questions
- **🤖 AI Analysis**: Get instant crop diagnosis
- **🌱 Organic Solutions**: Receive organic treatment plans
- **📊 Results Display**: Beautiful diagnosis results
- **📱 PWA**: Installable on home screen
- **🔄 Offline Support**: Service worker caching

## 🏗️ Project Structure

```
frontend-pwa/
├── public/
│   ├── index.html           # Main HTML file
│   ├── manifest.json        # PWA manifest
│   ├── sw.js               # Service Worker
│   ├── icon-192.png
│   └── icon-512.png
├── src/
│   ├── components/
│   │   ├── CameraCapture.jsx    # Camera component
│   │   ├── AudioRecorder.jsx    # Audio recorder
│   │   ├── ResultCard.jsx       # Results display
│   │   └── Layout.jsx           # Main layout
│   ├── pages/
│   │   ├── Home.jsx             # Home page
│   │   ├── Diagnose.jsx         # Diagnosis wizard
│   │   ├── Results.jsx          # Results page
│   │   └── Profile.jsx          # User profile
│   ├── services/
│   │   └── api.js              # API client
│   ├── store/
│   │   └── diagnosisStore.js   # Zustand state management
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── vite.config.js
├── package.json
└── .env.example
```

## 🔧 Key Technologies

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **Zustand**: State management
- **Tailwind CSS**: Styling
- **react-webcam**: Camera access
- **react-mic**: Audio recording
- **Axios**: HTTP client
- **PWA Features**: Service Worker, Manifest

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Quality
npm run lint         # Lint code
npm run format       # Format code with Prettier
```

## 🎨 UI Components

### CameraCapture
Captures images from device camera

```jsx
<CameraCapture onCapture={(blob) => handleImageCapture(blob)} />
```

### AudioRecorder
Records voice input

```jsx
<AudioRecorder onRecordComplete={(blob) => handleAudio(blob)} />
```

### ResultCard
Displays diagnosis results

```jsx
<ResultCard diagnosis={diagnosis} treatmentPlan={plan} />
```

## 🌐 Pages

### Home
Landing page with features and how-it-works

### Diagnose
Multi-step diagnosis wizard:
1. Capture crop image
2. Ask question about the issue
3. Add optional metadata
4. Get AI diagnosis

### Results
Displays:
- Disease diagnosis
- Organic solutions
- Treatment plan
- Severity and confidence
- Recovery timeline

### Profile
User settings:
- Farmer ID
- Region
- Crop type

## 📡 API Integration

All API calls go through `src/services/api.js`:

```javascript
import { apiClient } from '@/services/api'

// Analyze image
const result = await apiClient.analyzeImage(imageFile)

// Get diagnosis
const diagnosis = await apiClient.diagnose(
  tags,
  question,
  cropType,
  region,
  farmerId
)

// Speech to text
const text = await apiClient.speechToText(audioBlob)

// Text to speech
const audio = await apiClient.textToSpeech(text)
```

## 🔄 State Management

Using Zustand for state:

```javascript
import { useDiagnosisStore } from '@/store/diagnosisStore'

const store = useDiagnosisStore()

// Access state
store.diagnosis
store.imageTags
store.loading

// Update state
store.setDiagnosis(diagnosis)
store.setFarmerId(farmerId)
store.reset()
```

## 📱 PWA Features

### Service Worker
Caches static assets and enables offline access

```javascript
// In main.jsx
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}
```

### Web App Manifest
Defines PWA metadata and installation options

### Installation
Users can:
- Add to home screen (mobile)
- Install on desktop
- Works offline with cached content

## 🚀 Deployment

### Vercel
```bash
# Connect repo to Vercel
# Auto-deploys on push

# Or manual:
npm install -g vercel
vercel
```

### Netlify
```bash
# Connect repo to Netlify
# Auto-deploys on push

# Or manual:
npm install -g netlify-cli
netlify deploy
```

### Build for Production
```bash
npm run build
# Output in 'dist/' directory
```

## 🔐 Environment Variables

```bash
VITE_API_URL=http://localhost:8000
```

## 🎯 Mobile-First Design

- Large, touch-friendly buttons
- Optimized for smaller screens
- Responsive grid layouts
- Accessible color contrasts
- Fast loading times

## 📊 Performance

- Code splitting with route-based chunks
- Image optimization
- Lazy loading components
- Service Worker caching
- Minified builds

## 🧪 Testing

```bash
npm run test           # Run tests
npm run test:watch    # Watch mode
```

## 🐛 Common Issues

### Issue: Camera not working
**Solution**: 
- Check HTTPS (required for camera)
- Check browser permissions
- Try different browser

### Issue: Microphone not recording
**Solution**:
- Allow microphone access
- Check browser permissions
- Use HTTPS

### Issue: API 404 errors
**Solution**:
- Verify `VITE_API_URL` is correct
- Check backend is running
- Review browser console

## 📚 Additional Resources

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Zustand](https://github.com/pmndrs/zustand)

---

**Frontend Lead**: Oram
**Status**: Phase 1 Complete ✅
