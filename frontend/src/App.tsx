import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Vacations from './components/vacations/Vacations';
import AdminVacations from './components/admin/AdminVacations';
import AdminReports from './components/admin/AdminReports';
import { RootState } from './store/store';
import './App.css';

const App: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <div className="App">
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/" /> : <Register />} 
        />
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              user?.is_admin ? <AdminVacations /> : <Vacations />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route 
          path="/admin/reports" 
          element={
            isAuthenticated && user?.is_admin ? (
              <AdminReports />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;

