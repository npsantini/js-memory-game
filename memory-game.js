// Global Variables
var memory_array = [];
// Colors needed to be in hex to work correctly
var colors_array = [
  '"#800000"',
  '"#FF0000"',
  '"#FFA500"',
  '"#FFFF00"',
  '"#008000"',
  '"#800080"',
  '"#00FF00"',
  '"#0000FF"',
  '"#808080"',
  '"#FFFFFF"',
  '"#FF6347"'
];
var colors_array2 = [];
var memory_values = [];
var color_memory_values = [];
var memory_tile_ids = [];
var color_memory_tile_ids = [];

var player1;
var player2;

var count = 0;
var p1Count = 0;
var p2Count = 0;
var turnCount = 0; // Should only be 0 for player 1's turn or 1 for player 2's turn

var tiles_flipped = 0;
var boardSize;

function gameInfo(){
// Get usernames for the board *****************************************
  player1 = prompt("Player 1: what is your name?", "");
  player2 = prompt("Player 2: what is your name?", "");
  // *********************************************************************

  // Add usernames to board *********************************************
  document.getElementById("p1").innerHTML = player1;
  document.getElementById("p2").innerHTML = player2;
  // *********************************************************************

  // User selects size of board ***************************************
  boardSize = prompt("What size board? (Min 4, Max 10)", "4");
  // ******************************************************************

  // Error Handling for board size ************************************
  while (boardSize < 4 || boardSize > 10 || boardSize % 2 != 0) {
    boardSize = prompt("What size board? (Even only. Min 4, Max 10)", "4");
  }
  // ******************************************************************
}

// Shuffle functions
Array.prototype.memory_tile_shuffle = function() {
  var i = this.length, j, temp;
  while (--i > 0) {
    j = Math.floor(Math.random() * (i + 1));

    //Number shuffle
    temp = this[j];
    this[j] = this[i];
    this[i] = temp;

    //Color shuffle
    // w = array x = temp y = j z = i
    function myFunction(w, x, y, z) {
      x = w[j];
      w[j] = w[i];
      w[i] = x;
    }

    myFunction(colors_array2, temp, j, i);
  }

};

function newBoard() {
  gameInfo();
  p1Count = 0;
  p2Count = 0;
  document.getElementById("player1Score").innerHTML = p1Count;
  document.getElementById("player2Score").innerHTML = p2Count;
  
  var totalTiles = boardSize * boardSize;
  var tileSize = 100 / boardSize + "%";
  
  // Loop to poulate the arrays
  for (var i = 0; i < totalTiles / 2; i++) {
    var random = Math.random();
    var random2 = Math.random();
    // Populate with digits 1 - 4
    memory_array.push(Math.floor(random * 5));
    memory_array.push(Math.floor(random * 5));
    // populate with colors
    colors_array2.push(colors_array[Math.floor(random2 * 10)]);
    colors_array2.push(colors_array[Math.floor(random2 * 10)]);
  }

  tiles_flipped = 0;
  var output = "";

  // Shuufle arrays
  memory_array.memory_tile_shuffle();
  colors_array2.memory_tile_shuffle();

  for (var i = 0; i < boardSize * boardSize; i++) {
    output +=
      "<div id='tile_" +
      i +
      "' onclick='memoryFlipTile(this," +
      memory_array[i] +
      "," +
      colors_array2[i] +
      ")' style='width:" +
      tileSize +
      "; height='" + tileSize + ";'></div>";
  }
  

  document.getElementById("memory_board").innerHTML = output + "<div class='clear'></div>";
  
  // Set initial message
  if (turnCount == 0){
    document.getElementById("message").innerHTML = player1 + "'s turn.";
  } else {
    document.getElementById("message").innerHTML = player2 + "'s turn.";
  }
  
}


function memoryFlipTile(tile, val, color) {
  
  if (turnCount > 1){
    turnCount = 0;
  }
  
  if (turnCount == 0){
    document.getElementById("message").innerHTML = player1 + "'s turn.";
  } else {
    document.getElementById("message").innerHTML = player2 + "'s turn.";
  }

  if (tile.innerHTML == "" && memory_values.length < 2) {
    tile.style.background = color;
    tile.innerHTML = val;
    if (memory_values.length == 0) {
      memory_values.push(val);
      memory_tile_ids.push(tile.id);
      color_memory_values.push(color);
      document.getElementById("message").innerHTML = "First tile has been chosen.";
    } else if (memory_values.length == 1) {
      memory_values.push(val);
      memory_tile_ids.push(tile.id);
      color_memory_values.push(color);
      // If a match
      if (
        memory_values[0] == memory_values[1] &&
        color_memory_values[0] == color_memory_values[1]
      ) {
        document.getElementById("message").innerHTML = "That's a match!";
        if (turnCount == 0){
          p1Count++;
          //player1Score = count;
          document.getElementById("player1Score").innerHTML = p1Count;
        } else {
          //player2Score = count;
          p2Count++;
          document.getElementById("player2Score").innerHTML = p2Count;
        }
        tiles_flipped += 2;
        // Clear both arrays
        memory_values = [];
        memory_tile_ids = [];
        color_memory_values = [];
        colors_array2 = [];
        memory_array = [];
        
        // Check to see if the whole board is cleared
        if (tiles_flipped == boardSize * boardSize) {
            if (p1Count > p2Count){
              alert(player1 + " won!");
            } else if (p2Count > p1Count) {
              alert(player2 + " won!");
            } else {
              alert("It's a Tie");
            }
        }
      } else {
        // If not a match
        function flip2Back() {
          turnCount++;
          // Flip the 2 tiles back over
          document.getElementById("message").innerHTML = "That's not a match...";
          var tile_1 = document.getElementById(memory_tile_ids[0]);
          var tile_2 = document.getElementById(memory_tile_ids[1]);
          tile_1.style.background = "#ccc";
          tile_1.innerHTML = "";
          tile_2.style.background = "#ccc";
          tile_2.innerHTML = "";

          // Clear both arrays
          memory_values = [];
          memory_tile_ids = [];
          color_memory_values = [];
        }
        setTimeout(flip2Back, 700);
      }
    }
  }
}

function concedeGame(){
   if (turnCount == 0){
    alert(player1 + " quit. " + player2 + " wins.");
    newBoard();
  } else {
    alert(player2 + " quit. " + player1 + " wins.");
    newBoard();
  }
}