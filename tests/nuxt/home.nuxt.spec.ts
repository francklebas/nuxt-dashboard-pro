import { describe, it, expect } from "vitest";

import { mountSuspended } from "@nuxt/test-utils/runtime";

import Home from "~/app/pages/index.vue";

describe("Home page", () => {
  it("renders", async () => {
    const component = await mountSuspended(Home);
    expect(component.html()).toContain("Dashboard"); // adapte à ton contenu
  });
});
