const container = document.getElementById("gridd")
const imggrid = document.getElementById("imggrid")
var selectedimg = null;
var movex = 0;
var movey = 0;
var mult = 3;
var placeMode = false;
var deleteMode = false
document.body.addEventListener("keydown", function(e) {
  
  console.log(e.key)
  switch (e.key) {
    case "ArrowLeft": movex-=1*mult; break;
    case "ArrowRight": movex+=1*mult; break;
    case "ArrowUp": movey-=1*mult; break;
    case "ArrowDown": movey+=1*mult; break;
  }
  
  movex = Math.min(Math.max(movex, -1*mult), 1*mult);
  movey = Math.min(Math.max(movey, -1*mult), 1*mult);
  
})

document.body.addEventListener("keyup", function (e) {
  movex = 0;
  movey = 0;
})

document.body.addEventListener("mousedown", function(e) {
  switch (e.button){
    case 0: if(!deleteMode){placeMode=true}; break; 
    case 2: if(!placeMode){deleteMode=true}; break; 
  }
  console.log(placeMode,deleteMode,e.button)
})

document.body.addEventListener("mouseup", function(e) {
  switch (e.button){
    case 0: placeMode=false; break; 
    case 2: deleteMode=false; break; 
  }
})

function resetMapHtml() {
  container.innerHTML = ""
  makeRows(10,10)
}

function makeRows(rows, cols) {
  for (let i = 0; i < rows; i++) {
    let div = document.createElement("div")
    div.classList.add("d-flex")
    for (let a = 0; a < cols; a++) {
      let cell = document.createElement("div")
      cell.innerHTML = " "
      cell.classList.add("cell")
      cell.onmouseenter = function(){touchedCell(this);}
      cell.onmousedown = function(){clickedCell(this);}
      cell.oncontextmenu = function(e){e.preventDefault();deleteCell(this)}
      div.appendChild(cell)
      
    }

    container.appendChild(div)
    
  }
};

resetMapHtml()

function loadSpriteSheet(input) {
  imggrid.innerHTML = ""
  var url = input.value;
  var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
  var reader = new FileReader();

  reader.onload = function(e) {
    let res = prompt("Resolution of a single tile in pixels:")
    handleSpriteSheet(e.target.result,res)
  }

  reader.readAsDataURL(input.files[0])
}

function handleSpriteSheet(src,px) {
  var image = new Image();
  image.onload = cutImageUp;
  image.src = src;

  function cutImageUp() {
      
      let widthOfOnePiece = px
      let heightOfOnePiece = widthOfOnePiece
      let numColsToCut = image.width/px
      let numRowsToCut = image.height/px
      imggrid.style.setProperty('--grid-rows', numColsToCut);
      imggrid.style.setProperty('--grid-cols', numRowsToCut);
      var imagePieces = [];
      for(var x = 0; x < numColsToCut; ++x) {
          for(var y = 0; y < numRowsToCut; ++y) {
              var canvas = document.createElement('canvas');
              canvas.width = widthOfOnePiece;
              canvas.height = heightOfOnePiece;
              var context = canvas.getContext('2d');
              context.drawImage(image, y * widthOfOnePiece, x * heightOfOnePiece, widthOfOnePiece, heightOfOnePiece, 0, 0, canvas.width, canvas.height);
              imagePieces.push(canvas.toDataURL());
          }
      }

      // imagePieces now contains data urls of all the pieces of the image

      // load one piece onto the page
      
      //anImageElement.src = imagePieces[0];
      for (let i = 0; i < imagePieces.length; i++) {
        const url = imagePieces[i];
        let img = document.createElement("img")
        img.src = url
        img.onclick = function(){selectImage(this)}
        img.classList.add("pixelated","imgcell")
        imggrid.append(img)
      }
  }
}


function selectImage(img) {
  selectedimg = img
}

function touchedCell(cell) {
  if (placeMode) {
    clickedCell(cell)
  }
  else if (deleteMode) {
    deleteCell(cell)
  }
}

function clickedCell(cell) {
  if (selectedimg != null) {
    cell.style.backgroundImage = "url('" + selectedimg.src + "')"
  }
  
}
function deleteCell(cell,e) {
    cell.style.backgroundImage = ""
  
}






function loop() {
  
  container.style.left = String(parseInt(container.style.left)+movex)+"px"
  container.style.top = String(parseInt(container.style.top)+movey)+"px"
  requestAnimationFrame(loop)
}

loop()
