'use client';

import { Grid, Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface StatsGridProps {
  stats?: {
    totalIssues: number;
    resolvedToday: number;
    inProgress: number;
    criticalIssues: number;
  };
  loading?: boolean;
}

interface ChartData {
  name: string;
  value: number;
}

export default function StatsGrid({ stats, loading }: StatsGridProps) {
  const statCards = [
    {
      title: 'Total Issues',
      value: stats?.totalIssues || 1284,
      change: 12,
      changeLabel: 'vs last week',
      chartData: [
        { name: 'Mon', value: 1100 },
        { name: 'Tue', value: 1150 },
        { name: 'Wed', value: 1200 },
        { name: 'Thu', value: 1180 },
        { name: 'Fri', value: 1220 },
        { name: 'Sat', value: 1250 },
        { name: 'Sun', value: 1284 },
      ],
    },
    {
      title: 'Resolved Today',
      value: stats?.resolvedToday || 47,
      change: 8,
      changeLabel: 'vs yesterday',
      chartData: [
        { name: 'Mon', value: 35 },
        { name: 'Tue', value: 42 },
        { name: 'Wed', value: 38 },
        { name: 'Thu', value: 45 },
        { name: 'Fri', value: 41 },
        { name: 'Sat', value: 43 },
        { name: 'Sun', value: 47 },
      ],
    },
    {
      title: 'In Progress',
      value: stats?.inProgress || 126,
      change: -3,
      changeLabel: 'vs last week',
      chartData: [
        { name: 'Mon', value: 130 },
        { name: 'Tue', value: 135 },
        { name: 'Wed', value: 128 },
        { name: 'Thu', value: 132 },
        { name: 'Fri', value: 129 },
        { name: 'Sat', value: 127 },
        { name: 'Sun', value: 126 },
      ],
    },
    {
      title: 'Critical',
      value: stats?.criticalIssues || 23,
      change: 5,
      changeLabel: 'vs last week',
      chartData: [
        { name: 'Mon', value: 18 },
        { name: 'Tue', value: 20 },
        { name: 'Wed', value: 19 },
        { name: 'Thu', value: 21 },
        { name: 'Fri', value: 22 },
        { name: 'Sat', value: 21 },
        { name: 'Sun', value: 23 },
      ],
    },
  ];

  if (loading) {
    return (
      <Grid container spacing={2}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} sm={6} lg={3} key={i}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <CardContent>
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="40%" height={36} />
                <Skeleton variant="text" width="80%" height={16} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={2}>
      {statCards.map((stat, index) => (
        <Grid item xs={12} sm={6} lg={3} key={stat.title}>
          <Card 
            elevation={0} 
            sx={{ 
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              height: 140,
              '&:hover': {
                borderColor: '#bdbdbd',
              },
              transition: 'border-color 0.2s',
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#757575',
                      fontWeight: 500,
                      mb: 0.5,
                      fontSize: 13,
                    }}
                  >
                    {stat.title}
                  </Typography>
                  
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 600,
                      color: '#1a1a1a',
                      mb: 0.5,
                    }}
                  >
                    {stat.value.toLocaleString()}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {stat.change > 0 ? (
                      <TrendingUp sx={{ fontSize: 14, color: '#757575' }} />
                    ) : (
                      <TrendingDown sx={{ fontSize: 14, color: '#757575' }} />
                    )}
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#757575',
                        fontWeight: 500,
                        fontSize: 11,
                      }}
                    >
                      {Math.abs(stat.change)}% {stat.changeLabel}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ width: 100, height: 50 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stat.chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                      <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                        {stat.chartData.map((entry, idx) => (
                          <Cell 
                            key={`cell-${idx}`} 
                            fill={idx === stat.chartData.length - 1 ? '#424242' : '#e0e0e0'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}