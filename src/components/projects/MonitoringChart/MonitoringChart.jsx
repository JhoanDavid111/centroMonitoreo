// src/components/projects/MonitoringChart/MonitoringChart.jsx
import PropTypes from 'prop-types';
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartWrapper
} from './MonitoringChart.styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import tokens from '../../../styles/theme.js';

const MonitoringChart = ({ title, data }) => {
  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>{title}</ChartTitle>
      </ChartHeader>
      <ChartWrapper>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="month" 
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: tokens.colors.surface.primary,
                borderColor: tokens.colors.border.default,
                borderRadius: '0.5rem',
                padding: tokens.spacing.lg
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="programmed" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Programado"
            />
            <Line 
              type="monotone" 
              dataKey="fulfilled" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Ejecutado"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </ChartContainer>
  );
};

MonitoringChart.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      programmed: PropTypes.number.isRequired,
      fulfilled: PropTypes.number.isRequired
    })
  ).isRequired
};

export default MonitoringChart;