import { useEffect, useState } from "react";
import { Alert, Button, Container, Spinner } from "react-bootstrap";
import { BsCalendarEvent, BsClock, BsGeoAlt } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { describeApiError } from "../services/errors";
import { formatLongDate, formatTime } from "../utils/dates";

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
    <div className="event-detail">
      <Container>
        <Link to="/">&larr; Back to events</Link>
        {loading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading event</span>
            </Spinner>
          </div>
        ) : event ? (
          <article className="event-detail__poster">
            <h1 className="event-detail__title">{event.name}</h1>
            <dl className="event-detail__facts">
              <dt>
                <BsCalendarEvent aria-hidden="true" /> Date
              </dt>
              <dd>{formatLongDate(event.date)}</dd>
              <dt>
                <BsClock aria-hidden="true" /> Time
              </dt>
              <dd>{formatTime(event.date)}</dd>
              <dt>
                <BsGeoAlt aria-hidden="true" /> Where
              </dt>
              <dd>{event.location}</dd>
            </dl>
            <p className="event-detail__description">{event.description}</p>
          </article>
        ) : error === "notFound" ? (
          <div className="event-detail__poster">
            <h1 className="event-detail__title">Event not found</h1>
            <p>It may have been deleted by its organiser.</p>
          </div>
        ) : (
          <Alert variant="danger" className="mt-4">
            <p>{error}</p>
            <Button variant="outline-danger" size="sm" onClick={retry}>
              Try again
            </Button>
          </Alert>
        )}
      </Container>
    </div>
  );
};

export default EventDetails;
