var _cvs = { game: null };
var _map = { width: 0, height: 0 };
var _line = { body: [], width: 10 };
var _mouse = { x: null, y: null };

document.addEventListener("DOMContentLoaded", initGame);
document.documentElement.style.overflowX = "hidden";	 // Horizontal scrollbar will be hidden
document.documentElement.style.overflowY = "hidden";     // Vertical scrollbar will be hidden
window.addEventListener("mousedown", mouseDownEvent);
window.addEventListener("mouseup", mouseUpEvent);

function initGame()
{
    var cvsBorderThick = parseInt(getComputedStyle(document.getElementById('gameCanvas'),null).getPropertyValue('border-width'));
    _cvs.game = document.getElementById("gameCanvas").getContext("2d");
    _map.width = window.innerWidth - (cvsBorderThick * 2);
    _map.height = window.innerHeight - (cvsBorderThick * 2);
    _cvs.game.canvas.width = _map.width;
    _cvs.game.canvas.height = _map.height;
    setInterval(gameLoop, 1000 / 60);
}

function gameLoop()
{
    clearScreen();
    updateLine();
    paintLine();
}

function updateLine()
{
    var x = getRandomNumber(0, _map.width);
    var y = getRandomNumber(0, _map.height);
    _line.body.push({ x: x, y: y });
 
    for(var i in _line.body)
    {
        _line.body[i].y += 10;
        
        if(_line.body[i].y > _map.height + (_map.height / 3))
           _line.body.splice(i, 1);
    }
}

function paintLine()
{
    _cvs.game.beginPath();
    _cvs.game.lineWidth = _line.width;
    _cvs.game.moveTo(_line.body[0].x, _line.body[0].y);
    
    for(var i = 1; i < _line.body.length; i++)
        _cvs.game.lineTo(_line.body[i].x, _line.body[i].y);
    
    _cvs.game.strokeStyle = getRandomColor(0, 255);
    _cvs.game.stroke();
    _cvs.game.closePath();
}

function clearScreen()
{
    _cvs.game.clearRect(0, 0, _map.width, _map.height);
}

function mouseDownEvent(e)
{
    console.log(e);
    _mouse.x = e.x;
    _mouse.y = e.y;
}

function mouseUpEvent(e)
{
    _mouse.x = null;
    _mouse.y = null;
}

// Returns random color between iMin and iMax.
function getRandomColor(min, max)
{
    // Creating a random number between iMin and iMax, converting to hex
    var hexR = (getRandomNumber(min, max)).toString(16);
    var hexG = (getRandomNumber(min, max)).toString(16);
    var hexB = (getRandomNumber(min, max)).toString(16);

    // Making sure single character values are prepended with a "0"
    if (hexR.length == 1)
        hexR = "0" + hexR;

    if (hexG.length == 1)
        hexG = "0" + hexG;

    if (hexB.length == 1)
        hexB = "0" + hexB;

    // Creating the hex value by concatenatening the string values
    return ("#" + hexR + hexG + hexB).toUpperCase();
}

// Returns random number between iMin and iMax, include iMin and iMax
function getRandomNumber(min, max)
{
    if (max < min)
    {
        var tmp = max;
        max = min;
        min = tmp;
    }

    return Math.floor((Math.random() * ((max + 1) - min)) + min);
}