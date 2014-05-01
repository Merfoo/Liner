// Gobal variables, starting with _
var _cvs = { game: null };
var _map = { width: 0, height: 0 };
var _line = { body: [], width: 10 };
var _mouse = { x: null, y: null, down: false };

document.addEventListener("DOMContentLoaded", initGame);
document.documentElement.style.overflowX = "hidden";	 // Horizontal scrollbar will be hidden
document.documentElement.style.overflowY = "hidden";     // Vertical scrollbar will be hidden
window.addEventListener("mousedown", mouseDownEvent);
window.addEventListener("mouseup", mouseUpEvent);
window.addEventListener("mousemove", mouseMoveEvent);

// Called once when the document has loaded
function initGame()
{
    var cvsBorderThick = parseInt(getComputedStyle(document.getElementById('gameCanvas'),null).getPropertyValue('border-width'));
    _cvs.game = document.getElementById("gameCanvas").getContext("2d");
    _map.width = window.innerWidth - (cvsBorderThick * 2);
    _map.height = window.innerHeight - (cvsBorderThick * 2);
    _cvs.game.canvas.width = _map.width;
    _cvs.game.canvas.height = _map.height;
    setInterval(gameLoop, 1000 / 60);
    _line.body.push({ x: 0, y: 0 });
}

// Main loop for the game
function gameLoop()
{
    clearScreen();
    updateLine();
    paintLine();
}

// Adds new points to the line
function updateLine()
{   
    var x, y;
    
    if(_mouse.x !== null && _mouse.y !== null)
    {
        x = getRandomNumber(_mouse.x - 200, _mouse.x + 200);
        y = getRandomNumber(_mouse.y - 200, _mouse.y + 200);
    }
    
    else
    {
        x = getRandomNumber(0, _map.width);
        y = getRandomNumber(0, _map.height);
    }
    
    _line.body.unshift({ x: x, y: y });
 
    for(var i in _line.body)
    {
        _line.body[i].y += 10;
        
        if(_line.body[i].y > _map.height + (_map.height / 3))
           _line.body.splice(i, 1);
    }
}

// Paints the line body
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

// Paints the whole screen
function clearScreen()
{
    _cvs.game.fillStyle = "black";
    _cvs.game.fillRect(0, 0, _map.width, _map.height);
}

// Gets called once when the mouse button is held down, not continously
function mouseDownEvent(e)
{
    console.log(e);
    _mouse.down = true;
    _mouse.x = e.x;
    _mouse.y = e.y;
}

// Gets called when the mouse button is released
function mouseUpEvent(e)
{
    _mouse.down = false;
    _mouse.x = null;
    _mouse.y = null;
}

// Gets called when the mouse moves
function mouseMoveEvent(e)
{
    if(_mouse.down)
    {
        _mouse.x = e.x;
        _mouse.y = e.y;
    }
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