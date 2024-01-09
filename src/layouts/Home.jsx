import CreateEvent from "../components/CreateEvent";
import EventSection from "../components/EventSection";

const Home = () => (
  <>
    <EventSection
      collection="mine"
      title="My Events"
      emptyMessage="You have not created any event. Create your first event."
    />
    <CreateEvent />
    <EventSection
      collection="joined"
      title="Joined Events"
      emptyMessage="You have not joined any event yet."
    />
    <EventSection
      collection="joinable"
      title="Join Upcoming Events"
      emptyMessage="There is no upcoming event."
    />
  </>
);

export default Home;
