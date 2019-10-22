'use strict'

var BOARD = [
    [1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0],
    [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0],
    [1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1]
];

var GUESS = Array(BOARD.length).fill().map(() =>
            Array(BOARD[0].length).fill(0));

function hookMouse(ctx, backdrop, scale) {
    var last = [-1, -1];
    var painting = -1;
    function handleMouse(offsetX, offsetY, button) {
        var ox = (Math.ceil(BOARD[0].length / 2));
        var oy = (Math.ceil(BOARD.length / 2));
        var x = (Math.floor((((offsetX - 2.5))/(35*scale))-ox));
        var y = (Math.floor((((offsetY - 2.5))/(35*scale))-oy));
        if (last[0] != x || last[1] != y) {
            if (x < BOARD[0].length && y < BOARD.length) {
                if (button == 1) {
                    if (GUESS[y][x] == 0 && painting != 0) {
                        GUESS[y][x] = 1;
                        painting = 1;
                    } else if (GUESS[y][x] == 1 && painting != 1) {
                        GUESS[y][x] = 0;
                        painting = 0;
                    }
                } else if (button == 2) {
                    if (GUESS[y][x] == 0 && painting != 0) {
                        GUESS[y][x] = 2;
                        painting = 1;
                    } else if (GUESS[y][x] == 2 && painting != 1) {
                        GUESS[y][x] = 0;
                        painting = 0;
                    }
                }
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(backdrop, 0, 0);
                renderGuess(ctx, scale);
                last = [x, y];
                console.log(last);
            }
        }
    };
    canvas.addEventListener('mousedown', function(ev) {
        last = [-1, -1];
        painting = -1;
        handleMouse(ev.offsetX, ev.offsetY, ev.buttons);
    });
    canvas.addEventListener('contextmenu', function(ev) {
        return false;
    });
    canvas.addEventListener('mousemove', function(ev) {
        if (ev.buttons != 0) {
            handleMouse(ev.offsetX, ev.offsetY, ev.buttons);
        }
    });
};

function calculateHints() {
    var i = 0;
    var j = 0;
    var hhints = [];
    var vhints = [];
    for (i = 0; i < BOARD.length; ++i) {
        var hints = [];
        var cons = 0;
        for (j = 0; j < BOARD[0].length; ++j) {
            if (BOARD[i][j] == 1) {
                cons += 1;
            } else if (BOARD[i][j] == 0 && cons > 0) {
                hints.unshift(cons);
                cons = 0;
            }
        }
        if (cons > 0 || hints.length == 0) {
            hints.unshift(cons);
        }
        hhints.push(hints);
    }
    for (i = 0; i < BOARD[0].length; ++i) {
        var hints = [];
        var cons = 0;
        for (j = 0; j < BOARD.length; ++j) {
            if (BOARD[j][i] == 1) {
                cons += 1;
            } else if (BOARD[j][i] == 0 && cons > 0) {
                hints.unshift(cons);
                cons = 0;
            }
        }
        if (cons > 0 || hints.length == 0) {
            hints.unshift(cons);
        }
        vhints.push(hints);
    }
    return [hhints, vhints];
};

function renderBoard(renderTarget, scale) {
    var i = 0;
    var j = 0;
    var ox = (35 * (Math.ceil(BOARD[0].length / 2))) * scale;
    var oy = (35 * (Math.ceil(BOARD.length / 2))) * scale;
    renderTarget.fillStyle = "#444";
    renderTarget.fillRect(ox, oy, (5+BOARD[0].length*35)*scale, (5+BOARD.length*35)*scale);
    renderTarget.font = "20px Arial";
    var hints = calculateHints();
    for (i = 0; i < BOARD.length; ++i) {
        for (j = 0; j < hints[0][i].length; ++j){
            renderTarget.fillText(hints[0][i][j], (ox-(35*(j+0.5)*scale)), (oy+(35*(i+0.7)*scale)));
        }
    }
    for (i = 0; i < BOARD[0].length; ++i) {
        for (j = 0; j < hints[1][i].length; ++j){
            renderTarget.fillText(hints[1][i][j], (ox+(35*(i+0.5) * scale)), (oy-(35*(j+0.3) * scale)));
        }
    }
    for (i = 0; i < BOARD.length; ++i) {
        j = 0;
        for (j = 0; j < BOARD[0].length; ++j) {
            var c = Math.floor(200 + (Math.random() * 30));
            renderTarget.fillStyle="rgb(" + c + "," + c + "," + c + ")";
            renderTarget.fillRect((ox+(5+j*35)*scale), (oy+(5+i*35)* scale), 30*scale, 30*scale);
        }
    }
};

function renderGuess(renderTarget, scale) {
    var i = 0;
    var j = 0;
    var ox = (35 * (Math.ceil(BOARD[0].length / 2))) * scale;
    var oy = (35 * (Math.ceil(BOARD.length / 2))) * scale;
    for (i = 0; i < BOARD.length; ++i) {
        j = 0;
        for (j = 0; j < BOARD[0].length; ++j) {
            if (GUESS[i][j] == 1) { 
                renderTarget.fillStyle="#6666EE";
                renderTarget.fillRect((ox+(5+j*35)*scale), (oy+(5+i*35)*scale), 30*scale, 30*scale);
            } else if (GUESS[i][j] == 2) {
                renderTarget.fillStyle="#EE6666";
                renderTarget.fillRect((ox+(5+j*35)*scale), (oy+(5+i*35)*scale), 30*scale, 30*scale);
            }
        }
    }
};

window.onload = function() {
    window.canvas = document.getElementById("game");
    //canvas.width = (5 + (35 * (Math.ceil(BOARD[0].length * 1.5))));
    //canvas.height = (5 + (35 * (Math.ceil(BOARD.length * 1.5))));
    canvas.width = (5 + (35 * (BOARD[0].length * 2)));
    canvas.height = (5 + (35 * (BOARD.length * 2)));
    var cWidth = document.getElementById("container").offsetWidth;
    //var cHeight = document.getElementById("container").offsetHeight;
    var cHeight = document.documentElement.clientHeight;
    var scale = Math.min(cWidth/canvas.width, cHeight/canvas.height);
    canvas.width = canvas.width * scale;
    canvas.height = canvas.height * scale;
    var backdrop = document.createElement("canvas");
    backdrop.width = (5 + (35 * (Math.ceil(BOARD[0].length * 1.5)))) * scale;
    backdrop.height = (5 + (35 * (Math.ceil(BOARD.length * 1.5)))) * scale;
    var ctx = canvas.getContext("2d");
    hookMouse(ctx, backdrop, scale);
    renderBoard(backdrop.getContext("2d"), scale);
    ctx.drawImage(backdrop, 0, 0); 
};
