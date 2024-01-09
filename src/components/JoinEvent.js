import React, { useEffect, useState } from "react";
import { Row, Container } from "react-bootstrap";
import axios from "../services/api";
import EventCard from "./EventCard";
import { useEvent } from "../context/EventContext";
import { NotificationManager } from "react-notifications";

const JoinEvent = () => {
  const { state: { joinEvents }, dispatch } = useEvent();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (joinEvents) setEvents(joinEvents);
  }, [joinEvents]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/api/v1/events/get_events");
        dispatch({ type: "JOIN_EVENTS", payload: response.data });
      } catch (error) {
        NotificationManager.error("Something went wrong!", "Error");
      }
    };

    fetchEvents();
  }, [dispatch]);

  return (
    <div className="join-event-container py-5">
      <Container>
        <h2 className="w-100 text-center fw-bolder">Join Upcoming Events</h2>
        <Row>
          {
            events.length > 0 ? (
              events.map((event) => (
                <EventCard key={event.id} event={event} actionType="JOIN_EVENTS" events={events} />
              ))
            ) : (
              <h4 className="text-center mt-4">There is no upcoming event.</h4>
            )
          }
        </Row>
      </Container>
    </div>
  );
};

export default JoinEvent;
