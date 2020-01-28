import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from './src/reducers';
import RouterComponent from './src/Router';
import crashlytics from '@react-native-firebase/crashlytics';
import PushNotification from "react-native-push-notification";


PushNotification.cancelAllLocalNotifications()
crashlytics().setCrashlyticsCollectionEnabled(true);
console.disableYellowBox = true
export default class App extends Component{

  constructor(){
    super();
  }

  render(){
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
    return (
      <Provider store={store}>
        <RouterComponent/>
      </Provider>
    );
  };
}