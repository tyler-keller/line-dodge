var modal = document.getElementById("how-to-play");
var btn = document.getElementById("open-btn");
var btn2 = document.getElementById("open-btn2");
var span = document.getElementsByClassName("close")[0];

const clickSound = new Audio('assets/Sounds/click.wav');
clickSound.preload = 'auto';
clickSound.volume = 0.4;

btn.onclick = function() {
  modal.style.display = "flex";
  clickSound.play();
}
btn2.onclick = function() {
  modal.style.display = "flex";
  clickSound.play();
}
span.onclick = function() {
  modal.style.display = "none";
  clickSound.play();
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}