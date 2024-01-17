import { Component } from "react";
import ListOfCommands from "../../projects";

export default class InputTerminal extends Component {
    

    state = {
        previous_input: [],
        unknown_input: "Unknown command. Type 'help' for a list of commands"
    }
    num_ups = 0

    commands = ListOfCommands()

    handleArgs = (cmd, args) => {

        let command = this.commands[cmd]

        if(!command.class) return [`command ${cmd} takes no args`]

        let cmd_class = new command.class()
        let unrecognized_arg = null

        args.forEach(arg => {
            if(cmd_class[arg]){
                cmd_class[arg]()
            }else{
                unrecognized_arg = arg
            }
        });

        if(unrecognized_arg) return [`unrecognized arg: ${unrecognized_arg}`]

        return ["its being handled lol also this is an array now"]
    }

    print = (arr) => {
        return arr.map((line,i) => {
            if(line === ' ') return <div key={i}>&nbsp;</div>
            return <div key={i}>{line}</div>
        })
    }

    render() {
        return (
            <div id="terminal-input">
                {this.state.previous_input.map((str, i) => {
                    let args = str.split("-").filter(arg => arg !== "").map(arg => arg.trim())
                    let cmd = args[0].trim()

                    args = args.slice(1)

                    return (<div key={i}>
                        <div>&nbsp;</div>
                        <div>{this.props.input_start}{str}</div>
                        {!this.commands[cmd] && <div>
                            {this.state.unknown_input}
                        </div>}
                        {this.commands[cmd] && <div>
                            {!args.length && 
                                <div>
                                    {this.print(this.commands[cmd].output_lines)}
                                    {(this.commands[cmd].link || this.commands[cmd].github) && (
                                        <div>
                                            <div>&nbsp;</div>
                                            <div>links: 
                                                {this.commands[cmd].link && <a href={this.commands[cmd].link}>site</a>} 
                                                {this.commands[cmd].link && this.commands[cmd].github && "/"}
                                                {this.commands[cmd].github && <a href={this.commands[cmd].github}>github</a>}
                                            </div>
                                        </div>
                                    )}
                                </div>}
                            {args.length > 0 && <div>
                                {this.print(this.handleArgs(cmd, args))}
                            </div>}
                        </div>}
                    </div>)
                })}
                <div>&nbsp;</div>
                <div className="scroll-to">{this.props.input_start}<input autoFocus className="cmd-input" onKeyDown={(e) => {
                    if(e.key === "Enter"){
                        let temp = this.state.previous_input
                        temp.push(e.target.value)
                        e.target.value = ""
                        this.num_ups = 0
                        window.setTimeout(() => {
                            document.getElementsByClassName("main-terminal")[0].scrollBy(0, 1000)
                        }, 10) // this scrolls to the bottom after some amount of time has passed
                        this.setState({previous_input: this.state.previous_input})
                    }else if(e.key === "ArrowUp"){
                        e.target.value = this.state.previous_input[this.state.previous_input.length -1 -this.num_ups]
                        if(this.num_ups < this.state.previous_input.length - 1)
                            this.num_ups++
                    }else if(e.key === "ArrowDown"){
                        e.target.value = this.state.previous_input[this.state.previous_input.length -1 -this.num_ups]
                        if(this.num_ups > 0)
                            this.num_ups--
                    }
                }}></input></div>
            </div>
        )
    }


}