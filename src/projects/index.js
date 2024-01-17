import MazeGeneration from "./maze_generation"


export default function ListOfCommands() {

    let Apps = {
        "mazeGenerator": {
            output_lines: ["test for generation of a maze"],
            link: window.location.href,
            class: MazeGeneration
        },
        
    }

    let Projects = {
        
    }

    let help = {
        "help": {
            output_lines: [
                "hello there"
            ],
            link: "test",
            github: "test again"
        }
    }

    return {...Apps, ...help}
}
