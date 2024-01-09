import React, { useState } from "react";
import { Button, Card, Col, Modal } from "react-bootstrap";
import axios from "../services/api";
import EventForm from './EventForm';
import eventImg from "../assets/images/event1.avif";
import { useEvent } from "../context/EventContext";
import { NotificationManager } from "react-notifications";

const EventCard = ({ event, isMine=false, isJoined=false, actionType, events }) => {
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [joinModal, setJoinModal] = useState(false);

  const { state: { joinedEvents }, dispatch } = useEvent();

  const handleEditEvent = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
      handleEditEvent();
    } else {
      window.location.href = `/events/${event.id}`;
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      await axios.delete(`/api/v1/events/${event.id}`);
      dispatch({ type: actionType, payload: events.filter((ev) => ev.id !== event.id) });
      NotificationManager.success("Event Deleted successfully", "Success");
    } catch (error) {
      NotificationManager.error("Something went wrong!", "Error");
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`/api/v1/events/add_user_to_events?event_id=${event.id}`);
      dispatch({ type: actionType, payload: events.filter((ev) => ev.id !== event.id) });
      dispatch({ type: "JOINED_EVENTS", payload: [...joinedEvents, event] })
      setJoinModal(false);
      NotificationManager.success("Event joined successfully", "Success");
    } catch (error) {
      NotificationManager.error("Something went wrong!", "Error");
    }
  };

  return (
    <>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EventForm onClose={handleCloseModal} event={event} />
        </Modal.Body>
      </Modal>
      <Modal show={deleteModal} onHide={() => setDeleteModal(false)}>
        <Modal.Header>
          <Modal.Title>Are you sure to delete this event permanently?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-end">
          <Button className="b-1 border-secondary text-secondary me-3" variant="light" onClick={() => setDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Body>
      </Modal>
      <Modal show={joinModal} onHide={() => setJoinModal(false)}>
        <Modal.Header>
          <Modal.Title>Are you sure to Join this event?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-end">
          <Button className="b-1 border-secondary text-secondary me-3" variant="light" onClick={() => setJoinModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={(e) => handleJoin(e)}>Join</Button>
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
            !isMine && !isJoined && (
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
