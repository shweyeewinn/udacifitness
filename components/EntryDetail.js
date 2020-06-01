import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux';
import MetricCard from "./MetricCard";
import { white } from "../utils/colors";
import { addEntry } from '../actions'
import { getDailyReminderValue, timeToString } from "../utils/helpers";
import { removeEntry } from "../utils/api";
import TextButton from "./TextButton";

class EntryDetail extends Component {
  setTitle = (formattedDate) => {
    this.props.navigation.setOptions({
      title: formattedDate
    })
  }
  reset = () => {
    const { remove, goBack, entryId } = this.props;
    remove();
    goBack();
    removeEntry(entryId);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.metrics && !nextProps.metrics.today;
  }

  render() {
    const { entryId, metrics, formattedDate } = this.props
    this.setTitle(formattedDate)
    return (
      <View style={styles.container}>
        <MetricCard date={formattedDate} metrics={metrics} />
        <TextButton onPress={this.reset} style={{ margin: 20 }}>Reset</TextButton>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    padding: 15
  }
});



function mapStateToProps(state, { route }) {
  const { entryId, formattedDate } = route.params
  return {
    entryId,
    formattedDate,
    metrics: state[entryId]
  }
}

function mapDispatchToProps(dispatch, { route, navigation }) {
  const { entryId } = route.params;
  return {
    remove: () => dispatch(addEntry({
      [entryId]: timeToString() === entryId
        ? getDailyReminderValue()
        : null
    })),
    goBack: () => navigation.goBack()
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(EntryDetail);

