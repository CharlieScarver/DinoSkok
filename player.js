var Player = (function() {
    function Player(x, y) {
        this.position = new Vector2(x,y);
        this.movement = {
            left: false,
            right: false,
            falling: false,
            jumping: false,
            idle: true
        };

        this.animation = new Animation(60, 70, 0, 0, 2, 'images/cactus shiit.png', 4, 2, 1);
        //(width, height, row, column, limit, imgSrc, fps, columns, rows);
        
        this.width = 60;
        this.height = 70;
        this.ground = 500 - this.height;
        
        this.velocityX = 8;
        this.velocityYJumping = 23;
        this.velocityYFalling = 20;


        this.jumpDuration = 8;
        this.jumpState = 0;

        this.ticksNeededToGainScore = 10;
        this.ticksPassedSinceScoreGain = 0;
        this.dinoPoints = 0;
        this.MaxDinoPoints = 0;


        this.boundingBox = new Rectangle (
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );

    }

    Player.prototype.update = function() {

        if(this.movement.idle) {
            this.movement.right = false;
            this.movement.left = false;
        }
        
        if(this.movement.jumping && this.jumpState <= this.jumpDuration) {
            this.position.y -= this.velocityYJumping;
            this.jumpState ++;

            if(this.jumpState > this.jumpDuration) {
                this.jumpState = 0;
                this.movement.jumping = false;
                this.movement.falling = true;
            }
        } else if(this.movement.falling) {
            this.position.y += this.velocityYFalling;

            if(this.position.y >= this.ground) {
                this.movement.falling = false;
                this.position.y = this.ground;
            }
        }

        if(this.movement.left) {
            this.position.x -= this.velocityX;

            if(this.position.x < 0) {
                this.position.x += 1100;
            }
        } else if(this.movement.right) {
            this.position.x += this.velocityX;

            if(this.position.x + this.width > 1100) {
                this.position.x -= 1100;
            }
        }

        if(this.ticksPassedSinceScoreGain == this.ticksNeededToGainScore) {
            this.dinoPoints += (1 + dinos.length); 
            this.ticksPassedSinceScoreGain = 0;

            if(this.MaxDinoPoints < this.dinoPoints) {
                this.MaxDinoPoints = this.dinoPoints;
            }
        }

        this.ticksPassedSinceScoreGain++;

        this.boundingBox.x = this.position.x + this.width / 4;
        this.boundingBox.y = this.position.y;
        this.boundingBox.width = this.width / 2;

        this.animation.position.set(this.position.x, this.position.y);
        this.animation.update();
       
    };


    Player.prototype.render = function(ctx) {
    	
        //ctx.fillStyle = '#7580AF';
        //ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

        this.animation.draw(ctx);

    };

    Player.prototype.intersects = function (object) {
		return object.boundingBox.intersects(this.boundingBox) || this.boundingBox.intersects(object.boundingBox);
	};

	Player.prototype.intersectsRight = function (object) {
    	var playerFutureBox = new Rectangle(
    		this.boundingBox.x + this.velocityX + 1,
    		this.boundingBox.y,
    		this.boundingBox.width,
    		this.boundingBox.height
    	);

		return object.boundingBox.intersects(playerFutureBox) || playerFutureBox.intersects(object.boundingBox);
	};

	Player.prototype.intersectsLeft = function (object) {
    	var playerFutureBox = new Rectangle(
    		this.boundingBox.x - this.velocityX - 1,
    		this.boundingBox.y,
    		this.boundingBox.width,
    		this.boundingBox.height
    	);

		return object.boundingBox.intersects(playerFutureBox) || playerFutureBox.intersects(object.boundingBox);
	};

    return Player;
}());