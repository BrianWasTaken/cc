import type { TileIdentifier } from "#bot/structures/tiles/piece.js";
import { ButtonComponentBuilder } from "#bot/utilities/builders";
import { container } from "@sapphire/framework";

export interface ICell<Id extends TileIdentifier> {
  id: Id;
  revealed: boolean;
  component: ButtonComponentBuilder;
}

export class Cell<Id extends TileIdentifier> implements ICell<Id> {
  public component = new ButtonComponentBuilder();

  public constructor(
    public id: Id,
    public revealed: boolean,
  ) {
    if (revealed) {
      this.reveal();
    }
  }

  public reveal() {
    container.stores
      .get("tiles")
      .get(this.id)
      .style(this.component, (this.revealed = true));

    return this;
  }
}
