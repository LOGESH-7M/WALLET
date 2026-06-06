import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StressLevelChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No stress level data available
      </div>
    );
  }

  const stressValueMap = {
    'Low': 1,
    'Medium': 2,
    'High': 3,
  };

  const chartData = data.map((item) => ({
    date: item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : item.date,
    stressLevel: stressValueMap[item.stressLevel] || 0,
    label: item.stressLevel || 'Unknown',
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="date" 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#6b7280"
          domain={[0, 4]}
          ticks={[1, 2, 3]}
          tickFormatter={(value) => {
            const labels = { 1: 'Low', 2: 'Medium', 3: 'High' };
            return labels[value] || '';
          }}
          label={{ value: 'Stress Level', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px',
            fontSize: '12px'
          }}
          formatter={(value, name, props) => [props.payload.label, 'Stress Level']}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Line 
          type="monotone" 
          dataKey="stressLevel" 
          stroke="#ef4444" 
          strokeWidth={2}
          dot={{ fill: '#ef4444', r: 4 }}
          activeDot={{ r: 6 }}
          name="Stress Level"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default StressLevelChart;

