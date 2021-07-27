import { combineReducers } from "redux";
import AccountReducer from "./AccountReducer";

export default combineReducers({
  accountState: AccountReducer,
});