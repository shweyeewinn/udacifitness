import 'react-native-gesture-handler';
import React from 'react'
import { View, Platform, Text, StatusBar, SafeAreaView } from 'react-native'

//Redux
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'

//Components
import AddEntry from './components/AddEntry'
import History from './components/History'
import EntryDetail from "./components/EntryDetail";
import Live from './components/Live';

// import { TabNavigator } from 'react-navigation'

//Fix
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { purple, white } from './utils/colors';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

import Constants from 'expo-constants';

import { createStackNavigator } from '@react-navigation/stack';


function UdaciStatusBar({ backgroundColor, ...props }) {
  return (
    <SafeAreaView style={{ backgroundColor, height: Constants.statusBarHeight }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  )
}

const Tabs =
  Platform.OS === "ios"
    ? createBottomTabNavigator()
    : createMaterialTopTabNavigator();

const RouteConfigs = {
  History: {
    name: "History",
    component: History,
    options: { tabBarIcon: ({ tintColor }) => <Ionicons name='ios-bookmarks' size={25} color={tintColor} style={{ paddingTop: 5, paddingBottom: 5 }} />, title: 'History' }
  },
  AddEntry: {
    component: AddEntry,
    name: "Add Entry",
    options: { tabBarIcon: ({ tintColor }) => <FontAwesome name='plus-square' size={25} color={tintColor} style={{ paddingTop: 5, paddingBottom: 5 }} />, title: 'Add Entry' }
  },
  Live: {
    component: Live,
    name: "Live",
    options: { tabBarIcon: ({ tintColor }) => <Ionicons name='ios-speedometer' size={30} color={tintColor} />, title: 'Live' }
  }
}

const TabNavigatorConfig = {
  navigationOptions: {
    header: null
  },
  tabBarOptions: {
    activeTintColor: Platform.OS === "ios" ? purple : white,
    style: {
      height: 86,
      backgroundColor: Platform.OS === "ios" ? white : purple,
      shadowColor: "rgba(0, 0, 0, 0.24)",
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowRadius: 6,
      shadowOpacity: 1
    }
  }
}

const Tab = Platform.OS === 'ios'
  ? createBottomTabNavigator()
  : createMaterialTopTabNavigator()


const TabNav = () => (
  <Tab.Navigator {...TabNavigatorConfig}>
    <Tab.Screen {...RouteConfigs['History']} />
    <Tab.Screen {...RouteConfigs['AddEntry']} />
    <Tab.Screen {...RouteConfigs['Live']} />
  </Tab.Navigator>
)

//Config for StackNavigator
const StackNavigatorConfig = {
  headerMode: "screen"
}

const StackConfig = {
  TabNav: {
    name: "Home",
    component: TabNav,
    options: { headerShown: false }
  },
  EntryDetail: {
    name: "EntryDetail",
    component: EntryDetail,
    options: {
      headerTintColor: white,
      headerStyle: {
        backgroundColor: purple
      },
      title: "Entry Detail"
    }
  }
}

const Stack = createStackNavigator();
const MainNav = () => (
  <Stack.Navigator {...StackNavigatorConfig}>
    <Stack.Screen {...StackConfig['TabNav']} />
    <Stack.Screen {...StackConfig['EntryDetail']} />
  </Stack.Navigator>
)


class App extends React.Component {
  render() {
    const store = createStore(reducer)
    return (
      <Provider store={store}>
        <UdaciStatusBar backgroundColor={purple} barStyle="light-content" />
        <NavigationContainer >
          <MainNav />
        </NavigationContainer>
      </Provider>
    )
  }
}
export default App;