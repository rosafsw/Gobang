
var gobang = document.getElementById('gobang');
var context = gobang.getContext('2d');
var me = true;
var over = false;
var chessBoard = [];
var wins = [];
var myWins = [];
var aiWins = [];

for(var i = 0; i < 15; i++){
	chessBoard[i] = [];
	for(var j = 0; j < 15; j++){
		chessBoard[i][j] = 0;
	}
}

for(var i = 0; i < 15; i++){
	wins[i] = [];
	for(var j = 0; j < 15; j++){
		wins[i][j] = [];
	}
}

var count = 0;

for(var i = 0; i < 15; i++){
	for(var j = 0; j < 11; j++){
		for(var k = 0; k < 5; k++){
			wins[i][j + k][count] = true;
		}
	count++;
	}
}

for(var i = 0; i < 15; i++){
	for(var j = 0; j < 11; j++){
		for(var k = 0; k < 5; k++){
			wins[j + k][i][count] = true;
		}
	count++;
	}
}

for(var i = 0; i < 11; i++){
	for(var j = 0; j < 11; j++){
		for(var k = 0; k < 5; k++){
			wins[i + k][j + k][count] = true;
		}
	count++;
	}
}

for(var i = 0; i < 11; i++){
	for(var j = 14; j > 3; j--){
		for(var k = 0; k < 5; k++){
			wins[i + k][j - k][count] = true;
		}
	count++;
	}
}

console.log(count)

for(var i = 0; i < count; i++){
	myWins[i] = 0;
	aiWins[i] = 0;
}


context.strokeStyle="#BFBFBF";

var logo = new Image();
logo.src = "images/logo.png";
logo.onload = function(){
	context.drawImage(logo, 0, 0, 450, 450);
	drawChessBoard();
}

var drawChessBoard = function(){
for(var i = 0; i < 15; i++){
	context.moveTo(15 + i * 30, 15);
	context.lineTo(15 + i * 30, 435);
	context.stroke();
	context.moveTo(15, 15 + i * 30);
	context.lineTo(435, 15 + i * 30);
	context.stroke();
}
}

var oneStep = function(i, j, me){
	context.beginPath();
	context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
	context.closePath();
	var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0 );
	if(me){
		gradient.addColorStop(0, "#0A0A0A");
		gradient.addColorStop(1, "#636766");
	}else{
		gradient.addColorStop(0, "#D1D1D1");
		gradient.addColorStop(1, "#FFFFFF");
	}
	context.fillStyle = gradient;
	context.fill();
}

gobang.onclick = function(e){
	if(over){
		return;
	}
	if(!me){
		return;
	}
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x / 30);
	var j = Math.floor(y / 30);
	if(chessBoard[i][j] == 0){
	oneStep(i, j, me);
	chessBoard[i][j] = 1;
	for(var k = 0; k < count; k++){
		if(wins[i][j][k]){
			myWins[k]++;
			aiWins[k] = 6;
			if(myWins[k] == 5){
				window.alert("Congratulations! You Win!");
				over = true;
			}
		}
	}
	if(!over){
		me = !me;
		computerAI();
	}
	}
}


var computerAI = function(){
	var myScore = [];
	var aiScore = [];
	var max = 0;
	var u = 0;
	var v = 0;
	for(var i = 0; i < 15; i++){
		myScore[i] = [];
		aiScore[i] = [];
		for(var j = 0; j < 15; j++){
			myScore[i][j] = 0;
			aiScore[i][j] = 0;
		}
	}
	for(var i = 0; i < 15; i++){
		for(var j = 0; j < 15; j++){
			if(chessBoard[i][j] == 0){
				for(var k = 0; k < count; k++){
					if(wins[i][j][k]){
						if(myWins[k] == 1){
							myScore[i][j] += 200;
						}else if(myWins[k] == 2){
							myScore[i][j] += 400;
						}else if(myWins[k] == 3){
							myScore[i][j] += 2000;
						}else if(myWins[k] == 4){
							myScore[i][j] += 10000;
						}
						if(aiWins[k] == 1){
							aiScore[i][j] += 220;
						}else if(aiWins[k] == 2){
							aiScore[i][j] += 420;
						}else if(aiWins[k] == 3){
							aiScore[i][j] += 2100;
						}else if(aiWins[k] == 4){
							aiScore[i][j] += 20000;
						}
					}
				}
				if(myScore[i][j] > max){
					max = myScore[i][j];
					u = i;
					v = j;
				}else if(myScore[i][j] == max){
					if(aiScore[i][j] > aiScore[u][v]){
						u = i;
						v = j;
					} 
				}
				if(aiScore[i][j] > max){
					max = aiScore[i][j];
					u = i;
					v = j;
				}else if(aiScore[i][j] == max){
					if(myScore[i][j] > myScore[u][v]){
						u = i;
						v = j;
					} 
				}
			}
		}
	}
	oneStep(u, v, false);
	chessBoard[u][v] = 2;
	for(var k = 0; k < count; k++){
		if(wins[u][v][k]){
			aiWins[k]++;
			myWins[k] = 6;
			if(aiWins[k] == 5){
				window.alert("Sorry! You lose!");
				over = true;
			}
		}
	}
	if(!over){
		me = !me;
	}
}


