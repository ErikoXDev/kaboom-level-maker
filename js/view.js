
var view_spriteSheet = true
function view_toggleSpriteSheet(checkelmt, id) {
  let elmt = document.getElementById("window_"+id)
  elmt.classList.toggle("d-none")
  checkelmt.innerHTML = checkelmt.innerHTML.slice(0,-1) + (!elmt.classList.contains("d-none") ? "✅" : "❌")
}