/* // PersonalLoanChart.jsx
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  MenuItem,
  Select,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'Jan', value: 25000 },
  { month: 'Feb', value: 20000 },
  { month: 'Mar', value: 30000 },
  { month: 'Apr', value: 48000 },
  { month: 'May', value: 18000 },
  { month: 'Jun', value: 28000 },
  { month: 'Jul', value: 25000 },
  { month: 'Aug', value: 50000 },
  { month: 'Sep', value: 43000 },
  { month: 'Oct', value: 35000 },
  { month: 'Nov', value: 39000 },
  { month: 'Dec', value: 32000 },
];

const PersonalLoanChart = () => {
  return (
    <Card elevation={0} sx={{ borderRadius: 3, p: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Personal Loan
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              $48,574.21{' '}
              <Typography component="span" variant="body2" color="success.main">
                +20%
              </Typography>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Lead conversion rate
            </Typography>
          </Box>
          <Select
            variant="standard"
            value="this_month"
            disableUnderline
            sx={{ fontSize: 14 }}
          >
            <MenuItem value="this_month">This Month</MenuItem>
            <MenuItem value="last_month">Last Month</MenuItem>
          </Select>
        </Box>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value / 1000}K`}
            />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PersonalLoanChart;
 */