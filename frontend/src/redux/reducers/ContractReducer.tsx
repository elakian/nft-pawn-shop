import { SET_PAWN_SHOP_CONTRACTS } from "../actionTypes";
import { ethers } from "ethers";  

export interface ContractState {
    nftPawnShopContract: any,
    pawnNftContract: any,
}

const initialState: ContractState = {
    nftPawnShopContract: null,
    pawnNftContract: null,
};
  
  
const ContractReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case SET_PAWN_SHOP_CONTRACTS: {
          return {
            nftPawnShopContract: action.payload.nftPawnShopContract,
            pawnNftContract: action.payload.pawnNftContract,
          };
        }
      }
      return state;
    };
  
export default ContractReducer;