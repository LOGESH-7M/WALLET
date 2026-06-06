import { useState, useEffect } from 'react';
import { dashboardAPI } from '../api/api';
import MetricCard from '../components/MetricCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import StatusBadge from '../components/StatusBadge';
import { getStressInterpretation, getSleepInterpretation, getRecommendations, formatTimestamp } from '../utils/helpers';

const Dashboard = () => {
  const [todayData, setTodayData] = useState(null);
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveLoading, setLiveLoading] = useState(false);

  const fetchTodayData = async () => {
    try {
      setError(null);
      const data = await dashboardAPI.getToday();
      setTodayData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveData = async () => {
    try {
      setLiveLoading(true);
      const data = await dashboardAPI.getLive();
      setLiveData(data);
    } catch (err) {
      console.error('Error fetching live data:', err);
    } finally {
      setLiveLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayData();
    fetchLiveData();

    const liveInterval = setInterval(fetchLiveData, 5000);

    return () => clearInterval(liveInterval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorAlert message={error} onRetry={fetchTodayData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Real-time monitoring of your stress and sleep metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Live Heart Rate"
            value={liveData?.heartRate || '--'}
            unit="BPM"
            color="red"
            icon="❤️"
            subtitle={liveData?.timestamp ? `Updated: ${formatTimestamp(liveData.timestamp)}` : 'Connecting...'}
          />
          <MetricCard
            title="Live SpO₂"
            value={liveData?.spo2 || '--'}
            unit="%"
            color="blue"
            icon="🫁"
            subtitle={liveData?.timestamp ? `Updated: ${formatTimestamp(liveData.timestamp)}` : 'Connecting...'}
          />
          <MetricCard
            title="Stress Level"
            value={todayData?.stressLevel || '--'}
            color="yellow"
            icon="⚡"
            subtitle="Today's average"
          />
          <MetricCard
            title="Sleep Score"
            value={todayData?.sleepScore || '--'}
            unit="/100"
            color="green"
            icon="😴"
            subtitle={todayData?.sleepQuality || ''}
          />
          <MetricCard
            title="Sleep Quality"
            value={todayData?.sleepQuality || '--'}
            color="purple"
            icon="⭐"
          />
          <MetricCard
            title="Sleep Duration"
            value={todayData?.sleepHours || '--'}
            unit="hours"
            color="indigo"
            icon="⏰"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Summary</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Sleep Analysis</h3>
                <p className="text-gray-600 text-sm">
                  {getSleepInterpretation(
                    todayData?.sleepScore,
                    todayData?.sleepHours,
                    todayData?.sleepQuality
                  )}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Stress Analysis</h3>
                <p className="text-gray-600 text-sm mb-2">
                  {getStressInterpretation(todayData?.stressLevel)}
                </p>
                <StatusBadge 
                  label={todayData?.stressLevel || 'Unknown'} 
                  variant={todayData?.stressLevel === 'Low' ? 'success' : todayData?.stressLevel === 'High' ? 'danger' : 'warning'}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h2>
            <ul className="space-y-2">
              {getRecommendations(
                todayData?.stressLevel,
                todayData?.sleepScore,
                todayData?.sleepHours
              ).map((rec, index) => (
                <li key={index} className="flex items-start text-sm text-gray-600">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Average Heart Rate</p>
              <p className="text-2xl font-bold text-gray-900">{todayData?.avgHeartRate || '--'} <span className="text-lg text-gray-500">BPM</span></p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Heart Rate Variability (HRV)</p>
              <p className="text-2xl font-bold text-gray-900">{todayData?.hrv || '--'} <span className="text-lg text-gray-500">ms</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

