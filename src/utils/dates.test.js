import { describe, expect, it } from "vitest";
import { stubParts, toLocalInput } from "./dates";

describe("date helpers", () => {
  it("formats a date for a datetime-local input in local time", () => {
    const local = new Date(2027, 2, 4, 7, 5);
    expect(toLocalInput(local)).toBe("2027-03-04T07:05");
  });

  it("round-trips through the input format", () => {
    const local = new Date(2027, 10, 30, 18, 30);
    expect(new Date(toLocalInput(local)).getTime()).toBe(local.getTime());
  });

  it("splits a date into the card's month and day", () => {
    expect(stubParts(new Date(2027, 3, 17, 9).toISOString())).toEqual({ month: "Apr", day: 17 });
  });
});
