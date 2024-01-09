import EventList from "../components/EventList";
import CreateEvent from "../components/CreateEvent";
import JoinedEvents from "../components/JoinedEvents";
import JoinEvent from "../components/JoinEvent";

const Home = () => (
  <>
    <EventList />
    <CreateEvent />
    <JoinedEvents />
    <JoinEvent />
  </>
);

export default Home;
