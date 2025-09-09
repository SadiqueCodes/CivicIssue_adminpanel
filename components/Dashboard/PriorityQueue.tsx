'use client';

import {
  Box,
  Typography,
  List,
  ListItem,
} from '@mui/material';

interface PriorityQueueProps {
  issues?: any[];
  onIssueSelect?: (issue: any) => void;
}

export default function PriorityQueue({ issues = [], onIssueSelect }: PriorityQueueProps) {
  const demoIssues = [
    {
      id: '1',
      title: 'Major pothole causing accidents',
      address: 'Main St & 5th Ave',
      severity: 9.2,
    },
    {
      id: '2',
      title: 'Water main break',
      address: 'Oak Street',
      severity: 8.8,
    },
    {
      id: '3',
      title: 'Traffic light malfunction',
      address: 'Downtown Junction',
      severity: 8.5,
    },
  ];

  const displayIssues = issues.length > 0 
    ? issues.map(issue => ({
        ...issue,
        address: issue.address || 'Unknown location',
        severity: issue.severity || 5.0,
      }))
    : demoIssues;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 2 }}>
        Priority Queue
      </Typography>

      <List sx={{ p: 0 }}>
        {displayIssues.slice(0, 5).map((issue) => (
          <ListItem
            key={issue.id}
            sx={{
              p: 1.5,
              mb: 1,
              backgroundColor: '#fafafa',
              borderRadius: 1,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
            onClick={() => onIssueSelect?.(issue)}
          >
            <Box sx={{ width: '100%' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 500,
                  color: '#1a1a1a',
                  mb: 0.5,
                  fontSize: 13,
                }}
              >
                {issue.title}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#757575',
                  fontSize: 12,
                }}
              >
                {issue.address}
              </Typography>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}