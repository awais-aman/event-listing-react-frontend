import React, { useEffect, useState } from "react";
import { Row, Container } from "react-bootstrap";
import axios from "../services/api";
import EventCard from "./EventCard";
import { EventHeading } from "./EventHeading";
import { useEvent } from "../context/EventContext";
import { NotificationManager } from "react-notifications";

const EventList = () => {
  const { state: { myEvents }, dispatch } = useEvent();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (myEvents) setEvents(myEvents);
  }, [myEvents]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/api/v1/events");
        if (response.data) {
          dispatch({ type: "MY_EVENTS", payload: response.data });
        }
      } catch (error) {
        NotificationManager.error("Something went wrong!", "Error");
      }
    };

    fetchEvents();
  }, [dispatch]);

  return (
    <Container className="my-events-container py-5">
      <EventHeading>My Events</EventHeading>
      <Row>
        {
          events.length > 0 ? (
            events.map((event) => (
              <EventCard key={event.id} event={event} isMine={true} actionType="MY_EVENTS" events={events} />
            ))
          ) : (
            <h4 className="text-center mt-4">You have not created any event. Create your first event.</h4>
          )
        }
      </Row>
    </Container>
  );
};

export default EventList;
