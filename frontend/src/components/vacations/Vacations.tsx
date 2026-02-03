import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Button, Card, Row, Col, Badge } from 'react-bootstrap';
import { fetchVacations, followVacation, unfollowVacation, updateVacationInState, removeVacation } from '../../store/slices/vacationSlice';
import { logout } from '../../store/slices/authSlice';
import { AppDispatch, RootState } from '../../store/store';
import { Vacation } from '../../store/slices/vacationSlice';
import { socketService } from '../../services/socketService';
import './Vacations.css';

const Vacations: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { vacations, loading } = useSelector((state: RootState) => state.vacations);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchVacations());

    // Set up socket listeners
    socketService.onVacationUpdated((vacation: Vacation) => {
      dispatch(updateVacationInState(vacation));
    });

    socketService.onVacationDeleted((vacationId: number) => {
      dispatch(removeVacation(vacationId));
    });

    socketService.onVacationCreated((vacation: Vacation) => {
      dispatch(fetchVacations()); // Refresh list
    });

    return () => {
      socketService.disconnect();
    };
  }, [dispatch]);

  const handleFollow = async (vacationId: number) => {
    dispatch(followVacation(vacationId));
  };

  const handleUnfollow = async (vacationId: number) => {
    dispatch(unfollowVacation(vacationId));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(price);
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand>מערכת חופשות</Navbar.Brand>
          <Nav className="me-auto">
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
        {loading ? (
          <div className="text-center">טוען...</div>
        ) : (
          <Row>
            {vacations.map((vacation) => (
              <Col key={vacation.id} md={6} lg={4} className="mb-4">
                <Card>
                  {vacation.image && (
                    <Card.Img
                      variant="top"
                      src={`http://localhost:3001${vacation.image}`}
                      className="vacation-image"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image';
                      }}
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{vacation.destination}</Card.Title>
                    <Card.Text>{vacation.description}</Card.Text>
                    <div className="mb-2">
                      <Badge bg="info" className="me-2">
                        {formatDate(vacation.start_date)} - {formatDate(vacation.end_date)}
                      </Badge>
                      <Badge bg="success">{formatPrice(vacation.price)}</Badge>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">
                        עוקבים: {vacation.followers_count}
                      </small>
                    </div>
                    {vacation.is_following ? (
                      <Button
                        variant="danger"
                        className="w-100"
                        onClick={() => handleUnfollow(vacation.id)}
                      >
                        הסר מעקב
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        className="w-100"
                        onClick={() => handleFollow(vacation.id)}
                      >
                        עקוב אחרי
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
            {vacations.length === 0 && (
              <Col>
                <div className="text-center">אין חופשות זמינות</div>
              </Col>
            )}
          </Row>
        )}
      </Container>
    </>
  );
};

export default Vacations;

