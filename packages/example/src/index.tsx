import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from './state';
import Calculator from './calculator';
import Welcome from './welcome-component';
import { LongList } from './long-list';

ReactDOM.render(
  <Provider>
    <Welcome />
    <Calculator />
    <LongList />
  </Provider>,
  document.getElementById('entry'),
);
