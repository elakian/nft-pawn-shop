import { SET_ACCOUNT_DETAILS } from "../actionTypes";

export interface AccountState {
  selectedAddress: String;
  selectedNetwork: String;
  provider: any;
}

const initialState: AccountState = {
  selectedAddress: "",
  selectedNetwork: "",
  provider: null,
};

const AccountReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_ACCOUNT_DETAILS: {
      return {
        selectedAddress: action.payload.selectedAddress,
        selectedNetwork: action.payload.selectedNetwork,
        provider: action.payload.provider,
      };
    }
  }
  return state;
};

export default AccountReducer;
