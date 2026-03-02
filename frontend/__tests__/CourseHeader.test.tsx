import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { CourseHeader } from '../components/course/CourseHeader';

// Helper to render with router context
const renderWithRouter = (ui: React.ReactElement) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('CourseHeader', () => {
    const defaultProps = {
        trackId: 'system-design',
        trackLabel: 'System Design',
        currentLevelIndex: 0,
        currentLevelTitle: 'Client-Server Architecture',
        subLevelProgress: 0,
        totalLevels: 10,
        currentUser: null,
        onNavigateHome: vi.fn(),
        onOpenRoadmap: vi.fn(),
        onNavigateReviews: vi.fn(),
        onOpenProfile: vi.fn(),
        onOpenAuth: vi.fn(),
        getUserInitials: (name: string) => {
            const parts = name.trim().split(/\s+/);
            if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
            return name.substring(0, 2).toUpperCase();
        },
    };

    it('renders the BeCurious title', () => {
        renderWithRouter(<CourseHeader {...defaultProps} />);
        expect(screen.getByText('BeCurious')).toBeInTheDocument();
    });

    it('shows level number and progress', () => {
        renderWithRouter(<CourseHeader {...defaultProps} />);
        expect(screen.getByText('L1')).toBeInTheDocument();
        expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('shows Sign In button when no user', () => {
        renderWithRouter(<CourseHeader {...defaultProps} currentUser={null} />);
        expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    it('shows user initials when logged in', () => {
        renderWithRouter(
            <CourseHeader {...defaultProps} currentUser={{ name: 'Alice Bob', email: 'alice@test.com' }} />
        );
        expect(screen.getByText('AB')).toBeInTheDocument();
    });

    it('shows correct progress percentage', () => {
        renderWithRouter(<CourseHeader {...defaultProps} currentLevelIndex={4} subLevelProgress={0.5} totalLevels={10} />);
        expect(screen.getByText('45%')).toBeInTheDocument();
    });
});
