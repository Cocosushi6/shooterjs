var orientation = 0;

document.addEventListener('mousemove', function(event) {
    var x = event.clientX - 280;
    var y = event.clientY;
    var result = document.getElementById('result');
    orientation = -1 * ((180 / Math.PI) * Math.acos(x/(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)))) + 90);
    result.innerHTML = orientation;
    draw();
});



function draw() {
    var context = document.getElementById('canvas').getContext('2d');
    context.clearRect(0, 0, 560, 560);
    context.save();
    context.translate(280 + 10, 500);
    context.rotate((Math.PI / 180) * orientation);
    context.fillRect(-10, 0, 20, 50);
    context.restore();
    context.beginPath();
    context.arc(100,75,50,Math.PI, 0);
    context.fill();
}
