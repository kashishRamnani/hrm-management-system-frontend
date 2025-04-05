import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; 

export const ProtectedRoute = ({ element, requiredRole }) => {
  const { user } = useAuth();

  if (!user) {
   
    return <Navigate to="/signin" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    
    return <Navigate to="/signin" />;
  }

  
  return element;
};
