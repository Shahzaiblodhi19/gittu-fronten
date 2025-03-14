import * as anchor from "@project-serum/anchor";
import {
  IDL
} from "./presale.ts";

import {
  toast
} from "react-toastify";
import * as keys from "./keys";

import BN from "bn.js";

import {
  Connection,
  Transaction,
  clusterApiUrl,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction
} from "@solana/spl-token"

import {
  PROGRAM_ID,
  SEC,
  SEC_DECIMALS,
  PRICE_PER_TOKEN,
  aSEC,
  ALT_TOKEN_PUBKEY,
  SOL_DECIMALS,
  PRESALE_START_TIMESTAMP,
  PRESALE_END_TIMESTAMP
} from './constants';

export const SOLANA_HOST = "https://devnet.helius-rpc.com/?api-key=9b4a9dfe-c992-4e28-bd47-f710f6383123";//clusterApiUrl("devnet");
// "https://mainnet.helius-rpc.com/?api-key=9b4a9dfe-c992-4e28-bd47-f710f6383123"

const connection = new Connection(SOLANA_HOST, 'processed');

export const getProgram = (wallet) => {
  let provider = new anchor.AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(IDL, PROGRAM_ID, provider);
  return program;
};

export const getIsGlobalStateInitialized = async (wallet) => {
  try {
    const program = getProgram(wallet);
    const stateKey = await keys.getGlobalStateKey();
    const stateInfo = await program.account.globalState.fetchNullable(stateKey);

    if (!stateInfo) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

export const getAdmin = async (wallet) => {
  try {
    const program = getProgram(wallet);
    const stateKey = await keys.getGlobalStateKey();
    const stateInfo = await program.account.globalState.fetchNullable(stateKey);

    

    if (wallet.publicKey.toString() === stateInfo.authority.toString()) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

export const createGlobalState = async (wallet, token_decimal, token_price, maxAmount) => {
  const program = getProgram(wallet);

  // Todo
  const stateKey = await keys.getGlobalStateKey();
  const rTokenVault = await keys.getAssociatedTokenAccount(stateKey, SEC);
  const aTokenVault = await keys.getAssociatedTokenAccount(stateKey, aSEC);
  const solVault = await keys.getVaultKey();
  const tokenPrice = convertToSolDecimal(token_price);
  const tokenDecimal = new BN(token_decimal);

  const tx = new Transaction();
  tx.add(
    await program.methods
      .createGlobalState(tokenPrice, tokenDecimal)
      .accounts({
        globalState: stateKey,
        solVault: solVault,
        mint: SEC,
        vault: rTokenVault,
        altMint: aSEC,
        altVault: aTokenVault,
        authority: wallet.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .instruction()
  )
  return await send(connection, wallet, tx);
}

export const updateGlobalState = async (wallet, token_decimal, token_price, new_authority, max_amount) => {
  const program = getProgram(wallet);

  // Todo
  const stateKey = await keys.getGlobalStateKey();
  const tokenPrice = convertToSolDecimal(token_price);
  const tokenDecimal = new BN(token_decimal);
  const maxAmount = new BN(max_amount);
  const tx = new Transaction();
  
  tx.add(
    await program.methods
      .updateGlobalState(tokenPrice, tokenDecimal, maxAmount, new PublicKey(new_authority))
      .accounts({
        globalState: stateKey,
        authority: wallet.publicKey,
      })
      .instruction()
  )
  return await send(connection, wallet, tx);
}


export const depositAltToken = async (wallet, amount) => {

  const program = getProgram(wallet);

  const stateKey = await keys.getGlobalStateKey();
  const aTokenVault = await keys.getAssociatedTokenAccount(stateKey, aSEC);
  const userVault = await keys.getAssociatedTokenAccount(wallet.publicKey, aSEC);
  const depositAltTokenAmount = convertToDecimal(amount);
  const tx = new Transaction();
  tx.add(
    await program.methods
      .depositToken(depositAltTokenAmount)
      .accounts({
        globalState: stateKey,
        authority: wallet.publicKey,
        mint: aSEC,
        poolVault: aTokenVault,
        userVault: userVault,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .instruction()
  )

  return await send(connection, wallet, tx);
}

export const depositRealToken = async (wallet, amount) => {

  const program = getProgram(wallet);

  const stateKey = await keys.getGlobalStateKey();
  const rTokenVault = await keys.getAssociatedTokenAccount(stateKey, SEC);
  const userVault = await keys.getAssociatedTokenAccount(wallet.publicKey, SEC);
  const depositAltTokenAmount = convertToDecimal(amount);
  const tx = new Transaction();
  tx.add(
    await program.methods
      .depositToken(depositAltTokenAmount)
      .accounts({
        globalState: stateKey,
        authority: wallet.publicKey,
        mint: SEC,
        poolVault: rTokenVault,
        userVault: userVault,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .instruction()
  )

  return await send(connection, wallet, tx);
}

export const claimRealToken = async (wallet, amount) => {
  if (wallet.publicKey === null || wallet.publicKey === undefined) {
    showToast("Connect Wallet!", 5000, 1);
    return null;
  }

  if (parseFloat(amount) <= 0 || amount === '') {
    showToast("Enter Correct Amount!", 5000, 1);
    return null;
  }

  const program = getProgram(wallet);
  const stateKey = await keys.getGlobalStateKey();
  const rTokenVault = await keys.getAssociatedTokenAccount(stateKey, SEC);
  const userVault = await keys.getAssociatedTokenAccount(wallet.publicKey, SEC);
  const depositRealTokenAmount = convertToDecimal(amount);

  const tx = new Transaction();
  tx.add(
    await program.methods
      .claimToken(depositRealTokenAmount)
      .accounts({
        globalState: stateKey,
        authority: wallet.publicKey,
        mint: SEC,
        poolVault: rTokenVault,
        userVault: userVault,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .instruction()
  )

  return await send(connection, wallet, tx);
}

export const swapToken = async (wallet, amount) => {
  const program = getProgram(wallet);
  const stateKey = await keys.getGlobalStateKey();
  const aTokenVault = await keys.getAssociatedTokenAccount(stateKey, aSEC);
  const userVault = await keys.getAssociatedTokenAccount(wallet.publicKey, aSEC);
  const userRVault = await keys.getAssociatedTokenAccount(wallet.publicKey, SEC);
  const depositRealTokenAmount = convertToDecimal(amount);
  const rTokenVault = await keys.getAssociatedTokenAccount(stateKey, SEC);

  const tx = new Transaction();
  tx.add(
    await program.methods
      .swapToken(depositRealTokenAmount)
      .accounts({
        globalState: stateKey,
        authority: wallet.publicKey,
        poolAltVault: aTokenVault,
        altMint: aSEC,
        userAltVault: userVault,
        poolVault: rTokenVault,
        mint: SEC,
        userVault: userRVault,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .instruction()
  )

  return await send(connection, wallet, tx);
}

export const claimAltToken = async (wallet, amount) => {
  if (wallet.publicKey === null || wallet.publicKey === undefined) {
    showToast("Connect Wallet!", 5000, 1);
    return null;
  }

  if (parseFloat(amount) <= 0 || amount === '') {
    showToast("Enter Correct Amount!", 5000, 1);
    return null;
  }

  const program = getProgram(wallet);
  const stateKey = await keys.getGlobalStateKey();
  const aTokenVault = await keys.getAssociatedTokenAccount(stateKey, aSEC);
  const userVault = await keys.getAssociatedTokenAccount(wallet.publicKey, aSEC);
  const depositRealTokenAmount = convertToDecimal(amount);

  const tx = new Transaction();
  tx.add(
    await program.methods
      .claimToken(depositRealTokenAmount)
      .accounts({
        globalState: stateKey,
        authority: wallet.publicKey,
        mint: aSEC,
        poolVault: aTokenVault,
        userVault: userVault,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .instruction()
  )

  return await send(connection, wallet, tx);
}

export const buyToken = async (wallet, amount) => {
  if (wallet.publicKey === null || wallet.publicKey === undefined) {
    showToast("Connect Wallet!", 5000, 1);
    return null;
  }

  if (amount <= 0 || amount === '' || isNaN(amount)) {
    showToast("Enter Correct Amount!", 5000, 1);
    return null;
  }

  const nowTime = new Date().getTime();
  if (nowTime / 1000 < PRESALE_START_TIMESTAMP) {
    showToast("Presale is not started yet!", 5000, 1);
    return null;
  }
  if (nowTime / 1000 > PRESALE_END_TIMESTAMP) {
    showToast("Presale is ended!", 5000, 1);
    return null;
  }

  const program = getProgram(wallet);

  const stateKey = await keys.getGlobalStateKey();

  const aTokenVault = await keys.getAssociatedTokenAccount(stateKey, aSEC);
  const userState = await keys.getUserKey(stateKey.toBuffer(), wallet.publicKey.toBuffer())
  const userVault = await keys.getAssociatedTokenAccount(wallet.publicKey, aSEC);
  const solAmount = convertToSolDecimal(amount);
  const solVault = await keys.getVaultKey();

  const tx = new Transaction();
  tx.add(
    await program.methods
      .buyToken(solAmount)
      .accounts({
        globalState: stateKey,
        user: wallet.publicKey,
        solVault: solVault,
        userState: userState,
        poolVault: aTokenVault,
        altMint: aSEC,
        userVault: userVault,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .instruction()
  )

  return await send(connection, wallet, tx);
}

export const claimSol = async (wallet, amount) => {

  if (wallet.publicKey === null || wallet.publicKey === undefined) {
    showToast("Connect Wallet!", 5000, 1);
    return null;
  }

  if (parseFloat(amount) <= 0 || amount === '') {
    showToast("Enter Correct Amount!", 5000, 1);
    return null;
  }

  const program = getProgram(wallet);
  const pool = await keys.getGlobalStateKey();
  const solVault = await keys.getVaultKey();
  const claimSolAmount = convertToSolDecimal(amount);
  const tx = new Transaction();
  tx.add(
    await program.methods
      .claimSol(claimSolAmount)
      .accounts({
        globalState: pool,
        user: wallet.publicKey,
        solVault: solVault,
        systemProgram: SystemProgram.programId,
      })
      .instruction()
  )

  return await send(connection, wallet, tx);

}

export const getPoolInfo = async (wallet) => {
  try {
    const program = getProgram(wallet);
    const pool = await keys.getGlobalStateKey();
    const poolInfo = await program.account.globalState.fetchNullable(pool);
    return poolInfo;
  } catch (e) {
    return null;
  }
}

export const getStateInitialized = async (wallet) => {
  try {
    const poolInfo = await getPoolInfo(wallet);
    if (!poolInfo)
      return false;
    const isInitialized = poolInfo.isInitialized;
    return isInitialized;
  } catch (e) {
    return 0;
  }
}

export const getSoldInfo = async (wallet) => {
  const program = getProgram(wallet);
  const pool = await keys.getGlobalStateKey();
  const poolInfo = await program.account.globalState.fetchNullable(pool);
  if (!poolInfo) {
    return 0;
  }
  const sold_amount = convertFromSolDecimal(poolInfo.amount.toNumber())
  
  return sold_amount;
}

export const getPrice = async (wallet) => {
  const program = getProgram(wallet);
  const pool = await keys.getGlobalStateKey();
  const poolInfo = await program.account.globalState.fetchNullable(pool);
  if (!poolInfo) {
    return 0;
  }
  const token_price = convertFromSolDecimal(poolInfo.tokenPrice.toNumber());
  return token_price;
}

export const getTokenDecimal = async (wallet) => {
  const program = getProgram(wallet);
  const pool = await keys.getGlobalStateKey();
  const poolInfo = await program.account.globalState.fetchNullable(pool);
  if (!poolInfo) {
    return 0;
  }
  const token_decimal = poolInfo.tokenDecimal.toNumber();
  return token_decimal;
}

export const getMaxAmount = async (wallet) => {
  const program = getProgram(wallet);
  const pool = await keys.getGlobalStateKey();
  const poolInfo = await program.account.globalState.fetchNullable(pool);
  if (!poolInfo) {
    return 0;
  }
  const max_amount = poolInfo.maxToken.toNumber();
  return max_amount;
}

export async function getTokenFromBalance() {
  const stateKey = await keys.getGlobalStateKey();
  const rTokenVault = await keys.getAssociatedTokenAccount(stateKey, SEC);
  try {
    const info = await connection.getTokenAccountBalance(rTokenVault);

    if (!info.value.uiAmount) throw new Error('No balance found');
    return info.value.uiAmount;
  } catch (e) {
    return 0;
  }
}

export async function getTotalSuplyToken(wallet) {
  const stateKey = await keys.getGlobalStateKey();
  const aTokenVault = await keys.getAssociatedTokenAccount(stateKey, aSEC);
  try {
    const info = await connection.getTokenAccountBalance(aTokenVault);

    if (!info.value.uiAmount) throw new Error('No balance found');
    return info.value.uiAmount;
  } catch (e) {
    console.log(e);
    return 0;
  }
}


export async function send(connection, wallet, transaction) {
  const txHash = await sendTransaction(connection, wallet, transaction);
  if (txHash != null) {
    let confirming_id = showToast("Confirming Transaction ...", -1, 2);

    let res = await connection.confirmTransaction(txHash);
    toast.dismiss(confirming_id);
    if (res.value.err) showToast("Transaction Failed", 2000, 1);
    else showToast("Transaction Confirmed", 2000);
  } else {
    showToast("Transaction Failed", 2000, 1);
  }
  return txHash;
}

export async function sendTransaction(
  connection,
  wallet,
  transaction
) {
  if (wallet.publicKey === null || wallet.signTransaction === undefined)
    return null;
  try {
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    transaction.feePayer = wallet.publicKey;
    const signedTransaction = await wallet.signTransaction(transaction);
    const rawTransaction = signedTransaction.serialize();

    showToast("Sending Transaction ...", 500);

    const txid = await connection.sendRawTransaction(
      rawTransaction, {
      skipPreflight: true,
      preflightCommitment: "processed",
    }
    );
    return txid;
  } catch (e) {
    console.log("error: ", e)
    return null;
  }
}

export const showToast = (txt, duration = 5000, ty = 0) => {
  let type = toast.TYPE.SUCCESS;
  if (ty === 1) type = toast.TYPE.ERROR;
  if (ty === 2) type = toast.TYPE.INFO;

  let autoClose = duration;
  if (duration < 0) {
    autoClose = false;
  }
  return toast.error(txt, {
    position: "bottom-right",
    autoClose,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    type,
    theme: "colored",
  });
};

export const convertToDecimal = (amount) => {
  const integerStringValue = (parseFloat(amount) * 10 ** SEC_DECIMALS).toFixed(0);
  const rAmount = new BN(integerStringValue);
  return rAmount
}

export const convertToSolDecimal = (amount) => {
  const integerStringValue = (parseFloat(amount) * 10 ** SOL_DECIMALS).toFixed(0);
  const rAmount = new BN(integerStringValue);
  return rAmount;
}

export const convertFromDecimal = (amount) => {
  return amount / (10 ** SEC_DECIMALS)
}

export const convertFromSolDecimal = (amount) => {
  return amount / (10 ** SOL_DECIMALS)
}

export const createTokenAccount = async (wallet, mint) => {
  try {
    try {
      const associatedToken = getAssociatedTokenAddressSync(
        mint,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      );

      const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          associatedToken,
          wallet.publicKey,
          mint,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID,
        )
      );

      return await send(connection, wallet, transaction);
    } catch (error) {
      // Ignore all errors; for now there is no API-compatible way to selectively ignore the expected
      // instruction error if the associated account exists already.
    }
  } catch (e) {
    return 0;
  }
}

export const getVaultKey = async (ownerPubkey, mintPk) => {
  const [vaultKey] = await asyncGetPda(
    [
      ownerPubkey.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      mintPk.toBuffer(), // mint address
    ],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  return vaultKey;
};

const asyncGetPda = async (seeds, programId) => {
  const [pubKey, bump] = await PublicKey.findProgramAddress(seeds, programId);
  return [pubKey, bump];
};