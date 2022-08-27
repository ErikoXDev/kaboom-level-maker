const container = document.getElementById("gridd")
const moveable = document.getElementById("grid-move")
const imggrid = document.getElementById("imggrid")
var selectedimg = null;
var movex = 0;
var movey = 0;
var mult = 3;
var celltouch = false
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
  switch (e.button && celltouch){
    case 0: if(!deleteMode){placeMode=true}; break; 
    case 2: if(!placeMode){deleteMode=true}; break; 
  }
})

document.body.addEventListener("mouseup", function(e) {
  celltouch = false
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
    let div = makeRow(cols)

    container.appendChild(div)
    
  }
};

function makeRow(cols) {
  let div = document.createElement("div")
  div.classList.add("d-flex")
  for (let a = 0; a < cols; a++) {
    let cell = makeCell()
    div.appendChild(cell)
    
  }
  return div
}

function makeCell() {
  let cell = document.createElement("div")
  cell.innerHTML = " "
  cell.id = " "
  cell.classList.add("cell")
  cell.onmouseenter = function(){touchedCell(this);}
  cell.onmousedown = function(){clickedCell(this);}
  cell.oncontextmenu = function(e){e.preventDefault();deleteCell(this)}
  return cell
}

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

function loadSpriteSheetExample() {
  imggrid.innerHTML = ""

  let img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAA0lJREFUaIHtWb2K20AQHvvc3VVBjXAjBLrGrYuQwnCgOuUVeYBAmjzC1anvEVKmTC0IuI3ewCDcBBEjUiVFAsEpktGNxrO7s9q13OQDg9HuaGfnb79ZzW5X5RH+IUlz6NoGKJI07/93bSPOuaT87HZVHukkH2RFDvW2ginkUen1poT9runl52MXR0wln6Q5JOnfDVPMg1aPhKzIISv0G6GYm+JRCy6vVYTK19vqxLJaLGKFACqOitBY1ciPRVASA5xWBnyXlHQ2+bEIygG0OipBFTElnSQfsn7QBtCyNguid6RE1YSYa/2gHNBYsGsbWG/KQW7EQlbksIj2NsMCXdvAfvcU5zSkNJvJitzqqWhJLC2sOWVdSYweNG3ibAdZCMVA8NIsIUoV0j73nYdGMBkiuArZFp4Ks1dv3vV0mrK8/a4Ry57NanR8rLzv+rP//QBLVlfVcMn7rh+1H8gKN32wyY9BcBLTmETFQ5XyQXA/QK09RvHQ9edJmnt1RByXbkkHVQi5iZSAJk4Syuej9gPY2nGPYLXgiMHnXeO26DCyUUp9621ltFIMPm9C1zaD/DCV5j6EeC1HhLLJENgONRwXyyiv7SacO4RMNJ3KLegA5SJoWdtJGSOEJA9SPmW69TjZQL2t+ioUWttDIV3NmE53sQoB6BTnIYCe08IUQlL7aUK0njiUmHHw95iKzKAf4K7z5fOh8tp+gHrG2Q9waObw+YiL9AM2Zel9D30GoKtQMfqB2Yvy9dE91Z818vLnw6+08GrqTVZyWS/k6lwDdT8gJd96Uxo9g/Nt1yIAp559WB0GJI7+HlaHE3nV3aiJjaKC0ia05wkPNYAD1NsKHsubwbz3v54P5mHoqTxAlaEKIRWwwVU28eaargMA8Lb6PvjRMaT8+52BzHFQxXmfQMely1rN9wFpzmN5M/jx9+EmVNcq1G2calMyxokZ/2ojgXvwZfIDPnbX4lw+lqS5OwdoY8FDiIeH7fiXQL/wSMpSmDbl5EK+J+8Y0APx89efAFfXosI4hjIAZ/w+4CuP3vjy6QO0V88g/f1tMA+fLe/uAeCpCp31C40PeiJ3dw9LYXzJ5iGCNuDL/zXyPtTibN8HpkT07wNTy/8BaS6HD2GyS9MAAAAASUVORK5CYII="
  handleSpriteSheet(img,16)
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
  celltouch = true
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

function generateMap(id) {
  const textarea = document.getElementById(id)
  const grid = document.getElementById("gridd")
  const rows = grid.children
  let output = "[\n\""
  for (let x = 0; x < rows.length; x++) {
    const row = rows[x]
    const cols = row.children
    let block = ""
    for (let y = 0; y < cols.length; y++) {
      const col = cols[y];
      block+= col.id || " "
      
    }
    output+=block+"\",\n\""
  }
  output = output.slice(0,-3)+"\n]"
  textarea.value = output
  textarea.style.height = (textarea.scrollHeight+15) + 'px';
}

function clipboardFromText(id) {
  var copyText = document.getElementById(id);

  copyText.select();
  copyText.setSelectionRange(0, 99999);

  navigator.clipboard.writeText(copyText.value);

  /* Alert the copied text */
  alert("Copied output to clipboard");
  
}

function map_addCol() {
  let rows = container.children
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row.children.length < 100) {
      row.appendChild(makeCell())
    }
    
    
  }
}
function map_remCol() {
  let rows = container.children
  for (let i = 0; i < rows.length; i++) {
    const cols = rows[i].children;
    if (cols.length > 3) {
      cols[cols.length - 1].remove()
    }
    
    
  }
  
}

function map_addRow() {
  let cellcount = container.children[0].children.length
  let row = makeRow(cellcount)
  container.appendChild(row)
}
function map_remRow() {
  let rows = container.children
  if (rows.length > 3)rows[rows.length-1].remove()
  
}










const addSide = document.getElementById("plusminusside")
const addBottom = document.getElementById("plusminusbottom")


function loop() {
  if (movex != 0 || movey != 0) {
    moveable.style.left = String(parseInt(moveable.style.left)+movex)+"px"
    moveable.style.top = String(parseInt(moveable.style.top)+movey)+"px"
  }
  addSide.style.left = container.offsetWidth/2+30 + "px"
  addBottom.style.top = container.offsetHeight/2+30 + "px"
  
  requestAnimationFrame(loop)
}

loop()
