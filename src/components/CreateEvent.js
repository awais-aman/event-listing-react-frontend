import React, { useState } from 'react';
import { Button, Container, Modal } from 'react-bootstrap';
import EventForm from './EventForm';

const CreateEvent = () => {
  const [showModal, setShowModal] = useState(false);

  const handleCreateEvent = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EventForm onClose={handleCloseModal} />
        </Modal.Body>
      </Modal>
      <div className="bg-dark text-white">
        <Container className="d-flex justify-content-between align-items-center p-5">
          <h3>
            Let's create a new event
          </h3>
          <Button className="b-1 border-white text-white" variant="transparent" onClick={handleCreateEvent}>
            Create an event
          </Button>
        </Container>
      </div>
    </>
  );
};

export default CreateEvent;
