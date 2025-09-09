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
  timestamp: Date;
  icon: React.ReactNode;
  color: 'success' | 'warning' | 'info' | 'error';
}

interface ActivityFeedProps {
  activities?: Activity[];
}

export default function ActivityFeed({ activities = [] }: ActivityFeedProps) {
  const demoActivities: Activity[] = [
    {
      id: '1',
      type: 'issue_resolved',
      title: 'Issue Resolved',
      description: 'Pothole on Elm Street has been fixed by Team A',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      icon: <CheckCircle />,
      color: 'success',
    },
    {
      id: '2',
      type: 'team_dispatched',
      title: 'Team Dispatched',
      description: 'Team B dispatched to water leak on Oak Street',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      icon: <Build />,
      color: 'info',
    },
    {
      id: '3',
      type: 'issue_created',
      title: 'New Critical Issue',
      description: 'Traffic light malfunction reported at Downtown Junction',
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      icon: <Warning />,
      color: 'error',
    },
    {
      id: '4',
      type: 'issue_assigned',
      title: 'Issue Assigned',
      description: 'Graffiti removal assigned to Team D',
      timestamp: new Date(Date.now() - 120 * 60 * 1000),
      icon: <Assignment />,
      color: 'warning',
    },
  ];

  const displayActivities = activities.length > 0 ? activities : demoActivities;

  const formatTime = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Recent Activity
      </Typography>

      <Timeline position="right" sx={{ p: 0, m: 0 }}>
        {displayActivities.map((activity, index) => (
          <TimelineItem key={activity.id}>
            <TimelineSeparator>
              <TimelineDot color={activity.color} variant="outlined">
                {activity.icon}
              </TimelineDot>
              {index < displayActivities.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent sx={{ pb: 3 }}>
              <Typography variant="subtitle2" component="div" fontWeight={600}>
                {activity.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {activity.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatTime(activity.timestamp)}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Paper>
  );
}