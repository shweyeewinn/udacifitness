import React, { Component } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { getMetricMetaInfo, timeToString } from "../utils/helpers";
import UdacitSlider from './UdacitSlider'
import UdaciSteppers from './UdaciSteppers'
import DateHeader from './DateHeader'
import { Ionicons } from '@expo/vector-icons'
import TextButton from './TextButton'

function SubmitBtn({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}>
      <Text>SUBMIT</Text>
    </TouchableOpacity>
  )
}
export default class AddEntry extends Component {
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
    this.setState({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0,
    })
    //Navigate to home

    //Save to Database

    //Clean local notification

  }
  reset = () => {
    const key = timeToString()

    //Update Redux

    //Route to Home

    //Update Database
  }
  render() {
    const metaInfo = getMetricMetaInfo()
    console.log('metaInfo', Object.keys(metaInfo))

    if (this.props.alreadyLogged) {
      return (
        <View>
          <Ionicons name='md-happy' size={100} />
          <Text>You already logged your information for today.</Text>
          <TextButton onPress={this.reset}>
            Reset
        </TextButton>
        </View>
      )
    }
    return (
      <View>
        <DateHeader date={(new Date()).toLocaleDateString()} />
        {/* <Text>{JSON.stringify(this.state)}</Text> */}
        {
          Object.keys(metaInfo).map((key) => {
            const { getIcon, type, ...rest } = metaInfo[key]
            const value = this.state[key]
            return (
              <View key={key}>
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