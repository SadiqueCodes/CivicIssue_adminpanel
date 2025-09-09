'use client';

import { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Skeleton,
} from '@mui/material';
import {
  Visibility,
  Assignment,
  Search,
  FilterList,
  Download,
} from '@mui/icons-material';
import { format } from 'date-fns';

interface Issue {
  id: string;
  title: string;
  category: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  priority: 'high' | 'medium' | 'low';
  status: 'new' | 'in-progress' | 'resolved';
  assignedTo?: string;
  reportedAt: Date;
}

interface IssuesTableProps {
  issues?: Issue[];
  onIssueSelect?: (issue: Issue) => void;
  loading?: boolean;
}

export default function IssuesTable({ issues = [], onIssueSelect, loading }: IssuesTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Demo data if no issues provided
  const demoIssues: Issue[] = [
    {
      id: '#1284',
      title: 'Pothole on Main Street',
      category: 'Road',
      location: { lat: 40.7128, lng: -74.0060 },
      address: 'Main St & 5th Ave',
      priority: 'high',
      status: 'new',
      assignedTo: undefined,
      reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: '#1283',
      title: 'Broken Streetlight',
      category: 'Lighting',
      location: { lat: 40.7260, lng: -73.9960 },
      address: 'Park Avenue',
      priority: 'medium',
      status: 'in-progress',
      assignedTo: 'Team A',
      reportedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: '#1282',
      title: 'Overflowing Trash Bin',
      category: 'Sanitation',
      location: { lat: 40.7080, lng: -74.0180 },
      address: 'City Center',
      priority: 'low',
      status: 'resolved',
      assignedTo: 'Team C',
      reportedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: '#1281',
      title: 'Graffiti on Bridge',
      category: 'Vandalism',
      location: { lat: 40.7580, lng: -73.9855 },
      address: 'Bridge Underpass',
      priority: 'low',
      status: 'in-progress',
      assignedTo: 'Team D',
      reportedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: '#1280',
      title: 'Water Leak',
      category: 'Water',
      location: { lat: 40.7489, lng: -73.9680 },
      address: 'Oak Street',
      priority: 'high',
      status: 'new',
      assignedTo: undefined,
      reportedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    },
  ];

  const displayIssues = issues.length > 0 ? issues : demoIssues;

  const filteredIssues = displayIssues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || issue.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'warning';
      case 'in-progress': return 'info';
      case 'resolved': return 'success';
      default: return 'default';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={400} />
      </Box>
    );
  }

  return (
    <Paper>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Recent Issues</Typography>
          <Button
            startIcon={<Download />}
            variant="outlined"
            size="small"
          >
            Export
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search issues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, maxWidth: 400 }}
          />
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {['all', 'new', 'in-progress', 'resolved'].map((status) => (
              <Chip
                key={status}
                label={status.charAt(0).toUpperCase() + status.slice(1)}
                onClick={() => setFilterStatus(status)}
                color={filterStatus === status ? 'primary' : 'default'}
                variant={filterStatus === status ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Issue Type</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Reported</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredIssues
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((issue) => (
                <TableRow
                  key={issue.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => onIssueSelect?.(issue)}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#667eea', fontWeight: 500 }}>
                      {issue.id}
                    </Typography>
                  </TableCell>
                  <TableCell>{issue.title}</TableCell>
                  <TableCell>{issue.address}</TableCell>
                  <TableCell>
                    <Chip
                      label={issue.priority}
                      color={getPriorityColor(issue.priority) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={issue.status.replace('-', ' ')}
                      color={getStatusColor(issue.status) as any}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{issue.assignedTo || 'Unassigned'}</TableCell>
                  <TableCell>{formatTimeAgo(issue.reportedAt)}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={(e) => {
                      e.stopPropagation();
                      onIssueSelect?.(issue);
                    }}>
                      <Visibility />
                    </IconButton>
                    <IconButton size="small">
                      <Assignment />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredIssues.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}