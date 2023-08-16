import { defineConfig } from "cypress";
export default defineConfig({
  video: false,
  watchForFileChanges: false,
  e2e: {
    experimentalRunAllSpecs: true,
    baseUrl: 'https://mggp.pythonanywhere.com/'
  },
});
