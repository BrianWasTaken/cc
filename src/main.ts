import "@sapphire/plugin-hmr/register.js";
import "@sapphire/plugin-subcommands/register.js";
import "@sapphire/plugin-utilities-store/register.js";
import "#bot/utilities/package.js";

import { config } from "dotenv-cra";

process.env.NODE_ENV ??= "development";

void config();

import "./client.js";
