import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      components: "/src/components",
      assets: "/src/assets",
      layouts: "/src/layouts",
      main: "/src/main",
      pages: "/src/pages",
      services: "/src/services",
      utils: "/src/utils",
      configs: "/src/configs",
      features: "/src/features",
      hooks: "/src/hooks",
      store: "/src/store",
    },
  },
});
