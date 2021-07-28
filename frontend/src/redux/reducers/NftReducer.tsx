import { SET_NFTS } from "../actionTypes";

export interface NFTState {
  nfts: any;
}

const initialState: NFTState = {
  nfts: null,
};

const NFTReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_NFTS: {
      return {
        nfts: action.payload.nfts,
      };
    }
  }
  return state;
};

export default NFTReducer;
