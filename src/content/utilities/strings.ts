import { Utility } from "@sapphire/plugin-utilities-store";
import { DiscordSnowflake } from "@sapphire/snowflake";

export class StringUtilities extends Utility {
  public constructor(context: Utility.Context) {
    super(context, { name: StringUtilities.Name });
  }

  public transformNumToRoman = (num: number): string => {
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const romans = [
      "M",
      "CM",
      "D",
      "CD",
      "C",
      "XC",
      "L",
      "XL",
      "X",
      "IX",
      "V",
      "IV",
      "I",
    ];

    let roman = "";
    let index = 0;

    while (index < romans.length) {
      roman += romans.at(index)!.repeat(num / values.at(index)!);
      num %= values.at(index)!;
      index++;
    }

    return roman;
  };

  public joinNewline = (...strings: string[] | string[][]): string => {
    return strings.flat(Infinity).join("\n");
  };

  public listInline = (...strings: string[]): string => {
    return new Intl.ListFormat("en", {
      style: "long",
      type: "conjunction",
    }).format(strings);
  };

  public createDiscordSnowflake = (
    timestamp: ReturnType<typeof Date.now>,
  ): bigint => {
    return DiscordSnowflake.generate({ timestamp });
  };
}

export namespace StringUtilities {
  export const Name = "string" as const;
}

declare module "@sapphire/plugin-utilities-store" {
  interface Utilities {
    [StringUtilities.Name]: Omit<StringUtilities, keyof Utility>;
  }
}
