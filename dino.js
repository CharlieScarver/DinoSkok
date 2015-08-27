var Dino = (function() {
    function Dino(x, y) {
        this.position = new Vector2(x,y);
        this.movement = {
            left: true,
            right: false,
            down: false,
            up: false,
            idle: false
        };

        this.animation = new Animation(40, 60, 0, 0, 2, 'images/dino shiit.png', 4, 2, 1);
        //(width, height, row, column, limit, imgSrc, fps, columns, rows);
        
        this.width = 40;
        this.height = 60;
        
        this.minVelocityX = 8;
        this.velocityX = this.minVelocityX;
        this.velocityY = 6;
        this.maxVelocityX = Math.floor(Math.random() * 2 + 16);

        this.ticksUntilAcceleration = 100;
        this.ticksPassed = 0;

        this.boundingBox = new Rectangle (
            x,
            y,
            this.width,
            this.height
        );

    }

    Dino.prototype.update = function() {

        if(this.movement.left) {
            this.position.x -= this.velocityX;

            if(this.position.x < -100) {
                //this.position.x += 1200;
                do {
                    this.position.x = Math.floor(Math.random() * 500 + 1100);
                } while (this.intersectsWithOneOf(this, dinos));
            }
        } 

        if(this.ticksPassed == this.ticksUntilAcceleration && this.velocityX < this.maxVelocityX) {
            this.velocityX += 1;
            this.ticksPassed = 0;
            console.log(this.velocityX);
        }

        if (this.velocityX < this.maxVelocityX) {
            this.ticksPassed++;
        }
        

        this.boundingBox.x = this.position.x + this.width / 4;
        this.boundingBox.y = this.position.y;
        this.boundingBox.width = this.width / 2;

        this.animation.position.set(this.position.x, this.position.y);
        this.animation.update();
    };


    Dino.prototype.render = function(ctx) {
    	
        //ctx.fillStyle = '#75AF80';
        //ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

        this.animation.draw(ctx);

    };


    Dino.prototype.intersects = function (object) {
		return object.boundingBox.intersects(this.boundingBox) || this.boundingBox.intersects(object.boundingBox);
	};

    Dino.prototype.intersectsWithOneOf = function(that, collection) {
        var intersections = 0;

        collection.forEach(function(el) {
            if(that.intersects(el)) { intersections++; }
            if(intersections > 1) { return true; }
        });

        return false;
    };

	Dino.prototype.intersectsRight = function (object) {
    	var playerFutureBox = new Rectangle(
    		this.boundingBox.x + this.velocityX + 1,
    		this.boundingBox.y,
    		this.boundingBox.width,
    		this.boundingBox.height
    	);

		return object.boundingBox.intersects(playerFutureBox) || playerFutureBox.intersects(object.boundingBox);
	};

	Dino.prototype.intersectsLeft = function (object) {
    	var playerFutureBox = new Rectangle(
    		this.boundingBox.x - this.velocityX - 1,
    		this.boundingBox.y,
    		this.boundingBox.width,
    		this.boundingBox.height
    	);

		return object.boundingBox.intersects(playerFutureBox) || playerFutureBox.intersects(object.boundingBox);
	};

    return Dino;
}());