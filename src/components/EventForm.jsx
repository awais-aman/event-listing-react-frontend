import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { BsCalendarEvent, BsGeoAlt, BsTag, BsTextParagraph } from "react-icons/bs";
import api from "../services/api";
import { describeApiError } from "../services/errors";
import { toast } from "../services/toast";
import { useEvent } from "../context/EventContext";
import { nextFullHour, toLocalInput } from "../utils/dates";

const blankEvent = { name: "", description: "", location: "" };

const EventForm = ({ onClose, event = blankEvent, startEditing = false }) => {
  const { dispatch } = useEvent();
  const isEdit = Boolean(event.id);

  const [fields, setFields] = useState({
    name: event.name,
    description: event.description,
    date: toLocalInput(event.date ?? nextFullHour()),
    location: event.location,
  });
  const [canEdit, setCanEdit] = useState(!isEdit || startEditing);
  const [submitting, setSubmitting] = useState(false);
  const readOnly = !canEdit;

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleCancelEdit = () => {
    setFields({
      name: event.name,
      description: event.description,
      date: toLocalInput(event.date),
      location: event.location,
    });
    setCanEdit(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { event: { ...fields, date: new Date(fields.date).toISOString() } };

    setSubmitting(true);
    try {
      if (isEdit) {
        const response = await api.patch(`/api/v1/events/${event.id}`, payload);
        dispatch({ type: "UPDATED", key: "mine", event: response.data });
      } else {
        const response = await api.post("/api/v1/events", payload);
        dispatch({ type: "ADDED", key: "mine", event: response.data });
      }
      toast.success(`Event ${isEdit ? "updated" : "created"}.`, "Success");
      onClose();
    } catch (error) {
      setSubmitting(false);
      if (!error.sessionExpired) toast.error(describeApiError(error), "Could not save the event");
    }
  };

  return (
    <Form className="event-form" onSubmit={handleSubmit}>
      <Row className="mb-3 gy-3">
        <Col md={6}>
          <Form.Group controlId="formName">
            <Form.Label>
              <BsTag aria-hidden="true" />
              Event name
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={fields.name}
              onChange={handleChange}
              placeholder="Riverside book swap"
              disabled={readOnly}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="formDate">
            <Form.Label>
              <BsCalendarEvent aria-hidden="true" />
              Date and time
            </Form.Label>
            <Form.Control
              type="datetime-local"
              name="date"
              value={fields.date}
              onChange={handleChange}
              disabled={readOnly}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group controlId="formDescription" className="mb-3">
        <Form.Label>
          <BsTextParagraph aria-hidden="true" />
          Description
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          value={fields.description}
          onChange={handleChange}
          placeholder="What should people expect?"
          disabled={readOnly}
          required
        />
      </Form.Group>

      <Form.Group controlId="formLocation" className="mb-4">
        <Form.Label>
          <BsGeoAlt aria-hidden="true" />
          Location
        </Form.Label>
        <Form.Control
          type="text"
          name="location"
          value={fields.location}
          onChange={handleChange}
          placeholder="Venue or address"
          disabled={readOnly}
          required
        />
      </Form.Group>

      <div className="d-flex justify-content-end gap-2">
        {isEdit &&
          (canEdit ? (
            <Button variant="outline-dark" onClick={handleCancelEdit}>
              Cancel
            </Button>
          ) : (
            <Button variant="primary" onClick={() => setCanEdit(true)}>
              Edit
            </Button>
          ))}
        {canEdit && (
          <Button variant="primary" type="submit" disabled={submitting}>
            {isEdit ? "Update" : "Create"} Event
          </Button>
        )}
      </div>
    </Form>
  );
};

export default EventForm;
