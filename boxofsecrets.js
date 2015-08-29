var BoxOfSecrets = (function() {
    function BoxOfSecrets(x, y) {
        this.position = new Vector2(x,y);
        this.movement = {
            left: true,
            right: false,
        };
        
        this.width = 20;
        this.height = 20;
        this.ground = 500 - this.height;
        
        this.velocityX = 8;

        this.type = Math.floor(Math.random() * 4);
        // 0 - getSlow
        // 1 - jumpAround
        // 2 - pointBooster
        // 3 - immuneSandstorm

        this.image = new Image();

        switch(this.type) {
        	case 0:
        		this.image.src = "images/power up yellow 25.png";
        		break;
        	case 1:
        		this.image.src = "images/power up blue 25.png";
        		break;
            case 2:
                this.image.src = "images/power up green 25.png";
                break;
            case 3:
                this.image.src = "images/power up pink 25.png";
                break;
        }

        this.boundingBox = new Rectangle (
            x + this.width,
            y + this.height,
            this.width,
            this.height
        );

    }

    BoxOfSecrets.prototype.update = function() {

        if(this.movement.left) {
            this.position.x -= this.velocityX;

            if(this.position.x < -100) {
                //this.position.x += 1200;
            }
        }


        this.boundingBox.x = this.position.x;
        this.boundingBox.y = this.position.y;
       
    };


    BoxOfSecrets.prototype.render = function(ctx) {
    	/*
        switch(boxOfSecrets.type) {
            case 0:
                ctx.fillStyle = '#FFD801';
                break;
            case 1:
                ctx.fillStyle = '#0026FF';
                break;
        }
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
		*/

		ctx.drawImage(this.image, this.position.x, this.position.y);
    };

    BoxOfSecrets.prototype.intersects = function (object) {
		return object.boundingBox.intersects(this.boundingBox) || this.boundingBox.intersects(object.boundingBox);
	};

    return BoxOfSecrets;
}());