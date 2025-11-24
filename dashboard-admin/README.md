# AgriVoice Admin Dashboard

Real-time analytics and impact metrics dashboard for AgriVoice.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Dashboard runs at http://localhost:5174
```

## 📊 Features

- **Real-time Statistics**: Total diagnoses, farmers helped, regions active
- **Disease Analytics**: Diagnoses by disease type
- **Regional Breakdown**: Diagnoses by region
- **Success Metrics**: Treatment success rates
- **Trend Analysis**: Performance over time

## 🏗️ Project Structure

```
dashboard-admin/
├── src/
│   ├── Dashboard.jsx
│   ├── App.jsx
│   └── index.jsx
├── package.json
└── README.md
```

## 📈 Metrics Displayed

### Key Performance Indicators
1. **Total Diagnoses**: Number of crop diagnoses provided
2. **Farmers Helped**: Unique farmer count
3. **Regions Active**: Geographic coverage
4. **Success Rate**: Percentage of successful treatments

### Charts
- **Disease Distribution**: Bar chart showing disease frequency
- **Regional Distribution**: Pie chart showing regional spread
- **Trend Analysis**: Line chart of diagnoses over time (upcoming)

## 🔧 Technologies

- **React 18**: UI framework
- **Vite**: Build tool
- **Recharts**: Data visualization
- **Tailwind CSS**: Styling
- **Zustand**: State management

## 📡 API Integration

Fetches data from backend:

```javascript
GET /api/v1/impact-stats

Response:
{
  "total_diagnoses": 1250,
  "total_farmers": 450,
  "regions": 8,
  "success_rate": 0.87,
  "by_disease": {
    "rust": 320,
    "blight": 280,
    ...
  },
  "by_region": {
    "east_africa": 500,
    "west_africa": 450,
    ...
  }
}
```

## 🚀 Deployment

### Vercel
```bash
vercel
```

### Netlify
```bash
netlify deploy --prod
```

## 📝 Future Enhancements

- [ ] Real-time data updates with WebSocket
- [ ] Export reports (PDF, CSV)
- [ ] Regional farmer profiles
- [ ] Treatment effectiveness tracking
- [ ] Cost-benefit analysis
- [ ] Sustainability impact metrics

---

**Dashboard Lead**: Lewis
**Status**: Phase 1 Complete ✅
