import { Component } from "react"
import './typing'
import Typing from "./typing"
import './terminal.css'
import ASCII from './ASCII'


export default class Terminal extends Component{

    state = {
        done_typing: false
    }

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
                <div className="terminal-side"></div>
                <div className="main-terminal">
                <Typing 
                    speed='80'
                    string="cat BMW_Resume.txt"
                    show_cursor="true"
                    time_before_typing='800'
                    end_cursor_time='2800'
                    before="BMW@Sedna:~$ "
                />
                <div className="ASCII">
                    {ASCII.lines.map((str, i) => {
                        return (<Typing 
                            speed="20"
                            string={str}
                            time_before_typing={2800+i*80}
                            end_cursor_time="000"
                            before=""
                            key={i}
                        />)
                    })}
                </div>
                </div>
                <div className="terminal-side"></div>
                <div className="terminal-bottom"></div>
            </div>
            
        )
    }
}

// <Typing 
//                         speed='20'
//                         string="hello world this is my resume"
//                         show_cursor='false'
//                         time_before_typing='0'
//                         end_cursor_time='0'
//                     />
                    
//                     <Typing 
//                         speed='200' 
//                         string="cat resume.txt" 
//                         show_cursor="true" 
//                         time_before_typing='1200'
//                         end_cursor_time='3000'
//                         before="BMW@Sedna$&nbsp; > "
//                     />