import React, { Component } from 'react';
import { YellowBox } from 'react-native';
import OneSignal from 'react-native-onesignal';

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket',
  'OneSignal'
])

import Routes from './routes';

export default class App extends Component {
  constructor(properties) {
    super(properties);
    OneSignal.init("a29e7661-57b5-460a-ad25-9a1427227657");

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.configure(); 	// triggers the ids event
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onIds(device) {
    console.log('Device info: ', device);
  }

  render() {
    return (
      <Routes />
    );
  }
}
