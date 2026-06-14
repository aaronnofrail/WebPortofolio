import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemas";

export default defineConfig({
  name: "default",
  title: "Aaron Retro Portfolio Studio",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "y2wq5bs3",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",

  basePath: "/studio",

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
});
