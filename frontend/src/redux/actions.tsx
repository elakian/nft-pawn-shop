import {
  SET_ACCOUNT_DETAILS,
  SET_PAWN_SHOP_CONTRACTS,
  SET_PAWNS,
  SET_LOANS,
  SET_NFTS,
} from "./actionTypes";
import { AccountState } from "./reducers/AccountReducer";
import { ContractState } from "./reducers/ContractReducer";
import { LoanState } from "./reducers/LoanReducer";
import { NFTState } from "./reducers/NftReducer";
import { PawnState } from "./reducers/PawnReducer";

export const setAccountDetails = (account: AccountState) => ({
  type: SET_ACCOUNT_DETAILS,
  payload: {
    ...account,
  },
});

export const setContractDetails = (contract: ContractState) => ({
  type: SET_PAWN_SHOP_CONTRACTS,
  payload: {
    ...contract,
  },
});

export const setLoans = (loans: LoanState) => ({
  type: SET_LOANS,
  payload: {
    ...loans,
  },
});

export const setNfts = (nfts: NFTState) => ({
  type: SET_NFTS,
  payload: {
    ...nfts,
  },
});

export const setPawns = (pawns: PawnState) => ({
  type: SET_PAWNS,
  payload: {
    ...pawns,
  },
});
