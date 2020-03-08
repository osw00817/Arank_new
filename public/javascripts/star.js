
function check(star) {
  for(let a=1;a<star+1;a++) {
    console.log(a);
    document.getElementById(`star${a}`).classList.add('star_checked');
  }
  for(let a=5;a>star;a--) {
    console.log(a);
    document.getElementById(`star${a}`).classList.remove('star_checked');
  }
  document.getElementById('score').innerText = star;
}