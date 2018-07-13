// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

// pollyfill Modal component on web.
const ReactNative = require('react-native')
const Modal = require('./ModalComponent/Modal')
ReactNative.Modal = Modal

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
