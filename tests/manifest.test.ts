import manifestJson from "../static/manifest.json";

interface Manifest {
  content_scripts: {
    matches: string[];
    run_at: string;
    all_frames?: boolean;
  }[];
}

const manifest: Manifest = manifestJson;

describe("manifest", () => {
  it("runs only on Gmail, from the start of the page", () => {
    expect(manifest.content_scripts).toEqual([
      {
        matches: ["https://mail.google.com/*"],
        js: ["content.js"],
        run_at: "document_start",
      },
    ]);
  });

  // The content script rewrites links in place, which needs no permission.
  // A declarativeNetRequest redirect on www.google.com/url would need host
  // access to google.com, and still could not decode the target.
  it("asks for no permissions or host access", () => {
    expect(manifestJson).not.toHaveProperty("permissions");
    expect(manifestJson).not.toHaveProperty("host_permissions");
    expect(manifestJson).not.toHaveProperty("optional_permissions");
    expect(manifestJson).not.toHaveProperty("declarative_net_request");
  });

  it("has no toolbar button, options page or keyboard shortcut", () => {
    expect(manifestJson).not.toHaveProperty("action");
    expect(manifestJson).not.toHaveProperty("options_page");
    expect(manifestJson).not.toHaveProperty("options_ui");
    expect(manifestJson).not.toHaveProperty("commands");
  });
});
