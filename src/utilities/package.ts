import packageJson from "../../package.json";
import { container } from "@sapphire/pieces";

container.package = packageJson;

export { packageJson };

declare module "@sapphire/pieces" {
  interface Container {
    package: typeof packageJson;
  }
}
