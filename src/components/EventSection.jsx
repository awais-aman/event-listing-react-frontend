import { Alert, Button, Container, Row, Spinner } from "react-bootstrap";
import { useEventCollection } from "../hooks/useEventCollection";
import EventCard from "./EventCard";

const EventSection = ({ collection, title, emptyMessage }) => {
  const { events, total, status, error, retry, loadMore, hasMore } =
    useEventCollection(collection);
  const headingId = `${collection}-heading`;
  const loading = status === "loading";

  return (
    <section
      className={`event-section event-section--${collection}`}
      aria-labelledby={headingId}
      aria-busy={loading}
    >
      <Container>
        <div className="section-header">
          <h2 id={headingId} className="section-title">
            {title}
          </h2>
          {total > 0 && (
            <span className="section-count">
              {total} {total === 1 ? "event" : "events"}
            </span>
          )}
        </div>

        {status === "error" && (
          <Alert variant="danger" className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-4">
            <span>{error}</span>
            <Button variant="outline-danger" size="sm" onClick={retry}>
              Try again
            </Button>
          </Alert>
        )}

        {status === "ready" && events.length === 0 && (
          <p className="empty-state">{emptyMessage}</p>
        )}

        {events.length > 0 && (
          <Row>
            {events.map((event) => (
              <EventCard key={event.id} event={event} collection={collection} />
            ))}
          </Row>
        )}

        {loading && (
          <div className="text-center mt-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading {title.toLowerCase()}</span>
            </Spinner>
          </div>
        )}

        {!loading && status !== "error" && hasMore && (
          <div className="text-center mt-4">
            <Button variant="outline-dark" onClick={loadMore}>
              Load more
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
};

export default EventSection;
