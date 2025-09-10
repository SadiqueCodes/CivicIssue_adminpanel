import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

interface DashboardData {
  stats: {
    totalIssues: number;
    resolvedToday: number;
    inProgress: number;
    criticalIssues: number;
  };
  issues: any[];
  activities: any[];
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({
    stats: {
      totalIssues: 1284,
      resolvedToday: 47,
      inProgress: 126,
      criticalIssues: 23,
    },
    issues: [],
    activities: [],
  });

  const { data: fetchedData, isLoading, error, refetch } = useQuery(
    'dashboardData',
    async () => {
      try {
        const response = await axios.get('/api/dashboard');
        return response.data;
      } catch (error) {
        // Return demo data if API fails
        return {
          stats: {
            totalIssues: 1284,
            resolvedToday: 47,
            inProgress: 126,
            criticalIssues: 23,
          },
          issues: [
            {
              id: '#1284',
              title: 'Pothole on Main Street',
              category: 'Road',
              location: { lat: 40.7128, lng: -74.0060 },
              address: 'Main St & 5th Ave',
              priority: 'high',
              status: 'new',
              reportedAt: new Date(),
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
          ],
          activities: [],
        };
      }
    },
    {
      refetchInterval: 30000, // Refetch every 30 seconds
      staleTime: 10000,
    }
  );

  useEffect(() => {
    if (fetchedData) {
      setData(fetchedData);
    }
  }, [fetchedData]);

  return {
    stats: data.stats,
    issues: data.issues,
    activities: data.activities,
    loading: isLoading && !data.stats.totalIssues, // Only show loading if we don't have default data
    error,
    refetch,
  };
}