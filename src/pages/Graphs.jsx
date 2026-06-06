import { useState, useEffect } from 'react';
import { dashboardAPI } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import HeartRateChart from '../charts/HeartRateChart';
import SleepScoreChart from '../charts/SleepScoreChart';
import SleepHoursChart from '../charts/SleepHoursChart';
import StressLevelChart from '../charts/StressLevelChart';

const Graphs = () => {
  const [weeklyData, setWeeklyData] = useState(null);
  const [liveDataHistory, setLiveDataHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeeklyData = async () => {
    try {
      setError(null);
      const data = await dashboardAPI.getWeekly();
      setWeeklyData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveData = async () => {
    try {
      const data = await dashboardAPI.getLive();
      setLiveDataHistory((prev) => {
        const newHistory = [...prev, data];
        return newHistory.slice(-20);
      });
    } catch (err) {
      console.error('Error fetching live data:', err);
    }
  };

  useEffect(() => {
    fetchWeeklyData();
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
        <ErrorAlert message={error} onRetry={fetchWeeklyData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Visualization</h1>
          <p className="text-gray-600">Comprehensive charts and trends for your health metrics</p>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Heart Rate Over Time</h2>
            <HeartRateChart data={liveDataHistory} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sleep Score Trend (7 Days)</h2>
            <SleepScoreChart data={weeklyData || []} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sleep Hours (7 Days)</h2>
            <SleepHoursChart data={weeklyData || []} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Stress Level Trend (7 Days)</h2>
            <StressLevelChart data={weeklyData || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graphs;

