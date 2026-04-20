import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import EmployeesPage from './pages/EmployeesPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';

function App() {
  return (
      <BrowserRouter>
        <div className="app">
          <nav className="navbar">
            <h1 className="logo">Salary Management</h1>
            <div className="nav-links">
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                Dashboard
              </NavLink>
              <NavLink to="/employees" className={({ isActive }) => isActive ? 'active' : ''}>
                Employees
              </NavLink>
            </div>
          </nav>
          <main className="content">
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
  );
}

export default App;
