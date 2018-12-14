import React from 'react';
import {render} from 'react-dom';
import App from './components/app/App';
import {Store} from 'react-chrome-redux';
import {Provider} from 'react-redux';
import Raven from 'raven-js';
import { MuiThemeProvider } from '@material-ui/core/styles';
import AnalyticsUtil from '../../../utils/AnalyticsUtil';
import {SENTRY_TOKEN, muiTheme} from '../../../utils/Constants';

export const proxyStore = new Store({
  portName: 'chrome-ig-story'
});

if(SENTRY_TOKEN !== null) {
  Raven.config(SENTRY_TOKEN).install();
  window.addEventListener('unhandledrejection', event => {
    Raven.captureException(event.reason);
  });
}

// wait for the store to connect to the background page
proxyStore.ready().then(() => {
  var cookies = proxyStore.getState().popup.cookies;
  AnalyticsUtil.initializeMixpanel(cookies);
  AnalyticsUtil.initializeAmplitude(cookies);
  render(
    <Provider store={proxyStore}>
      <MuiThemeProvider theme={muiTheme}>
        <App/>
      </MuiThemeProvider>  
    </Provider>
    , document.getElementById('app'));
  });