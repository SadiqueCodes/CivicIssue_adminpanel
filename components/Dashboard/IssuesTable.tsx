'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Search,
  MoreHoriz,
} from '@mui/icons-material';
import AdminApiService from '@/lib/api';
import { newTheme } from '@/lib/theme';

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
  reportedAt: Date | string;
}

interface IssuesTableProps {
  issues?: Issue[];
  onIssueSelect?: (issue: Issue) => void;
  loading?: boolean;
}

export default function IssuesTable({ issues: propIssues = [], onIssueSelect, loading: propLoading }: IssuesTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [issues, setIssues] = useState(propIssues);
  const [loading, setLoading] = useState(propLoading || false);

  useEffect(() => {
    if (!propIssues.length) {
      loadIssues();
    }
  }, [propIssues]);

  const loadIssues = async () => {
    try {
      setLoading(true);
      const response = await AdminApiService.getIssues({
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm || undefined,
      });
      
      // Transform backend data to component format
      const transformedIssues = response.issues.map((issue: any) => ({
        id: issue.id,
        title: issue.title,
        category: issue.category,
        location: {
          lat: issue.latitude,
          lng: issue.longitude,
        },
        address: issue.address,
        priority: issue.priority,
        status: issue.status,
        assignedTo: issue.assignee?.name,
        reportedAt: new Date(issue.createdAt),
      }));
      
      setIssues(transformedIssues);
    } catch (error) {
      console.error('Failed to load issues:', error);
    } finally {
      setLoading(false);
    }
  };

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
  ];

  const displayIssues = issues;
  const filteredIssues = displayIssues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatTimeAgo = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const hours = Math.floor((Date.now() - dateObj.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return '1d ago';
    return `${days}d ago`;
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
            Recent Issues
          </Typography>
          <TextField
            size="small"
            placeholder="Search..."
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
              width: 200,
              '& .MuiOutlinedInput-root': {
                fontSize: 13,
                borderRadius: 1,
                '& fieldset': {
                  borderColor: '#e0e0e0',
                },
              },
            }}
          />
        </Box>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#757575', fontSize: 12, fontWeight: 500, borderBottom: '1px solid #e0e0e0' }}>
                ID
              </TableCell>
              <TableCell sx={{ color: '#757575', fontSize: 12, fontWeight: 500, borderBottom: '1px solid #e0e0e0' }}>
                Issue
              </TableCell>
              <TableCell sx={{ color: '#757575', fontSize: 12, fontWeight: 500, borderBottom: '1px solid #e0e0e0' }}>
                Location
              </TableCell>
              <TableCell sx={{ color: '#757575', fontSize: 12, fontWeight: 500, borderBottom: '1px solid #e0e0e0' }}>
                Status
              </TableCell>
              <TableCell sx={{ color: '#757575', fontSize: 12, fontWeight: 500, borderBottom: '1px solid #e0e0e0' }}>
                Assigned
              </TableCell>
              <TableCell sx={{ color: '#757575', fontSize: 12, fontWeight: 500, borderBottom: '1px solid #e0e0e0' }}>
                Time
              </TableCell>
              <TableCell sx={{ color: '#757575', fontSize: 12, fontWeight: 500, borderBottom: '1px solid #e0e0e0' }}>
                
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredIssues
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((issue) => (
                <TableRow
                  key={issue.id}
                  hover
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#fafafa',
                    },
                  }}
                  onClick={() => onIssueSelect?.(issue)}
                >
                  <TableCell sx={{ fontSize: 13, color: '#424242', borderBottom: '1px solid #f0f0f0' }}>
                    {issue.id}
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, color: '#1a1a1a', fontWeight: 500, borderBottom: '1px solid #f0f0f0' }}>
                    {issue.title}
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, color: '#424242', borderBottom: '1px solid #f0f0f0' }}>
                    {issue.address}
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, borderBottom: '1px solid #f0f0f0' }}>
                    <Box
                      component="span"
                      sx={{
                        px: 1,
                        py: 0.25,
                        borderRadius: 3,
                        fontSize: 11,
                        fontWeight: 600,
                        backgroundColor: 
                          issue.status === 'new' ? newTheme.colors.status.new :
                          issue.status === 'in-progress' ? newTheme.colors.status.inProgress :
                          issue.status === 'resolved' ? newTheme.colors.status.resolved : '#f0f0f0',
                        color: '#ffffff',
                        width: 85,
                        textAlign: 'center',
                        display: 'inline-block',
                        textTransform: 'capitalize',
                      }}
                    >
                      {issue.status}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, color: '#424242', borderBottom: '1px solid #f0f0f0' }}>
                    {issue.assignedTo || '-'}
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, color: '#757575', borderBottom: '1px solid #f0f0f0' }}>
                    {formatTimeAgo(issue.reportedAt)}
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>
                    <IconButton size="small" sx={{ color: '#757575' }}>
                      <MoreHoriz sx={{ fontSize: 18 }} />
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
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        sx={{
          borderTop: '1px solid #e0e0e0',
          '.MuiTablePagination-toolbar': {
            minHeight: 48,
          },
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            fontSize: 13,
            color: '#757575',
          },
        }}
      />
    </Box>
  );
}