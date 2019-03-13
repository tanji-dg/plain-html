import React from 'react';
import ReactDOM from 'react-dom';

import '../../node_modules/normalize.css/normalize.css';
import './index.css';

import { i18n } from '../services';
import App from '../App';

ReactDOM.render(
  <App i18n={i18n} />,
  window.document.getElementById('root')
);
