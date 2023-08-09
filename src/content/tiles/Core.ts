import { Tile } from "#bot/structures/tiles/piece.js";
import type { ButtonComponentBuilder } from "#bot/utilities/builders";
import { ApplyOptions } from "@sapphire/decorators";
import { ButtonStyle } from "discord.js";

const enum CoreTileType {
  Fatal = "fatal",
  Lucky = "lucky",
  Neutral = "neutral",
}

@ApplyOptions<Tile.Options<CoreTileType.Fatal>>({
  id: CoreTileType.Fatal,
  name: CoreTileType.Fatal,
})
export class CoreFatalTile extends Tile<CoreTileType.Fatal> {
  public style(builder: ButtonComponentBuilder, revealed: boolean) {
    return builder.setStyle(
      revealed ? ButtonStyle.Danger : ButtonStyle.Secondary,
    );
  }

  public trigger(ctx: unknown) {
    return ctx;
  }
}

@ApplyOptions<Tile.Options<CoreTileType.Lucky>>({
  id: CoreTileType.Lucky,
  name: CoreTileType.Lucky,
})
export class CoreLuckyTile extends Tile<CoreTileType.Lucky> {
  public style(builder: ButtonComponentBuilder, revealed: boolean) {
    return builder.setStyle(
      revealed ? ButtonStyle.Danger : ButtonStyle.Secondary,
    );
  }

  public trigger(ctx: unknown) {
    return ctx;
  }
}

@ApplyOptions<Tile.Options<CoreTileType.Neutral>>({
  id: CoreTileType.Neutral,
  name: CoreTileType.Neutral,
})
export class CoreNeutralTile extends Tile<CoreTileType.Neutral> {
  public style(builder: ButtonComponentBuilder, revealed: boolean) {
    return builder.setStyle(
      revealed ? ButtonStyle.Primary : ButtonStyle.Secondary,
    );
  }

  public trigger(ctx: unknown) {
    return ctx;
  }
}

declare module "#bot/structures/tiles/Piece.js" {
  interface TileEntries {
    [CoreTileType.Fatal]: never;
    [CoreTileType.Neutral]: never;
    [CoreTileType.Lucky]: never;
  }
}
