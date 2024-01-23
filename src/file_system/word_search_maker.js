const str = `<head>
    <title>Word Search Maker</title>
</head>
<body>
    <style>
        .title {
            text-align: center;
        }
        #content{
            width: 90%;
            margin-left: auto;
            margin-right: auto;
            margin-top: 5%;
        }
        #word-list-input {
            width: 100%;
        }
        .list{
            width: min-content;
            height: min-content;
            max-height: 40vh;
            background-color: rgb(225, 225, 225);
            border-radius: 10px;
            overflow: hidden;
        }
        .list-top {
            height: 10%;
            width: 100%;
            background-color: aqua;
            text-align: center;
        }
        #letter-list .letter-input{
            text-align: center;
            width: 6vw;
        }
        .list-bottom {
            height: 35vh;
            overflow-y: auto;
            overflow-wrap: break-word;
        }
        .word div {
            text-align: center;
            width: 11vw;
        }
        .word {
            border: 1px solid black;
        }
        #word-search-wrapper{
            position: relative;
        }
        .word-display td{
            width: 33vw;
        }
    </style>
    <h1 class="title">Word Search Maker !</h1>
    <h4 class="title" id="credits"></h4>
    <div id="content">
        <div class="hide-on-print">
            comma seperated word list. Group letters by putting them between < >:
            <div>
                <textarea id="word-list-input" rows="10"></textarea>
            </div>
            <div id="hw-inputs">
                <div>
                    width: <input id="width" placeholder="int"></input>
                    height: <input id="height" placeholder="int"></input>
                    font: <input id="font" placeholder="30px Arial"></input>
                </div>
                <div>
                    add a new word list: <button onclick="addNewWordList()">add word list</button>
                    generate: <button id="generate">Generate</button>
                </div>
                <div>
                    save and overwrite word list: <button onclick="save()">save</button>
                    load word list: <button onclick="load()">load</button>
                    print: <button onclick="print()">print</button>
                </div>
            </div>
            <div id="letter-inputs">
                letter list inputs => 
                A-Z: <input type="checkbox" id="A-Z" checked></input>
                a-z: <input type="checkbox" id="a-z"></input>
                0-9: <input type="checkbox" id="0-9"></input>
            </div>
        </div>
        <div id="letter-list" class="list hide-on-print" hidden>
            <div class="list-top">letter list:</div>
            <div class="list-bottom" id="letter-list-bottom"></div>
        </div>
        <div id="word-list" class="list hide-on-print" hidden>
            <div class="list-top">word list:</div>
            <div class="list-bottom" id="word-list-bottom"></div>
        </div>
        <div id="word-search-wrapper">
            <canvas id="word-search-raw" hidden></canvas>
            <img id="word-search" hidden></img>
            <div id="words-display"></div>
        </div>
        
    </div>
    
    <script>
    
        document.getElementById("credits").innerText = "Made by Brandon Wetzel at " + window.location.origin + window.location.pathname;
        let wordList = [];
        let letterList = [];
        let wordSearchData = [];

        const save = () => {
            const wordListStr = wordList.map(word => {
                return word.reduce((str, curr) => {
                    if(curr.length === 1){
                        return str + curr;
                    }else return str + "<" + curr + ">";
                });
            }).join('\n');
    
            window.localStorage.setItem("savedWordList", wordListStr);
        };
    
        const load = () => {
            const savedWordList = window.localStorage.getItem("savedWordList");
            document.getElementById("word-list-input").value = savedWordList;
        };
    
        const print = () => {
            const ws = document.getElementById("word-search");
            const wd = document.getElementById("words-display");

            const toHide = document.getElementsByClassName("hide-on-print");
            for (let i = 0; i < toHide.length; i++){
                const elem = toHide.item(i);
                elem.hidden = true;
            }
            ws.style.position = "static";
            ws.style.width = "60vw";
            ws.style.height = "60vw";
            ws.style.marginLeft = "15vw";
            wd.style.marginLeft = "15vw";
            wd.style.position = "static";

            window.print();
    
            for (let i = 0; i < toHide.length; i++){
                const elem = toHide.item(i);
                elem.hidden = false;
            }
            ws.style.position = "absolute";
            ws.style.marginLeft = null;
            wd.style.marginLeft = null;
            wd.style.position = "absolute";           
        };
    
        const addNewWordList = () => {
            wordList = document.getElementById("word-list-input").value
                .split(/[, \n]+/)
                .filter(word => word !== '')
                .map(word => word.match(/(?<=<)(.(?!>))+.(?=>)|./g).filter(l => l !== '<' && l !== '>'));
    
            makeNewLetterList();
    
            const wordListElm = document.getElementById("word-list-bottom");
            wordListElm.parentElement.hidden = false; 
    
            let str = "<table>";
            const rows = wordList.map((word, i) => {
                if(i % 2 === 0) str += "<tr>";
                str += "<td class='word'><div>"+ word.join('/') +"</div></td>";
                if(i % 2 === 1) str += "</tr>";
            }).join('');
            str += rows + "</table>";
    
            wordListElm.innerHTML = str;
    
            document.getElementById("generate").addEventListener("click", generate);
    
        };
    
        const getLetterList = () => {
            let str = "<table>";
            let rows = letterList.map((letter, i) => {
                if(i % 3 === 0) str += "<tr>";
                str += "<td class='letter'><input class='letter-input' onchange='onLetterChange(this, " + i + ")' value=" + letter + "></input></td>";
                if(i % 3 === 2) str += "</tr>";
            }).join('');
            str += rows + "</table>";
            return str;
        };
    
        function onLetterChange(target, i){
            if(target.value === '' || letterList.includes(target.value)){
                target.parentElement.removeChild(target);
                letterList.splice(i, 1);
                if(i === letterList.length)
                    letterList = [...letterList, ""];
                renderLetterList();
            }else{
                letterList[i] = target.value;
                if(i+1 === letterList.length)
                    letterList = [...letterList, ""];
                renderLetterList();
            }
            
        };
    
        const makeNewLetterList = () => {
            const removeDuplicates = array => [...new Set(array)];
            letterList = removeDuplicates(wordList.flat(1));
            const a_z = document.getElementById("a-z");
            const capA_Z = document.getElementById("A-Z");
            const digits = document.getElementById("0-9");
            const a_zArr = "abcdefghijklmnopqrstuvwxyz".split(/[]*/);
            const capA_ZArr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(/[]*/);
            const digitsArr = "0123456789".split(/[]*/);
            if(a_z.checked) letterList = removeDuplicates([...letterList, ...a_zArr]);
            if(capA_Z.checked) letterList = removeDuplicates([...letterList, ...capA_ZArr]);
            if(digits.checked) letterList = removeDuplicates([...letterList, ...digitsArr]);
            letterList = [...letterList, ""];
            renderLetterList();
        };
    
        const renderLetterList = () => {
            const letterListElm = document.getElementById("letter-list-bottom");
            letterListElm.parentElement.hidden = false;
            letterListElm.innerHTML = getLetterList();                
        };
    
        const generate = () => {
    
            const fontElm = document.getElementById("font");
            const widthElm = document.getElementById("width");
            const heightElm = document.getElementById("height");
    
            const blocksX = Math.abs(parseInt(widthElm.value) || 10);
            const blocksY = Math.abs(parseInt(heightElm.value) || 10);
            const font = fontElm.value || "30px Arial";
    
            fontElm.value = font;
            widthElm.value = blocksX;
            heightElm.value = blocksY;
    
            const canvas = document.getElementById("word-search-raw");
            canvas.hidden = false;
            const canvasWidth = canvas.width = 1000;
            const canvasHeight = canvas.height = 1000;
    
            const blockWidth = canvasWidth / blocksX;
            const blockHeight = canvasHeight / blocksY;
    
            const fontSize = parseInt(font);
    
            wordSearchData = new Array(blocksX).fill(0).map((_, i) => {
                return new Array(blocksY).fill(0).map((_, j) => {
                    const index = Math.floor(Math.random()*(letterList.length-1));
                    const numLetters = letterList[index].length-1;
                    return {
                        letter: letterList[index],
                        cx: blockWidth * (i+.5) - fontSize/2 - fontSize*numLetters/4,
                        cy: blockHeight * (j + .5) + fontSize/2,
                        canChange: true,
                        partOfWord: null,
                        x: i,
                        y: j
                    }
                });
            });
    
            wordSearchData.draw = function (){
    
                const ctx = canvas.getContext('2d');
    
                ctx.fillStyle = "white";
                ctx.fillRect(0,0, canvasWidth, canvasHeight);
                ctx.fillStyle = "black";
                ctx.lineWidth = "50px";
                ctx.strokeRect(0, 0, canvasWidth, canvasHeight);
                ctx.font = font;
    
                this.forEach(row => {
                    row.forEach(l => {
                        ctx.fillText(l.letter, l.cx, l.cy);
                    });
                });
            };
    
            wordSearchData.canPlaceWord = function (wordLength, direction) {
                if(direction === 0){
                    return this.map(e => e.slice(0, e.length - wordLength));
                }
                if(direction === 1){
                    return this.slice(0, this.length - wordLength).map((e) => e.slice(0, e.length - wordLength));
                }
                if(direction === 2){
                    return this.slice(0, this.length - wordLength);
                }
                if(direction === 3){
                    return this.slice(0, this.length - wordLength).map((e) => e.slice(wordLength));
                }
                if(direction === 4){
                    return this.map((e) => e.slice(wordLength));
                }
                if(direction === 5){
                    return this.slice(wordLength).map((e) => e.slice(wordLength));
                }
                if(direction === 6){
                    return this.slice(wordLength);
                }
                if(direction === 7){
                    return this.slice(wordLength).map(e => e.slice(0, e.length - wordLength));
                }
            };
    
            wordSearchData.nextLetter = function (x, y, direction){
                if(direction === 0){
                    return this[x][y+1];
                }
                if(direction === 1){
                    return this[x+1][y+1];
                }
                if(direction === 2){
                    return this[x+1][y];
                }
                if(direction === 3){
                    return this[x+1][y-1];
                }
                if(direction === 4){
                    return this[x][y-1];
                }
                if(direction === 5){
                    return this[x-1][y-1];
                }
                if(direction === 6){
                    return this[x-1][y];
                }
                if(direction === 7){
                    return this[x-1][y+1];
                }
            };
    
            const shuffle = (array) => {
                let currentIndex = array.length,  randomIndex;
    
                while (currentIndex > 0) {
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex--;
                    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
                }
    
                return array;
            };
    
            const randomDirections = () => {
                return shuffle([0,1,2,3,4,5,6,7])
            };
    
            const randomPoints = (matrix) => {
                return shuffle(matrix.flat(1))
            };
    
            wordList.forEach(word => {
                const directions = randomDirections();
                let shouldEnd = false;
                for(let i = 0; i < directions.length; i++){
                    const d = directions[i];
                    const matrix = wordSearchData.canPlaceWord(word.length, d);
                    if(!matrix[0] || !matrix[0][0])
                        continue;
                    const points = randomPoints(matrix);
                    for(let j = 0; j < points.length; j++){
                        const point = points[j];
                        const wordPoints = [];
                        let currentPoint = point;
                        
                        if(!point) break;
                        for(let k = 0; k < word.length; k++){
                            if(currentPoint.canChange || currentPoint.letter === word[k]){
                                wordPoints.push(currentPoint);
                                currentPoint = wordSearchData.nextLetter(currentPoint.x, currentPoint.y, d);
                            }else break;
                        }
                        if(wordPoints.length === word.length){
                            wordPoints.forEach((p, k) => {
                                p.letter = word[k];
                                p.partOfWord = wordPoints;
                                p.canChange = false;
                            });
                            shouldEnd = true;
                            return;
                        }
    
                    }
                }
                
    
            });
    
    
            wordSearchData.draw();
            
            const wordListDisplay = document.getElementById("words-display");
            const img = document.getElementById("word-search");
            const {width, height} = document.getElementById("letter-list").getBoundingClientRect();
            img.hidden = false;
            img.style.position = "absolute";
            img.style.top = (-height*2)+"px";
            img.style.left = (width+50) + "px";
            img.style.width = width*2+"px";
            img.style.height = width*2 + "px";
    
            wordListDisplay.style.position = "absolute";
            wordListDisplay.style.top = (-height*2+width*2)+"px";
            wordListDisplay.style.left = (width+50) + "px";
            wordListDisplay.style.width = width*2+"px";

            const imgData = canvas.toDataURL('image/png');
            img.src = imgData;
    
            const trows = wordList.map((word, i) => {
                let str = "";
                if(i % 3 === 0) str += "<tr class='word-display'>";
                str += "<td>•" + word.join('') + "</td>";
                if(i % 3 === 2) str += "</tr>";
                return str;
            }).join('');

            wordListDisplay.innerHTML = "<div>word list: </div><table>" + trows + "</table>";

            canvas.hidden = true;
    
        };
    
    </script>
</body>`

module.exports = () => {
    return str
}
