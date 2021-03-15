import {React} from 'react';
import './App.css';
import { TreeDataProvider } from './provider';
import { TreeView } from './tree-view'


function App() {
  return (
    <TreeDataProvider>
      <TreeView />
    </TreeDataProvider>
  );
}

export default App;
