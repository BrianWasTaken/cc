import type { Responder } from "#bot/utilities/responder";
import { Piece, Store } from "@sapphire/framework";
import { chunk, type Awaitable, isNullOrUndefined } from "@sapphire/utilities";
import { ButtonBuilder, ButtonInteraction } from "discord.js";

/**
 * Represents a tile.
 * @template T The name of the tile.
 */
export abstract class Tile<T extends TileKeys> extends Piece<Tile.Options<T>> {
  public declare name: T;
  public declare store: TileStore;

  public constructor(context: Piece.Context, options: Tile.Options<T>) {
    super(context, options);
  }

  /**
   * Styles the button of this tile as a cell on the grid.
   * @param builder An instance of a discord {@link ButtonBuilder button builder}.
   */
  public abstract style(
    builder: ButtonBuilder,
    state: TileState,
  ): ButtonBuilder;

  /**
   * Runs the logic of this tile.
   * @param context The game's context.
   */
  public abstract trigger(context: TileContext<T>): Awaitable<unknown>;
}

export declare namespace Tile {
  type Options<T extends TileKeys> = Piece.Options & { name: T };
  type Context = Piece.Context;
  type JSON = Piece.JSON;
  type LocationJSON = Piece.LocationJSON;

  type Entries = Tiles;
  type Keys = TileKeys;
}

/**
 * The interface on which the developer must augment in order to register tile types' keys.
 */
export interface Tiles {}

/**
 * The registered tiles' keys.
 */
export type TileKeys = keyof Tiles;

/**
 * Represents a tile cell.
 * @template T A registered tile entry.
 */
export interface TileCell<T extends TileKeys> {
  /**
   * The id of the cell.
   */
  id: T;
  /**
   * The piece linked to this cell.
   */
  piece: Tile<T>;
  /**
   * The current state of this cell.
   */
  state: TileState;
  /**
   * The button component builder linked to this cell.
   */
  component: ButtonBuilder;
}

/**
 * Represents the state of the tile.
 */
export interface TileState {
  /**
   * Whether this tile has been revealed or not.
   */
  revealed: boolean;
}

/**
 * Represents the context of a tile interaction.
 * @template T The tile tied to this context.
 */
export interface TileContext<T extends TileKeys = TileKeys> {
  cellData: TileCell<T>;
  state: TileState;
  db: unknown;
  responder: Responder<ButtonInteraction<"cached">>;
}

/**
 * The store for all tiles.
 */
export class TileStore extends Store<Tile<TileKeys>> {
  public constructor() {
    super(Tile, {
      name: "tiles",
    });
  }

  /**
   * Creates a tile {@link TileCell cell}.
   * @param id The id of the cell.
   * @returns A {@link TileCell cell} object.
   */
  public createCell<T extends TileKeys>(id: T): TileCell<T> {
    const piece = this.get(id);
    if (isNullOrUndefined(piece))
      throw new ReferenceError(`Cannot find tile "${id}" from the store.`);

    const state: TileState = { revealed: false };

    return {
      id,
      piece,
      state,
      component: piece.style(new ButtonBuilder(), state),
    };
  }

  /**
   * Generates a grid of {@link Tile tile}s with a specific dimension.
   * @template T The keys to generate.
   * @param dimension The width and height of the grid.
   * @param keys The registered tile ids.
   * @returns A 2-dimensional array of {@link Tile tiles}.
   */
  public generateGrid<const T extends TileKeys>(
    dimension: number,
    keys: T[],
  ): TileGrid<T> {
    if (keys.length !== dimension)
      throw new RangeError("Invalid distribution of tiles.");

    return chunk(
      keys.map((key) => this.createCell(key)),
      dimension,
    );
  }

  /**
   * Styles a cell.
   * @param cell The cell.
   * @returns A {@link TileCell cell}.
   */
  public styleCell<const T extends TileKeys>(cell: TileCell<T>): TileCell<T> {
    return {
      ...cell,
      component: cell.piece
        .style(new ButtonBuilder(), cell.state)
        .setCustomId(cell.id),
    };
  }

  /**
   * Creates a grid of {@link ButtonBuilder button builders} to send to discord.
   * @param grid The grid.
   * @param states The states of each cell within the grid.
   * @returns A 2-dimensional array of {@link ButtonBuilder buttons}.
   */
  public styleGrid<const T extends TileKeys>(grid: TileGrid<T>): TileGrid<T> {
    return grid.map((row) => row.map((cell) => this.styleCell(cell)));
  }
}

export interface TileStore {
  get<T extends TileKeys>(key: T): Tile<T>;
  get(key: string): undefined;
}

export type TileGrid<T extends TileKeys> = TileCell<T>[][];
