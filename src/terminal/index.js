import { Component } from "react"
import InputTerminal from './input_terminal'
import './terminal.css'
import Typing from "./typing"

export default class Terminal extends Component{

    state = {
        readyForLiveTerminal: !this.props.open_resume
    }

    open_resume = this.props.open_resume
    prompt = "BMW@Sedna:"
    initial_command = "cat BMW_Resume.txt"
    wait_time = this.props.wait_time

    make_input_terminal () {
        return <div>
            {this.open_resume && <InputTerminal prompt={this.prompt} initial_command={this.initial_command} fileSystem={this.props.fileSystem}/>}
            {!this.open_resume && <InputTerminal prompt={this.prompt} fileSystem={this.props.fileSystem}/>}
        </div>
    }

    render() {

        window.setTimeout(() => {
            if(!this.state.readyForLiveTerminal)
                this.setState({readyForLiveTerminal: true})
        }, this.wait_time);

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
                    {!this.state.readyForLiveTerminal && <Typing 
                        before_string={this.prompt + '~$ '}
                        string={this.initial_command}
                        speed="50"
                        show_animation="true"
                        show_cursor="true"
                        time_before_typing="1000"
                        time_after_typing="800"
                    />}
                    {this.state.readyForLiveTerminal && this.make_input_terminal()}
                    
                </div>
            </div>
        )
    }
}


