const container = document.getElementById("gridd")
const moveable = document.getElementById("grid-move")
const imggrid = document.getElementById("imggrid")
const letters = "abcdefghijklmnopqrstuvwxyz1234567890"
var selectedimg = null;
var movex = 0;
var movey = 0;
var mult = 3;

var placeMode = false
var deleteMode = false


var mapConfig ={
  blockSize: 0,
  fileName: "",
  partsWidth: 0,
  partsHeight: 0,
  imgSrc: "",
  imgSrcR: "",
  px: 0
}
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
  console.log(placeMode,deleteMode,celltouch,e.button,(e.button && celltouch))
})

document.body.addEventListener("mouseup", function(e) {
  celltouch = false
  switch (e.button){
    case 0: placeMode=false; break; 
    case 2: deleteMode=false; break; 
  }
})


var celltouch = false

function makeCell() {
  let cell = document.createElement("div")
  cell.innerHTML = " "
  cell.id = " "
  cell.classList.add("cell")
  // For holding mouse button
  cell.onmouseenter = function(){touchedCell(this);}
  // Click once logic
  cell.onmousedown = function(e){touchedCellOnce(this,e);}
  cell.oncontextmenu = function(e){e.preventDefault()}
  return cell
}

function touchedCell(cell) {
  celltouch = true
  console.log("Touched cell " + cell.id)
  if (placeMode) {
    clickedCell(cell)
  }
  else if (deleteMode) {
    deleteCell(cell)
  }
}

function touchedCellOnce(cell,e) {
  if (e.button == 0) {
    clickedCell(cell)
  } else if (e.button == 2) {
    deleteCell(cell)
  }
}

function clickedCell(cell) {
  if (selectedimg != null) {
    cell.style.backgroundImage = "url('" + selectedimg.src + "')"
    cell.id = selectedimg.id
  }
  
}
function deleteCell(cell) {
    cell.style.backgroundImage = ""
    cell.id = " "
}



function resetMapHtml() {
  container.innerHTML = ""
  makeRows(10,10)
  document.getElementById("mapoutput").value = ""
  document.getElementById("mapoutput").style.height = (0+60) + 'px';
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

resetMapHtml()

function loadSpriteSheet(input) {
  imggrid.innerHTML = ""
  var url = input.value;
  console.log(url)
  var reader = new FileReader();

  reader.onload = function(e) {
    let res = prompt("Resolution of a single tile in pixels:")
    
    handleSpriteSheet(e.target.result,res)
  }
  mapConfig.fileName = input.files[0].name
  console.log(mapConfig.fileName)
  reader.readAsDataURL(input.files[0])
}


function resizeImg(src) {
  let ca = document.getElementById("imgCanvas")
  ca.width = mapConfig.partsWidth*mapConfig.blockSize*parseInt(document.getElementById("sScale").value)
  ca.height = mapConfig.partsHeight*mapConfig.blockSize*parseInt(document.getElementById("sScale").value)
  let ctx = ca.getContext("2d")
  ctx.imageSmoothingEnabled = false
  ctx.clearRect(0,0,1000,1000)
  let image = new Image()
  image.src = mapConfig.imgSrc
  console.log(mapConfig.blockSize,mapConfig.partsWidth,mapConfig.partsHeight,document.getElementById("sScale").value)
  console.log(image,0,0,mapConfig.blockSize*parseInt(document.getElementById("sScale").value)*mapConfig.partsWidth,mapConfig.blockSize*parseInt(document.getElementById("sScale").value)*mapConfig.partsHeight)
  ctx.drawImage(image,0,0,mapConfig.blockSize*parseInt(document.getElementById("sScale").value)*mapConfig.partsWidth,mapConfig.blockSize*parseInt(document.getElementById("sScale").value)*mapConfig.partsHeight)
  return ca.toDataURL("image/png")
}

function loadSpriteSheetExample() {
  imggrid.innerHTML = ""
  mapConfig.fileName = "exampleSheet"
  let img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAA0lJREFUaIHtWb2K20AQHvvc3VVBjXAjBLrGrYuQwnCgOuUVeYBAmjzC1anvEVKmTC0IuI3ewCDcBBEjUiVFAsEpktGNxrO7s9q13OQDg9HuaGfnb79ZzW5X5RH+IUlz6NoGKJI07/93bSPOuaT87HZVHukkH2RFDvW2ginkUen1poT9runl52MXR0wln6Q5JOnfDVPMg1aPhKzIISv0G6GYm+JRCy6vVYTK19vqxLJaLGKFACqOitBY1ciPRVASA5xWBnyXlHQ2+bEIygG0OipBFTElnSQfsn7QBtCyNguid6RE1YSYa/2gHNBYsGsbWG/KQW7EQlbksIj2NsMCXdvAfvcU5zSkNJvJitzqqWhJLC2sOWVdSYweNG3ibAdZCMVA8NIsIUoV0j73nYdGMBkiuArZFp4Ks1dv3vV0mrK8/a4Ry57NanR8rLzv+rP//QBLVlfVcMn7rh+1H8gKN32wyY9BcBLTmETFQ5XyQXA/QK09RvHQ9edJmnt1RByXbkkHVQi5iZSAJk4Syuej9gPY2nGPYLXgiMHnXeO26DCyUUp9621ltFIMPm9C1zaD/DCV5j6EeC1HhLLJENgONRwXyyiv7SacO4RMNJ3KLegA5SJoWdtJGSOEJA9SPmW69TjZQL2t+ioUWttDIV3NmE53sQoB6BTnIYCe08IUQlL7aUK0njiUmHHw95iKzKAf4K7z5fOh8tp+gHrG2Q9waObw+YiL9AM2Zel9D30GoKtQMfqB2Yvy9dE91Z818vLnw6+08GrqTVZyWS/k6lwDdT8gJd96Uxo9g/Nt1yIAp559WB0GJI7+HlaHE3nV3aiJjaKC0ia05wkPNYAD1NsKHsubwbz3v54P5mHoqTxAlaEKIRWwwVU28eaargMA8Lb6PvjRMaT8+52BzHFQxXmfQMely1rN9wFpzmN5M/jx9+EmVNcq1G2calMyxokZ/2ojgXvwZfIDPnbX4lw+lqS5OwdoY8FDiIeH7fiXQL/wSMpSmDbl5EK+J+8Y0APx89efAFfXosI4hjIAZ/w+4CuP3vjy6QO0V88g/f1tMA+fLe/uAeCpCp31C40PeiJ3dw9LYXzJ5iGCNuDL/zXyPtTibN8HpkT07wNTy/8BaS6HD2GyS9MAAAAASUVORK5CYII="
  handleSpriteSheet(img,16)
}

function handleSpriteSheet(src,px) {
  var image = new Image();
  image.onload = cutImageUp;
  image.src = src;
  mapConfig.px = px
  mapConfig.imgSrc = src
  

  function cutImageUp() {
      
      let widthOfOnePiece = px
      let heightOfOnePiece = widthOfOnePiece
      document.getElementById("sBlockSize").value = px
      mapConfig.blockSize = px
      let numColsToCut = image.width/px
      let numRowsToCut = image.height/px
      mapConfig.partsHeight = numColsToCut
      mapConfig.partsWidth = numRowsToCut
      imggrid.style.setProperty('--grid-rows', numColsToCut);
      imggrid.style.setProperty('--grid-cols', numRowsToCut);
      var imagePieces = [];
      for(var x = 0; x < numColsToCut; ++x) {
          for(var y = 0; y < numRowsToCut; ++y) {
              var canvas = document.createElement('canvas');
              canvas.width = widthOfOnePiece;
              canvas.height = heightOfOnePiece;
              var context = canvas.getContext('2d');
              context.clearRect(0,0,1000,1000)
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
        img.id = letters[i]
        img.onmouseenter = function(e){hoverspritesheet(this)}
        img.onclick = function(){selectImage(this)}
        img.classList.add("pixelated","imgcell")
        imggrid.append(img)
      }
  }
}


function selectImage(img) {
  selectedimg = img
}

function hoverspritesheet(img) {
  document.getElementById("imgletter").innerText = img.id
}

// This section of code is left as an excercise for the reader.
function generateMap(id) {
  const textarea = document.getElementById(id)
  textarea.style.height = "0px"
  textarea.value = ""
  mapConfig.imgSrcR = resizeImg(mapConfig.imgSrc)
  document.getElementById("mapoutputimage").src = mapConfig.imgSrcR
  console.log(mapConfig.imgSrcR)
  const grid = document.getElementById("gridd")
  let output = ""
  if (imggrid.children.length > 1) {
    output += "//loadSprites logic\nloadSpriteAtlas(\"sprites/" + mapConfig.fileName + ".png\", {"
    imgarr = []
    let offset = 0
    for (let y = 0; y < mapConfig.partsHeight; y++) {
      let arr = []
      for (let x = 0; x < mapConfig.partsWidth; x++) {
        let ele = 0
        ele+=x
        ele+=offset
          //?
        arr.push(imggrid.children[ele])
        
      }
      offset+=mapConfig.partsWidth
      imgarr.push(arr)
    }
    console.log(imgarr)

    let atlas = ""
    for (let x = 0; x < mapConfig.partsWidth; x++) {
      for (let y = 0; y < mapConfig.partsHeight; y++) {
        let img = imgarr[y][x]
        atlas += "\n\t\"" + mapConfig.fileName + "_" + img.id + "\": {\n\t\tx: " + x*document.getElementById("sBlockSize").value + ",\n\t\ty: " + y*document.getElementById("sBlockSize").value + ",\n\t\twidth: " + document.getElementById("sBlockSize").value + ",\n\t\theight: " + document.getElementById("sBlockSize").value + ",\n\t},"
      }
      
    }
    output += atlas.slice(0,-1)+"})\n"
  }
  
  

  // add level logic
  const rows = grid.children
  let begin = "\n//addLevel logic\naddLevel([\n\""
  output += begin
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
  output = output.slice(0,-3)+",\n]"

  // Add letters
  if (imggrid.children.length > 1) {
    output+=", {\n\twidth: " + mapConfig.blockSize + ",\n\theight: " + mapConfig.blockSize + ","
    let elements = ""
    
    for (let i = 0; i < imggrid.children.length; i++) {
      const imgcell = imggrid.children[i];
      let symbol = imgcell.id
      elements += "\n\t\"" + symbol + "\": () => [\n\t\tsprite(\"" + mapConfig.fileName + "_" + imggrid.children[i].id + "\")," + "\n\t],"
    }
    output += elements + "\n\t\" \": () => ["+"]," +  "\n})\n\n"
    
    
  }
  
  textarea.value = output
  textarea.style.height = (Math.min(textarea.scrollHeight+15, 200)) + 'px';
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
  addSide.style.left = container.offsetWidth/2+50 + "px"
  addBottom.style.top = container.offsetHeight/2+50 + "px"
  
  requestAnimationFrame(loop)
}

loop()
