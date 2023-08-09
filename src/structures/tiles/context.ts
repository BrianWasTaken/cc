import type { TileIdentifier } from "#bot/structures/tiles/piece.js";
import { Responder } from "#bot/utilities/responder";
import { ComponentType, type ButtonInteraction } from "discord.js";
import { Cell } from "./cell";
import type { Grid } from "./grid";

export class Context<Id extends TileIdentifier> {
  public cell: Cell<Id>;
  public db: null;
  public responder: Responder<ButtonInteraction<"cached">>;

  public constructor(
    public grid: Grid<TileIdentifier>,
    public id: Id,
    protected interaction: ButtonInteraction<"cached">,
  ) {
    this.cell = new Cell(id, false);
    this.db = null;
    this.responder = new Responder(interaction);
  }

  public async reveal(): Promise<this> {
    this.cell.reveal();
    await this.updateMessage();

    return this;
  }

  protected async updateMessage() {
    const { components } = this.interaction.message;

    const cellRowIndex = components.findIndex((row) =>
      row.components.some((c) => c.customId === this.interaction.customId),
    );
    if (cellRowIndex === -1)
      throw new Error("Unable to find what row this cell belongs to.");

    const cellIndex = components
      .at(cellRowIndex)!
      .components.findIndex(
        (comp) => comp.customId === this.interaction.customId,
      );

    await this.responder.edit((content) =>
      content.replaceComponentRowComponent(
        cellRowIndex,
        cellIndex,
        ComponentType.Button,
        () => this.cell.component,
      ),
    );
  }
}
