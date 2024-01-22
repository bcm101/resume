import './App.css';
import Resume from './resume';
import Terminal from './terminal';
import FileSystem from './file_system';
import { Component } from 'react';

export default class App extends Component{

  state = {
    loaded_FS: false
  }

  params = new URLSearchParams(window.location.search)
  no_open_resume = this.params.get('no_open_resume')
  opened_file = this.params.get("opened_file")

  fileSystem = new FileSystem(async (FS) => {

    this.setState({loaded_FS: true})

    if(this.opened_file){ // if a file is opened by this site
      const path = this.opened_file.split('/')
      const fileName = path.pop()

      // function to set innerhtml while still running any JS
      function setInnerHTML(elm, html) {
        elm.innerHTML = html;
        
        Array.from(elm.querySelectorAll("script"))
            .forEach( oldScriptEl => {
            const newScriptEl = document.createElement("script");
            
            Array.from(oldScriptEl.attributes).forEach( attr => {
                newScriptEl.setAttribute(attr.name, attr.value) 
            });
            
            const scriptText = document.createTextNode(oldScriptEl.innerHTML);
            newScriptEl.appendChild(scriptText);
            
            oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);
        });
      }

      const fileText = (await FS.openFile(fileName, path))
      if(fileText){
        const processed = fileText.map((o) => {
          if(o.line) return o.line;
          else return o;
        }).join(' ')
  
        setInnerHTML(document.getElementById('page'), processed)
      }else 
        document.getElementById('page').innerHTML = "file not found"

    }
  })

  render() {

    const wait_time = 2500 // literally just a random amount of time before loading my resume so it isnt abrubt !

    if(!this.opened_file)
      return (
      <div id="App">
        <Terminal open_resume={!this.no_open_resume} fileSystem={this.fileSystem} wait_time={wait_time}/>
        {!this.no_open_resume && <Resume wait_time={wait_time}/>}
      </div>
      )
    
    return (<div></div>)
  }
  
}
