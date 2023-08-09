import type { Payload } from "./utility";

namespace Player {
  /**
   * Player's schema.
   */
  interface Schema {
    /**
     * Unique ID Of the player.
     */
    id: string;
    /**
     * Boosters.
     */
    boosters: Booster[];
    /**
     * Currency.
     */
    currency: Currency;
    /**
     * Progress.
     */
    progress: Progress;
    /**
     * Quests.
     */
    quests: Quest[];
    /**
     * Timed rewards.
     */
    rewards: Rewards;
  }

  /**
   * Player's booster.
   */
  interface Booster {
    /**
     * Booster's unique identifier.
     */
    id: string;
    /**
     * The expiration timestamp of the booster.
     */
    expires_at: number;
    /**
     * Fragments to upgrade the power of this booster.
     * Extra fragments after reaching maximum level will be converted to coins.
     */
    fragments: number;
    /**
     * Booster's level.
     */
    level: number;
  }

  interface Bracket {
    /**
     * The current grid.
     */
    grid: Cell[][];
    /**
     * Amount of times this bracket has already been replayed.
     */
    replays: BracketReplay;
    /**
     * The current round.
     */
    round: number;
    /**
     * The outstanding rewards of the player.
     */
    rewards: Season.RoundRewards;
  }

  interface BracketReplay extends Payload<number> {
    /**
     * The replay winning streak for this bracket.
     */
    win_streak: number;
  }

  interface Cell {
    /**
     * Cell's unique identifier.
     */
    id: string;
    /**
     * If this cell has been revealed or not.
     */
    revealed: boolean;
  }

  interface Currency {
    /**
     * In-game currency.
     */
    coins: Payload<number>;
    /**
     * Fragments to apply for the boosters.
     */
    fragments: Payload<number>;
    /**
     * Chances of players to replay a round in a bracket.
     */
    hearts: Hearts;
    /**
     * Mastery points of players to indicate their progress.
     */
    mastery: Payload<number>;
  }

  interface Hearts extends Payload<number> {
    /**
     * The timestamp on which the player last lost a heart.
     */
    last_lost: number;
  }

  interface RewardsPayload {
    /**
     * The count.
     */
    count: number;
    /**
     * The timestamp on which the player last claimed their rewards.
     */
    last_claimed: number;
  }

  interface Progress {
    /**
     * The season's id.
     */
    season_id: string;
    /**
     * The bracket information.
     */
    bracket: Bracket;
  }

  interface Quest {
    /**
     * The quest's id.
     */
    id: string;
    /**
     * The indicator of the quest's progress.
     */
    count: number;
    /**
     * A timestamp on when the player started this quest.
     */
    started_at: number;
  }

  interface Rewards {
    /**
     * Daily rewards.
     */
    daily: RewardsPayload;
    /**
     * Hourly rewards.
     */
    hourly: RewardsPayload;
  }
}

namespace Season {
  interface Schema {
    id: string;
    starts_at: number;
    brackets: Bracket[];
  }

  interface Bracket {
    id: string;
    description: string;
    name: string;
    replay_limit: number;
    rounds: Round[];
  }

  interface Round {
    /**
     * Round's unique identifier.
     */
    id: number;
    /**
     * Round type.
     */
    type: string;
    /**
     * Round rewards.
     */
    rewards: RoundRewards;
  }

  interface RoundRewards {
    /**
     * Coins.
     */
    coins: number;
    /**
     * Mastery points.
     */
    mastery: number;
    /**
     * Booster fragments.
     */
    fragments: number;
  }
}
