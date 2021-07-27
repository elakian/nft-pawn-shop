import { 
    SET_ACCOUNT_DETAILS, 
    SET_PAWN_SHOP_CONTRACTS } from "./actionTypes";
import { AccountState } from "./reducers/AccountReducer";
import { ContractState } from "./reducers/ContractReducer";

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

