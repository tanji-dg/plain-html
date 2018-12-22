import React, { Component } from "react";
import { connect } from "react-redux";
import { setUnit } from "../actions";
import { DAYS, HOURS, MINUTES } from "../domain";
import styles from "./UnitSelector.css";

export class UnitSelector extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.setUnit(event.target.value);
  }

  render() {
    return (
      <select
        value={this.props.selectedUnit}
        onChange={this.handleChange}
        className={styles.unitSelector}
      >
        <option value={DAYS}>Days</option>
        <option value={HOURS}>Hours</option>
        <option value={MINUTES}>Minutes</option>
      </select>
    );
  }
}

const mapStateToProps = state => ({ selectedUnit: state.selectedUnit });
const mapDispatchToProps = { setUnit };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UnitSelector);
