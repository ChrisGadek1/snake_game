
let begin = false;
let dx = 0;
let dy = 0;
let s = 60; //size of quad
let pressedKey = 115;
let contr = 0;
let sizeX = 780;
let sizeY = 540;
let destX = Math.floor(Math.random() * (sizeX/s - 1));
let destY = Math.floor(Math.random() * (sizeY/s -1));
let arrayOfFields = new Array(sizeY/s);
let points = 0;
for(let i = 0; i < arrayOfFields.length; i++){
    arrayOfFields[i] = new Array(sizeX/s);
    for(let j = 0; j < arrayOfFields[i].length; j++){
        arrayOfFields[i][j] = false;
    }
}
let pressQueue = new buckets.Queue();
let lastPressed = 115;
let putInfoBegin = false;
let pause = false;
let putInfoPause = false;

document.addEventListener("keypress", function (){
    if(event.which == 32 && !begin && putInfoBegin){
        putInfoBegin = false;
        begin = true;
        $("#begin_info").remove();
    }
    else if(event.which == 32 && begin && !pause){
        pause = true;
    }
    else if(event.which == 32 && begin && pause){
        pause = false;
        putInfoPause = false;
        $("#begin_info").remove();
    }
    else if(event.which == 97 || event.which == 115 || event.which == 100 || event.which == 119) {
        if ((lastPressed == 97 && event.which != 100 || lastPressed == 100 && event.which != 97 ||
            lastPressed == 115 && event.which != 119 || lastPressed == 119 && event.which != 115) && lastPressed != event.which) {
            pressQueue.add(event.which);
            lastPressed = event.which;
        }
    }
});

function setup(){
    myCanvas = createCanvas(sizeX, sizeY);
    myCanvas.parent('game');
    frameRate(30);
    quad(0,0,0,s,s,s,s,0);
    background("black");
    textSize(50);
    textAlign(CENTER, CENTER);
    strokeWeight(4);
}

class Quad{
    constructor(x1,y1,x2,y2,x3,y3,x4,y4) {
        this.x1 = x1;
        this.x2 = x2;
        this.x3 = x3;
        this.x4 = x4;
        this.y1 = y1;
        this.y2 = y2;
        this.y3 = y3;
        this.y4 = y4;
    }
}
let gameOver = false;
let queue = new buckets.Queue();
queue.add(new Quad(dx,dy,dx,s + dy,s + dx,s+dy,s+dx,dy));
function draw(){
    let last;
    let frame = 0
    let difficultly = $("#choose_dif").val();
    if(difficultly == "łatwy") frame = 11;
    else if(difficultly == "normalny") frame = 8;
    else frame = 5;
    let i = 1;
    fill("white");
    queue.forEach(function (object){
        last = object;
    });
    if((!(last.x1 < sizeX && last.x1 >= 0 && last.y1 < sizeY && last.y1 >= 0) || arrayOfFields[last.y1/s][last.x1/s]==true) && !gameOver){
        gameOver = true;
        $("#game").append('<div id="end_container"></div>');
        $("#end_container").append('<div id="koniec" class="end">Koniec Gry!</div>');
        $("#end_container").append('<div id="again" class="end"> jeszcze raz? </div>');
        $(".end").css("position","relative");
        $("#end_container").css("position","absolute");
        $(".end").css("font-size","40px");
        $("#end_container").css("top","30%");
        $("#end_container").css("left","30%");
        $("#again").css("background-color","#e33b3b");
        $("#again").css("color","black");
        $("#end_container").css("border","5px solid #d6c913");
        $("#end_container").css("background-color","#000000");
        $("#again").css("transition","background-color 1s, color 1s");
        $("#again").css("padding","4px");
        $(".end").css("margin","20px");
        $("#again").hover(function(e) {
            $("#again").css("background-color", e.type=="mouseenter"?"#780709":"#e33b3b");
            $("#again").css("cursor", e.type=="mouseenter"?"pointer":"default");
            $("#again").css("color",e.type=="mouseenter"?"#e33b3b":"black");
        });
        $("#again").css("border","solid 5px #e09494");
        $("#again").click(function(){
            dx = 0;
            dy = 0;
            queue = new buckets.Queue();
            queue.add(new Quad(dx,dy,dx,s + dy,s + dx,s+dy,s+dx,dy));
            destX = Math.floor(Math.random() * (sizeX/s - 1));
            destY = Math.floor(Math.random() * (sizeY/s -1));
            $("#end_container").remove();
            for(let i = 0; i < arrayOfFields.length; i++){
                arrayOfFields[i] = new Array(sizeX/s);
                for(let j = 0; j < arrayOfFields[i].length; j++){
                    arrayOfFields[i][j] = false;
                }
            }
            gameOver = false;
            begin = false;
            pressedKey = 115;
            lastPressed = 115;
            pressQueue = new buckets.Queue();
        });
    }
    if(!begin && !putInfoBegin){
        background("black");
        $("#count").html("0");
        $("#game").append('<div id="begin_info">Naciśnij spację, aby rozpocząć</div>');
        $("#begin_info").css("background-color","black");
        $("#begin_info").css("position","absolute");
        $("#begin_info").css("font-size","30px");
        $("#begin_info").css("top","45%");
        $("#begin_info").css("left","15%");
        $("#begin_info").css("border","3px solid #d6c913");
        $("#begin_info").css("padding","5px");
        putInfoBegin = true;
    }
    else if(begin && pause && !putInfoPause){
        background("black");
        $("#game").append('<div id="begin_info">Pauza<br>Naciśnij spację, aby kontynuować</div>');
        $("#begin_info").css("background-color","black");
        $("#begin_info").css("position","absolute");
        $("#begin_info").css("font-size","30px");
        $("#begin_info").css("top","40%");
        $("#begin_info").css("left","12%");
        $("#begin_info").css("border","3px solid #d6c913");
        $("#begin_info").css("padding","5px");
        putInfoPause = true;
    }
    if(!gameOver && begin && !pause){
        $("#choose_dif")[0].disabled = true;
        background("black");
        queue.forEach(function (object){
            if(i == queue.size()){
                fill("green");
            };
            quad(object.x1, object.y1, object.x2, object.y2, object.x3, object.y3, object.x4, object.y4);
            i++;
            fill("white");
        });
        fill("red");
        quad(destX*s,destY*s,destX*s,destY*s+s,destX*s+s,destY*s+s,destX*s+s,destY*s);
        fill("white");
        contr++;
        if(contr == frame){
            contr = 0;
            if(!pressQueue.isEmpty()){
                pressedKey = pressQueue.dequeue();
            }

            if(pressedKey == 97){
                dx += -s;
                dy += 0;
            }
            else if(pressedKey == 115){
                dx += 0;
                dy += s;
            }
            else if(pressedKey == 100){
                dx += s;
                dy += 0;
            }
            else if(pressedKey == 119){
                dx += 0;
                dy += -s;
            }
            arrayOfFields[last.y1/s][last.x1/s] = true;
            queue.add(new Quad(dx,dy,dx,s + dy,s + dx,s+dy,s+dx,dy));
            if(destX*s == last.x1 && destY*s == last.y1){
                if($("#choose_dif").val() == "łatwy") points += 1;
                else if($("#choose_dif").val() == "normalny") points += 2;
                else points += 3;
                $("#count").html(points);
                destX = Math.floor(Math.random() * (sizeX/s-1));
                destY = Math.floor(Math.random() * (sizeY/s-1));
                while(arrayOfFields[destY][destX]){
                    destX += 14;
                    while(destX > 12){
                        destX -= 13;
                        destY++;
                        if(destY == 9) destY = 0;
                    }
                }
            }
            else{
                let head = queue.dequeue();
                arrayOfFields[head.y1/s][head.x1/s] = false;
            }
        }
    }
    else if(!begin){
        $("#choose_dif")[0].disabled = false;
    }
}