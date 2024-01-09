import React from "react";
import EventList from '../components/EventList';
import CreateEvent from "../components/CreateEvent";
import JoinedEvents from '../components/JoinedEvents';
import JoinEvent from '../components/JoinEvent';
import { useEvent } from "../context/EventContext";

const Home = () => {
  const { state } = useEvent();
  const { isAuthenticated } = state;
  
  return (
    <>
      {isAuthenticated && <EventList />}
      {isAuthenticated && <CreateEvent />}
      {isAuthenticated && <JoinedEvents />}
      {isAuthenticated && <JoinEvent />}
    </>
  );
};

export default Home;
