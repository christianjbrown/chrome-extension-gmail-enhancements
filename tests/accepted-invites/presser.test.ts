import { MousePresser } from "../../src/accepted-invites/presser";

describe("MousePresser", () => {
  it("sends the control a whole mouse press, in order", () => {
    const control = document.createElement("div");
    const seen: string[] = [];
    for (const type of ["mousedown", "mouseup", "click"])
      control.addEventListener(type, (event) => seen.push(event.type));

    new MousePresser((type) => new MouseEvent(type)).press(control);

    expect(seen).toEqual(["mousedown", "mouseup", "click"]);
  });
});
