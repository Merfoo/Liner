// Gobal variables, starting with _
var _cvs = { game: null };
var _map = { width: 0, height: 0 };
var _touchArea = { y: 300, height: 200, color: "white" };
var _line = { body: [], normWidth: 15, smallWidth: 10, bigWidth: 20 };
var _mouse = { x: null, y: null, down: false };
var _lineMode = { left: false, center: false, right: false, none: false, count: 0, minCount: 15, maxCount: 25, dist: 0 };

document.addEventListener("DOMContentLoaded", initGame);
document.documentElement.style.overflowX = "hidden";	 // Horizontal scrollbar will be hidden
document.documentElement.style.overflowY = "hidden";     // Vertical scrollbar will be hidden
window.addEventListener("mousedown", mouseDownEvent);
window.addEventListener("mouseup", mouseUpEvent);
window.addEventListener("mousemove", mouseMoveEvent);
window.addEventListener("touchstart", mouseDownEvent);
window.addEventListener("touchend", mouseUpEvent);
window.addEventListener("touchstart", mouseMoveEvent);

// Called once when the document has loaded
function initGame()
{
    var cvsBorderThick = parseInt(getComputedStyle(document.getElementById('gameCanvas'),null).getPropertyValue('border-width'));
    _cvs.game = document.getElementById("gameCanvas").getContext("2d");
    _map.width = window.innerWidth - (cvsBorderThick * 2);
    _map.height = window.innerHeight - (cvsBorderThick * 2);
    _cvs.game.canvas.width = _map.width;
    _cvs.game.canvas.height = _map.height;
    _line.body.push({ x: _map.width / 2, y: 0, visible: false });

    window.requestAnimFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };

    gameLoop();
}

// Main loop for the game
function gameLoop()
{
    clearScreen();
    updateLine();
    paintTouchArea();
    paintLine();
    window.requestAnimFrame(gameLoop);
}

// Adds new points to the line
function updateLine()
{   
    var lastPos = { x: _line.body[0].x, y: _line.body[0].y };

    if(--_lineMode.count <= 0)
    {
        if(_lineMode.none)
            lastPos.x = getRandomNumber(0, _map.width);
        
        resetLineMode();
        _lineMode.count = getRandomNumber(_lineMode.minCount, _lineMode.maxCount);
        var mode = Math.random();

        if(mode < 0.25)
            _lineMode.center = true;

        else if(mode < 0.555)
            _lineMode.left = true;

        else if(mode < 0.75)
            _lineMode.right = true;

        else
            _lineMode.none = true;
        
        _lineMode.dist = getRandomNumber(6, 8);
    }

    if(lastPos.x < 0 + _line.normWidth)
    {
        resetLineMode();
        _lineMode.right = true;
    }

    if(lastPos.x > _map.width - _line.normWidth)
    {
        resetLineMode();
        _lineMode.left = true;
    }

    if(_lineMode.left)
        _lineMode.dist = -Math.abs(_lineMode.dist);

    else if(_lineMode.center)
        _lineMode.dist = 0;

    else if(_lineMode.right)
        _lineMode.dist = Math.abs(_lineMode.dist);

    _line.body.unshift({ x: lastPos.x + _lineMode.dist, y: 0, visible: !_lineMode.none, width: _line.normWidth });

    for(var i in _line.body)
    {
        _line.body[i].y += 5;

        if(_line.body[i].y > _map.height + (_map.height / 10))
        {   
            _line.body.splice(i, 1);
            continue;
        }

        if(_line.body[i].y > _touchArea.y && _line.body[i].y < _touchArea.y + _touchArea.height)
        {
            if(_mouse.down)
            {
                if(Math.abs(_mouse.x - _line.body[i].x) < 15 && Math.abs(_mouse.y - _line.body[i].y) < 15)
                {
                    console.log("touching");
                    _line.body[i].visible = false;
                }
            }
        }
    }
}

// Resets the game
function resetGame()
{
    resetLineMode();
    _mouse.down = false;
    _line.body = [];
    _line.body.push({ x: _map.width / 2, y: 0, visible: true, width: _line.normWidth });
}

// Resets the the lineMode
function resetLineMode()
{
    _lineMode.left = false;
    _lineMode.center = false;
    _lineMode.right = false;
    _lineMode.none = false;
}

// Paints the line body
function paintLine()
{
    _cvs.game.beginPath();
    _cvs.game.lineCap = "round";
    _cvs.game.moveTo(_line.body[0].x, _line.body[0].y);

    for(var i = 1; i < _line.body.length; i++)
    {    
        _cvs.game.lineWidth = _line.body[i].width;
        
        if(_line.body[i].visible)
        {    
            if(!_line.body[i - 1].visible)
                _cvs.game.moveTo(_line.body[i].x, _line.body[i].y);
            
            _cvs.game.lineTo(_line.body[i].x, _line.body[i].y);
        }
    }

    _cvs.game.strokeStyle = getRandomColor(0, 255);
    _cvs.game.stroke();
    _cvs.game.closePath();
}

// Paints the touch area
function paintTouchArea()
{
    _cvs.game.fillStyle = _touchArea.color;
    _cvs.game.fillRect(0, _touchArea.y, _map.width, _touchArea.height);
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