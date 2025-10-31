import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve} from "path"


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    base: env.VITE_BASE || "/",
    plugins: [react()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./"),
      },
    },
  };
});
