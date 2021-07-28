import { combineReducers } from "redux";
import AccountReducer from "./AccountReducer";
import ContractReducer from "./ContractReducer";
import LoanReducer from "./LoanReducer";
import NFTReducer from "./NftReducer";
import PawnReducer from "./PawnReducer";

export default combineReducers({
  accountState: AccountReducer,
  contractState: ContractReducer,
  loanState: LoanReducer,
  nftState: NFTReducer,
  pawnState: PawnReducer,
});
