import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { BsCalendar, BsGeoAlt, BsPerson } from "react-icons/bs";
import DatePicker from "react-datepicker";
import axios from "../services/api";
import styled from "styled-components";
import { NotificationManager } from "react-notifications";
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
  const { state, dispatch } = useEvent();
  const events = state.myEvents || [];

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

    try {
      if (isEdit) {
        await axios.patch(`/api/v1/events/${event.id}`, formData);
        dispatch({ type: "MY_EVENTS", payload: events.map((ev) => {
          if (ev.id === event.id) {
            return { id: event.id, ...formData.event };
          } else {
            return ev;
          }
        })});
      } else {
        const response = await axios.post("/api/v1/events", formData);
        dispatch({ type: "MY_EVENTS", payload: [...events, response.data]});
      }
      NotificationManager.success(`Event is ${isEdit ? "updated" : "created"} successfully!`, "Success");
      onClose();
    } catch (error) {
      NotificationManager.error("Something went wrong!", "Error");
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
            <Button variant="primary" type="submit" className="ms-3">
              {isEdit ? "Update" : "Create"} Event
            </Button>
          )
        }
      </div>
    </StyledForm>
  );
};

export default EventForm;
