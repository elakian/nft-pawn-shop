import { SET_PAWNS } from "../actionTypes";

export interface PawnState {
    pawns: any,
}

const initialState: PawnState = {
    pawns: null,
};
  
const PawnReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case SET_PAWNS: {
          return {
            pawns: action.payload.pawns
          };
        }
      }
      return state;
    };
  
export default PawnReducer;