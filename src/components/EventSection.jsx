import { Alert, Button, Container, Row, Spinner } from "react-bootstrap";
import { useEventCollection } from "../hooks/useEventCollection";
import EventCard from "./EventCard";
import { EventHeading } from "./EventHeading";

const EventSection = ({ collection, title, emptyMessage, className }) => {
  const { events, status, error, retry, loadMore, hasMore } = useEventCollection(collection);
  const headingId = `${collection}-heading`;
  const loading = status === "loading";

  return (
    <section className={`${className} py-5`} aria-labelledby={headingId} aria-busy={loading}>
      <Container>
        <EventHeading id={headingId}>{title}</EventHeading>

        {status === "error" && (
          <Alert variant="danger" className="d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <Button variant="outline-danger" size="sm" onClick={retry}>
              Try again
            </Button>
          </Alert>
        )}

        {status === "ready" && events.length === 0 && (
          <p className="text-center mt-4 fs-5">{emptyMessage}</p>
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
