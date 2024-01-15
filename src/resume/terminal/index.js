import { Component } from "react"
import './typing'
import Typing from "./typing"
import './terminal.css'
import ASCII from './ASCII'
import './input_terminal'
import InputTerminal from "./input_terminal"

export default class Terminal extends Component{

    state = {
        done_typing: false,
        delay: 2800,
        input_start: "BMW@Sedna:~$ "
    }

    about_me = [
        " ",
        "about me: ",
        " ",
        "Hi! I am Brandon. I am looking for a full-time position in Computer Science in the Boston Area. I graduated in 2024 with a Master's degree in Computer Science and a Minor in Mathematics from the University of Massachussets Dartmouth. I was top of my class with a GPA of 3.9 with which I received several awards and scholarships. I wrote my Master's thesis on how to improve trust in AI by storing Machine Learning models in a decentralized blockchain environment. I have worked several summers as a web developement intern at Loomis Sayles based on Boston. I also have been a teacher's assistant for two Master's level Computer Science classes, and a mentor for an undergraduate Computer Science course."
    ]

    render() {
        return (
            <div className="terminal">
                <div className="terminal-top">
                    <div className="bar-button close">
                        <div>x</div>
                    </div>
                    <div className="bar-button change-size">
                        <div>&#9633;</div>
                    </div>
                    <div className="bar-button change-size">
                        <div>-</div>
                    </div>
                </div>
                <div className="main-terminal">
                    <Typing 
                        speed='80'
                        string="cat BMW_Resume.txt"
                        show_cursor="true"
                        time_before_typing='800'
                        end_cursor_time='2800'
                        before={this.state.input_start}
                        show_animation={`${!this.state.done_typing}`}
                    />
                    <div className="ASCII">
                        {!window.mobileAndTabletCheck() && ASCII.lines.map((str, i) => {
                            this.state.delay = 2800
                            return (<Typing 
                                speed="20"
                                string={str}
                                time_before_typing={this.state.delay+=i*80}
                                end_cursor_time="000"
                                before=""
                                show_animation={`${!this.state.done_typing}`}
                                key={i}
                            />)
                        })}
                    </div>
                    <div>
                        {this.about_me.map((str, i) => {
                            return (<Typing 
                                speed="5"
                                string={str}
                                time_before_typing={this.state.delay + i * 120}
                                end_cursor_time="000"
                                before=""
                                purge_multiple_spaces="true"
                                show_animation={`${!this.state.done_typing}`}
                                key={i}
                                callback={() => {
                                    if(i === this.about_me.length-1)
                                        setTimeout(() => {
                                            this.setState({done_typing: true})
                                        }, 500)
                                }}
                            />)
                        })}
                        {this.state.done_typing && (
                            <InputTerminal 
                                input_start={this.state.input_start}
                            />
                        )}
                    </div>
            
                </div>
            </div>
        )
    }
}