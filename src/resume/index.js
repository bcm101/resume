import Terminal from './terminal';
import Resume_Comp from './resume_comp'
import './resume_page.css'

function Resume() {

    return (
      <div className='resume-page'>
        <div className='resume-contents'>
          <Terminal/>
          <Resume_Comp speed=".03"/>
        </div>
      </div>
    )
  }
  
export default Resume;
  