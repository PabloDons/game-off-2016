var size = 100;
var numBombs = 15;
var minesweeper = new ms(size, numBombs);
var msmap = drawMap();
//numOfFields=size*size; //unused
//var fieldIcons = ["Bilder/0.png","Bilder/1.png","Bilder/2.png","Bilder/3.png","Bilder/4.png","Bilder/5.png","Bilder/6.png","Bilder/7.png","Bilder/8.png","Bilder/flagged.png","Bilder/default.png"];
function drawMap(getMapResult){
    var msmap = [];
    var tableEl = document.createElement("table");
    for (var y=0; y<size; y++){
        var trEl = document.createElement("tr");
        msmap.push([]);
        for (var x=0; x<size; x++){
            var tdEl = document.createElement("td");
            tdEl.className="game-item";
            tdEl.style["background-image"] = "url('bilder/default.png')";
            tdEl.setAttribute("data-x",""+x);
            tdEl.setAttribute("data-y",""+y);
            tdEl.addEventListener("click",send);
            trEl.appendChild(tdEl);
            msmap[y].push(tdEl);
        }
        tableEl.appendChild(trEl);
    }
    document.getElementById("game").appendChild(tableEl);
    return msmap;
}
function send(e){
    var xCoord = Number(e.target.getAttribute("data-x"));
    var yCoord = Number(e.target.getAttribute("data-y"));

    var result = minesweeper.clickBox({x:xCoord, y:yCoord});
    console.log("updating map...");
    updateMap(result);//flyttes til connection.onmessage eller hva det nå enn heter
    console.log("Map udated.");
}
function updateMap(theResultOfClickBox) {
    if(theResultOfClickBox.hit===true){
        theGameHasEnded();
        return;
    }
    for (var i=0; i<theResultOfClickBox.act.length;i++) {
        var x = theResultOfClickBox.act[i].x;
        var y = theResultOfClickBox.act[i].y;
        var t = theResultOfClickBox.act[i].numOfAdj;
        msmap[y][x].style.backgroundImage="url('bilder/"+t+".png')";
    }
}
function theGameHasEnded(){
    console.log("ya lost");
}
