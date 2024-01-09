import { describe, expect, it } from "vitest";
import { describeApiError } from "./errors";

const withBody = (status, data) => ({ response: { status, data } });

describe("describeApiError", () => {
  it("joins the messages of an {errors: []} envelope", () => {
    expect(describeApiError(withBody(429, { errors: ["Too many attempts."] }))).toBe(
      "Too many attempts."
    );
  });

  it("names each field of a validation failure", () => {
    const error = withBody(422, {
      attributes_errors: { name: ["can't be blank"], date: ["is invalid"] },
    });
    expect(describeApiError(error)).toBe("Name can't be blank. Date is invalid");
  });

  it("reads Devise's array-valued status from /signup", () => {
    expect(describeApiError(withBody(422, { status: ["Email has already been taken"] }))).toBe(
      "Email has already been taken"
    );
  });

  it("explains a request that never reached the server", () => {
    expect(describeApiError({ request: {} })).toMatch(/could not be reached/);
  });

  it("falls back when the body has no known shape", () => {
    expect(describeApiError(withBody(500, "<html>"), "Nope.")).toBe("Nope.");
  });
});
