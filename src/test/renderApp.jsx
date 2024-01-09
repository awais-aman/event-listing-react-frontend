import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { EventProvider } from "../context/EventContext";

export const renderApp = (path = "/") => {
  const user = userEvent.setup();
  const view = render(
    <EventProvider>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </EventProvider>
  );
  return { user, ...view };
};
