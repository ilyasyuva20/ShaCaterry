import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/manage" element={<AdminPage />} />
      <Route path="/admin" element={<Navigate to="/manage" replace />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
