import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableWithoutFeedback
} from 'react-native'

import AddEntry from './components/AddEntry'

export default class App extends React.Component {
  handlePress = () => {
    alert('Hello')
  }

  render() {
    return (
      <View style={styles.container}>
        <AddEntry />
        {/* <TouchableHighlight style={styles.btn} onPress={this.handlePress} underlayColor='#000'>
          <Text style={styles.btnText}>Touchable Highlight</Text>
        </TouchableHighlight> */}
        {/* <TouchableOpacity style={styles.btn} onPress={this.handlePress}>
          <Text style={styles.btnText}>Touchable Opacity</Text>
        </TouchableOpacity> */}
        {/* <TouchableWithoutFeedback onPress={this.handlePress}>
          <View style={styles.btn}><Text style={styles.btnText}>Touchable Without Feedback</Text></View>
        </TouchableWithoutFeedback> */}
        {/* Only supported for Android */}
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.SelectableBackground}
          onPress={this.handlePress}>
          <View style={styles.btn}><Text style={styles.btnText}>TouchableNativeFeedback</Text></View>
        </TouchableNativeFeedback>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    backgroundColor: '#E53224',
    padding: 10,
    paddingLeft: 50,
    paddingRight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  btnText: {
    color: '#fff'
  }
})

