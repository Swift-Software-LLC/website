let constrain = 300;
let gifsContainer = document.getElementsByClassName("main__gifs")[0];
let gifsCollection = document.getElementsByClassName("main__gifs__gif");
let gifs = [...gifsCollection];

function transforms(x, y, el) {
  let box = el.getBoundingClientRect();
  let calcX = -(y - box.y - (box.height / 2)) / constrain;
  let calcY = (x - box.x - (box.width / 2)) / constrain;
  
  return "perspective(100px) "
    + "   rotateX("+ calcX +"deg) "
    + "   rotateY("+ calcY +"deg) ";
};

function transformElement(el, xyEl) {
  el.style.transform  = transforms.apply(null, xyEl);
}

gifsContainer.onmousemove = function(e) {
	gifs.forEach(gif => {

		let xy = [e.clientX, e.clientY];
		let position = xy.concat([gif]);

		window.requestAnimationFrame(function(){
			transformElement(gif, position);		
		});
	});
};