
export default function ListOfCommands() {

    let ret = {
        "resume": {
            output_lines: [
                "This is the website you see before you now!",
                " ",
                "I started this project in Janurary of 2024 as I entered the job search. This site was made by hand using React.JS, and was designed to resemble a linux terminal. This is hosted using github pages, which is quite useful... however github pages does not allow for multiple pages, so this website, although containing multiple subsites for other projects, is contained as a single page. ",
                " ",
                "skills needed to create",
                " - using JS/React.JS in a browser",
                " - hosting a website",
                " - working with styling using CSS"
            ],
            link: window.location.href,
            github: "https://github.com/bcm101/resume"
        },
        "wayne-buck-bot": {
            output_lines: [
                "This a project I made for me and my friends in early college.",
                " ",
                "This project is a discord bot that I made to act as a way to track a digital currency that was shared among my friends. This currency was used for dares as opposed to wasting real money. We had commands to make bets, do dares, etc., and it was created using Node JS.",
                " ",
                "skills needed to create: ",
                " - working with APIs",
                " - interacting with users using chat tools",
                " - using tokens to login as a bot to a social media"
            ],
            github: "https://github.com/bcm101/wayne-buck-bot"
        },
        "maze-maker": {
            output_lines: [
                "Creates a maze with customizable options!",
                " ",
                "I made this for both my sister and Mom as both work with kids.",
                " ",
                "skills needed to create:",
                " - an understanding of [Algorithm]",
            ],
            link: window.location.href+"?type=maze-maker"
        },
        "word-search-maker": {
            output_lines: [
                "Creates a word search with customizable options!",
                " ",
                "I made this site to help my Mom's teaching, as she teaches Orton Gillingham (reading teacher). ",
                " ",
                "skills needed to create:",
                " - an understanding of [Algorithm]",
            ],
            link: window.location.href+"?type=word-search-maker"
        }
    }

    ret['help'] = {
        output_lines: (() => {
            return Object.keys(ret)
        })(),
        link: null
    }


    return ret
}
