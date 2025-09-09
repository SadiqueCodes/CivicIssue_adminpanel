'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Download,
  FileDownload,
  PictureAsPdf,
  TableChart,
  MoreVert,
  CalendarToday,
} from '@mui/icons-material';

interface Report {
  id: string;
  name: string;
  type: 'summary' | 'detailed' | 'analytics';
  dateRange: string;
  generatedAt: Date;
  fileSize: string;
  status: 'ready' | 'generating' | 'failed';
}

const mockReports: Report[] = [
  {
    id: 'R001',
    name: 'Weekly Issues Summary',
    type: 'summary',
    dateRange: 'Mar 1-7, 2024',
    generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    fileSize: '2.4 MB',
    status: 'ready',
  },
  {
    id: 'R002',
    name: 'Monthly Analytics Report',
    type: 'analytics',
    dateRange: 'February 2024',
    generatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    fileSize: '5.7 MB',
    status: 'ready',
  },
  {
    id: 'R003',
    name: 'Detailed Issues Export',
    type: 'detailed',
    dateRange: 'Jan 1-31, 2024',
    generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    fileSize: '12.3 MB',
    status: 'ready',
  },
];

export default function Reports() {
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState('last-week');
  const [format, setFormat] = useState('pdf');

  const formatTimeAgo = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return '1d ago';
    return `${days}d ago`;
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'summary': return <FileDownload sx={{ fontSize: 16, color: '#757575' }} />;
      case 'analytics': return <TableChart sx={{ fontSize: 16, color: '#757575' }} />;
      case 'detailed': return <PictureAsPdf sx={{ fontSize: 16, color: '#757575' }} />;
      default: return <FileDownload sx={{ fontSize: 16, color: '#757575' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return '#4caf50';
      case 'generating': return '#ff9800';
      case 'failed': return '#f44336';
      default: return '#757575';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 3 }}>
        Reports
      </Typography>

      <Grid container spacing={3}>
        {/* Report Generator */}
        <Grid item xs={12} lg={4}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 2 }}>
                Generate New Report
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#757575', mb: 1, fontSize: 12 }}>
                  Report Type
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: 14,
                      borderRadius: 1,
                      '& fieldset': { borderColor: '#e0e0e0' },
                    },
                  }}
                >
                  <MenuItem value="summary">Issues Summary</MenuItem>
                  <MenuItem value="analytics">Analytics Report</MenuItem>
                  <MenuItem value="detailed">Detailed Export</MenuItem>
                </TextField>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#757575', mb: 1, fontSize: 12 }}>
                  Date Range
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: 14,
                      borderRadius: 1,
                      '& fieldset': { borderColor: '#e0e0e0' },
                    },
                  }}
                >
                  <MenuItem value="last-week">Last Week</MenuItem>
                  <MenuItem value="last-month">Last Month</MenuItem>
                  <MenuItem value="last-quarter">Last Quarter</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </TextField>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: '#757575', mb: 1, fontSize: 12 }}>
                  Format
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: 14,
                      borderRadius: 1,
                      '& fieldset': { borderColor: '#e0e0e0' },
                    },
                  }}
                >
                  <MenuItem value="pdf">PDF Document</MenuItem>
                  <MenuItem value="excel">Excel Spreadsheet</MenuItem>
                  <MenuItem value="csv">CSV File</MenuItem>
                </TextField>
              </Box>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<Download />}
                sx={{
                  borderColor: '#e0e0e0',
                  color: '#424242',
                  '&:hover': {
                    borderColor: '#bdbdbd',
                    backgroundColor: '#fafafa',
                  },
                }}
              >
                Generate Report
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 1, mt: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 2 }}>
                Report Statistics
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" sx={{ color: '#757575', fontSize: 12 }}>
                  Total Reports
                </Typography>
                <Typography variant="body2" sx={{ color: '#1a1a1a', fontSize: 12, fontWeight: 500 }}>
                  {mockReports.length}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" sx={{ color: '#757575', fontSize: 12 }}>
                  This Week
                </Typography>
                <Typography variant="body2" sx={{ color: '#1a1a1a', fontSize: 12, fontWeight: 500 }}>
                  2
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#757575', fontSize: 12 }}>
                  Storage Used
                </Typography>
                <Typography variant="body2" sx={{ color: '#1a1a1a', fontSize: 12, fontWeight: 500 }}>
                  20.4 MB
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Report History */}
        <Grid item xs={12} lg={8}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, pb: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 2 }}>
                  Recent Reports
                </Typography>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#757575', fontSize: 12, fontWeight: 500, borderBottom: '1px solid #e0e0e0' }}>
                        Report
                      </TableCell>
                      <TableCell sx={{ color: '#757575', fontSize: 12, fontWeight: 500, borderBottom: '1px solid #e0e0e0' }}>
                        Type
                      </TableCell>
                      <TableCell sx={{ color: '#757575', fontSize: 12, fontWeight: 500, borderBottom: '1px solid #e0e0e0' }}>
                        Date Range
                      </TableCell>
                      <TableCell sx={{ color: '#757575', fontSize: 12, fontWeight: 500, borderBottom: '1px solid #e0e0e0' }}>
                        Generated
                      </TableCell>
                      <TableCell sx={{ color: '#757575', fontSize: 12, fontWeight: 500, borderBottom: '1px solid #e0e0e0' }}>
                        Status
                      </TableCell>
                      <TableCell sx={{ color: '#757575', fontSize: 12, fontWeight: 500, borderBottom: '1px solid #e0e0e0' }}>
                        Size
                      </TableCell>
                      <TableCell sx={{ color: '#757575', fontSize: 12, fontWeight: 500, borderBottom: '1px solid #e0e0e0' }}>
                        
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockReports.map((report) => (
                      <TableRow
                        key={report.id}
                        hover
                        sx={{
                          '&:hover': { backgroundColor: '#fafafa' },
                        }}
                      >
                        <TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getReportIcon(report.type)}
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500, color: '#1a1a1a', fontSize: 13 }}>
                                {report.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#757575', fontSize: 11 }}>
                                {report.id}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>
                          <Chip
                            label={report.type}
                            size="small"
                            sx={{
                              backgroundColor: '#f0f0f0',
                              color: '#424242',
                              fontSize: 11,
                              height: 20,
                              textTransform: 'capitalize',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarToday sx={{ fontSize: 12, color: '#757575' }} />
                            <Typography variant="caption" sx={{ color: '#424242', fontSize: 11 }}>
                              {report.dateRange}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>
                          <Typography variant="caption" sx={{ color: '#757575', fontSize: 11 }}>
                            {formatTimeAgo(report.generatedAt)}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>
                          <Box
                            component="span"
                            sx={{
                              px: 1,
                              py: 0.25,
                              borderRadius: 0.5,
                              fontSize: 11,
                              fontWeight: 500,
                              backgroundColor: '#f0f0f0',
                              color: '#424242',
                              border: '1px solid #e0e0e0',
                              width: 85,
                              textAlign: 'center',
                              display: 'inline-block',
                            }}
                          >
                            {report.status}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>
                          <Typography variant="caption" sx={{ color: '#424242', fontSize: 11 }}>
                            {report.fileSize}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>
                          <IconButton size="small" sx={{ color: '#757575' }}>
                            <Download sx={{ fontSize: 16 }} />
                          </IconButton>
                          <IconButton size="small" sx={{ color: '#757575' }}>
                            <MoreVert sx={{ fontSize: 16 }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}