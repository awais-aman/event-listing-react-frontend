import CreateEvent from "../components/CreateEvent";
import EventSection from "../components/EventSection";

const Home = () => (
  <>
    <EventSection
      collection="mine"
      title="My Events"
      emptyMessage="You have not created any event. Create your first event."
      className="my-events-container"
    />
    <CreateEvent />
    <EventSection
      collection="joined"
      title="Joined Events"
      emptyMessage="You have not joined any event yet."
      className="joined-events-container"
    />
    <EventSection
      collection="joinable"
      title="Join Upcoming Events"
      emptyMessage="There is no upcoming event."
      className="join-event-container"
    />
  </>
);

export default Home;
