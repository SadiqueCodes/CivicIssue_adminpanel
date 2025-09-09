'use client';

import { useState, useEffect } from 'react';
import { Grid, Box, Container } from '@mui/material';
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
        icon: '🚨',
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
      // Handle assignment
      toast.success(`Issue assigned to ${action.assignee}`);
    } else if (action.type === 'prioritize') {
      // Handle prioritization
      toast.success('Issue priority updated');
    }
    refetch();
  };

  return (
    <DashboardLayout>
      <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
        {/* Stats Overview */}
        <StatsGrid stats={stats} loading={loading} />

        {/* Main Content Grid */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Left Column - Map and Issues */}
          <Grid item xs={12} lg={8}>
            {/* Interactive Map */}
            <Box
              sx={{
                height: 450,
                mb: 3,
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 1,
                backgroundColor: 'background.paper',
              }}
            >
              <IssueMap 
                issues={issues}
                onIssueSelect={handleIssueSelect}
                selectedIssue={selectedIssue}
              />
            </Box>

            {/* Issues Table */}
            <Box
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 1,
                backgroundColor: 'background.paper',
              }}
            >
              <IssuesTable 
                issues={issues}
                onIssueSelect={handleIssueSelect}
                loading={loading}
              />
            </Box>
          </Grid>

          {/* Right Column - AI Assistant and Activity */}
          <Grid item xs={12} lg={4}>
            {/* AI Assistant */}
            <Box
              sx={{
                height: 400,
                mb: 3,
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 1,
                backgroundColor: 'background.paper',
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
            </Box>

            {/* Priority Queue */}
            <Box
              sx={{
                mb: 3,
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 1,
                backgroundColor: 'background.paper',
              }}
            >
              <PriorityQueue 
                issues={issues?.filter(i => i.priority === 'high')}
                onIssueSelect={handleIssueSelect}
              />
            </Box>

            {/* Activity Feed */}
            <Box
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 1,
                backgroundColor: 'background.paper',
              }}
            >
              <ActivityFeed activities={activities} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
}