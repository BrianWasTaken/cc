import { getRootData } from "@sapphire/pieces";
import { join } from "node:path";

export const RootPath = getRootData().root;

export const SourcePath = join(RootPath, "src");

export const PiecesPath = join(SourcePath, "content");

export const Paths = {
  root: RootPath,
  source: SourcePath,
  pieces: PiecesPath,
};
