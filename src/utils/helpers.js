export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
};

export const getStressColor = (stressLevel) => {
  const level = stressLevel?.toLowerCase() || '';
  switch (level) {
    case 'low':
      return 'text-green-600 bg-green-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'high':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getSleepQualityColor = (quality) => {
  const q = quality?.toLowerCase() || '';
  switch (q) {
    case 'excellent':
      return 'text-green-600 bg-green-100';
    case 'good':
      return 'text-blue-600 bg-blue-100';
    case 'fair':
      return 'text-yellow-600 bg-yellow-100';
    case 'poor':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getSleepScoreColor = (score) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
};

export const calculateWeeklyStats = (weeklyData) => {
  if (!weeklyData || weeklyData.length === 0) {
    return {
      avgSleepScore: 0,
      avgSleepHours: 0,
      bestDay: null,
      worstDay: null,
      stressTrend: 'stable',
    };
  }

  const sleepScores = weeklyData.map(d => d.sleepScore).filter(s => s != null);
  const sleepHours = weeklyData.map(d => d.sleepHours).filter(h => h != null);

  const avgSleepScore = sleepScores.length > 0
    ? Math.round(sleepScores.reduce((a, b) => a + b, 0) / sleepScores.length)
    : 0;

  const avgSleepHours = sleepHours.length > 0
    ? parseFloat((sleepHours.reduce((a, b) => a + b, 0) / sleepHours.length).toFixed(1))
    : 0;

  const bestDay = weeklyData.reduce((best, current) => {
    if (!best || (current.sleepScore > best.sleepScore)) return current;
    return best;
  }, null);

  const worstDay = weeklyData.reduce((worst, current) => {
    if (!worst || (current.sleepScore < worst.sleepScore)) return current;
    return worst;
  }, null);

  const stressLevels = weeklyData.map(d => d.stressLevel?.toLowerCase()).filter(s => s);
  const lowCount = stressLevels.filter(s => s === 'low').length;
  const highCount = stressLevels.filter(s => s === 'high').length;
  
  let stressTrend = 'stable';
  if (highCount > lowCount) stressTrend = 'increasing';
  else if (lowCount > highCount) stressTrend = 'decreasing';

  return {
    avgSleepScore,
    avgSleepHours,
    bestDay,
    worstDay,
    stressTrend,
  };
};

export const getStressInterpretation = (stressLevel) => {
  const level = stressLevel?.toLowerCase() || '';
  switch (level) {
    case 'low':
      return 'Your stress levels are well-managed. Keep up the good work with your relaxation techniques.';
    case 'medium':
      return 'You\'re experiencing moderate stress. Consider taking breaks and practicing mindfulness.';
    case 'high':
      return 'Your stress levels are elevated. Prioritize rest, deep breathing, and consider consulting a healthcare provider.';
    default:
      return 'Monitor your stress levels regularly to maintain optimal health.';
  }
};

export const getSleepInterpretation = (sleepScore, sleepHours, sleepQuality) => {
  let interpretation = '';
  
  if (sleepScore >= 80) {
    interpretation = 'Excellent sleep quality! You\'re getting restorative rest.';
  } else if (sleepScore >= 60) {
    interpretation = 'Good sleep quality. Your body is recovering well.';
  } else if (sleepScore >= 40) {
    interpretation = 'Fair sleep quality. Consider improving your sleep hygiene.';
  } else {
    interpretation = 'Poor sleep quality detected. Focus on establishing a consistent sleep routine.';
  }

  if (sleepHours < 7) {
    interpretation += ' You may benefit from more sleep duration.';
  } else if (sleepHours > 9) {
    interpretation += ' You\'re getting adequate rest.';
  }

  return interpretation;
};

export const getRecommendations = (stressLevel, sleepScore, sleepHours) => {
  const recommendations = [];

  if (stressLevel?.toLowerCase() === 'high') {
    recommendations.push('Practice deep breathing exercises for 5-10 minutes daily');
    recommendations.push('Consider meditation or yoga to reduce stress');
    recommendations.push('Ensure you have a relaxing bedtime routine');
  }

  if (sleepScore < 60) {
    recommendations.push('Maintain a consistent sleep schedule');
    recommendations.push('Avoid screens 1 hour before bedtime');
    recommendations.push('Keep your bedroom cool, dark, and quiet');
  }

  if (sleepHours < 7) {
    recommendations.push('Aim for 7-9 hours of sleep per night');
    recommendations.push('Go to bed 30 minutes earlier each night until you reach your target');
  }

  if (recommendations.length === 0) {
    recommendations.push('Continue maintaining your healthy sleep and stress management habits');
  }

  return recommendations;
};

