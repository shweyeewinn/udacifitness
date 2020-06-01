import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { receiveEntries, addEntry } from '../actions';
import { timeToString, getDailyReminderValue } from '../utils/helpers';
import { fetchCalendarResults } from '../utils/api'
import { Calendar, Agenda, calendarTheme } from 'react-native-calendars';
import { red, blue, white } from '../utils/colors';
import UdaciFitnessCalendar from 'udacifitness-calendar';
import DateHeader from './DateHeader';
import MetricCard from './MetricCard'
import { AppLoading } from 'expo';

import * as SplashScreen from 'expo-splash-screen';

// Prevent native splash screen from autohiding before App component declaration
SplashScreen.preventAutoHideAsync()
  .then(result => console.log(`SplashScreen.preventAutoHideAsync() succeeded: ${result}`))
  .catch(console.warn); // it's good to explicitly catch and inspect any error



class History extends Component {
  state = {
    ready: false
  }


  componentDidMount() {
    const { dispatch } = this.props;
    // Hides native splash screen after 2s
    setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 2000);

    fetchCalendarResults()
      .then((entries) => dispatch(receiveEntries(entries)))
      .then(({ entries }) => {
        if (!entries[timeToString()]) {
          dispatch(addEntry({
            [timeToString()]: getDailyReminderValue()
          }))
        }
      })
      .then(() => this.setState(() => ({ ready: true })))
  }

  renderItem = ({ today, ...metrics }, formattedDate, key) => {
    console.log('today', today)
    return (
      <View style={styles.item}>
        {today
          ? <View>
            <DateHeader date={formattedDate} />
            <Text style={styles.noDataText}>
              {today}
            </Text>
          </View>
          : <TouchableOpacity
            onPress={() => this.props.navigation.navigate(
              'EntryDetail',
              {
                entryId: key,
                formattedDate: formattedDate
              }
            )}
          >
            <MetricCard date={formattedDate} metrics={metrics} />
          </TouchableOpacity>
        }
      </View>
    )
  }
  renderEmptyDate(formattedDate) {
    return (
      <View style={styles.item}>
        <DateHeader date={formattedDate} />
        <Text style={styles.noDataText}>
          You didn't log any data on this day.
        </Text>
      </View>
    )
  }

  render() {
    const { entries } = this.props;
    const { ready } = this.state;

    if (ready === false) {
      return (
        // <AppLoading />
        <View><Text>Loading...</Text></View>
      )
    }

    return (
      <UdaciFitnessCalendar
        items={entries}
        renderItem={this.renderItem}
        renderEmptyDate={this.renderEmptyDate}
      />
    )
  }

  // async _cacheResourcesAsync() {
  //   const images = [require('./assets/snack-icon.png')];

  //   const cacheImages = images.map(image => {
  //     return Asset.fromModule(image).downloadAsync();
  //   });
  //   return Promise.all(cacheImages);
  // }

}

const styles = StyleSheet.create({
  item: {
    backgroundColor: white,
    borderRadius: Platform.OS === 'ios' ? 16 : 2,
    padding: 20,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 17,
    justifyContent: 'center',
    shadowRadius: 3,
    shadowOpacity: 0.8,
    shadowColor: 'rgba(0, 0, 0, 0.24)',
    shadowOffset: {
      width: 0,
      height: 3
    },
  },
  noDataText: {
    fontSize: 20,
    paddingTop: 20,
    paddingBottom: 20
  }
})

function mapStateToProps(entries) {
  return {
    entries
  }
}
export default connect(mapStateToProps)(History);

