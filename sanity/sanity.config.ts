import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { sanityEnv } from "./env";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
  name: "default",
  title: "Sean E Bones Studio",
  projectId: sanityEnv.projectId as string,
  dataset: (sanityEnv.dataset ?? "production") as string,
  schema: {
    types: schemaTypes,
  },
  plugins: [structureTool(), visionTool()],
});
