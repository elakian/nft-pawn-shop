import { SET_ACCOUNT_DETAILS } from "../actionTypes";
  
export interface AccountState {
    selectedAddress: String,
    selectedNetwork: String
}

const initialState: AccountState = {
    selectedAddress: "",
    selectedNetwork: "",
};
  
  
const AccountReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case SET_ACCOUNT_DETAILS: {
          return {
            selectedAddress: action.payload.selectedAddress,
            selectedNetwork: action.payload.selectedNetwork,
          };
        }
      }
      return state;
    };
  
export default AccountReducer;