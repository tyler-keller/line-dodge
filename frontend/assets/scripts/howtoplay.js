var modal = document.getElementById("how-to-play");
var btn = document.getElementById("open-btn");
var btn2 = document.getElementById("open-btn2");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  modal.style.display = "flex";
}
btn2.onclick = function() {
  modal.style.display = "flex";
}
span.onclick = function() {
  modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}