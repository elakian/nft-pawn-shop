import React from "react";
import { connect } from "react-redux";
import { getAccountState, getContractState } from "../redux/selectors";
import { AccountState } from "../redux/reducers/AccountReducer";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Home from "./Home";
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import Mint from "./Mint";

interface Props {
  accountState: AccountState;
}

function Dapp(props: Props) {
  return (
    <Router>
      <div>
        <TopBar />
      </div>
      <div style={{ display: "flex" }}>
        <div>
          {/* <SideBar /> */}
          <Switch>
            <Route path="/" component={SideBar} />
          </Switch>
        </div>
        <div>
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/pawned" component={Home} />
            <Route path="/loans" component={Home} />
            <Route path="/mint" component={Mint} />

            <Route path="/">
              <Redirect to="/home" />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

const mapStateToProps = (state: any, ownProps: any) => ({
  ...ownProps,
  accountState: getAccountState(state),
  contractState: getContractState(state),
});

const mapDispatchToProps = (dispatch: any) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Dapp);
