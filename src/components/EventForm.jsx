import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { BsCalendar, BsGeoAlt, BsPerson } from "react-icons/bs";
import DatePicker from "react-datepicker";
import api from "../services/api";
import styled from "styled-components";
import { describeApiError } from "../services/errors";
import { toast } from "../services/toast";
import { useEvent } from "../context/EventContext";
import "react-datepicker/dist/react-datepicker.css";

const StyledForm = styled(Form)`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
`;

const EventForm = ({
  onClose,
  event={
    name: "",
    description: "",
    date: new Date(),
    location: "",
  },
}) => {
  const { dispatch } = useEvent();
  const isEdit = !!event.id;

  const [formData, setFormData] = useState({
    event: {
      name: event.name,
      description: event.description,
      date: new Date(event.date),
      location: event.location,
    },
  });
  const [canEdit, setCanEdit] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      event: { ...formData.event, [e.target.name]: e.target.value },
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      event: { ...formData.event, date },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    try {
      if (isEdit) {
        const response = await api.patch(`/api/v1/events/${event.id}`, formData);
        dispatch({ type: "UPDATED", key: "mine", event: response.data });
      } else {
        const response = await api.post("/api/v1/events", formData);
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
    <StyledForm onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="formName">
            <Form.Label>
              <BsPerson className="mr-2" /> Event Name
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.event.name}
              onChange={handleChange}
              placeholder="Enter the event name"
              disabled={isEdit && !canEdit}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="formDate">
            <Form.Label>
              <BsCalendar className="mr-2" /> Date
            </Form.Label>
            <DatePicker
              selected={formData.event.date}
              onChange={handleDateChange}
              dateFormat="MMMM d, yyyy"
              className="form-control"
              disabled={isEdit && !canEdit}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group controlId="formDescription" className="mb-3">
        <Form.Label>
          <BsGeoAlt className="mr-2" /> Description
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          value={formData.event.description}
          onChange={handleChange}
          placeholder="Enter a brief description of the event"
          disabled={isEdit && !canEdit}
          required
        />
      </Form.Group>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="formLocation">
            <Form.Label>
              <BsGeoAlt className="mr-2" /> Location
            </Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.event.location}
              onChange={handleChange}
              placeholder="Enter the event location"
              disabled={isEdit && !canEdit}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="w-100 text-end">
        {
          isEdit && (
            canEdit ? (
              <Button variant="light" className="b-1 border-secondary text-secondary" onClick={() => setCanEdit(false)}>
                Cancel
              </Button>
            ) : (
              <Button variant="primary" onClick={() => setCanEdit(true)}>
                Edit
              </Button>
            )
          )
        }
        {
          (!isEdit || (isEdit && canEdit)) && (
            <Button variant="primary" type="submit" className="ms-3" disabled={submitting}>
              {isEdit ? "Update" : "Create"} Event
            </Button>
          )
        }
      </div>
    </StyledForm>
  );
};

export default EventForm;
