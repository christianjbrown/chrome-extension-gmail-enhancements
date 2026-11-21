import { WindowTimer } from "../src/window-timer";

describe("WindowTimer", () => {
  it("resolves once the clock has waited that long", async () => {
    const setTimeout = vi.fn((resolve: () => void) => {
      resolve();
      return 0;
    });

    await new WindowTimer({ setTimeout }).delay(250);

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 250);
  });
});
