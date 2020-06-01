import React, { Component } from "react";
import { View, TouchableOpacity, Text, Platform, StyleSheet } from "react-native";
import { getMetricMetaInfo, timeToString, getDailyReminderValue } from "../utils/helpers";
import UdacitSlider from './UdacitSlider'
import UdaciSteppers from './UdaciSteppers'
import DateHeader from './DateHeader'
import { Ionicons } from '@expo/vector-icons'
import TextButton from './TextButton'
import { connect } from 'react-redux'
import { submitEntry, removeEntry } from '../utils/api'
import { addEntry } from '../actions'
import { white, purple } from '../utils/colors';
import { CommonActions } from '@react-navigation/native'

function SubmitBtn({ onPress }) {
  return (
    <TouchableOpacity
      style={Platform.OS === 'ios' ? styles.iosSubmitButton : styles.androidSubmitButton}
      onPress={onPress}>
      <Text style={styles.submitBtnText}>SUBMIT</Text>
    </TouchableOpacity>
  )
}

class AddEntry extends Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0,
  }
  //For run, bike, swim
  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric);
    console.log('Max', max);
    console.log('Step', step);

    this.setState((state) => {
      const count = state[metric] + step
      return {
        ...state,
        [metric]: count > max ? max : count
      }
    })
  }
  //For run, bike, swim
  decrement = (metric) => {
    const { step } = getMetricMetaInfo(metric);
    console.log('Step', step);

    this.setState((state) => {
      const count = state[metric] - step
      return {
        ...state,
        [metric]: count < 0 ? 0 : count
      }
    })
  }
  //For sleep, eat
  slide = (metric, value) => {
    this.setState(() => ({
      [metric]: value
    }))
  }


  submit = () => {
    const key = timeToString()
    const entry = this.state

    //Update Redux
    this.props.dispatch(addEntry(
      {
        [key]: entry
      }
    ))

    this.setState({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0,
    })
    //Navigate to home
    this.toHome();

    //Save to Database
    submitEntry({ entry, key })

    //Clean local notification

  }


  reset = () => {
    const key = timeToString()

    //Update Redux
    this.props.dispatch(addEntry(
      {
        [key]: getDailyReminderValue()
      }
    ))

    //Route to Home
    this.toHome();

    //Update Database
    removeEntry(key)

  }

  toHome = () => {
    this.props.navigation.dispatch(
      CommonActions.goBack({
        key: 'AddEntry',
      }))
  }


  render() {
    const metaInfo = getMetricMetaInfo()
    console.log('metaInfo', Object.keys(metaInfo))
    console.log('alreadyLogged', this.props.alreadyLogged)

    if (this.props.alreadyLogged) {
      return (
        <View style={styles.center}>
          <Ionicons name={Platform.OS === 'ios' ? 'ios-happy' : 'md-happy'}
            size={100}
          />
          <Text>You already logged your information for today.</Text>
          <TextButton style={{ padding: 10 }} onPress={this.reset}>
            Reset
        </TextButton>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <DateHeader date={(new Date()).toLocaleDateString()} />
        {/* <Text>{JSON.stringify(this.state)}</Text> */}
        {
          Object.keys(metaInfo).map((key) => {
            const { getIcon, type, ...rest } = metaInfo[key]
            const value = this.state[key]
            return (
              <View key={key} style={styles.row}>
                {getIcon()}
                {
                  type === 'slider'
                    ? <UdacitSlider
                      value={value}
                      onChange={(value) => this.slide(key, value)}
                      {...rest}
                    />
                    : <UdaciSteppers
                      value={value}
                      onIncrement={() => this.increment(key)}
                      onDecrement={() => this.decrement(key)}
                      {...rest}
                    />
                }
              </View>
            )
          })
        }
        <SubmitBtn onPress={this.submit} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  iosSubmitButton: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
  },
  androidSubmitButton: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,
  }
})
function mapStateToProps(state) {
  const key = timeToString()
  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined'
  }
}

export default connect(mapStateToProps)(AddEntry)