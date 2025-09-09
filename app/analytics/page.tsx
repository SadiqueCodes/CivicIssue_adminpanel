'use client';

import { Box, Typography, Grid, Card, CardContent, Skeleton } from '@mui/material';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const weeklyData = [
  { name: 'Mon', issues: 45, resolved: 12 },
  { name: 'Tue', issues: 52, resolved: 18 },
  { name: 'Wed', issues: 38, resolved: 25 },
  { name: 'Thu', issues: 61, resolved: 15 },
  { name: 'Fri', issues: 48, resolved: 22 },
  { name: 'Sat', issues: 34, resolved: 28 },
  { name: 'Sun', issues: 41, resolved: 19 },
];

const categoryData = [
  { name: 'Road', value: 245, color: '#424242' },
  { name: 'Lighting', value: 189, color: '#616161' },
  { name: 'Sanitation', value: 156, color: '#757575' },
  { name: 'Parks', value: 98, color: '#9e9e9e' },
  { name: 'Water', value: 67, color: '#bdbdbd' },
];

const resolutionData = [
  { name: 'Jan', time: 4.2 },
  { name: 'Feb', time: 3.8 },
  { name: 'Mar', time: 4.1 },
  { name: 'Apr', time: 3.6 },
  { name: 'May', time: 3.9 },
  { name: 'Jun', time: 3.4 },
];

export default function Analytics() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 3 }}>
        Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Issues Over Time */}
        <Grid item xs={12} lg={8}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 2 }}>
                Issues Over Time
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" stroke="#757575" fontSize={12} />
                    <YAxis stroke="#757575" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }} 
                    />
                    <Line type="monotone" dataKey="issues" stroke="#424242" strokeWidth={2} dot={{ fill: '#424242', r: 4 }} />
                    <Line type="monotone" dataKey="resolved" stroke="#757575" strokeWidth={2} dot={{ fill: '#757575', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Breakdown */}
        <Grid item xs={12} lg={4}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 2 }}>
                Issues by Category
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Resolution Time Trend */}
        <Grid item xs={12} lg={6}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 2 }}>
                Average Resolution Time (Days)
              </Typography>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={resolutionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" stroke="#757575" fontSize={12} />
                    <YAxis stroke="#757575" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }} 
                    />
                    <Area type="monotone" dataKey="time" stroke="#424242" fill="#f5f5f5" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Priority Distribution */}
        <Grid item xs={12} lg={6}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 2 }}>
                Priority Distribution
              </Typography>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'High', value: 23 },
                    { name: 'Medium', value: 156 },
                    { name: 'Low', value: 89 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" stroke="#757575" fontSize={12} />
                    <YAxis stroke="#757575" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }} 
                    />
                    <Bar dataKey="value" fill="#424242" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}