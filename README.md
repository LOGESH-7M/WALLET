# Sleep & Stress Tracker - Frontend

Production-ready React frontend for the Stress and Sleep Tracking System.

## Tech Stack

- **React 18** - Latest stable version
- **JavaScript** - No TypeScript
- **Vite** - Fast build tool and dev server
- **Recharts** - Professional charting library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

## Project Structure

```
/src
  /api          - API service layer
  /components   - Reusable UI components
  /pages        - Page components (Dashboard, Graphs, Weekly Report)
  /charts       - Chart components (Recharts)
  /utils        - Helper functions and utilities
  App.jsx       - Main app component with routing
  index.jsx     - Entry point
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Backend URL

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Replace `http://localhost:5000` with your actual backend URL if different.

### 3. Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

### 5. Preview Production Build

```bash
npm run preview
```

## Features

### Dashboard Page
- Real-time heart rate and SpO₂ monitoring
- Today's sleep metrics (score, quality, duration)
- Stress level indicator
- Daily summary and recommendations
- Additional metrics (HRV, average heart rate)

### Graphs Page
- Heart rate over time (live data)
- Sleep score trend (7 days)
- Sleep hours bar chart (7 days)
- Stress level trend (7 days)

### Weekly Report Page
- Average sleep score and duration
- Best and worst day identification
- Stress trend analysis
- Daily breakdown with all metrics
- Insights and personalized recommendations

## API Integration

The frontend consumes the following backend endpoints:

- `GET /api/dashboard/today` - Today's aggregated metrics
- `GET /api/dashboard/live` - Real-time live data
- `GET /api/dashboard/weekly` - Weekly historical data

All API calls are handled through the centralized API service layer in `/src/api/api.js`.

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (default: http://localhost:5000)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Production Deployment

1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Ensure the backend API is accessible from the frontend domain
4. Update `VITE_API_BASE_URL` in your production environment

## Notes

- The frontend automatically refreshes live data every 5 seconds
- All error states are handled gracefully with retry options
- Loading states are displayed during API calls
- The UI is fully responsive and works on mobile devices
