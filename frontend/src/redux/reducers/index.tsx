import { combineReducers } from "redux";
import AccountReducer from "./AccountReducer";
import ContractReducer from "./ContractReducer";

export default combineReducers({
  accountState: AccountReducer,
  contractState: ContractReducer,
});