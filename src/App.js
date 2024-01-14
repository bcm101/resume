import logo from './logo.svg';
import './App.css';
import Resume from './resume';

export default function App() {

  // this is my makeshift router since GH pages only allows single page applications :)

  let params = new URLSearchParams(window.location.search)
  let site = params.get('site')
  

  return (
    <div id="App">
      <Resume />
    </div>
  );
}
