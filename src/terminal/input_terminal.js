import { Component } from "react";
import Typing from "./typing";
import Commands from "./commands";
import FileSystem from "../file_system";
import '../util'

export default class InputTerminal extends Component {
    
    state = {
        cmd_history: this.props.initial_command ? [this.props.initial_command]: [],
        recorded_outputs: 0,
        is_done_typing: this.props.initial_command ? false: true,
        need_resolve_cmd: true,
        in_editor: false
    }

    data = {
        up: 0,
        prompt: this.props.prompt || "",
        current_output: [],
        prev_outputs: [],
        FS: this.props.fileSystem || new FileSystem(),
        onMobile: window.mobileAndTabletCheck()
    }

    print(arr, show_animation) {
        let ji = 0;
        return arr.map((d, j) => {
            if(d.no_render_mobile && this.data.onMobile){
                ji++;
                return;
            }

            return <Typing 
                string={d.line}
                show_animation={show_animation}
                time_before_typing={j*40 - ji * 40}
                speed="5"
                key={j}
                purge_multiple_spaces={d.remove_spaces}
                className={d.className}
                link={d.link}
            />
        })
    }

    wait_done_typing(){
        window.setTimeout(() => {
            let items_typing = document.getElementsByClassName("is-typing").length

            if(items_typing > 0){
                this.wait_done_typing()
                document.getElementsByClassName("main-terminal")[0].scrollBy(0, 1000)
            }else if(this.state.recorded_outputs < this.state.cmd_history.length){
                this.data.prev_outputs = [...this.data.prev_outputs, ...this.data.current_output]
                this.data.current_output = []
                this.setState({
                    is_done_typing: true,
                    recorded_outputs: this.state.recorded_outputs +1
                })
            }
        }, 100)
    }

    componentDidUpdate(){
        if(!this.state.is_done_typing && !this.state.need_resolve_cmd)
            this.wait_done_typing()
    }

    componentDidMount(){
        if(this.props.initial_command)
            this.wait_done_typing()
    }

    async resolveCmd(){

        window.setTimeout(async () => {
            const before = this.data.prompt + this.data.FS.getPath() + '$ ';

            if(this.state.recorded_outputs < this.state.cmd_history.length) { // have a new command, state was just updated
                let line = this.state.cmd_history[this.state.cmd_history.length-1]
                let args = line.split("-").filter(arg => arg !== "").map(arg => arg.split(' ').filter(arg => arg !== ""))
                let cmd = args[0][0]

                let commands = new Commands()

                this.data.prev_outputs = [...this.data.prev_outputs, {line: before+line, remove_spaces: true}]

                if(commands[cmd])
                    try {
                        this.data.current_output = await commands[cmd](args, this.data.FS, this)
                    }
                    catch(_e){
                        this.data.current_output = [
                            {line: "Error in processing command", remove_spaces: true, className: "command-output-error"}, 
                            {line: " ", remove_spaces: false, className: ""}
                        ]
                    }
                else
                    this.data.current_output = [
                        {line: "Unknown command. Type 'help' for a list of commands", remove_spaces: true, className: "command-output-error"}, 
                        {line: " ", remove_spaces: false, className: ""}
                    ]

                this.setState({need_resolve_cmd: false})
            }

        }, 10)
    }

    render() {

        const before = this.data.prompt + this.data.FS.getPath() + '$ ';
        if(this.state.need_resolve_cmd)
            this.resolveCmd()

        return (
            <div className="input-terminal">
                <div hidden={this.state.in_editor} className="commands">
                    {this.print(this.data.prev_outputs)}
                    {this.print(this.data.current_output, true)}
                    {this.state.is_done_typing && <div>
                        {before}<input autoFocus className="cmd-input" defaultValue="" onKeyDown={(e)=> {
                            if(e.key === "Enter" && e.target.value.split(' ').join('') !== ""){
                            this.setState({
                                cmd_history: [...this.state.cmd_history, e.target.value], 
                                is_done_typing: false,
                                need_resolve_cmd: true
                            })
                        }
                        }}></input>
                    </div>}
                </div>
                <div hidden={!this.state.in_editor}  className="editor">
                        hello
                </div>
            </div>
        )
    }
    
}