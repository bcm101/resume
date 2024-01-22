
const str = `<head>
    <title>Maze Maker</title>
</head>
<body>
    <style>
        #maze-image{
            position: fixed;
            display: block;
            margin-left: auto;
            margin-right: auto;
        }
        #maze {
            position: fixed;
            top: 20%;
            left: 30vw;
        }
        .title{
            width: 100%;
            text-align: center;
        }
        input{
            width: 30%;
        }
    </style>
    <h1 class="title">Maze Maker</h1>
    <h4 class="title" id="credits"></h4>
    <table id="options">
        <tr><td>width: </td><td><input id="css-X" placeholder="pixels"></input></td></tr>
        <tr><td>height: </td><td><input id="css-Y" placeholder="pixels"></input></td></tr>
        <tr><td>number of blocks in x: </td><td><input id="width" placeholder="int"></input></td></tr>
        <tr><td>number of blocks in y: </td><td><input id="height" placeholder="int"></input></td></tr>
        <tr><td>start location: </td><td><input id="start" placeholder="(0,0)"></input></td></tr>
        <tr><td>end location: </td><td><input id="end" placeholder="(0,0)"></input></td></tr>
        <tr><td>is circle: </td><td><input id="is-circle" type="checkbox"></input></td></tr>
        <tr><td>raw: </td><td><input id="raw" type="checkbox"></input></td></tr>
    </table>
    <button onclick="generate()" id="generate">Generate</button>
    <button onclick="printScreen()" id="print-screen">Print</button>
    <canvas hidden id="maze"></canvas>
    <img id="maze-image" hidden></img>
    <script>
        document.getElementById("credits").innerText = "Made by Brandon Wetzel at " + window.location.origin + window.location.pathname;
        const printScreen=()=>{
            document.getElementById("options").hidden = true;
            document.getElementById("generate").hidden = true;
            document.getElementById("print-screen").hidden = true;
            document.getElementById("maze").hidden = true;
            const imgElm = document.getElementById("maze-image");
            imgElm.style.position = "static";
            window.print();
        };
        const generate=()=>{
            const cssXElm = document.getElementById("css-X");
            const cssYElm = document.getElementById("css-Y");
            const widthElm = document.getElementById("width");
            const heightElm = document.getElementById("height");
            const startElm = document.getElementById("start");
            const endElm = document.getElementById("end");
            const isCircle = document.getElementById("is-circle").checked;
            const cssX = (!parseInt(cssXElm.value) || parseInt(cssXElm.value) < 0) ? 500: parseInt(cssXElm.value);
            const cssY = (!parseInt(cssYElm.value) || parseInt(cssYElm.value) < 0) ? 500: parseInt(cssYElm.value);
            let width = parseInt(widthElm.value) || 10;
            let height = parseInt(heightElm.value) || 10;
            if(width < 1) width = 1;
            if(height < 1) height = 1;
            const start = startElm.value.split(/[ ,()A-Za-z]+/).filter(s => s !== '');
            const end = endElm.value.split(/[ ,()A-Za-z]+/).filter(s => s !== '');
            start.push(0,0);
            end.push(Infinity,Infinity);
            let [startX, startY] = start.map(n => parseInt(n) || -1);
            let [endX, endY] = end.map(n => (parseInt(n) || parseInt(n)===0 ) ? parseInt(n): Infinity);
            if(startX===endX && startY === endY) return;
            if(startX > width) startX = width;
            if(startX < 1) startX = 1;
            if(startY > height) startY = height;
            if(startY < 1) startY = 1;
            if(endX > width) endX = width;
            if(endX < 1) endX = 1;
            if(endY > height) endY = height;
            if(endY < 1) endY = 1;
            cssXElm.value = cssY+"px";
            cssYElm.value = cssX+"px";
            heightElm.value = height;
            widthElm.value = width;
            startElm.value = "("+startX+","+startY+")";
            endElm.value = "("+endX+","+endY+")";
            const canvas = document.getElementById("maze");
            canvas.style.width = cssX+"px";
            canvas.style.height = cssY+"px";
            const ctx = canvas.getContext("2d");
            const canvasWidth = canvas.width = cssX;
            const canvasHeight = canvas.height = cssY;
            const blockWidth = canvasWidth / width;
            const blockHeight = canvasHeight / height;
            const centerX = cssX /2;
            const centerY = cssY /2;
            const radianStart = Math.PI* 3/2;
            const totalRadius = centerX > centerY ? centerY-10 : centerX-10;
            const centerRadius = totalRadius * .1;
            const explorableRadius = totalRadius - centerRadius;
            const arcLength = 2 * Math.PI / width;   
            const maze = new Array(width).fill(0).map((_e, i) => {
                const startArc = arcLength * i + 1.5*Math.PI;
                const endArc = startArc + arcLength;
                return new Array(height).fill(0).map((_e, j) => {
                    const arcRadius = explorableRadius / height * (height - j) + centerRadius;
                    const nextArcRadius = explorableRadius / height * (height - j - 1) + centerRadius;
                    return {
                        cx: blockWidth*i,
                        cy: blockHeight*j,
                        visited: false,
                        throughPath: [],
                        x: i,
                        y: j,
                        end: false,
                        start: false,
                        topArc: [
                            centerX,
                            centerY,
                            arcRadius,
                            startArc,
                            endArc
                        ],
                        bottomArc: [
                            centerX,
                            centerY,
                            nextArcRadius,
                            startArc,
                            endArc
                        ],
                        left: {
                            top: [
                                centerX + arcRadius * Math.cos(startArc), 
                                centerY + arcRadius * Math.sin(startArc)
                            ],
                            bottom: [
                                centerX + nextArcRadius * Math.cos(startArc), 
                                centerY + nextArcRadius * Math.sin(startArc)
                            ]
                        },
                        right: {
                            top: [
                                centerX + arcRadius * Math.cos(endArc), 
                                centerY + arcRadius * Math.sin(endArc)
                            ],
                            bottom: [
                                centerX + nextArcRadius * Math.cos(endArc), 
                                centerY + nextArcRadius * Math.sin(endArc)
                            ]
                        }
                        
                    }
                });
            });
            const startPoint = maze[startX-1][startY-1];
            const endPoint = maze[endX-1][endY-1];
            if(startX === width) startPoint.throughPath.push(1);
            if(startX === 1) startPoint.throughPath.push(3);
            if(startY === height) startPoint.throughPath.push(2);
            if(startY === 1) startPoint.throughPath.push(0);
            if(endX === width) endPoint.throughPath.push(1);
            if(endX === 1) endPoint.throughPath.push(3);
            if(endY === height) endPoint.throughPath.push(2);
            if(endY === 1) endPoint.throughPath.push(0);
            endPoint.end = true;
            startPoint.start = true;
            const getNewPoint = (currentPoint, path) => {
                if(path === 0 && currentPoint.y - 1 >= 0){
                    const newPoint = maze[currentPoint.x][currentPoint.y-1];
                    if(!newPoint.visited) return newPoint
                }
                if(path === 1 && (currentPoint.x + 1 < width || isCircle)){
                    const newPoint = maze[(currentPoint.x+1)%width][currentPoint.y];
                    if(!newPoint.visited) return newPoint
                }
                if(path === 2 && currentPoint.y + 1 < height){
                    const newPoint = maze[currentPoint.x][currentPoint.y+1];
                    if(!newPoint.visited) return newPoint
                }
                if(path === 3 && (currentPoint.x - 1 >= 0 || isCircle)){
                    const newPoint = maze[(currentPoint.x+width-1)%width][currentPoint.y];
                    if(!newPoint.visited) return newPoint
                }
                return false;
            };
            const visitMaze = (point=maze[startX-1][startY-1]) => {
                const randomPaths = [];
                for(let i = 0; i < 4; i++){ 
                    let path = Math.floor(Math.random()*4);
                    while(randomPaths.includes(path))
                        path = Math.floor(Math.random()*4);
                    randomPaths[i] = path;
                }
                point.visited = true;
                if(!point.end)
                    randomPaths.forEach((path) => {
                        let newPoint = getNewPoint(point, path);
                        if(newPoint){
                            point.throughPath.push(path);
                            newPoint.throughPath.push((path+2)%4);
                            visitMaze(newPoint);
                        }
                    });
            };
            visitMaze();
            ctx.beginPath();
            ctx.fillStyle  = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "black";
            ctx.lineWidth = (cssX / width / 16);
            if(!isCircle){
                maze.forEach(array => {
                    array.forEach((point) => {
                        if(point.start){
                            ctx.moveTo(point.cx+blockWidth/2+blockWidth/8, point.cy+blockHeight/4);
                            ctx.lineTo(point.cx+blockWidth/4+blockWidth/8, point.cy+blockHeight/4);
                            ctx.lineTo(point.cx+blockWidth/4+blockWidth/8, point.cy+blockHeight/2);
                            ctx.lineTo(point.cx+blockWidth/2+blockWidth/8, point.cy+blockHeight/2);
                            ctx.lineTo(point.cx+blockWidth/2+blockWidth/8, point.cy+blockHeight*(3/4));
                            ctx.lineTo(point.cx+blockWidth/4+blockWidth/8, point.cy+blockHeight*(3/4));
                        }
                        if(!point.throughPath.includes(0)){
                            ctx.moveTo(point.cx, point.cy);
                            ctx.lineTo(point.cx+blockWidth, point.cy);
                        }
                        if(!point.throughPath.includes(1)){
                            ctx.moveTo(point.cx+blockWidth, point.cy);
                            ctx.lineTo(point.cx+blockWidth, point.cy+blockHeight);
                        }
                        if(!point.throughPath.includes(2)){
                            ctx.moveTo(point.cx, point.cy+blockHeight);
                            ctx.lineTo(point.cx+blockWidth, point.cy+blockHeight);
                        }
                        if(!point.throughPath.includes(3)){
                            ctx.moveTo(point.cx, point.cy);
                            ctx.lineTo(point.cx, point.cy+blockHeight);
                        }
                        if(point.end){
                            ctx.moveTo(point.cx+blockWidth/4+blockWidth/8, point.cy+blockHeight/4);
                            ctx.lineTo(point.cx+blockWidth/4+blockWidth/8, point.cy+blockHeight*(3/4));
                            ctx.lineTo(point.cx+blockWidth/2+blockWidth/8, point.cy+blockHeight*(3/4));
                            ctx.moveTo(point.cx+blockWidth/4+blockWidth/8, point.cy+blockHeight/2);
                            ctx.lineTo(point.cx+blockWidth/2+blockWidth/8, point.cy+blockHeight/2);
                            ctx.moveTo(point.cx+blockWidth/4+blockWidth/8, point.cy+blockHeight/4);
                            ctx.lineTo(point.cx+blockWidth/2+blockWidth/8, point.cy+blockHeight/4);
                        }
                    });
                });
            }else{
                maze.forEach(array => {
                    array.forEach((point) => {
                        if(!point.throughPath.includes(0)){
                            ctx.moveTo(...point.left.top);
                            ctx.arc(...point.topArc);
                        }
                        if(!point.throughPath.includes(1)){
                            ctx.moveTo(...point.right.top);
                            ctx.lineTo(...point.right.bottom);
                        }
                        if(!point.throughPath.includes(2)){
                            ctx.moveTo(...point.left.bottom);
                            ctx.arc(...point.bottomArc);
                        }
                        if(!point.throughPath.includes(3)){
                            ctx.moveTo(...point.left.top);
                            ctx.lineTo(...point.left.bottom);
                        }
                    });
                });
            }
            ctx.stroke();
            canvas.hidden = false;
            const img = canvas.toDataURL('image/png');
            const imgElm = document.getElementById("maze-image");
            imgElm.src = img;
            imgElm.hidden = false;
            const body = document.body, html = document.documentElement;
            const pageWidth = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
            const pageHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
            const n = Math.min(pageWidth, pageHeight);
            imgElm.style.width = n * (2/3) + "px";
            imgElm.style.height = n * (2/3) + "px";
            imgElm.style.left = (pageWidth / 2 - n / 3) + "px";
            imgElm.style.top = (pageHeight / 2 - n / 3 + pageHeight / 10) + "px";
            canvas.hidden = true;
            if(document.getElementById("raw").checked){
                canvas.hidden = false;
                imgElm.hidden = true;
            }
        }
    </script>
</body>`


module.exports = () => {
    return str
}