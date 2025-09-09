'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Typography } from '@mui/material';

// You'll need to set your Mapbox token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJ5b3VyLXRva2VuIn0.xxxxx';

interface Issue {
  id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
}

interface IssueMapProps {
  issues?: Issue[];
  onIssueSelect?: (issue: Issue) => void;
  selectedIssue?: Issue | null;
}

export default function IssueMap({ issues = [], onIssueSelect, selectedIssue }: IssueMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      // Initialize map with a minimal style
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11', // Minimal light style
        center: [-74.0060, 40.7128], // NYC coordinates
        zoom: 12,
      });

      // Add minimal navigation controls
      map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');

    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Demo issues if none provided
    const displayIssues = issues.length > 0 ? issues : [
      {
        id: '1',
        title: 'Pothole on Main Street',
        category: 'Road',
        priority: 'high',
        status: 'new',
        location: { lat: 40.7128, lng: -74.0060 },
        address: 'Main St & 5th Ave',
      },
      {
        id: '2',
        title: 'Broken Streetlight',
        category: 'Lighting',
        priority: 'medium',
        status: 'in-progress',
        location: { lat: 40.7260, lng: -73.9960 },
        address: 'Park Avenue',
      },
      {
        id: '3',
        title: 'Overflowing Trash',
        category: 'Sanitation',
        priority: 'low',
        status: 'resolved',
        location: { lat: 40.7080, lng: -74.0180 },
        address: 'City Center',
      },
    ];

    // Add markers with minimal styling
    displayIssues.forEach(issue => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#424242';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
      el.style.cursor = 'pointer';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([issue.location.lng, issue.location.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25, closeButton: false })
            .setHTML(`
              <div style="padding: 8px; min-width: 150px;">
                <div style="font-size: 13px; font-weight: 500; color: #1a1a1a; margin-bottom: 4px;">
                  ${issue.title}
                </div>
                <div style="font-size: 12px; color: #757575;">
                  ${issue.address}
                </div>
              </div>
            `)
        )
        .addTo(map.current!);

      el.addEventListener('click', () => {
        if (onIssueSelect) {
          onIssueSelect(issue);
        }
      });

      markers.current.push(marker);
    });

    // Fit map to show all markers
    if (displayIssues.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      displayIssues.forEach(issue => {
        bounds.extend([issue.location.lng, issue.location.lat]);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [issues, onIssueSelect]);

  useEffect(() => {
    if (!map.current || !selectedIssue) return;

    // Fly to selected issue
    map.current.flyTo({
      center: [selectedIssue.location.lng, selectedIssue.location.lat],
      zoom: 15,
      essential: true,
    });
  }, [selectedIssue]);

  // Fallback if Mapbox token is not set
  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <Box 
        sx={{ 
          height: '100%', 
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fafafa',
          border: '1px solid #e0e0e0',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#757575', mb: 1 }}>
            Map View Unavailable
          </Typography>
          <Typography variant="caption" sx={{ color: '#9e9e9e' }}>
            Please configure Mapbox token in .env.local
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
      <div ref={mapContainer} style={{ height: '100%', width: '100%' }} />
    </Box>
  );
}