import { SapphireClient } from "@sapphire/framework";
import { GatewayIntentBits, Options } from "discord.js";
import { PiecesPath } from "#bot/utilities/paths.js";

const bot = new SapphireClient({
  baseUserDirectory: PiecesPath,
  intents: [
    /**
     * Use Case:
     * - Leaderboards
     * - User Interactions
     */
    GatewayIntentBits.GuildMembers,
    /**
     * Use Case:
     * - Spawning Loot
     */
    GatewayIntentBits.GuildMessages,
  ],
  hmr: {
    enabled: process.env.NODE_ENV === "development",
  },
  makeCache: Options.cacheWithLimits({
    ...Options.DefaultMakeCacheSettings,
    AutoModerationRuleManager: 0,
    GuildBanManager: 0,
    GuildInviteManager: 0,
    GuildScheduledEventManager: 0,
    GuildStickerManager: 0,
    PresenceManager: 0,
    ReactionManager: 0,
    ReactionUserManager: 0,
    StageInstanceManager: 0,
    VoiceStateManager: 0,
  }),
  sweepers: {
    ...Options.DefaultSweeperSettings,
    messages: {
      interval: 1800,
      filter: () => (message) => message.author.id !== message.client.user.id,
    },
    guildMembers: {
      interval: 3600,
      filter: () => (member) =>
        ![
          member.guild.ownerId,
          member.guild.client.user.id,
          member.client.application.owner?.id,
        ].some((id) => id !== member.id),
    },
  },
});

await bot.login();
