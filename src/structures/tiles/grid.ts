import { chunk } from "@sapphire/utilities";
import type { TileIdentifier } from "#bot/structures/tiles/piece.js";
import { Cell } from "./cell";
import { container } from "@sapphire/framework";
import { Collection } from "discord.js";

export interface IGrid<Ids extends TileIdentifier> {
  identifiers: Ids[];
  dimension: number;
}

export interface GridCells<Ids extends TileIdentifier>
  extends Collection<Ids, Cell<Ids>> {
  get<Id extends Ids>(key: Id): Cell<Id>;
  get(key: string): undefined;
}

export class Grid<Ids extends TileIdentifier> implements IGrid<Ids> {
  public cells: GridCells<Ids> = new Collection() as GridCells<Ids>;

  public constructor(
    public identifiers: Ids[],
    public dimension: number,
  ) {
    container.utilities["array"].transformArrayToCollection(
      identifiers.map((id) => this.create(id)),
      (cell) => cell.id,
      this.cells,
    );
  }

  public get cellIdGrid(): Ids[][] {
    return chunk(this.identifiers, this.dimension);
  }

  public get cellGrid(): Cell<Ids>[][] {
    return chunk([...this.cells.values()], this.dimension);
  }

  public get cellIndexGrid(): { index: number; id: Ids }[][] {
    return chunk(
      this.identifiers.map((id, index) => ({ id, index })),
      this.dimension,
    );
  }

  public create<Id extends Ids>(id: Id): Cell<Id> {
    return Reflect.construct(Cell<Id>, [id, false]);
  }

  public reveal<Id extends Ids>(cellId: Id): Cell<Id> {
    return this.cells.get(cellId).reveal();
  }
}
