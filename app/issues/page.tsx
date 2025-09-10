'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Tabs,
  Tab,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  LocationOn,
  Schedule,
  Person,
  CheckCircle,
  Warning,
  Error,
} from '@mui/icons-material';

interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'new' | 'in-progress' | 'resolved';
  location: string;
  assignedTo?: string;
  reportedBy: string;
  reportedAt: Date;
  images?: string[];
}

const mockIssues: Issue[] = [
  {
    id: '#1284',
    title: 'Large pothole causing traffic delays',
    description: 'Major pothole on Main Street intersection causing significant traffic delays and potential vehicle damage.',
    category: 'Road',
    priority: 'high',
    status: 'new',
    location: 'Main St & 5th Ave',
    reportedBy: 'John Smith',
    reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '#1283',
    title: 'Broken streetlight in residential area',
    description: 'Streetlight has been non-functional for over a week, creating safety concerns for pedestrians.',
    category: 'Lighting',
    priority: 'medium',
    status: 'in-progress',
    location: 'Park Avenue',
    assignedTo: 'Team A',
    reportedBy: 'Sarah Johnson',
    reportedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: '#1282',
    title: 'Overflowing trash bin in city center',
    description: 'Public trash bin has been overflowing for several days, attracting pests and creating unsanitary conditions.',
    category: 'Sanitation',
    priority: 'low',
    status: 'resolved',
    location: 'City Center Plaza',
    assignedTo: 'Team C',
    reportedBy: 'Mike Davis',
    reportedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

export default function Issues() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredIssues = mockIssues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Error sx={{ color: '#f44336', fontSize: 16 }} />;
      case 'medium': return <Warning sx={{ color: '#ff9800', fontSize: 16 }} />;
      case 'low': return <CheckCircle sx={{ color: '#4caf50', fontSize: 16 }} />;
      default: return null;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
          Issues Management
        </Typography>
        <Button
          variant="outlined"
          sx={{
            borderColor: '#e0e0e0',
            color: '#424242',
            '&:hover': {
              borderColor: '#bdbdbd',
              backgroundColor: '#fafafa',
            },
          }}
        >
          Export Report
        </Button>
      </Box>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search issues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 18, color: '#757575' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: 14,
                borderRadius: 1,
                '& fieldset': { borderColor: '#e0e0e0' },
                '&:hover fieldset': {
                  borderColor: '#b0d1c7',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#b0d1c7',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#b0d1c7',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            select
            fullWidth
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: 14,
                borderRadius: 1,
                '& fieldset': { borderColor: '#e0e0e0' },
                '&:hover fieldset': {
                  borderColor: '#b0d1c7',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#b0d1c7',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#b0d1c7',
              },
            }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{
          borderBottom: '1px solid #e0e0e0',
          mb: 3,
          '& .MuiTab-root': {
            color: '#757575',
            fontSize: 14,
            fontWeight: 500,
            textTransform: 'none',
          },
          '& .Mui-selected': {
            color: '#1a1a1a',
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#b0d1c7',
          },
        }}
      >
        <Tab label="All Issues" />
        <Tab label="Assigned to Me" />
        <Tab label="Unassigned" />
      </Tabs>

      {/* Issues Grid */}
      <Grid container spacing={2}>
        {filteredIssues.map((issue) => (
          <Grid item xs={12} key={issue.id}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                '&:hover': {
                  borderColor: '#bdbdbd',
                },
                transition: 'border-color 0.2s',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#757575', fontSize: 12 }}>
                        {issue.id}
                      </Typography>
                      <Chip
                        label={issue.category}
                        size="small"
                        sx={{
                          backgroundColor: '#f5f5f5',
                          color: '#424242',
                          fontSize: 11,
                          height: 20,
                        }}
                      />
                      <Box
                        sx={{
                          px: 1,
                          py: 0.25,
                          borderRadius: 0.5,
                          backgroundColor: '#f0f0f0',
                          border: '1px solid #e0e0e0',
                        }}
                      >
                        <Typography variant="caption" sx={{ fontSize: 10, color: '#424242' }}>
                          {issue.status}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 1, fontSize: 16 }}>
                      {issue.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#616161', mb: 2, lineHeight: 1.5 }}>
                      {issue.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOn sx={{ fontSize: 14, color: '#757575' }} />
                        <Typography variant="caption" sx={{ color: '#757575' }}>
                          {issue.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Schedule sx={{ fontSize: 14, color: '#757575' }} />
                        <Typography variant="caption" sx={{ color: '#757575' }}>
                          {formatTimeAgo(issue.reportedAt)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Person sx={{ fontSize: 14, color: '#757575' }} />
                        <Typography variant="caption" sx={{ color: '#757575' }}>
                          {issue.reportedBy}
                        </Typography>
                      </Box>
                      {issue.assignedTo && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Avatar sx={{ width: 16, height: 16, backgroundColor: '#e0e0e0', fontSize: 10 }}>
                            A
                          </Avatar>
                          <Typography variant="caption" sx={{ color: '#757575' }}>
                            {issue.assignedTo}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                    {getPriorityIcon(issue.priority)}
                    <IconButton size="small" sx={{ color: '#757575' }}>
                      <MoreVert sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}