import { Poller } from "../../src/reported-phishing/poller";

describe("Poller", () => {
  const timer = { delay: vi.fn(() => Promise.resolve()) };
  const schedule = { everyMs: 250, checks: 40 };

  it("returns what it finds as soon as it shows up", async () => {
    const find = vi
      .fn<() => string | undefined>()
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce("found");

    await expect(new Poller(timer, schedule).until(find)).resolves.toBe(
      "found",
    );
    expect(find).toHaveBeenCalledTimes(2);
    expect(timer.delay).toHaveBeenCalledWith(250);
  });

  it("gives up after ten seconds", async () => {
    const find = vi.fn(() => undefined);

    await expect(
      new Poller(timer, schedule).until(find),
    ).resolves.toBeUndefined();
    expect(find).toHaveBeenCalledTimes(40);
  });
});
