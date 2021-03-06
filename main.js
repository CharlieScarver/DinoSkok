var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var input = new Input();
attachListeners(input);

var ground = 500,
    gameOver = false,
    paused = false,
    timer = 0,
    lastTimerValue = 0,
    player = new Player(200, ground - 70);

var dinos = new Array(),
    spawnDinoScore = 0;

var boxOfSecrets = new BoxOfSecrets(generateRandomPosition(), ground - 25),
    boxOfSecretsTimer = 0,
    secsBetweenBoxSpawns = generateRandomBoxRespawnTime();

var animationDuration = 80,
    animationState = 80,
    animationInitialTextSize = 10,
    animationDeltaX = 190,
    animationTextColor = "#0026FF",
    animationText = "Wow!";

var backgroundImage = new Image();
backgroundImage.src = "images/background maybe.jpg";

//dinos.push(new Dino(900, ground - 60));
// /dinos.push(new Dino(1150, ground - 60));

function update() {
    tick();
    render(ctx);
    requestAnimationFrame(update);
}

function tick() {

    lastTimerValue = timer;
    timer = (Math.floor(new Date().getTime() / 1000) % 60);

    if(input.o) {
        if(paused) {
            paused = false;
            input.o = false;
        } else {
            paused = true;
            input.o = false;
        }
    }

    if(gameOver || paused) {
        return;
    }

    player.movement.idle = true;

    if(input.p) {
        console.log("dani e seksi");
    }
  
    if(input.right) {
        player.movement.right = true;
        player.movement.left = false;
        player.movement.idle = false;
    } else if(input.left) {
        player.movement.left = true;
        player.movement.right = false;
        player.movement.idle = false;
    } 

    if(input.space && !player.movement.falling) {
        player.movement.jumping = true;
        player.movement.falling = false;
        player.movement.idle = false;
    }     

    //console.log(player.jumpState);

    if(player.dinoPoints <= -50) {
        gameOver = true;
    }

    if (player.dinoPoints > spawnDinoScore) {
        dinos.push(new Dino(generateRandomPosition(), ground - 60));
        spawnDinoScore += ((dinos.length < 11 ? 100 : 150) * (dinos.length % 3 == 0 ? 2 : 1));
    }

    if (boxOfSecrets) {
        if (player.intersects(boxOfSecrets)) {
            boxOfSecrets.position.x = generateRandomPosition();
            boxOfSecrets.movement.left = false;

            switch(boxOfSecrets.type) {
                case 0:
                    dinos.forEach(function(dino) {
                        dino.velocityX = dino.minVelocityX;
                    });

                    animationTextColor = "#D4A017";
                    animationText = "Dino Slowl";
                    animationDeltaX = 190;
                    animationState = 0;
                    break;
                case 1:
                    player.jumpDuration += 2;
                    player.velocityYJumping += 2;
                    player.velocityYFalling += 1;

                    animationTextColor = "#2B65EC";
                    animationText = "Jump Higher";
                    animationDeltaX = 210;
                    animationState = 0;
                    break;
                case 2:
                    player.dinoPointsBoost = dinos.length;
                    player.dinoPointsBoostState = 0;
                    player.dinoPointsBoostDuration = player.generateRandomBoostDuration();

                    animationTextColor = "#52D017";
                    animationText = "Dino Point Boost";
                    animationDeltaX = 220;
                    animationState = 0;
                    break;       
                case 3:
                    player.immune = true;
                    player.immuneState = 0;
                    
                    animationTextColor = "#F6358A";
                    animationText = "I'm so Immune";
                    animationDeltaX = 215;
                    animationState = 0;
                    break;
            }

            boxOfSecrets = undefined;
        } else {
            boxOfSecrets.update();
        }
    }

    if(timer != lastTimerValue) {
        boxOfSecretsTimer++;
    }

    if(boxOfSecretsTimer == secsBetweenBoxSpawns) {
        boxOfSecrets = new BoxOfSecrets(generateRandomPosition(), ground - 25);
        boxOfSecretsTimer = 0;
        secsBetweenBoxSpawns = generateRandomBoxRespawnTime();
    }


    // ------

    player.update();
    
    dinos.forEach(function(dino) {
        dino.update();
        if(!player.immune) {
            if(dino.intersects(player)) { 
                player.dinoPoints -= (3 
                    + Math.floor(dino.velocityX / 9) 
                    * (dino.velocityX / 2) 
                    + dinos.length);  
            }
        }
    });

    
    
}




function render(ctx) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //ctx.fillStyle ='#AF7817';
    //ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0);


    if(animationState < animationDuration) {

        ctx.fillStyle = animationTextColor;
        ctx.font = (animationInitialTextSize + (animationState)) + "px Arial";
        ctx.fillText(animationText, canvas.width / 2 - animationDeltaX - (animationState / 2), canvas.height / 2);

        animationState++;
    }

    //ctx.font = "25px Arial";
    //ctx.fillText(player.dinoPointsBoost, 450, 30)


    if(player.immune) {
        ctx.fillStyle = '#F6358A';
        ctx.font = "20px Arial"
        ctx.fillText("Immune", player.position.x - 5, player.position.y - 5);
    }

    ctx.fillStyle = '#493D26';    

    if(gameOver) {
        ctx.font = "40px Arial";
        ctx.fillText("You ded", canvas.width / 2 - 100, 250);
        ctx.fillText("Max Dino Points Reached: " + player.MaxDinoPoints, canvas.width / 2 - 300, 300);
    }

    if(paused) {
        ctx.font = "40px Arial";
        ctx.fillText("Paused", canvas.width / 2 - 100, 250);
    }

    if(player.dinoPointsBoost > 0) {
        ctx.fillStyle = '#6AA121';   
    } else {
        ctx.fillStyle = '#493D26';  
    }   

    ctx.font = "28px Arial";
    ctx.fillText("Dino Points: " + player.dinoPoints, 850, 40);

    ctx.fillStyle = '#493D26';     
    ctx.font = "20px Arial";

    ctx.fillText("Next Box Of Secrets in: " + (secsBetweenBoxSpawns - boxOfSecretsTimer) + " seconds", 20, 30);
    ctx.fillText("Spawn Next Dino on: " + spawnDinoScore + " Dino Points", 20, 60);
    ctx.fillText("Dinos: " + dinos.length, 20, 90);

    ctx.fillStyle ='#FFD14A';
    ctx.fillRect(790, 538, 290, 30);
    ctx.fillStyle = '#493D26'; 
    ctx.fillText("Controls: Left, Right, Space, O", 800, 560);

    ctx.fillStyle ='#FFD14A';
    ctx.fillRect(10, 538, 450, 30);
    ctx.fillStyle = '#493D26'; 
    ctx.fillText("Highest Score in the Universe: 5292 (41 dinos)", 20, 560);


    ctx.fillRect(0, ground, canvas.width, 1);

    // ------

    player.render(ctx);
    
    dinos.forEach(function(dino) {
        dino.render(ctx);
    });

    if (boxOfSecrets) {
        boxOfSecrets.render(ctx);
    }
        
    //drawBoundingBoxes();

}

function drawBoundingBoxes() {
    ctx.beginPath();
    ctx.strokeStyle = 'red';

    ctx.rect(player.boundingBox.x, player.boundingBox.y, player.boundingBox.width, player.boundingBox.height);
    dinos.forEach(function(dino) { 
        ctx.rect(dino.boundingBox.x, dino.boundingBox.y, dino.boundingBox.width, dino.boundingBox.height);
    });

    ctx.stroke();
}

function generateRandomPosition() {
    return Math.floor(Math.random() * 500 + 1100);
}

function generateRandomBoxRespawnTime() {
    return Math.floor(Math.random() * 20 + 17);
}

update();