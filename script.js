var projectiles = new Array();
var asteroids = new Array();
var score = 0;
var projectileSpeed = 5;

function Gun() {
    this.posX = 230;
    this.posY = 510;
    this.orientation = 0; //from -90 to 90
    this.width = 100;
    this.height = 50;
    this.dead = false;
    this.draw = function(context) {
        context.fillStyle = "green";
        context.beginPath();
        context.arc(280,560,50,Math.PI, 0);
        
        context.fill();
        
        context.save();
        context.translate(280, 520);
        context.rotate((Math.PI / 180) * this.orientation);
        context.fillRect(-10, 0, 20, 50);
        context.restore();
        context.fillStyle = "black";
        
    }

}

function Projectile(posX, posY, orientation, speed) {
    this.orientation = orientation;
    this.speed = speed;
    this.posX = posX;
    this.posY = posY;
    this.square_length = 20;
    this.dead = false;
    this.horizontal_speed = Math.sin((Math.PI / 180) * this.orientation) * speed;
    this.vertical_speed = Math.cos((Math.PI / 180) * (this.orientation + 180)) * speed;
    this.update = function() {
        console.log("updated");
        if(this.posX > 0 && this.posX < 560 && this.posY > 0 && this.posY < 560) {
            this.posX -= this.horizontal_speed;
            this.posY -= this.vertical_speed;
        } else {
            this.dead = true;
            console.log("projectile is dead !");
        }
    }

    this.checkCollision = function(asteroid) {
        if((this.posX + this.horizontal_speed > asteroid.posX && this.posX + this.horizontal_speed < asteroid.posX + asteroid.square_length) || (this.posX + this.square_length + this.horizontal_speed > asteroid.posX && this.posX + this.square_length + this.horizontal_speed < asteroid.posX + asteroid.square_length)) {
            if((this.posY + this.vertical_speed > asteroid.posY && this.posY + this.vertical_speed < asteroid.posY + asteroid.square_length) || (this.posY + this.square_length + this.vertical_speed > asteroid.posY && this.posY + this.square_length + this.vertical_speed < asteroid.posY + asteroid.square_length)) {
                this.dead = true;
                asteroid.dead = true;
                score += 1;
                console.log("asteroid shot !");
            }
        }
    }

    this.draw = function(context) {
        context.fillStyle = "red";
        context.save();
        context.translate(this.posX, this.posY);
        context.rotate((Math.PI / 180) * this.orientation);
        context.fillRect(-10, 0, 20, 20);
        context.restore();
        context.fillStyle = "black";
    }
}

function Asteroid(posX, posY, speed) {
    this.posX = posX;
    this.posY = posY;
    this.speed = speed;
    this.square_length = 20;
    this.dead = false;
    this.checkCollision = function(gun) {
        if((this.posX > gun.posX && this.posX < gun.posX + gun.width) || (this.posX + this.square_length  > gun.posX && this.posX + this.square_length < gun.posX + gun.width)) {
            if((this.posY + this.speed > gun.posY && this.posY + this.speed < gun.posY + gun.height) || (this.posY + this.square_length + this.speed > gun.posY && this.posY + this.square_length + this.speed < gun.posY + gun.height)) {
                this.dead = true;
                gun.dead = true;
                document.writeln("Game Over");
            }
        }
    }

    this.update = function() {
        if(this.posY <= 560) {
          this.posY += speed; //make the asteroid go down.
        } else {
            this.dead = true;
        }
    }

    this.draw = function() {
        context.fillRect(this.posX, this.posY, this.square_length, this.square_length);
    }
}


var context = document.getElementById('canvas').getContext('2d');
var scoreP = document.getElementById('score');
var debug = document.getElementById('debug');
var asteroidSpeed = 3;
var projectileTimeout = 1000;
var asteroidDelay = 1000;

var timer = 0;
var projLockTimer = 0;
var gun = new Gun();
var lastShootTime = 0;

document.addEventListener('touchstart', function(event) {
    var x = event.touches[0].pageX - 280;
    var y = event.touches[0].pageY;
     gun.orientation = -1 * ((180 / Math.PI) * Math.acos(x/(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)))) + 90);
}, false);

document.addEventListener('mousemove', function(event) {
    var x = event.clientX - 280;
    var y = event.clientY;
    gun.orientation = -1 * ((180 / Math.PI) * Math.acos(x/(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)))) + 90); //Pythagorus + cosinuses to get angle orientation
}, false);
document.addEventListener('click', function(event) {
    //Shoot with gun
    if(timer - lastShootTime > projectileTimeout ) {
        projectiles.push(new Projectile(280 + 10, 530, gun.orientation, projectileSpeed));
        lastShootTime = timer;
    }
    console.log("Click happened");
}, false);

function updateTimers(interval) {
  timer += interval;
  projLockTimer += interval;
}

function removeDeadProjectiles() {
    for(var i = 0; i < projectiles.length; i++) {
        if(projectiles[i].dead == true) {
            projectiles.splice(i, 1);
        }
    }
    for(var i = 0; i < asteroids.length; i++) {
        if(asteroids[i].dead == true) {
            asteroids.splice(i, 1);
        }
    }
}

function renderObjects() {
    context.clearRect(0, 0, 560, 560);
    gun.draw(context);
    for(var i = 0; i < projectiles.length; i++) {
        projectiles[i].draw(context);
    }
    for(var i = 0; i < asteroids.length; i++) {
        asteroids[i].draw(context);
    }
}

function checkCollisions() {
    for(var i = 0; i < asteroids.length; i++) {
        asteroids[i].checkCollision(gun);
        for(var j = 0; j < projectiles.length; j++) {
            projectiles[j].checkCollision(asteroids[i]);
        }
    }
}

function updateObjects() {
    checkCollisions();
    removeDeadProjectiles();
    for(var i = 0; i < projectiles.length; i++) {
        projectiles[i].update();
    } 
    for(var i = 0; i < asteroids.length; i++) {
        asteroids[i].update();
    }
}


setInterval(function() {
    
    context.clearRect(0, 0, 560, 560);
    context.font = "17pt Calibri";
    context.fillStyle = "black";
    if(projLockTimer % asteroidDelay == 0) {
        asteroids.push(new Asteroid(Math.floor((Math.random() * 560) + 1), 0, asteroidSpeed));
    }
    
    //increase asteroid apparition rate and speed every 20 seconds
    if(projLockTimer % 20000 == 0) {
        if(asteroidSpeed < 10) {
            asteroidSpeed++;
        }
        if(asteroidDelay > 300) {
            asteroidDelay -= 50;
        }
    }
    
    //decrease projectile timeout for player to shoot more projectiles faster
    if(score > 0 && (score % 10 == 0) && projectileTimeout > 300) {
        projectileTimeout -= 100;
    }
    
    updateObjects();
    renderObjects();
    scoreP.innerHTML = "Score : " +  score;
    
    updateTimers(80);
}, 50);


/*TODO :
add textures (self designed)
add boosters to shoot many projectiles at a time
add background image
make compatible for touchscreens (add equivalents for click and mousemove)
*/