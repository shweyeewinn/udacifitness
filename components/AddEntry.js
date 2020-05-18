import React, { Component } from "react";
import { View, Text } from "react-native";
import { getMetricMetaInfo } from "../utils/helpers";
import UdacitSlider from './UdacitSlider'
import UdaciSteppers from './UdaciSteppers'
import DateHeader from './DateHeader'

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

  render() {
    const metaInfo = getMetricMetaInfo()
    console.log('metaInfo', Object.keys(metaInfo))

    return (
      <View>
        <DateHeader date={(new Date()).toLocaleDateString()} />
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
      </View>
    );
  }
}