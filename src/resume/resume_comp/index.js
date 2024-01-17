import { Component } from "react"
import './resume.css'
import Resume_text from "./resume_text"

export default class Resume_Comp extends Component{

    state = {
        opacity: 0,
        speed: parseFloat(this.props.speed) || .1,
        wait_time: parseInt(this.props.wait_time) || 3000,
        become_seen: this.props.become_seen || false,
    }

    render() {

        if(this.state.become_seen)
            window.setTimeout(() => {
                if(this.state.opacity < 1){
                    this.setState({opacity: this.state.opacity+this.state.speed})
                }
            }, 50)

        if(!this.state.become_seen)
            window.setTimeout(() => {
                this.setState({become_seen: true})
            }, this.state.wait_time)
        
        if(this.state.become_seen)
            return (
            <div className="resume" style={{opacity: this.state.opacity}}>                
                {Resume_text && <div>
                    {Resume_text.map((e, i) => {
                        return (<div key={i}>
                            {e.title && <table key={`title-${i}`}><tbody><tr><td className="title-point-buffer"></td><td className="title-point wrap">{e.title}</td><td></td></tr></tbody></table>}
                            {e.sub_title && <table key={`sub-title-{i}`}><tbody><tr><td className="sub-title-point-buffer"></td><td className="sub-title-point wrap">{e.sub_title}</td><td></td></tr></tbody></table>}
                            {e.bullets.map((b, j) => {
                                return (<div key={`bullet-${j}`}>
                                    <table><tbody><tr className="bullet-row"><td className="bullet-buffer"></td><td className="bullet wrap">{b.bullet}</td><td className="details">{b.details}</td></tr></tbody></table>
                                    {b.sub_bullet && b.sub_bullet.map((sb, k) => {
                                        return <table key={`sub-bullet-${k}`}><tbody><tr className="bullet-row"><td className="sub-bullet-buffer"></td><td className="sub-bullet wrap"><li>{sb}</li></td><td></td></tr></tbody></table>
                                    })}
                                </div>)
                            })}
                        </div>)
                    })}
                </div>}
                <div className='end-page-buffer'></div>
            </div>
            )
        
        return (<div></div>)
    }
}
