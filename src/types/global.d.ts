namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
    DISCORD_TOKEN: string;
    MDB_UNAME: string;
    MDB_PASS: string;
  }
}
