import { useState } from "react";
import { Button, Col, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../services/api";
import EventForm from "./EventForm";
import { useEvent } from "../context/EventContext";
import { describeApiError } from "../services/errors";
import { toast } from "../services/toast";
import { formatLongDate, formatTime, stubParts } from "../utils/dates";

const EventCard = ({ event, collection }) => {
  const { dispatch } = useEvent();
  const [showModal, setShowModal] = useState(false);
  const [startEditing, setStartEditing] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [joinModal, setJoinModal] = useState(false);
  const [pending, setPending] = useState(false);

  const isMine = collection === "mine";
  const canJoin = collection === "joinable";
  const { month, day } = stubParts(event.date);

  const openForm = (editing) => {
    setStartEditing(editing);
    setShowModal(true);
  };

  const reportFailure = (error) => {
    if (!error.sessionExpired) toast.error(describeApiError(error), "Error");
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
          <Modal.Title>Your event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EventForm onClose={() => setShowModal(false)} event={event} startEditing={startEditing} />
        </Modal.Body>
      </Modal>
      <Modal show={deleteModal} onHide={() => setDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete this event?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>{event.name}</strong> will be removed for everyone who joined it. This cannot be
            undone.
          </p>
          <div className="text-end">
            <Button variant="outline-dark" className="me-2" onClick={() => setDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={pending}>
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={joinModal} onHide={() => setJoinModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Join this event?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>{event.name}</strong>, {formatLongDate(event.date)} at {event.location}.
          </p>
          <div className="text-end">
            <Button variant="outline-dark" className="me-2" onClick={() => setJoinModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleJoin} disabled={pending}>
              Join
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <Col xs={12} md={6} xl={4} className="mt-4">
        <article className={`event-card event-card--${collection}`}>
          <div className="event-card__stub" aria-hidden="true">
            <span className="event-card__month">{month}</span>
            <span className="event-card__day">{day}</span>
          </div>
          <div className="event-card__body">
            <h3 className="event-card__title">
              {isMine ? (
                <button type="button" className="event-card__link" onClick={() => openForm(false)}>
                  {event.name}
                </button>
              ) : (
                <Link className="event-card__link" to={`/events/${event.id}`}>
                  {event.name}
                </Link>
              )}
            </h3>
            <p className="event-card__meta">
              <time dateTime={event.date}>
                {formatLongDate(event.date)}, {formatTime(event.date)}
              </time>
              <br />
              {event.location}
            </p>
            <p className="event-card__desc">{event.description}</p>
            {(isMine || canJoin) && (
              <div className="event-card__actions">
                {isMine && (
                  <Button
                    variant="outline-dark"
                    size="sm"
                    aria-label={`Edit ${event.name}`}
                    onClick={() => openForm(true)}
                  >
                    Edit
                  </Button>
                )}
                {isMine && (
                  <Button
                    variant="link"
                    size="sm"
                    className="btn-delete"
                    aria-label={`Delete ${event.name}`}
                    onClick={() => setDeleteModal(true)}
                  >
                    Delete
                  </Button>
                )}
                {canJoin && (
                  <Button
                    variant="primary"
                    size="sm"
                    aria-label={`Join ${event.name}`}
                    onClick={() => setJoinModal(true)}
                  >
                    Join
                  </Button>
                )}
              </div>
            )}
          </div>
        </article>
      </Col>
    </>
  );
};

export default EventCard;
