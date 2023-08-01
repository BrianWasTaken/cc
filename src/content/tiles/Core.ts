import {
  Tile,
  type TileContext,
  type TileState,
} from "#bot/structures/tile.js";
import { ButtonStyle, type ButtonBuilder } from "discord.js";

export class CoreFatalTile extends Tile<CoreTileType.Fatal> {
  public constructor(context: Tile.Context) {
    super(context, {
      name: CoreTileType.Fatal,
    });
  }

  public style(builder: ButtonBuilder, state: TileState) {
    return builder.setStyle(
      state.revealed ? ButtonStyle.Danger : ButtonStyle.Secondary,
    );
  }

  public trigger(ctx: TileContext<CoreTileType.Fatal>) {
    return ctx;
  }
}

export class CoreNeutralTile extends Tile<CoreTileType.Neutral> {
  public constructor(context: Tile.Context) {
    super(context, {
      name: CoreTileType.Neutral,
    });
  }

  public style(builder: ButtonBuilder, state: TileState) {
    return builder.setStyle(
      state.revealed ? ButtonStyle.Danger : ButtonStyle.Secondary,
    );
  }

  public trigger(ctx: TileContext<CoreTileType.Neutral>) {
    return ctx;
  }
}

export class CoreLuckyTile extends Tile<CoreTileType.Lucky> {
  public constructor(context: Tile.Context) {
    super(context, {
      name: CoreTileType.Lucky,
    });
  }

  public style(builder: ButtonBuilder, state: TileState) {
    return builder.setStyle(
      state.revealed ? ButtonStyle.Danger : ButtonStyle.Secondary,
    );
  }

  public trigger(ctx: TileContext<CoreTileType.Lucky>) {
    return ctx;
  }
}

const enum CoreTileType {
  Fatal = "fatal",
  Neutral = "neutral",
  Lucky = "lucky",
}

declare module "#bot/structures/tile.js" {
  export interface Tiles {
    [CoreTileType.Fatal]: never;
    [CoreTileType.Neutral]: never;
    [CoreTileType.Lucky]: never;
  }
}
