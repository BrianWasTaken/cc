import { Result } from "@sapphire/result";
import {
  StringSelectMenuInteraction,
  type ButtonInteraction,
  type ChatInputCommandInteraction,
} from "discord.js";
import {
  Builder,
  ComponentRowBuilder,
  InteractionMessageBuilder,
  UpdateInteractionMessageBuilder,
} from "./builders";
import { isFunction } from "@sapphire/utilities";

/**
 * Supported responder targets.
 */
export type ResponderTarget =
  | ChatInputCommandInteraction<"cached">
  | ButtonInteraction<"cached">
  | StringSelectMenuInteraction<"cached">;

/**
 * Supported responder content.
 */
export type ResponderContent<
  TComponents extends ComponentRowBuilder.ComponentTypes,
> =
  | string
  | InteractionMessageBuilder<TComponents>
  | Builder.Callback<InteractionMessageBuilder<TComponents>>;

/**
 * Represents the responder utility.
 * @template T The type of suppoerted responder content.
 */
export class Responder<T extends ResponderTarget> {
  /**
   * The responder's constructor.
   * @param target The target interaction.
   */
  public constructor(public target: T) {}

  /**
   * Sends a message through the responder target.
   * @param content The content.
   * @returns A message object.
   */
  public send<
    TComponents extends
      ComponentRowBuilder.ComponentTypes = ComponentRowBuilder.ComponentTypes,
  >(content: ResponderContent<TComponents>) {
    const { deferred, replied } = this.target;

    content = isFunction(content)
      ? Builder.build(new InteractionMessageBuilder<TComponents>(), content)
      : content;

    if (deferred && !replied) {
      return this.target.editReply(content);
    }

    if (replied) {
      return this.target.followUp(content);
    }

    return this.target.reply({
      ...(typeof content === "string" ? { content } : content),
      fetchReply: true,
    });
  }

  /**
   * Edits the message content of an interaction.
   * @param content The content.
   * @returns A message object.
   */
  public edit<
    TComponents extends
      ComponentRowBuilder.ComponentTypes = ComponentRowBuilder.ComponentTypes,
  >(content: ResponderContent<TComponents>) {
    content = isFunction(content)
      ? Builder.build(new InteractionMessageBuilder<TComponents>(), content)
      : content;

    if (
      this.target.isChatInputCommand() ||
      (this.target.deferred && this.target.replied)
    ) {
      return this.target.editReply(content);
    }

    if (this.target.isMessageComponent()) {
      content =
        typeof content === "string"
          ? new InteractionMessageBuilder<TComponents>().setContent(content)
          : content;

      return this.target.update({
        ...new UpdateInteractionMessageBuilder().apply(
          () => content as unknown as UpdateInteractionMessageBuilder,
        ),
        fetchReply: true,
      });
    }

    throw new Error("Cannot edit message.", {
      cause: { responder: this, content },
    });
  }

  /**
   * Unsends the latest response of the target interaction.
   * @todo Actually delete the latest response.
   * @returns A boolean indicating the success of the operation.
   */
  public async unsend() {
    return (await Result.fromAsync(this.target.deleteReply())).isOk();
  }
}
