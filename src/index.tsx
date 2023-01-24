import { App } from './App';
import { Component } from './Components/Component';
import { CreateDOM } from './CreateDOM';
import './style.css';

CreateDOM('root', (): Node => {
  return <App />;
});
