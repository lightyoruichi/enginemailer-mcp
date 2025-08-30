#!/usr/bin/env node
import { run } from "./index.js";

const arg = process.argv[2];
if (arg === "--version") {
  console.log("0.1.2");
  process.exit(0);
}
if (arg === "--help") {
  console.log("Usage: enginemailer-mcp [--help] [--version] [--health]");
  console.log("");
  console.log("Enginemailer MCP server for sending emails and managing campaigns");
  console.log("");
  console.log("Environment variables:");
  console.log("  ENGINEMAILER_API_KEY    Your Enginemailer API key (required)");
  console.log("  ENGINEMAILER_API_BASE   API base URL (default: https://api.enginemailer.com/restapi)");
  console.log("  ENGINEMAILER_HOST       API host (default: https://api.enginemailer.com)");
  console.log("");
  console.log("Examples:");
  console.log("  npx @lightyoruichi/enginemailer-mcp");
  console.log("  ENGINEMAILER_API_KEY=sk_... npx @lightyoruichi/enginemailer-mcp");
  process.exit(0);
}
if (arg === "--health") {
  console.log("ok");
  process.exit(0);
}

run().catch((err) => {
  console.error(err instanceof Error ? err.stack || err.message : err);
  process.exit(1);
});
