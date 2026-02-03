import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Navbar, Nav, Button, Card, Row, Col, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { fetchVacations, createVacation, updateVacation, deleteVacation, updateVacationInState, removeVacation } from '../../store/slices/vacationSlice';
import { logout } from '../../store/slices/authSlice';
import { AppDispatch, RootState } from '../../store/store';
import { Vacation } from '../../store/slices/vacationSlice';
import { vacationService } from '../../services/vacationService';
import { socketService } from '../../services/socketService';
import './AdminVacations.css';

const AdminVacations: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { vacations, loading } = useSelector((state: RootState) => state.vacations);
  const { user } = useSelector((state: RootState) => state.auth);

  const [showModal, setShowModal] = useState(false);
  const [editingVacation, setEditingVacation] = useState<Vacation | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    destination: '',
    start_date: '',
    end_date: '',
    price: '',
    image: null as File | null,
    imageUrl: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    dispatch(fetchVacations());

    // Set up socket listeners for real-time updates
    socketService.onVacationUpdated((vacation: Vacation) => {
      dispatch(updateVacationInState(vacation));
    });

    socketService.onVacationDeleted((vacationId: number) => {
      dispatch(removeVacation(vacationId));
    });

    return () => {
      socketService.disconnect();
    };
  }, [dispatch]);

  const handleShowModal = (vacation?: Vacation) => {
    if (vacation) {
      setEditingVacation(vacation);
      setFormData({
        description: vacation.description,
        destination: vacation.destination,
        start_date: vacation.start_date.split('T')[0],
        end_date: vacation.end_date.split('T')[0],
        price: vacation.price.toString(),
        image: null,
        imageUrl: vacation.image || '',
      });
    } else {
      setEditingVacation(null);
      setFormData({
        description: '',
        destination: '',
        start_date: '',
        end_date: '',
        price: '',
        image: null,
        imageUrl: '',
      });
    }
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVacation(null);
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        image: e.target.files[0],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      let imagePath = formData.imageUrl;

      // Upload image if new one is selected
      if (formData.image) {
        const uploadResult = await vacationService.uploadImage(formData.image);
        imagePath = uploadResult.path;
      }

      const vacationData = {
        description: formData.description,
        destination: formData.destination,
        start_date: formData.start_date,
        end_date: formData.end_date,
        price: parseFloat(formData.price),
        image: imagePath,
      };

      if (editingVacation) {
        await dispatch(updateVacation({ id: editingVacation.id, data: vacationData })).unwrap();
      } else {
        await dispatch(createVacation(vacationData)).unwrap();
      }

      handleCloseModal();
      dispatch(fetchVacations());
    } catch (err: any) {
      setError(err || 'שגיאה בשמירה');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את החופשה?')) {
      try {
        await dispatch(deleteVacation(id)).unwrap();
      } catch (err: any) {
        alert(err || 'שגיאה במחיקה');
      }
    }
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
          <Navbar.Brand>ניהול חופשות - אדמין</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/admin/reports" className="text-light">
              דוחות
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>חופשות</h2>
          <Button variant="primary" onClick={() => handleShowModal()}>
            הוסף חופשה
          </Button>
        </div>

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
                    <div className="admin-actions">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleShowModal(vacation)}
                      >
                        ✏️ ערוך
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(vacation.id)}
                      >
                        🗑️ מחק
                      </Button>
                    </div>
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

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingVacation ? 'ערוך חופשה' : 'הוסף חופשה'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>יעד</Form.Label>
              <Form.Control
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>תיאור</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>תאריך התחלה</Form.Label>
              <Form.Control
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>תאריך סיום</Form.Label>
              <Form.Control
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>מחיר</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>תמונה</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {formData.imageUrl && !formData.image && (
                <div className="mt-2">
                  <small>תמונה נוכחית:</small>
                  <img
                    src={`http://localhost:3001${formData.imageUrl}`}
                    alt="Current"
                    style={{ maxWidth: '200px', display: 'block', marginTop: '5px' }}
                  />
                </div>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              ביטול
            </Button>
            <Button variant="primary" type="submit">
              {editingVacation ? 'עדכן' : 'שמור'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AdminVacations;

