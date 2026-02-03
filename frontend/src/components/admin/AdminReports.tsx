import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { logout } from '../../store/slices/authSlice';
import { AppDispatch, RootState } from '../../store/store';
import { vacationService } from '../../services/vacationService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ReportData {
  id: number;
  vacation_name: string;
  followers_count: number;
}

const AdminReports: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await vacationService.getReports();
      setReports(data);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const chartData = {
    labels: reports.map((r) => r.vacation_name),
    datasets: [
      {
        label: 'מספר עוקבים',
        data: reports.map((r) => r.followers_count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'דוח חופשות ומספר עוקבים',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand>דוחות - אדמין</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="text-light">
              חופשות
            </Nav.Link>
            <Navbar.Text className="me-3">
              שלום, {user?.first_name} {user?.last_name}
            </Navbar.Text>
            <Button variant="outline-light" onClick={handleLogout}>
              התנתק
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <Container>
        <h2 className="mb-4">דוח חופשות ומספר עוקבים</h2>
        {loading ? (
          <div className="text-center">טוען...</div>
        ) : reports.length === 0 ? (
          <div className="text-center">אין נתונים להצגה</div>
        ) : (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        )}
      </Container>
    </>
  );
};

export default AdminReports;

