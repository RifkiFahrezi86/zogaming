import React from 'react';
import { Badge } from '@/lib/types';

// SVG Icons for badges
export const badgeIcons: Record<string, React.ReactElement> = {
    bolt: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2L3 14h9l-1 10 10-12h-9l1-10z" />
        </svg>
    ),
    star: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    ),
    fire: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 23c-3.866 0-7-3.134-7-7 0-2.5 1.5-4.8 3-6.5.5-.5 1.5-1.5 2-2.5.5 1 1.5 2 2 2.5 1.5 1.7 3 4 3 6.5 0 3.866-3.134 7-7 7zm0-11.2c-.7.9-1.5 2-2 3-.5.8-.5 1.5-.5 2.2 0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5c0-.7 0-1.4-.5-2.2-.5-1-1.3-2.1-2-3z" />
        </svg>
    ),
    gift: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 12 20 22 4 22 4 12" />
            <rect x="2" y="7" width="20" height="5" />
            <line x1="12" y1="22" x2="12" y2="7" />
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
        </svg>
    ),
    shield: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    ),
    crown: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 20h20v2H2v-2zm1-7l4.5 3.5L12 8l4.5 8.5L21 13l-2 7H5l-2-7z" />
        </svg>
    ),
    gem: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 3h12l4.5 8L12 21 1.5 11 6 3zm2.16 2L5.32 10h13.36l-2.84-5H8.16z" />
        </svg>
    ),
    none: <></>,
};

interface BadgeDisplayProps {
    badge: Badge;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function BadgeDisplay({ badge, size = 'sm', className = '' }: BadgeDisplayProps) {
    if (!badge.active) return null;

    const sizeClasses = {
        sm: 'text-xs px-2 py-1 gap-1',
        md: 'text-sm px-3 py-1.5 gap-1.5',
        lg: 'text-base px-4 py-2 gap-2',
    };

    return (
        <span
            className={`inline-flex items-center font-bold rounded-full whitespace-nowrap ${sizeClasses[size]} ${className}`}
            style={{ backgroundColor: badge.color, color: badge.textColor }}
        >
            {badge.icon !== 'none' && badgeIcons[badge.icon]}
            {badge.label}
        </span>
    );
}

export function getBadgeIcon(iconName: string) {
    return badgeIcons[iconName] || null;
}

export const BADGE_ICON_OPTIONS = [
    { value: 'bolt', label: 'Bolt' },
    { value: 'star', label: 'Star' },
    { value: 'fire', label: 'Fire' },
    { value: 'gift', label: 'Gift' },
    { value: 'shield', label: 'Shield' },
    { value: 'crown', label: 'Crown' },
    { value: 'gem', label: 'Gem' },
    { value: 'none', label: 'None' },
];

// Feature section SVG icons
export const featureIcons: Record<string, React.ReactElement> = {
    download: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
    ),
    users: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    play: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="10 8 16 12 10 16 10 8" />
        </svg>
    ),
    layout: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
    ),
};

// Star rating component
export function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    width={size}
                    height={size}
                    viewBox="0 0 24 24"
                    fill={i < rating ? '#f59e0b' : 'none'}
                    stroke={i < rating ? '#f59e0b' : '#d1d5db'}
                    strokeWidth="2"
                >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ))}
        </div>
    );
}
