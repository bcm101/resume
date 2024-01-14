import { Component } from "react"


export default class Typing extends Component{

    state = {
        numbers_shown: 0,
        string: this.props.string,
        speed: parseInt(this.props.speed),
        current_string: "",
        show_cursor: this.props.show_cursor,
        toggle_cursor: false,
        time_before_typing: parseInt(this.props.time_before_typing),
        total_time: 0,
        end_cursor_time: parseInt(this.props.end_cursor_time),
        called_callback: false
    }

    render() {
        window.setTimeout(() => {
            if(this.state.numbers_shown < this.state.string.length && this.state.total_time >= this.state.time_before_typing) {
                this.state.current_string += this.state.string[this.state.numbers_shown]
                this.setState({numbers_shown: this.state.numbers_shown+1, total_time: this.state.total_time+this.state.speed})
            }else if(this.state.total_time <= this.state.end_cursor_time || this.state.total_time <= this.state.time_before_typing){
                this.setState({total_time: this.state.total_time+this.state.speed, toggle_cursor: !this.state.toggle_cursor})
            }else{
                if(this.state.show_cursor)
                    this.setState({show_cursor: false})
            }
        }, this.state.speed)

        if(this.state.numbers_shown == this.state.string.length && !this.state.called_callback && this.props.callback){
            this.state.called_callback = true;
            this.props.callback()
        }
    
        return (
            <div>
                {this.props.before}
                {this.state.current_string.replace(/ /g, "\u00A0")}
                {this.state.show_cursor && this.state.numbers_shown !== this.state.string.length && this.state.numbers_shown !== 0 && '|'}
                {this.state.show_cursor && this.state.toggle_cursor && (!this.state.numbers_shown || this.state.numbers_shown == this.state.string.length) && '|'}
            </div>
        )
    }
}

