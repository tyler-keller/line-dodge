var modal = document.getElementById("how-to-play");
var btn = document.getElementById("open-btn");
var btn2 = document.getElementById("open-btn2");
var span = document.getElementsByClassName("close")[0];
var page1 = document.getElementById("htp-page-1");
var page2 = document.getElementById("htp-page-2");
var forwardBtn = document.getElementById("htp-forward-button");
var backBtn = document.getElementById("htp-back-button");

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

forwardBtn.onclick = function() {
  clickSound.play();
  page1.style.display = "none";
  page2.style.display = "block";
}
backBtn.onclick = function() {
  clickSound.play();
  page1.style.display = "block";
  page2.style.display = "none";
}