import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Pages
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ProfilePage } from '../pages/auth/ProfilePage';

// Student Pages
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { ReportLostPage } from '../pages/student/ReportLostPage';
import { ReportFoundPage } from '../pages/student/ReportFoundPage';
import { BrowseReportsPage } from '../pages/student/BrowseReportsPage';
import { MyReportsPage } from '../pages/student/MyReportsPage';
import { MyMatchesPage } from '../pages/student/MyMatchesPage';
import { MyClaimsPage } from '../pages/student/MyClaimsPage';
import { NotificationsPage } from '../pages/student/NotificationsPage';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { ManageReportsPage } from '../pages/admin/ManageReportsPage';
import { ManageClaimsPage } from '../pages/admin/ManageClaimsPage';
import { ManageUsersPage } from '../pages/admin/ManageUsersPage';
import { AnalyticsPage } from '../pages/admin/AnalyticsPage';
import { AuditLogsPage } from '../pages/admin/AuditLogsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> }
    ]
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: <StudentDashboard /> },
      { path: '/browse', element: <BrowseReportsPage /> },
      { path: '/report-lost', element: <ReportLostPage /> },
      { path: '/report-found', element: <ReportFoundPage /> },
      { path: '/my-reports', element: <MyReportsPage /> },
      { path: '/my-matches', element: <MyMatchesPage /> },
      { path: '/my-claims', element: <MyClaimsPage /> },
      { path: '/notifications', element: <NotificationsPage /> },
      { path: '/profile', element: <ProfilePage /> },

      // Admin routes
      {
        path: '/admin',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/reports',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <ManageReportsPage />
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/claims',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <ManageClaimsPage />
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/users',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <ManageUsersPage />
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/analytics',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AnalyticsPage />
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/audit-logs',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AuditLogsPage />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]);