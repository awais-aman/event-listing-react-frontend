import { useEffect } from "react";
import { Row, Container } from "react-bootstrap";
import axios from "../services/api";
import EventCard from "./EventCard";
import { EventHeading } from "./EventHeading";
import { useEvent } from "../context/EventContext";
import { toast } from "../services/toast";

const JoinedEvents = () => {
  const { state: { joinedEvents: events }, dispatch } = useEvent();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/api/v1/events/joined_events");
        dispatch({ type: "JOINED_EVENTS", payload: response.data });
      } catch (error) {
        if (!error.sessionExpired) toast.error("Something went wrong!", "Error");
      }
    };

    fetchEvents();
  }, [dispatch]);

  return (
    <Container className="joined-events-container py-5">
      <EventHeading>Joined Events</EventHeading>
      <Row>
        {
          events.length > 0 ? (
            events.map((event) => (
              <EventCard key={event.id} event={event} isJoined={true} actionType="JOINED_EVENTS" />
            ))
          ) : (
            <h4 className="text-center mt-4">You have not joined any event yet.</h4>
          )
        }
      </Row>
    </Container>
  );
};

export default JoinedEvents;
