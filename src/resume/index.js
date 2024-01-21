import { Component } from 'react'
import Resume_Comp from './resume_comp'
import './resume_page.css'

export default class Resume extends Component {
  render() {
    return (<div className='resume-page'>
      <div className='resume-contents'>
        <Resume_Comp speed=".03" wait_time={this.props.wait_time}/>
      </div>
    </div>)
  }
}
  