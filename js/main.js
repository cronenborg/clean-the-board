var x = 0,
y = 0,
ox = 0,
oy = 0,
dx = 0,
dy = 0,
victory = 0,
bonus = 3600,
level = 1,
levels = 8,
score = 0,
firstmove = 0;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function bonusdecrease(){
	window.bonus = window.bonus-100;
	if (window.bonus<=100){window.bonus=100;}
	$('#bonus').html(window.bonus);
	$("#bonus").addClass("shakef");
}

function finish(){
	console.log("You finished the game!!");
	$('#victorylabel').addClass("hidden");
	$('#endlabel').removeClass("hidden");
	$("#endlabel").addClass("flash");
	$('#endlabel').click(function(e){
		$("#endlabel").addClass("hidden");
		init(0);
	});
}

function init(l) {
	window.x 			= 0;
	window.y 			= 0;
	window.ox 			= 0;
	window.oy 			= 0;
	window.dx 			= 0;
	window.dy 			= 0;
	window.victory 		= 0;
	window.bonus 		= 3600;
	window.level 		= l+1;
	window.firstmove 	= 0;
	$('#bonus').html(window.bonus);
	$('#level').html(window.level);
	
	var orig = $("#pedina").parent();
	var pedinahtml = orig.html();
	$('td').each(function() {
		$(this).removeClass("bg-grey");
		$(this).empty();
	});
	$("#grid00").html(pedinahtml);
	
	switch(window.level) {
		case 1:
			console.log("level 1");
			$('#grid01').addClass("bg-grey");
			$('#grid02').addClass("bg-grey");
			$('#grid03').addClass("bg-grey");
		break;
		case 2:
			console.log("level 2");
			$('#grid03').addClass("bg-grey");
		break;
		case 3:
			console.log("level 3");
			$('#grid23').addClass("bg-grey");
		break;
		case 4:
			console.log("level 4");
			$('#grid23').addClass("bg-grey");
			$('#grid55').addClass("bg-grey");
		break;
		case 5:
			console.log("level 5");
			$('#grid15').addClass("bg-grey");
			$('#grid40').addClass("bg-grey");
			$('#grid53').addClass("bg-grey");
		break;
		case 6:
			console.log("level 6");
			$('#grid13').addClass("bg-grey");
			$('#grid14').addClass("bg-grey");
			$('#grid25').addClass("bg-grey");
			$('#grid31').addClass("bg-grey");
		break;
		case 7:
			console.log("level 7");
			$('#grid55').addClass("bg-grey");
		break;
		case 8:
			console.log("level 8");
			$('#grid14').addClass("bg-grey");
			$('#grid15').addClass("bg-grey");
			$('#grid26').addClass("bg-grey");
			$('#grid32').addClass("bg-grey");
		break;
		default:
			console.log("END");
		break;
	}
	
}

async function happy(){
	$("#pedina").addClass("wobble");
	await sleep(1000);
	$("#pedina").removeClass("wobble");
}

async function victoryFunc() {
	console.log("VICTORY!");
	window.victory = 1;
	window.score += window.bonus;
	$('#victorylabel').removeClass("hidden").addClass("rotateIn");
	$('#score').html(window.score);
	await happy();
	if(window.level<levels){
		init(window.level);
	} else {
		finish();
	}
}

function checkboard(){
	var res = 1;
	$('td').each(function() {
		if ($(this).hasClass("bg-grey")) {
			res = 0;
		}
	});
	if (res===1) {
		victoryFunc();
	}
}

function muovipedina() {
	bonusdecrease();
	var orig = {};
	orig = $("#pedina").parent();
	var pedinahtml = orig.html();
	orig.empty();
	$("#grid"+window.dx+""+window.dy).html(pedinahtml);
	window.x = window.dx;
	window.y = window.dy;
	if ($("#grid"+window.dx+""+window.dy).hasClass("bg-grey")) {
		$("#grid"+window.dx+""+window.dy).removeClass("bg-grey");
		$("#pedina").removeClass("shakef");
		$("#pedina").addClass("pulse");
	} else {
		$("#grid"+window.dx+""+window.dy).addClass("bg-grey");
		$("#pedina").removeClass("pulse");
		$("#pedina").addClass("shakef");
	}
	
	checkboard();
}

$(document).ready(function(){
	$("#victorylabel").addClass("animated");
	$("#pedina").addClass("animated");
	$("#bonus").addClass("animated");
	init(0);
	
	$(".casella").click(function(e){
		e.preventDefault();
		var orig = {};
		orig = $("#pedina").parent();
		window.ox = orig.data("row");
		window.oy = orig.data("col");
		console.log($(this).attr("id"));
		if (($(this).data("row") == window.ox && ($(this).data("col")==(window.oy+1) || $(this).data("col")==(window.oy-1))) || ($(this).data("col") == window.oy && ($(this).data("row")==(window.ox+1) || $(this).data("row")==(window.ox-1)))) 
		{
			console.log("good");
			if (window.victory===0) {
				if (window.firstmove==0) {
					$("#victorylabel").addClass("hidden");
					window.firstmove = 1;
				}
				window.dx = $(this).data("row");
				window.dy = $(this).data("col");
				muovipedina();
			} else {
				console.log("no movements allowed!");
				return;
			}
		} else {
			return;
		}
	});
	
	$(document).keydown(function(e) {
		var orig = {};
		orig = $("#pedina").parent();
		window.ox = orig.data("row");
		window.oy = orig.data("col");
		if (window.victory===0) {
			if (window.firstmove==0) {
				$("#victorylabel").addClass("hidden");
				window.firstmove = 1;
			}
			switch(e.which) {
				case 37: // left
					if (window.oy>0){
						window.dy = window.oy-1;
						muovipedina();
					} else {
						window.dy = 0;
					}
				break;
				case 38: // up
					if (window.ox>0){
						window.dx = window.ox-1;
						muovipedina();
					} else {
						window.dx = 0;
					}
				break;
				case 39: // right
					if (window.oy<5){
						window.dy = window.oy+1;
						muovipedina();
					} else {
						window.dy = 5;
					}
				break;
				case 40: // down
					if (window.ox<5){
						window.dx = window.ox+1;
						muovipedina();
					} else {
						window.dx = 5;
					}
				break;
				default: return;
			}
		} else {
			console.log("no movements allowed!");
			return;
		}
		e.preventDefault(); // prevent the default action (scroll / move caret)
	});
});
