import { defineConfig } from "vitest/config";

import { defineVitestProject } from "@nuxt/test-utils/config";

export default defineConfig({
  test: {
    projects: [
      {
        // unit tests "pures" (stores, services, utils)
        name: "unit",
        include: ["tests/unit/**/*.spec.{ts,js}"],
        environment: "node",
      },
      // tests if needed runtime Nuxt (pages, composables)
      await defineVitestProject({
        test: {
          name: "nuxt",
          include: ["tests/nuxt/**/*.spec.{ts,js}"],
          environment: "nuxt",
        },
      }),
    ],
  },
});
