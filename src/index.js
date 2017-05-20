require('babel-polyfill')

import React from 'react'
import ReactDOM  from 'react-dom'

import PersonList from './components/person-list'

document.addEventListener('DOMContentLoaded', () =>
    ReactDOM.render(<PersonList />, document.getElementById('app'))
)
