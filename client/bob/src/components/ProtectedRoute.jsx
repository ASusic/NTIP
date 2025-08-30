import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/prijava');
      return;
    }

    try {
      jwtDecode(token);
    } catch (error) {
      localStorage.removeItem('token');
      navigate('/prijava');
    }
  }, [navigate]);

  return children;
};

export default ProtectedRoute;