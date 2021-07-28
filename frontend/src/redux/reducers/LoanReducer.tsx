import { SET_LOANS } from "../actionTypes";

export interface LoanState {
  loans: any;
}

const initialState: LoanState = {
  loans: null,
};

const LoanReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_LOANS: {
      return {
        loans: action.payload.loans,
      };
    }
  }
  return state;
};

export default LoanReducer;
