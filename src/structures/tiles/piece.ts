import type { ButtonComponentBuilder } from "#bot/utilities/builders";
import { Piece } from "@sapphire/framework";
import type { Awaitable } from "discord.js";

/**
 * Represents the registered tiles' identifiers.
 */
export type TileIdentifier = keyof TileEntries;

/**
 * Represents the registered tile entries.
 * Augment this interface to add key (string identifiers) to value (never) pairs.
 */
export interface TileEntries {}

export interface TileOptions<Id extends TileIdentifier> extends Piece.Options {
  /**
   * The unique identifier.
   */
  id: Id;
}

export abstract class Tile<Id extends TileIdentifier> extends Piece<
  TileOptions<Id>
> {
  /**
   * The unique identifier.
   */
  public get id(): Id {
    return this.options.id;
  }

  /**
   * Styles the tile's cell on a grid.
   * @param builder The component builder.
   * @param revealed The reveal state.
   */
  public abstract style(
    builder: ButtonComponentBuilder,
    revealed: boolean,
  ): ButtonComponentBuilder;

  /**
   * Runs when this tile is clicked.
   * @param ctx The context object.
   */
  public abstract trigger(ctx: unknown): Awaitable<unknown>;

  public reveal(ctx: unknown): Awaitable<unknown> {
    return ctx;
  }
}

export declare namespace Tile {
  type Options<Id extends TileIdentifier> = TileOptions<Id>;
  type Context = Piece.Context;
  type JSON = Piece.JSON;
  type LocationJSON = Piece.LocationJSON;
}
