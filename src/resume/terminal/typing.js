import { Component } from "react"


// this component gives the typing animation for the console


export default class Typing extends Component{

    state = {
        numbers_shown: 0, //tracking numbers shown in current string
        string: this.props.string, // given string to type
        speed: parseInt(this.props.speed), // time to delay after each tick
        current_string: "", // current string
        show_cursor: this.props.show_cursor, // wheather to show cursor or not
        toggle_cursor: false,
        time_before_typing: parseInt(this.props.time_before_typing), // time before it begings typing
        total_time: 0,
        end_cursor_time: parseInt(this.props.end_cursor_time), // time before cursor dissapears
        called_callback: false,
        purge_multiple_spaces: this.props.purge_multiple_spaces, // whether to include multiple spaces in a row
        show_animation: this.props.show_animation // whether to show the animation at all
    }

    render() {
        window.setTimeout(() => {
            if(this.state.show_animation !== "false")
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

        if(this.state.numbers_shown === this.state.string.length && !this.state.called_callback && this.props.callback){
            this.state.called_callback = true;
            this.props.callback()
        }
        if(this.state.show_animation === "false")
            return (
                <div>
                    {this.props.before}
                    {this.state.purge_multiple_spaces && this.state.string}
                    {(!this.state.purge_multiple_spaces || this.state.current_string === ' ') && this.state.string.replace(/ /g, "\u00A0")}
                </div>
            )
        return (
            <div>
                {this.props.before}
                {(!this.state.purge_multiple_spaces || this.state.current_string === ' ') && this.state.current_string.replace(/ /g, "\u00A0")}
                {this.state.purge_multiple_spaces && this.state.current_string}
                {this.state.show_cursor && this.state.numbers_shown !== this.state.string.length && this.state.numbers_shown !== 0 && '|'}
                {this.state.show_cursor && this.state.toggle_cursor && (!this.state.numbers_shown || this.state.numbers_shown === this.state.string.length) && '|'}
            </div>
        )
    }
}

