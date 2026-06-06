import { useState, useEffect } from 'react';
import { dashboardAPI } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import { calculateWeeklyStats, formatDate } from '../utils/helpers';

const WeeklyReport = () => {
  const [weeklyData, setWeeklyData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeeklyData = async () => {
    try {
      setError(null);
      const data = await dashboardAPI.getWeekly();
      setWeeklyData(data);
      setStats(calculateWeeklyStats(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyData();
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

  const getStressTrendColor = (trend) => {
    switch (trend) {
      case 'decreasing':
        return 'success';
      case 'increasing':
        return 'danger';
      default:
        return 'info';
    }
  };

  const getStressTrendLabel = (trend) => {
    switch (trend) {
      case 'decreasing':
        return 'Decreasing';
      case 'increasing':
        return 'Increasing';
      default:
        return 'Stable';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Weekly Report</h1>
          <p className="text-gray-600">Comprehensive analysis of your weekly sleep and stress patterns</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Average Sleep Score"
            value={stats?.avgSleepScore || 0}
            unit="/100"
            color="green"
            icon="📊"
          />
          <MetricCard
            title="Average Sleep Duration"
            value={stats?.avgSleepHours || 0}
            unit="hours"
            color="indigo"
            icon="⏰"
          />
          <MetricCard
            title="Best Day"
            value={stats?.bestDay ? formatDate(stats.bestDay.date) : '--'}
            color="blue"
            icon="⭐"
            subtitle={stats?.bestDay ? `Score: ${stats.bestDay.sleepScore}` : ''}
          />
          <MetricCard
            title="Worst Day"
            value={stats?.worstDay ? formatDate(stats.worstDay.date) : '--'}
            color="yellow"
            icon="⚠️"
            subtitle={stats?.worstDay ? `Score: ${stats.worstDay.sleepScore}` : ''}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Overview</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Stress Trend</p>
                <StatusBadge 
                  label={getStressTrendLabel(stats?.stressTrend)} 
                  variant={getStressTrendColor(stats?.stressTrend)}
                />
                <p className="text-sm text-gray-600 mt-2">
                  {stats?.stressTrend === 'increasing' 
                    ? 'Your stress levels have been increasing this week. Consider implementing stress-reduction techniques.'
                    : stats?.stressTrend === 'decreasing'
                    ? 'Great job! Your stress levels are decreasing. Keep up the good work.'
                    : 'Your stress levels have remained relatively stable this week.'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Sleep Performance</p>
                <p className="text-gray-900">
                  {stats?.avgSleepScore >= 80 
                    ? 'Excellent sleep quality maintained throughout the week.'
                    : stats?.avgSleepScore >= 60
                    ? 'Good sleep quality with room for improvement.'
                    : 'Sleep quality needs attention. Focus on establishing better sleep habits.'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Daily Breakdown</h2>
            <div className="space-y-3">
              {weeklyData && weeklyData.length > 0 ? (
                weeklyData.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(day.date)}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-600">
                          Score: <span className="font-semibold">{day.sleepScore}</span>
                        </span>
                        <span className="text-xs text-gray-600">
                          Hours: <span className="font-semibold">{day.sleepHours}</span>
                        </span>
                      </div>
                    </div>
                    <StatusBadge 
                      label={day.stressLevel || 'Unknown'} 
                      variant={day.stressLevel === 'Low' ? 'success' : day.stressLevel === 'High' ? 'danger' : 'warning'}
                    />
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No weekly data available</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Insights & Recommendations</h2>
          <div className="space-y-3">
            {stats?.avgSleepHours < 7 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Sleep Duration:</strong> Your average sleep duration is below the recommended 7-9 hours. 
                  Consider going to bed earlier or improving your sleep schedule.
                </p>
              </div>
            )}
            {stats?.avgSleepScore < 60 && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  <strong>Sleep Quality:</strong> Your sleep scores indicate room for improvement. 
                  Focus on sleep hygiene: maintain a consistent schedule, avoid screens before bed, 
                  and create a relaxing bedtime routine.
                </p>
              </div>
            )}
            {stats?.stressTrend === 'increasing' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Stress Management:</strong> Your stress levels are trending upward. 
                  Consider incorporating stress-reduction techniques such as meditation, 
                  deep breathing exercises, or physical activity.
                </p>
              </div>
            )}
            {stats?.avgSleepScore >= 80 && stats?.stressTrend !== 'increasing' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Excellent Progress:</strong> You're maintaining excellent sleep quality 
                  and managing stress well. Keep up the great work!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport;

