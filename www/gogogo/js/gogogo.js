


function Go(){

    this.coordsxy = [['a',1],['b',2],['c',3],['d',4],['e',5],['f',6],['g',7],['h',8],['i',9],['j',10],
                    ['k',11],['l',12],['m',13],['n',14],['o',15],['p',16],['q',17],['r',18],['s',19]];
    this.svggrid = document.getElementById("svggrid");
    this.baseheight = getComputedStyle(document.getElementById("container")).getPropertyValue("--cell-height").replace("px","") / 2;
    this.gorcds = new Array(20).fill(null).map(()=>new Array(20).fill(null));
    this.blackwhite = {white:false, black:true};
    this.gostate = null;
}


Go.prototype.addGrids = function(){
    let container = document.querySelector("#go");
    // let coordsxy = [['a',1],['b',2],['c',3],['d',4],['e',5],['f',6],['g',7],['h',8],['i',9],['j',10],
    //                 ['k',11],['l',12],['m',13],['n',14],['o',15],['p',16],['q',17],['r',18],['s',19]];

    for(let i=0; i < 19*19; i++){
        let newnode = document.createElement('div');
        newnode.setAttribute("class", "cell");
        newnode.setAttribute("number", (i+1))
        newnode.setAttribute("coords", (this.coordsxy[i%19][0] + this.coordsxy[parseInt(i/19)][1]))
        
        // newnode.innerText = "i";

        container.appendChild(newnode);
    }
}

Go.prototype.addLine = function(){
    // let svggrid = document.getElementById("svggrid");
    // let baseheight = getComputedStyle(document.getElementById("container")).getPropertyValue("--cell-height").replace("px","") / 2;
    // let axisxy = [['a',1],['b',2],['c',3],['d',4],['e',5],['f',6],['g',7],['h',8],['i',9],['j',10],
    //                 ['k',11],['l',12],['m',13],['n',14],['o',15],['p',16],['q',17],['r',18],['s',19]];

    {
        let rowtemplate = `<line x1="${this.baseheight}" y1="rowY" x2="${this.baseheight * 37}" y2="rowY"  class="goline rowline" axis="{y}" />`;
        let coltemplate = `<line x1="colX" y1="${this.baseheight}" x2="colX" y2="${this.baseheight * 37}"  class="goline coline" axis="{x}" />`;
        for(let i = 0; i< 19; i++){
            let temprow = rowtemplate.replace("{y}", (this.coordsxy[i][1]));
            let tempcol = coltemplate.replace("{x}", (this.coordsxy[i][0]));

            this.svggrid.insertAdjacentHTML("beforeend", temprow.replace(/rowY/gi, (this.baseheight + this.baseheight * 2 * i)))
            this.svggrid.insertAdjacentHTML("beforeend", tempcol.replace(/colX/gi, (this.baseheight + this.baseheight * 2 * i)))
        }
    }

    {
        let rtcircle = `<circle cx="${this.baseheight * 7}" cy="${this.baseheight * 7}" r="${this.baseheight / 6}" class="svgcircle" />`;
        let ltcircle = `<circle cx="${this.baseheight * 31}" cy="${this.baseheight * 7}" r="${this.baseheight / 6}" class="svgcircle" />`;

        let rbcircle = `<circle cx="${this.baseheight * 7}" cy="${this.baseheight * 31}" r="${this.baseheight / 6}" class="svgcircle" />`;
        let lbcircle = `<circle cx="${this.baseheight * 31}" cy="${this.baseheight * 31}" r="${this.baseheight / 6}" class="svgcircle" />`;

        let midcircle = `<circle cx="${this.baseheight * 19}" cy="${this.baseheight * 19}" r="${this.baseheight / 4}" class="svgcircle" />`;

        this.svggrid.insertAdjacentHTML("beforeend", rtcircle)
        this.svggrid.insertAdjacentHTML("beforeend", ltcircle)

        this.svggrid.insertAdjacentHTML("beforeend", rbcircle)
        this.svggrid.insertAdjacentHTML("beforeend", lbcircle)

        this.svggrid.insertAdjacentHTML("beforeend", midcircle)
    }

    {
        // axis text
        let xtemplate = `<text x="{x}" y="${this.baseheight / 2}" fill="black" font-family="microsoft yahei" text-anchor="middle" >{text}</text>`;
        let ytemplate = `<text x="${this.baseheight / 8}" y="{y}" fill="black" font-family="microsoft yahei" >{text}</text>`;

        for(let i = 1; i <= 19; i++){
            let xtemp, ytemp;

            xtemp = xtemplate.replace("{x}", (this.baseheight * 2 * i - this.baseheight))
            xtemp = xtemp.replace("{text}",this.coordsxy[i-1][0])

            ytemp = ytemplate.replace("{y}", (this.baseheight * 2 * i - this.baseheight + 5))
            ytemp = ytemp.replace("{text}",this.coordsxy[i-1][1])

            this.svggrid.insertAdjacentHTML("beforeend", xtemp)
            this.svggrid.insertAdjacentHTML("beforeend", ytemp)
        }
    }
}

const GORCDS = new Array(20).fill([]).map(()=>new Array(20).fill([]));
const ORDERRCDS = new Array(19*19).fill([]);
const blackwhite = {white:false, black:true}
const BWCOUNT = new Map([["white",0],["black",0],["order",0]]);
Go.prototype.goes = function(){
    let svggrid =this.svggrid;
    let baseheight = this.baseheight;
    let oxy = [baseheight, baseheight];
    let coordsxy = new Map(this.coordsxy);
    let goestemplate = `<circle cx="{x}" cy="{y}" r="${baseheight / 1.3}" class="svggoes" svgcoords="{svgcrds}" order="{ord}"/>`;
    
    let cells = document.querySelectorAll(".cell")
    cells.forEach(cell=>{
        cell.onclick = function(){
            let coords = this.getAttribute("coords");
            let num = this.getAttribute("number");

            if(!document.querySelector(`[svgcoords="${coords}"]`)){
                let x = oxy[0] + baseheight * 2 * (coordsxy.get(coords.substr(0,1)) -1 ),
                y = oxy[1] + baseheight * 2 * (coords.substr(1) -1 );

                let goestemp = goestemplate.replace("{x}", x);
                goestemp = goestemp.replace("{y}", y);
                goestemp = goestemp.replace("{svgcrds}", coords);
        
                if(blackwhite.black){
                    blackwhite.black = false;
                    blackwhite.white = true;
                    document.getElementById("blackbar").style.background = "gray";
                    document.getElementById("whitebar").style.background = "yellow";

                    BWCOUNT.set("black",(BWCOUNT.get("black") + 1));
                    BWCOUNT.set("order",(BWCOUNT.get("order") + 1))

                    goestemp = goestemp.replace("{ord}",BWCOUNT.get("order"));
                    goestemp = goestemp.replace("svggoes", "svggoes goyang");
                    svggrid.insertAdjacentHTML("beforeend", goestemp);

                    GORCDS[coords.substr(1)][coordsxy.get(coords.substr(0,1))] = [x,y,coords,+num,"goyang"];
                    ORDERRCDS[num] = [BWCOUNT.get("order"),goestemp];

                    judge(coords);

                }else if(blackwhite.white){
                    blackwhite.white = false;
                    blackwhite.black = true;
                    document.getElementById("blackbar").style.background = "yellow";
                    document.getElementById("whitebar").style.background = "gray";

                    BWCOUNT.set("white",(BWCOUNT.get("white") + 1));
                    BWCOUNT.set("order",(BWCOUNT.get("order") + 1))

                    goestemp = goestemp.replace("{ord}",BWCOUNT.get("order"));
                    goestemp = goestemp.replace("svggoes", "svggoes goyin");
                    svggrid.insertAdjacentHTML("beforeend", goestemp);

                    GORCDS[coords.substr(1)][coordsxy.get(coords.substr(0,1))] = [x,y,coords,+num,"goyin"];
                    ORDERRCDS[num] = [BWCOUNT.get("order"),goestemp];

                    judge(coords);

                }else{
                    return
                }

            }
        }
    })
}

Go.prototype.setWhoGo = function(str){

    if(str === "init" || str ==="reset"){
        blackwhite.white = false;
        blackwhite.black = true;
        this.gostate = true;

        GORCDS.forEach((x,i)=>GORCDS[i].fill([]));
        ORDERRCDS.fill([]);
        BWCOUNT.forEach((val,key)=>BWCOUNT.set(key,0));

        document.querySelectorAll(".svggoes").forEach(svggo=>svggo.parentElement.removeChild(svggo))
        document.getElementById("blackfirst").disabled = false;
        document.getElementById("whitefirst").disabled = false;
    }else if(str === "black"){
        blackwhite.white = false;
        blackwhite.black = true;
    }else if(str === "white"){
        blackwhite.white = true;
        blackwhite.black = false;
    }else if(str === "forbid"){
        let forbidgo = document.getElementById("forbidgo");

        if(this.gostate){
            this.blackwhite.white = blackwhite.white;
            this.blackwhite.black = blackwhite.black;
            blackwhite.white = false;
            blackwhite.black = false;
            this.gostate = false;
            document.getElementById("blackfirst").disabled = true;
            document.getElementById("whitefirst").disabled = true;

            forbidgo.innerText = "继续";
        }else if(this.gostate === false){
            blackwhite.white = this.blackwhite.white;
            blackwhite.black = this.blackwhite.black;
            this.gostate = true;

            forbidgo.innerText = "暂停";
        }
    }else if(str === "resume"){
        
    }

    blackwhite.white ? document.getElementById("whitebar").style.background = "yellow" : document.getElementById("whitebar").style.background = "gray";
    blackwhite.black ? document.getElementById("blackbar").style.background = "yellow" : document.getElementById("blackbar").style.background = "gray";

}

function whoGo(){
    document.getElementById("reset").addEventListener("click", ()=>{newGo.setWhoGo("reset")});
    document.getElementById("blackfirst").addEventListener("click", ()=>{newGo.setWhoGo("black")});
    document.getElementById("whitefirst").addEventListener("click", ()=>{newGo.setWhoGo("white")});
    document.getElementById("forbidgo").addEventListener("click", ()=>{newGo.setWhoGo("forbid")});
}

const coordsxy = new Map([['a',1],['b',2],['c',3],['d',4],['e',5],['f',6],['g',7],['h',8],['i',9],['j',10],
                ['k',11],['l',12],['m',13],['n',14],['o',15],['p',16],['q',17],['r',18],['s',19]]);
const erx = new Map([["goyang","黑棋"],["goyin","白棋"]]);
function judge(coords){

    let a = coordsxy.get(coords.substr(0,1)), b = +coords.substr(1);
    let gone = GORCDS.flat().filter(x=>{return x.length > 0});
    let curtgt = gone.find(x=>x[2]===coords);
    let whowon;

    let col = GORCDS.map(x=>x[coordsxy.get(coords.substr(0,1))]),
        row = GORCDS[coords.substr(1)];
        
    {
        // 纵列
        let ccount = 0;

        col.forEach(x=>{
            if(x.length > 0 && x[curtgt.length - 1] === curtgt[curtgt.length - 1]){
                ccount += 1;
            }else if(ccount < 5){ ccount = 0; }
        })

        if(ccount >= 5){
            whowon = erx.get(curtgt[curtgt.length - 1]);
        }
    }

    {
        // 横行
        let rcount = 0;

        row.forEach(x=>{
            if(x.length > 0 && x[curtgt.length - 1] === curtgt[curtgt.length - 1]){
                rcount += 1;
            }else if(rcount < 5){ rcount = 0; }
        })

        if(rcount >= 5){
            whowon = erx.get(curtgt[curtgt.length - 1]);
        }
    }

    {
        // 左斜对角
        let backslash = [];
        let ltcount = 0;

        if(a > b){
            // console.log("起始行：",1,"起始点：",(a-b + 1));
            // console.log("终止行：",(19-a+b),"终止点：",19)

            for(let i=1; i <= (19-a+b); i++){
                backslash.push(GORCDS[i][a-b+i])
            }

        }else if(a === b){
            // console.log("起始行：",1,"起始点：",(a-b+1));
            // console.log("终止行：",19,"终止点：",(19-b+a));

            for(let i=1; i <= 19; i++){
                backslash.push(GORCDS[i][i])
            }
        }else{
            // console.log("起始行：",(b-a+1),"起始点：",1);
            // console.log("终止行：",19,"终止点：",(19-b+a));

            for(let i=1; i <= 19-b+a; i++){
                backslash.push(GORCDS[i+b-a][i])
            }
        }
        
        if((backslash.filter(x=>x.length!==0)).length >= 5){
            backslash.forEach(x=>{
                if(x.length > 0 && x[curtgt.length - 1] === curtgt[curtgt.length - 1]){
                    ltcount += 1;
                }else if(ltcount < 5){ ltcount = 0; }
            })
    
            if(ltcount >= 5){
                whowon = erx.get(curtgt[curtgt.length - 1]);
            }
        }
    }

    {
        // 右斜对角
        let rtcount = 0;
        let slash = [];
        let start, stop, found;

        if(a + b <= 20){
            start = a + b - 1, stop = 19 * ( a + b - 1) - 18;
            for(let i=start; i <= stop; i+=18){
                found = GORCDS.flat().find(x=>x[3]===i)
                slash.push(found ? found:[])
            }
        }else{
            start = 19 + ( a + b - 20 ) * 19, stop = a + b - 19 + 18 * 19;
            for(let i=start; i <= stop; i+=18){
                found = GORCDS.flat().find(x=>x[3]===i)
                slash.push(found ? found:[])
            }
        }
        
        if((slash.filter(x=>x.length!==0)).length >= 5){
            slash.forEach(x=>{
                if(x.length > 0 && x[curtgt.length - 1] === curtgt[curtgt.length - 1]){
                    rtcount += 1;
                }else if( rtcount < 5){ rtcount = 0; }
            })
    
            if(rtcount >= 5){
                whowon = erx.get(curtgt[curtgt.length - 1]);
            }
        }
        
    }

    if( whowon ){ 
        newGo.setWhoGo("forbid");
        if(whowon === "黑棋"){
            let heiqi = document.getElementById("leftflag");
            heiqi.style.animation = "expflag 2s forwards";
            heiqi.innerText = "恭喜 黑棋赢了";
            setTimeout(() => {
                heiqi.style.animation = "";
                heiqi.innerText = "";
            }, 15000);
        }else{
            let baiqi = document.getElementById("rightflag");
            baiqi.style.animation = "expflag 2s forwards";
            baiqi.innerText = "恭喜 白棋赢了";
            setTimeout(() => {
                baiqi.style.animation = "";
                baiqi.innerText = "";
            }, 15000);
        };
    }
    // console.log("当前坐标：",coords, "[ a：",a, "b：",b, `换算位置：${(a + (b -1) * 19)}]`,"当前位置：", curtgt[3])
}

let newGo = new Go();
let gonode = document.getElementById("go");
let gocount = 0;

function checkNodeState(node){
    if(!node){
        gonode = document.getElementById("go");
        clearInterval(gocount);
        gocount = setInterval( checkNodeState, 500, gonode);
    }else{
        clearInterval(gocount);

        newGo.addGrids();
        newGo.addLine();
        newGo.setWhoGo("init")
        newGo.goes();
        whoGo();
    }
}
checkNodeState(gonode);