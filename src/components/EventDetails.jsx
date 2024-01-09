import { useEffect, useState } from "react";
import { Alert, Button, Container, Spinner } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faAlignLeft,
} from "@fortawesome/free-solid-svg-icons";
import api from "../services/api";
import { describeApiError } from "../services/errors";

const EventDetailsContainer = styled.div`
  background: linear-gradient(to right, #3494e6, #ec6ead);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  color: #fff;
  text-align: center;
  padding: 40px 0px;
  width: 100%;
  display: flex;
`;

const EventTitle = styled.h2`
  font-size: 32px;
  margin-bottom: 20px;
`;

const EventDescription = styled.p`
  font-size: 18px;
  margin-bottom: 15px;
  line-height: 1.5;
`;

const EventDetail = styled.p`
  font-size: 20px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Icon = styled.span`
  margin-right: 10px;
`;

const EventDetails = () => {
  const { id } = useParams();
  const [result, setResult] = useState({ id: null, event: null, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    api
      .get(`/api/v1/events/${id}`)
      .then((response) => active && setResult({ id, event: response.data, error: null }))
      .catch((error) => {
        if (!active || error.sessionExpired) return;
        const notFound = error.response?.status === 404;
        setResult({ id, event: null, error: notFound ? "notFound" : describeApiError(error) });
      });
    return () => {
      active = false;
    };
  }, [id, attempt]);

  const loading = result.id !== id || (!result.event && !result.error);
  const { event, error } = result;

  const retry = () => {
    setResult({ id: null, event: null, error: null });
    setAttempt((n) => n + 1);
  };

  return (
    <EventDetailsContainer>
      <Container className="my-auto">
        {loading ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading event</span>
          </Spinner>
        ) : event ? (
          <>
            <EventTitle>{event.name}</EventTitle>
            <EventDescription>
              <Icon>
                <FontAwesomeIcon icon={faAlignLeft} />
              </Icon>
              {event.description}
            </EventDescription>
            <EventDetail>
              <Icon>
                <FontAwesomeIcon icon={faCalendarAlt} />
              </Icon>
              {new Date(event.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </EventDetail>
            <EventDetail>
              <Icon>
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </Icon>
              {event.location}
            </EventDetail>
          </>
        ) : error === "notFound" ? (
          <p>Event not found</p>
        ) : (
          <Alert variant="light">
            <p>{error}</p>
            <Button variant="outline-dark" size="sm" onClick={retry}>
              Try again
            </Button>
          </Alert>
        )}
        <p className="mt-4">
          <Link to="/" className="text-white">
            Back to events
          </Link>
        </p>
      </Container>
    </EventDetailsContainer>
  );
};

export default EventDetails;
