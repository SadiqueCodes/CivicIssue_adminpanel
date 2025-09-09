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
  Chip,
  IconButton,
} from '@mui/material';
import {
  Warning,
  ArrowForward,
  LocationOn,
  Timer,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface PriorityQueueProps {
  issues?: any[];
  onIssueSelect?: (issue: any) => void;
}

export default function PriorityQueue({ issues = [], onIssueSelect }: PriorityQueueProps) {
  const demoIssues = [
    {
      id: '1',
      title: 'Major pothole causing accidents',
      location: 'Main St & 5th Ave',
      severity: 9.2,
      timeElapsed: '2 hours',
      category: 'Road',
    },
    {
      id: '2',
      title: 'Water main break',
      location: 'Oak Street',
      severity: 8.8,
      timeElapsed: '45 minutes',
      category: 'Water',
    },
    {
      id: '3',
      title: 'Traffic light malfunction',
      location: 'Downtown Junction',
      severity: 8.5,
      timeElapsed: '1 hour',
      category: 'Traffic',
    },
  ];

  const displayIssues = issues.length > 0 ? issues : demoIssues;

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Priority Queue</Typography>
        <Chip
          label={`${displayIssues.length} Critical`}
          color="error"
          size="small"
        />
      </Box>

      <List sx={{ p: 0 }}>
        {displayIssues.map((issue, index) => (
          <motion.div
            key={issue.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ListItem
              sx={{
                mb: 1,
                bgcolor: 'background.default',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderLeft: '4px solid',
                borderLeftColor: 'error.main',
                '&:hover': {
                  bgcolor: 'action.hover',
                  cursor: 'pointer',
                },
              }}
              onClick={() => onIssueSelect?.(issue)}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'error.light' }}>
                  <Warning color="error" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" fontWeight={600}>
                    {issue.title}
                  </Typography>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOn sx={{ fontSize: 14 }} />
                        {issue.location}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Timer sx={{ fontSize: 14 }} />
                        {issue.timeElapsed}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={`Severity: ${issue.severity}/10`}
                        size="small"
                        color="error"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label={issue.category}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                }
              />
              <IconButton>
                <ArrowForward />
              </IconButton>
            </ListItem>
          </motion.div>
        ))}
      </List>
    </Paper>
  );
}