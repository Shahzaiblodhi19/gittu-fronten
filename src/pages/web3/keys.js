import { PublicKey } from "@solana/web3.js";
import {
  GLOBAL_STATE_SEED,
  SOL_VAULT_SEED,
  USER_STATE_SEED,
  PROGRAM_ID,
} from "./constants";

import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from "@solana/spl-token"

export const getGlobalStateKey = async () => {
  const [globalStateKey] = await asyncGetPda(
    [Buffer.from(GLOBAL_STATE_SEED)],
    PROGRAM_ID
  );
  return globalStateKey;
};

export const getPoolKey = async (mintKey) => {
  const [poolKey] = await asyncGetPda(
    [mintKey.toBuffer()], // mint address
    PROGRAM_ID
  );
  return poolKey;
};

export const getVaultKey = async () => {
  const [vaultKey] = await asyncGetPda(
    [Buffer.from(SOL_VAULT_SEED)],
    PROGRAM_ID
  );
  return vaultKey;
};

// export const getUserKey = async (authority) => {
//   const [userKey] = await asyncGetPda(
//     [
//       authority.toBuffer(),
//       Buffer.from(USER_STATE_SEED)
//     ],
//     PROGRAM_ID
//   )
//   return userKey;
// }

export const getUserKey = async (seed1, seed2) => {
  const [userKey] = await asyncGetPda(
    [
      seed1,
      seed2
    ],
    PROGRAM_ID
  )
  return userKey;
}

export const getAssociatedTokenAccount = async (ownerPubkey, mintPk) => {
  let associatedTokenAccountPubkey = (
    await PublicKey.findProgramAddress(
      [
        ownerPubkey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        mintPk.toBuffer(), // mint address
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  )[0];
  return associatedTokenAccountPubkey;
};

export const asyncGetPda = async (seeds, programId) => {
  const [pubKey, bump] = await PublicKey.findProgramAddress(seeds, programId);
  return [pubKey, bump];
};
