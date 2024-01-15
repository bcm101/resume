import { Component } from "react";
import '../../projects'
import ListOfCommands from "../../projects";

export default class InputTerminal extends Component {
    
    state = {
        previous_input: [],
        unknown_input: "Unknown command. Type 'help' for a list of commands"
    }

    commands = ListOfCommands()

    render() {
        return (
            <div id="terminal-input">
                {this.state.previous_input.map((str, i) => {
                    return (<div key={i}>
                        <div>&nbsp;</div>
                        <div>{this.props.input_start}{str}</div>
                        {!this.commands[str] && <div>
                            {this.state.unknown_input}
                        </div>}
                        {this.commands[str] && <div>
                            <div>&nbsp;</div>
                            {this.commands[str].output_lines.map((str, i) => {
                                if(str === ' ') return <div key={i}>&nbsp;</div>
                                return <div key={i}>{str}</div>
                            })}
                            {(this.commands[str].link || this.commands[str].github) && (
                                <div>
                                    <div>&nbsp;</div>
                                    <div>links: 
                                        {this.commands[str].link && <a href={this.commands[str].link}>site</a>} 
                                        {this.commands[str].link && this.commands[str].github && "/"}
                                        {this.commands[str].github && <a href={this.commands[str].github}>github</a>}
                                    </div>
                                </div>
                            )}
                        </div>}
                    </div>)
                })}
                <div>&nbsp;</div>
                <div className="scroll-to">{this.props.input_start}<input autoFocus className="cmd-input" onKeyDown={(e) => {
                    if(e.key === "Enter"){
                        let temp = this.state.previous_input
                        temp.push(e.target.value)
                        e.target.value = ""
                        window.setTimeout(() => {
                            document.getElementsByClassName("main-terminal")[0].scrollBy(0, 1000)
                        }, 10) // this scrolls to the bottom after some amount of time has passed
                        this.setState({previous_input: this.state.previous_input})
                    }
                }}></input></div>
            </div>
        )
    }


}