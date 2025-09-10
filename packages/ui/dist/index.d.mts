import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}
declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;

declare function DashboardSkeleton(): React.JSX.Element;

interface DashboardLayoutProps {
    children: ReactNode;
    sidebar?: ReactNode;
    header?: ReactNode;
    className?: string;
}
declare function DashboardLayout({ children, sidebar, header, className }: DashboardLayoutProps): React.JSX.Element;

interface SidebarProps {
    title: string;
    subtitle?: string;
    children?: ReactNode;
    className?: string;
}
interface SidebarItemProps {
    children: ReactNode;
    active?: boolean;
    onClick?: () => void;
    variant?: 'primary' | 'ghost';
}
declare function Sidebar({ title, subtitle, children, className }: SidebarProps): React.JSX.Element;
declare function SidebarItem({ children, active, onClick, variant }: SidebarItemProps): React.JSX.Element;

declare const version = "0.1.0";

export { Button, type ButtonProps, DashboardLayout, type DashboardLayoutProps, DashboardSkeleton, Sidebar, SidebarItem, type SidebarItemProps, type SidebarProps, version };
