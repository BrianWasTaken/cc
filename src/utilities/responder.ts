import { Result } from "@sapphire/result";
import {
  StringSelectMenuInteraction,
  type ButtonInteraction,
  type ChatInputCommandInteraction,
  type InteractionEditReplyOptions,
  type InteractionReplyOptions,
} from "discord.js";

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
export type ResponderContent =
  | InteractionReplyOptions
  | InteractionEditReplyOptions;

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
  public send(content: ResponderContent) {
    const { deferred, replied } = this.target;

    if (deferred && !replied) {
      return this.target.editReply(content);
    }

    if (this._isContentForSend(content)) {
      if (replied) {
        return this.target.followUp(content);
      }

      return this.target.reply({ ...content, fetchReply: true });
    }

    throw new Error("Cannot send message.", {
      cause: { responder: this, content },
    });
  }

  /**
   * Edits the message content of an interaction.
   * @param content The content.
   * @returns A message object.
   */
  public edit(content: ResponderContent) {
    if (
      this.target.isChatInputCommand() ||
      (this.target.deferred && this.target.replied) ||
      this._isContentForSend(content)
    ) {
      return this.target.editReply(content);
    }

    if (this.target.isMessageComponent()) {
      return this.target.update({ ...content, fetchReply: true });
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

  private _isContentForSend(
    content: ResponderContent,
  ): content is InteractionReplyOptions {
    return "flags" in content && content.flags !== "Ephemeral";
  }
}
