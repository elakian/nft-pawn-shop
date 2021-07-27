import {SET_ACCOUNT_DETAILS} from "./actionTypes";
import { AccountState } from "./reducers/AccountReducer";

export const setAccountDetails = (account: AccountState) => ({
    type: SET_ACCOUNT_DETAILS,
    payload: {
      ...account,
    },
});
