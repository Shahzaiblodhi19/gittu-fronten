import {
  PublicKey
} from "@solana/web3.js";

export const GLOBAL_STATE_SEED = "GLOBAL_STATE_SEED";
export const USER_STATE_SEED = "USER_STATE_SEED";
export const SOL_VAULT_SEED = "SOL_VAULT_SEED";

export const Networks = {
  MAINNET: 101,
  DEVNET: 102,
};
// export const DEFAULT_NETWORK = Networks.MAINNET;
export const DEFAULT_NETWORK = Networks.DEVNET;
export const IS_MAINNET = DEFAULT_NETWORK == Networks.MAINNET;

export const PROGRAM_ID = new PublicKey(
  IS_MAINNET ?
    "5KzCBkpXMSjtFtjyQZSSBzJ9H1yWKFikV3Ah3kSUX7t1" :
    "5KzCBkpXMSjtFtjyQZSSBzJ9H1yWKFikV3Ah3kSUX7t1"
);

export const TOKEN_DECIMALS = IS_MAINNET ? 6 : 6;
export const SOL_DECIMALS = 9;

export const PRESALE_START_TIMESTAMP = 1717750800; // Thu Jun 06 2024 00:00:00 GMT+0000 //1717750800
export const PRESALE_END_TIMESTAMP = 1781725200; // 	Sun Jul 21 2024 00:00:00 GMT+0000    presale takes 45 days.

export const TOKEN_PUBKEY = new PublicKey("CuW881brinpe8UkTA2U7GDJKDs33mw8nVkkT9m3bV6Df");
export const ALT_TOKEN_PUBKEY = new PublicKey("Gg2D7TcW2VZBjwzeKZ9ZfeLufnynGZbSjKgFt3d3L4Vz");

export const TOKEN_PRESALE_HARDCAP = 4000000000; // token
export const PRICE_PER_TOKEN = 0.0000002; // sol