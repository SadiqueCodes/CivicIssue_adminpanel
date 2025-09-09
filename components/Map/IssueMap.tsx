'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Paper, Typography, Chip, IconButton } from '@mui/material';
import { Layers, MyLocation, ZoomIn, ZoomOut } from '@mui/icons-material';

// You'll need to set your Mapbox token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'your-mapbox-token';

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
  const [mapStyle, setMapStyle] = useState('streets-v12');
  const [viewport, setViewport] = useState({
    lat: 40.7128,
    lng: -74.0060,
    zoom: 12,
  });

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: `mapbox://styles/mapbox/${mapStyle}`,
      center: [viewport.lng, viewport.lat],
      zoom: viewport.zoom,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add geolocate control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      'top-right'
    );

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

    // Add markers for each issue
    displayIssues.forEach(issue => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.borderRadius = '50%';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.fontSize = '16px';
      el.style.color = 'white';
      
      // Set color based on priority
      if (issue.priority === 'high') {
        el.style.backgroundColor = '#fc5c65';
        el.innerHTML = '⚠️';
      } else if (issue.priority === 'medium') {
        el.style.backgroundColor = '#f6ad55';
        el.innerHTML = '⚡';
      } else {
        el.style.backgroundColor = '#48bb78';
        el.innerHTML = '✓';
      }

      const marker = new mapboxgl.Marker(el)
        .setLngLat([issue.location.lng, issue.location.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 8px;">
                <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">${issue.title}</h3>
                <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">
                  <strong>Category:</strong> ${issue.category}
                </p>
                <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">
                  <strong>Status:</strong> ${issue.status}
                </p>
                <p style="margin: 0; font-size: 12px; color: #666;">
                  <strong>Location:</strong> ${issue.address}
                </p>
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

    // Open popup for selected marker
    const marker = markers.current.find(m => {
      const lngLat = m.getLngLat();
      return lngLat.lng === selectedIssue.location.lng && lngLat.lat === selectedIssue.location.lat;
    });
    
    if (marker) {
      marker.getPopup()?.addTo(map.current);
    }
  }, [selectedIssue]);

  const handleStyleChange = () => {
    const styles = ['streets-v12', 'satellite-v9', 'dark-v11', 'light-v11'];
    const currentIndex = styles.indexOf(mapStyle);
    const nextStyle = styles[(currentIndex + 1) % styles.length];
    setMapStyle(nextStyle);
    
    if (map.current) {
      map.current.setStyle(`mapbox://styles/mapbox/${nextStyle}`);
    }
  };

  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
      <div ref={mapContainer} style={{ height: '100%', width: '100%' }} />
      
      {/* Map Controls Overlay */}
      <Paper
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Typography variant="h6">Live Issue Map</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip label="🔴 High: 3" size="small" />
          <Chip label="🟡 Medium: 7" size="small" />
          <Chip label="🟢 Low: 12" size="small" />
        </Box>
      </Paper>

      {/* Style Switcher */}
      <IconButton
        sx={{
          position: 'absolute',
          bottom: 100,
          right: 16,
          bgcolor: 'white',
          boxShadow: 2,
          '&:hover': { bgcolor: 'white' },
        }}
        onClick={handleStyleChange}
      >
        <Layers />
      </IconButton>
    </Box>
  );
}