import { useState } from "react";
import { Button, Container, Modal } from "react-bootstrap";
import EventForm from "./EventForm";

const CreateEvent = () => {
  const [showModal, setShowModal] = useState(false);
  const close = () => setShowModal(false);

  return (
    <>
      <Modal show={showModal} onHide={close}>
        <Modal.Header closeButton>
          <Modal.Title>New event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EventForm onClose={close} />
        </Modal.Body>
      </Modal>
      <div className="create-banner">
        <Container className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h2>Planning something?</h2>
            <p>Post it here and other members can find it and join.</p>
          </div>
          <Button variant="primary" size="lg" onClick={() => setShowModal(true)}>
            Create an event
          </Button>
        </Container>
      </div>
    </>
  );
};

export default CreateEvent;
