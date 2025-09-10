'use client';

import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  CheckCircle,
  Assignment,
  Person,
  Warning,
  Build,
} from '@mui/icons-material';

interface Activity {
  id: string;
  type: 'issue_created' | 'issue_assigned' | 'issue_resolved' | 'team_dispatched';
  title: string;
  description: string;
  timestamp: Date | string;
  icon: React.ReactNode;
  color: 'success' | 'warning' | 'info' | 'error';
}

interface ActivityFeedProps {
  activities?: Activity[];
}

export default function ActivityFeed({ activities}: ActivityFeedProps) {
  const demoActivities: Activity[] = [
    {
      id: '1',
      type: 'issue_resolved',
      title: 'Issue Resolved',
      description: 'Pothole on Main Road Ranchi has been fixed by Ranchi Municipal Team',
      timestamp: '30m ago',
      icon: <CheckCircle fontSize="small" />,
      color: 'success',
    },
    {
      id: '2',
      type: 'team_dispatched',
      title: 'Team Dispatched',
      description: 'Municipal team dispatched to water pipe leak in Lalpur, Ranchi',
      timestamp: '1h ago',
      icon: <Build fontSize="small" />,
      color: 'info',
    },
    {
      id: '3',
      type: 'issue_created',
      title: 'New Critical Issue',
      description: 'Traffic signal malfunction reported at Albert Ekka Chowk, Ranchi',
      timestamp: '1h ago',
      icon: <Warning fontSize="small" />,
      color: 'error',
    },
    {
      id: '4',
      type: 'issue_assigned',
      title: 'Issue Assigned',
      description: 'Street cleaning work assigned to Dhanbad Municipal Corporation Team',
      timestamp: '2h ago',
      icon: <Assignment fontSize="small" />,
      color: 'warning',
    },
  ];

  // Always use demo activities for now to avoid rendering issues
  const displayActivities = demoActivities;

  const formatTime = (date: Date | string) => {
    // If it's already a formatted string, return it
    if (typeof date === 'string' && date.includes('ago')) {
      return date;
    }
    
    // Otherwise, format the date
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const minutes = Math.floor((Date.now() - dateObj.getTime()) / (1000 * 60));
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 2 }}>
        Recent Activity
      </Typography>

      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto', 
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        '-ms-overflow-style': 'none',
        'scrollbar-width': 'none',
      }}>
        {displayActivities.map((activity, index) => (
          <Box key={activity.id} sx={{ display: 'flex', mb: 3, alignItems: 'flex-start' }}>
            {/* Left side - Dot and Line */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  border: `2px solid ${
                    activity.color === 'success' ? '#4caf50' :
                    activity.color === 'warning' ? '#ff9800' :
                    activity.color === 'error' ? '#f44336' : '#b0d1c7'
                  }`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  color: activity.color === 'success' ? '#4caf50' :
                    activity.color === 'warning' ? '#ff9800' :
                    activity.color === 'error' ? '#f44336' : '#b0d1c7',
                  '& svg': {
                    fontSize: 14
                  }
                }}
              >
                {activity.icon}
              </Box>
              {index < displayActivities.length - 1 && (
                <Box
                  sx={{
                    width: 2,
                    height: 40,
                    backgroundColor: '#e0e0e0',
                    mt: 1
                  }}
                />
              )}
            </Box>
            
            {/* Right side - Content */}
            <Box sx={{ flex: 1, pt: -0.1 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600,
                  color: '#1a1a1a',
                  mb: 0.5,
                  fontSize: 14,
                }}
              >
                {activity.title}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#757575',
                  fontSize: 13,
                  lineHeight: 1.4,
                  mb: 0.5,
                }}
              >
                {activity.description}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#9e9e9e',
                  fontSize: 12,
                }}
              >
                {formatTime(activity.timestamp)}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}