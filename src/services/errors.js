const GENERIC = "Something went wrong. Please try again.";

const humanize = (field) =>
  field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, " ");

// Turns the API's error envelopes ({errors: []}, {attributes_errors: {}} and
// Devise's {status: []}) into one sentence fit for a toast or inline alert.
export const describeApiError = (error, fallback = GENERIC) => {
  const response = error?.response;
  if (!response) {
    return "The server could not be reached. Check your connection and try again.";
  }

  const data = response.data;
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.join(" ");
  }
  if (data?.attributes_errors && typeof data.attributes_errors === "object") {
    return Object.entries(data.attributes_errors)
      .map(([field, messages]) => `${humanize(field)} ${[].concat(messages).join(", ")}`)
      .join(". ");
  }
  if (Array.isArray(data?.status) && data.status.length > 0) {
    return data.status.join(". ");
  }
  return fallback;
};
