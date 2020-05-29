//create a new scene
let gameScene = new Phaser.Scene('Game');

//initiate scene parameters
gameScene.init = function() {
    //player Speed
    this.playerSpeed = 3.5;
    this.maxSpeed = 3.5;

    // enemy speed
    this.enemyMinSpeed = 1;
    this.enemyMaxSpeed = 5.5;

    //boundaries
    this.enemyMinY = 80;
    this.enemyMaxY = 280;

    this.playerMinY = 80;
    this.playerMaxY = 280;
    this.playerMinX = 80;
    this.playerMaxX = 280;


    //Not terming
    this.isTerminating = false;

    this.isRightKeyPressed = false;
    this.isLeftKeyPressed = false;
    this.isDownKeyPressed = false;
    this.isUpKeyPressed = false;

    
}


//Load Assets
gameScene.preload = function() {

    //load images
    this.load.image(
        'background',
        'assets/background.png'
        );

    this.load.image(
        'player',
        'assets/player.png'
        );
    this.load.image(
        'enemy',
        'assets/dragon.png'
        );
    this.load.image(
        'goal',
        'assets/treasure.png'
        );
    
    
};


//called once after the preload ends, similar to Component will mount
gameScene.create = function() {
    
    //create bg sprite
    this.bg = this.add.sprite(0, 0, 'background');

    //change origin to the top left corner
    this.bg.setOrigin(0,0);

    //Create player
    this.player = this.add.sprite(
        40, 
        this.sys.game.config.height / 2, 
        "player"
        ).setScale(0.5)
        
    
    //create goal
    this.goal = this.add.sprite(
        this.sys.game.config.width - 80, 
        this.sys.game.config.height / 2, 
        "goal"
        ).setScale(0.6);

    //enemy group
    this.enemies = this.add.group({
        key: 'enemy',
        repeat: 5,
        setXY: {
            x:90,
            y: 100,
            stepX: 80,
            stepY: 20
        }
    });
    //setting scale of all enemies in group
    Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.4, -0.4);
    //Da Flip! X axis
    Phaser.Actions.Call(this.enemies.getChildren(), function(enemy) {
        //set flip
        enemy.flipX = true;
        //set speed
        let dir = Math.random() < 0.5 ? 1 : -1;
        let speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
        enemy.speed = dir * speed;
        
    }, this);

};



//this is called up to 60 times per second
gameScene.update = function() {  

//don't execute if we are terming
if(this.isTerminating) return;

// check for active input
if(this.input.activePointer.isDown) {
    //player walks
    this.player.x += this.maxSpeed;
};

if(this.input.keyboard.addKey('D').isDown) {
    //player walks
    this.player.x += this.maxSpeed;
};
if(this.input.keyboard.addKey('A').isDown) {
    //player walks
    this.player.x -= this.maxSpeed;
};
if(this.input.keyboard.addKey('w').isDown) {
    //player walks
    this.player.y -= this.maxSpeed;
};
if(this.input.keyboard.addKey('S').isDown) {
    //player walks
    this.player.y += this.maxSpeed;
};

//treasure overlap check
let playerRect = this.player.getBounds();
let treasureRect = this.goal.getBounds();

if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)) {
    console.log('reached goal');
    // alert("reached goal");
    // endgame
    return this.gameOver();
};


let enemies = this.enemies.getChildren();
let numEnemies = enemies.length;

for(let i= 0; i < numEnemies; i++) {
// enemy Movement
enemies[i].y += enemies[i].speed;

// if(this.player.y = this.playerMinY) {
//     this.playerSpeed = 0;
// };
    // this.playerMaxY = 280;
    // this.playerMinX = 80;
    // this.playerMaxX = 280;
//check we haven't passed min/max y
let conditionUp = enemies[i].speed < 0 && enemies[i].y <= this.enemyMinY;
let conditionDown = enemies[i].speed > 0 && enemies[i].y >= this.enemyMaxY;

//if passed upper/lower y limits
if(conditionUp || conditionDown) {
    enemies[i].speed *= -1;
    };
//enemy overlap check
let enemyRect = enemies[i].getBounds();

if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)) {
    console.log('Ouch! Game Over!');
    // alert('Ouch! Game Over!');
    // endgame
    return this.gameOver();
};
};
};


gameScene.gameOver = function() {

    //initiated Game Over Sequence
    this.isTerminating = true;
    
    //shake shake shake!
    this.cameras.main.shake(500);
    //listen for finish
    this.cameras.main.on('camerashakecomplete',
     function(camera, effect){
     //fadeout
     this.cameras.main.fade(500);
    }, this);
    
    this.cameras.main.on('camerafadeoutcomplete',
    function(camera, effect){
    //restart the Scene
    this.scene.restart();
    }, this);
    
    
    };
    // Phaser.Physics.Arcade.Body#setCollideWorldBounds = true;


//set the congfiguration of the game
let config = {
    type: Phaser.AUTO, //phaser will choose what is compatible.
    width: 640,
    height: 360,
    scene: gameScene
    
};



// create a new game, pass the configuation
let game = new Phaser.Game(config);
