'use client';

import { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  InputBase,
  alpha,
  styled,
  Popover,
  Paper,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Assignment,
  People,
  Analytics,
  Settings,
  Notifications,
  CheckCircle,
  Warning,
  Info,
  Search as SearchIcon,
  Logout,
  Person,
  Circle,
  Description,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import Link from 'next/link';

const drawerWidth = 240;

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 8,
  backgroundColor: '#ffffff',
  border: '1px solid #e0e0e0',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
  marginLeft: theme.spacing(2),
  width: '320px',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#757575',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    fontSize: 14,
  },
}));

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationCount, setNotificationCount] = useState(3);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const [profileHoverTimeout, setProfileHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setNotificationAnchorEl(event.currentTarget);
    // Clear notification count when opening dropdown
    setNotificationCount(0);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const notificationOpen = Boolean(notificationAnchorEl);
  const profileOpen = Boolean(profileAnchorEl);

  const handleProfileMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMouseLeave = () => {
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard sx={{ fontSize: 20 }} />, path: '/dashboard' },
    { text: 'Issues', icon: <Assignment sx={{ fontSize: 20 }} />, path: '/issues' },
    { text: 'Users', icon: <People sx={{ fontSize: 20 }} />, path: '/users' },
    { text: 'Analytics', icon: <Analytics sx={{ fontSize: 20 }} />, path: '/analytics' },
    { text: 'Reports', icon: <Description sx={{ fontSize: 20 }} />, path: '/reports' },
    { text: 'Settings', icon: <Settings sx={{ fontSize: 20 }} />, path: '/settings' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', backgroundColor: '#212121' }}>
      {/* Logo */}
      <Box sx={{ 
        p: 2.5,
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            color: '#ffffff',
            letterSpacing: '-0.5px'
          }}
        >
          NagarMitram
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          Issue Management System
        </Typography>
      </Box>
      
      {/* Navigation */}
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              href={item.path}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#ffffff', minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: '#ffffff'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#ffffff' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Toolbar sx={{ height: 64 }}>
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }, color: '#424242' }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Actions */}
          <IconButton 
            sx={{ color: '#757575' }}
            onClick={handleNotificationClick}
          >
            <Badge badgeContent={notificationCount} color="error" variant="dot">
              <Notifications sx={{ fontSize: 22 }} />
            </Badge>
          </IconButton>
          
          <Box 
            sx={{ ml: 2, display: 'flex', alignItems: 'center' }}
            onMouseEnter={handleProfileMouseEnter}
            onMouseLeave={handleProfileMouseLeave}
          >
            <Avatar
              sx={{ 
                width: 32, 
                height: 32,
                backgroundColor: '#e0e0e0',
                color: '#757575',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: '#d0d0d0',
                }
              }}
            >
              JD
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Notification Dropdown */}
      <Popover
        open={notificationOpen}
        anchorEl={notificationAnchorEl}
        onClose={handleNotificationClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        disableScrollLock={true}
        sx={{
          '& .MuiPopover-paper': {
            marginTop: 1,
          }
        }}
      >
        <Paper sx={{ 
          width: 320, 
          maxHeight: 420,
          overflow: 'hidden',
          '& .MuiList-root': {
            maxHeight: 350,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: 4,
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#d0d0d0',
              borderRadius: 2,
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#b0b0b0',
            },
          }
        }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', backgroundColor: 'white' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
              Notifications
            </Typography>
          </Box>
          <List sx={{ p: 0 }}>
            <ListItem sx={{ 
              p: 2, 
              borderBottom: '1px solid #f5f5f5',
              alignItems: 'flex-start',
              minHeight: 80
            }}>
              <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
              </ListItemIcon>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5, color: '#1a1a1a' }}>
                  Issue Resolved
                </Typography>
                <Typography variant="caption" sx={{ color: '#757575', lineHeight: 1.3, display: 'block', mb: 0.5 }}>
                  Pothole on Main Street has been fixed by Team A
                </Typography>
                <Typography variant="caption" sx={{ color: '#9e9e9e', fontSize: 11 }}>
                  30 minutes ago
                </Typography>
              </Box>
            </ListItem>
            
            <ListItem sx={{ 
              p: 2, 
              borderBottom: '1px solid #f5f5f5',
              alignItems: 'flex-start',
              minHeight: 80
            }}>
              <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                <Info sx={{ color: '#b0d1c7', fontSize: 20 }} />
              </ListItemIcon>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5, color: '#1a1a1a' }}>
                  Team Dispatched
                </Typography>
                <Typography variant="caption" sx={{ color: '#757575', lineHeight: 1.3, display: 'block', mb: 0.5 }}>
                  Team B has been dispatched to water leak on Oak Street
                </Typography>
                <Typography variant="caption" sx={{ color: '#9e9e9e', fontSize: 11 }}>
                  1 hour ago
                </Typography>
              </Box>
            </ListItem>
            
            <ListItem sx={{ 
              p: 2,
              alignItems: 'flex-start',
              minHeight: 80
            }}>
              <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                <Warning sx={{ color: '#ff9800', fontSize: 20 }} />
              </ListItemIcon>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5, color: '#1a1a1a' }}>
                  New Critical Issue
                </Typography>
                <Typography variant="caption" sx={{ color: '#757575', lineHeight: 1.3, display: 'block', mb: 0.5 }}>
                  Traffic light malfunction reported at Downtown Junction
                </Typography>
                <Typography variant="caption" sx={{ color: '#9e9e9e', fontSize: 11 }}>
                  2 hours ago
                </Typography>
              </Box>
            </ListItem>
          </List>
        </Paper>
      </Popover>

      {/* Profile Hover Card */}
      <Popover
        open={profileOpen}
        anchorEl={profileAnchorEl}
        onClose={() => setProfileAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        disableScrollLock={true}
        sx={{
          '& .MuiPopover-paper': {
            marginTop: 1,
          }
        }}
      >
        <Paper 
          sx={{ 
            width: 240, 
            p: 2,
            border: '1px solid #e0e0e0',
            backgroundColor: 'white'
          }}
          onMouseLeave={() => setProfileAnchorEl(null)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40,
                backgroundColor: '#b0d1c7',
                color: 'white',
                fontSize: 16,
                fontWeight: 600,
                mr: 2
              }}
            >
              JD
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                {user?.name || 'John Doe'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#757575' }}>
                {user?.role || 'Administrator'}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ mt: 1 }}>
            <Button
              fullWidth
              size="small"
              startIcon={<Logout sx={{ fontSize: 16 }} />}
              onClick={logout}
              sx={{
                color: '#757575',
                fontSize: 12,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                  color: '#1a1a1a',
                },
              }}
            >
              Sign Out
            </Button>
          </Box>
        </Paper>
      </Popover>
      
      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: '1px solid #e0e0e0',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: '#fafafa',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}