import { Store } from "@sapphire/framework";
import { Tile, type TileIdentifier } from "./piece.js";

export class TileStore extends Store<Tile<TileIdentifier>> {
  public constructor() {
    super(Tile, { name: "tiles" });
  }
}

export declare interface TileStore {
  get<Id extends TileIdentifier>(id: Id): Tile<Id>;
  get(id: string): undefined;
}

declare module "@sapphire/pieces" {
  interface StoreRegistryEntries {
    tiles: TileStore;
  }
}
