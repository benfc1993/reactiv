import { App } from './App';
import { CreateDOM } from './CreateDOM';
import './style.css';

CreateDOM('root', (): Node => {
  return <App />;
});
