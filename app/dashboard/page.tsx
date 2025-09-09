'use client';

import { useState, useEffect } from 'react';
import { Grid, Box, Container, Paper, Typography } from '@mui/material';
import StatsGrid from '@/components/Dashboard/StatsGrid';
import IssueMap from '@/components/Map/IssueMap';
import AIAssistant from '@/components/AIChat/AIAssistant';
import IssuesTable from '@/components/Dashboard/IssuesTable';
import PriorityQueue from '@/components/Dashboard/PriorityQueue';
import ActivityFeed from '@/components/Dashboard/ActivityFeed';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useWebSocket } from '@/lib/hooks/useWebSocket';
import { useDashboardData } from '@/lib/hooks/useDashboardData';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const { stats, issues, activities, loading, error, refetch } = useDashboardData();
  const { messages, sendMessage, isConnected } = useWebSocket('ws://localhost:3000');

  useEffect(() => {
    if (isConnected) {
      toast.success('Connected to real-time updates');
    }
  }, [isConnected]);

  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (latestMessage?.type === 'new_issue') {
      toast('New issue reported!', {
        icon: '🔔',
      });
      refetch();
    }
  }, [messages, refetch]);

  const handleIssueSelect = (issue: any) => {
    setSelectedIssue(issue);
  };

  const handleAIAction = async (action: any) => {
    console.log('AI Action:', action);
    if (action.type === 'assign') {
      toast.success(`Issue assigned to ${action.assignee}`);
    } else if (action.type === 'prioritize') {
      toast.success('Issue priority updated');
    }
    refetch();
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {/* Simple Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#757575', mt: 0.5 }}>
            Overview of civic issues and management metrics
          </Typography>
        </Box>

        {/* Stats */}
        <Box sx={{ mb: 3 }}>
          <StatsGrid stats={stats} loading={loading} />
        </Box>

        {/* Main Grid */}
        <Grid container spacing={3}>
          {/* Left Side */}
          <Grid item xs={12} lg={8}>
            {/* Map */}
            <Paper 
              elevation={0} 
              sx={{ 
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                overflow: 'hidden',
                mb: 3,
                height: 400
              }}
            >
              <IssueMap 
                issues={issues}
                onIssueSelect={handleIssueSelect}
                selectedIssue={selectedIssue}
              />
            </Paper>

            {/* Table */}
            <Paper 
              elevation={0} 
              sx={{ 
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                overflow: 'hidden' 
              }}
            >
              <IssuesTable 
                issues={issues}
                onIssueSelect={handleIssueSelect}
                loading={loading}
              />
            </Paper>
          </Grid>

          {/* Right Side */}
          <Grid item xs={12} lg={4}>
            {/* Priority Queue */}
            <Paper 
              elevation={0} 
              sx={{ 
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                mb: 3,
                overflow: 'hidden'
              }}
            >
              <PriorityQueue 
                issues={issues?.filter(i => i.priority === 'high')}
                onIssueSelect={handleIssueSelect}
              />
            </Paper>

            {/* AI Assistant */}
            <Paper 
              elevation={0} 
              sx={{ 
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                height: 400,
                overflow: 'hidden'
              }}
            >
              <AIAssistant
                context={{
                  selectedIssue,
                  stats,
                  recentIssues: issues?.slice(0, 5),
                }}
                onActionSuggested={handleAIAction}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}