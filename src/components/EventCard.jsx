import { useState } from "react";
import { Button, Card, Col, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import EventForm from "./EventForm";
import eventImg from "../assets/images/event1.avif";
import { useEvent } from "../context/EventContext";
import { describeApiError } from "../services/errors";
import { toast } from "../services/toast";

const EventCard = ({ event, collection }) => {
  const navigate = useNavigate();
  const { dispatch } = useEvent();
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [joinModal, setJoinModal] = useState(false);
  const [pending, setPending] = useState(false);

  const isMine = collection === "mine";
  const canJoin = collection === "joinable";

  const reportFailure = (error) => {
    if (!error.sessionExpired) toast.error(describeApiError(error), "Error");
  };

  const showJoinModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setJoinModal(true);
  };

  const showDeleteModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteModal(true);
  };

  const handleCardClick = () => {
    if (isMine) {
      setShowModal(true);
    } else {
      navigate(`/events/${event.id}`);
    }
  };

  const handleDelete = async () => {
    setPending(true);
    try {
      await api.delete(`/api/v1/events/${event.id}`);
      setDeleteModal(false);
      dispatch({ type: "REMOVED", key: "mine", id: event.id });
      toast.success("Event deleted.", "Success");
    } catch (error) {
      setPending(false);
      setDeleteModal(false);
      reportFailure(error);
    }
  };

  const handleJoin = async () => {
    setPending(true);
    try {
      await api.post("/api/v1/events/add_user_to_events", null, {
        params: { event_id: event.id },
      });
      setJoinModal(false);
      dispatch({ type: "REMOVED", key: "joinable", id: event.id });
      dispatch({ type: "ADDED", key: "joined", event });
      toast.success("You have joined this event.", "Success");
    } catch (error) {
      setPending(false);
      setJoinModal(false);
      reportFailure(error);
    }
  };

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EventForm onClose={() => setShowModal(false)} event={event} />
        </Modal.Body>
      </Modal>
      <Modal show={deleteModal} onHide={() => setDeleteModal(false)}>
        <Modal.Header>
          <Modal.Title>Delete this event permanently?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-end">
          <Button className="b-1 border-secondary text-secondary me-3" variant="light" onClick={() => setDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} disabled={pending}>Delete</Button>
        </Modal.Body>
      </Modal>
      <Modal show={joinModal} onHide={() => setJoinModal(false)}>
        <Modal.Header>
          <Modal.Title>Join this event?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-end">
          <Button className="b-1 border-secondary text-secondary me-3" variant="light" onClick={() => setJoinModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleJoin} disabled={pending}>Join</Button>
        </Modal.Body>
      </Modal>
      <Col xs={12} sm={6} md={4} lg={3} className="mt-4">
        <Card className="w-100 position-relative h-100" onClick={handleCardClick}>
          {
            isMine && (
              <div className="delete-event" onClick={showDeleteModal}>
                +
              </div>
            )
          }
          <Card.Img variant="top" src={eventImg} />
          <Card.Body>
            <Card.Title>{event.name}</Card.Title>
            <Card.Text>{event.description}</Card.Text>
          {
            canJoin && (
              <button className="btn btn-large btn-warning w-100 mt-auto" onClick={showJoinModal}>
                Join
              </button>
            )
          }
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

export default EventCard;
