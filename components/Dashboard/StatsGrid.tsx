'use client';

import { Grid, Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { TrendingUp, TrendingDown, Warning, CheckCircle } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  type: 'success' | 'warning' | 'danger' | 'info';
  icon: React.ReactNode;
}

interface StatsGridProps {
  stats?: {
    totalIssues: number;
    resolvedToday: number;
    inProgress: number;
    criticalIssues: number;
  };
  loading?: boolean;
}

export default function StatsGrid({ stats, loading }: StatsGridProps) {
  const statCards: StatCard[] = [
    {
      title: 'Total Issues',
      value: stats?.totalIssues || 0,
      change: 12,
      type: 'info',
      icon: <Warning />,
    },
    {
      title: 'Resolved Today',
      value: stats?.resolvedToday || 0,
      change: 8,
      type: 'success',
      icon: <CheckCircle />,
    },
    {
      title: 'In Progress',
      value: stats?.inProgress || 0,
      change: -3,
      type: 'warning',
      icon: <TrendingUp />,
    },
    {
      title: 'Critical Issues',
      value: stats?.criticalIssues || 0,
      change: 5,
      type: 'danger',
      icon: <Warning />,
    },
  ];

  const getGradient = (type: string) => {
    switch (type) {
      case 'success':
        return 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
      case 'warning':
        return 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)';
      case 'danger':
        return 'linear-gradient(135deg, #fc5c65 0%, #eb3b5a 100%)';
      default:
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  };

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" height={40} />
                <Skeleton variant="text" width="80%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {statCards.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={stat.title}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              sx={{
                position: 'relative',
                overflow: 'visible',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: getGradient(stat.type),
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 700, my: 1 }}>
                      {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {stat.change > 0 ? (
                        <TrendingUp sx={{ fontSize: 16, color: '#48bb78' }} />
                      ) : (
                        <TrendingDown sx={{ fontSize: 16, color: '#fc5c65' }} />
                      )}
                      <Typography
                        variant="caption"
                        sx={{
                          color: stat.change > 0 ? '#48bb78' : '#fc5c65',
                          fontWeight: 500,
                        }}
                      >
                        {Math.abs(stat.change)}% from last period
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: getGradient(stat.type),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
}