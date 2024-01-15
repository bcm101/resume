import { Component } from "react"
import './resume.css'

export default class Resume_Comp extends Component{

    state = {
        opacity: 0,
        speed: parseFloat(this.props.speed) || .1,
        wait_time: parseInt(this.props.wait_time) || 3000,
        become_seen: this.props.become_seen || false,
    }

    resume_text = [
        {title: "Education", sub_title: "UMD, Dartmouth, MA", bullets: [
            {bullet: "BS in Computer Science", details: ""},
            {bullet: "Minor in Mathematics", details: ""},
            {bullet: "MS in Computer Science", details: ""}
        ]},
        {title: "Skills", bullets: [
            {bullet: "Languages: C, C++, Java, JavaScript, Python, Elixir, HTML, CSS", details: ""},
            {bullet: "Libraries: React.js, Chart.js, jQuery, and Ajax.js, Phoenix framework for Elixir", details: ""},
            {bullet: "Environments: Eclipse, Visual Studio Code", details: ""}
        ]},
        {title: "Academia", bullets: [
            {bullet: "Deep learning methods for image classification", details: "Nov. 2019 - Mar. 2020", sub_bullet: [
                "Developed deep learning neural network utilizing C programming language to achieve maximum flexibility in net architecture."
            ]},
            {bullet: "Storage of Machine Learning models on decentralized systems", details: "whatever time i was working on my thesis"}
        ]},
        {title: "Experience", bullets: [
            {bullet: "Internship at Loomis Sayles", details: "Summers of 2018 - 2022", sub_bullet: [
                "Both paid and unpaid internships where I lead a team of interns.",
                "During COVID, transfered to online rather than in-office",
                "Full-stack web development utilizing Java, Javascript, HTML, Elixir, and the frameworks of React.JS and Pheonix"
            ]},
            {bullet: "Storage of Machine Learning models on decentralized systems", details: "whatever time i was working on my thesis"}
        ]},
    ]

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
                {this.resume_text && <table><tbody>
                    {this.resume_text.map((e) => {
                        return (<div>
                            {e.title && <tr><td className="title-point-buffer"></td><td className="title-point wrap">{e.title}</td><td></td></tr>}
                            {e.sub_title && <tr><td className="sub-title-point-buffer"></td><td className="sub-title-point wrap">{e.sub_title}</td><td></td></tr>}
                            {e.bullets.map((b) => {
                                return (<div>
                                    <tr className="bullet-row"><td className="bullet-buffer"></td><td className="bullet wrap">{b.bullet}</td><td className="details">{b.details}</td></tr>
                                    {b.sub_bullet && b.sub_bullet.map((sb) => {
                                        return <div><tr className="bullet-row"><td className="sub-bullet-buffer"></td><td className="sub-bullet wrap"><li>{sb}</li></td><td></td></tr></div>
                                    })}
                                </div>)
                            })}
                        </div>)
                    })}
                </tbody></table>}
            </div>
            )
        
        return (<div></div>)
    }
}
