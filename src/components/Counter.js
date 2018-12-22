import React, { Component } from "react";
import Odometer from "react-odometerjs";
import { connect } from "react-redux";
import { getLastMfuDate, setCurrentDate } from "../actions.js";
import styles from "./Counter.css";
import { getCounterValue } from "../selectors.js";

export class Counter extends Component {
  componentDidMount() {
    this.props.getLastMfuDate();
    setInterval(this.props.setCurrentDate, 1000);
  }

  render() {
    return (
      <div className={styles.counter}>
        {/* need to multiple value by 10 to accomodate tenths display */}
        <Odometer value={this.props.value * 10} format="d" />
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  value: getCounterValue(state)
});

export const mapDispatchToProps = {
  getLastMfuDate,
  setCurrentDate
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter);
