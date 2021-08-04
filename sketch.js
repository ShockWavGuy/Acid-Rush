var player, ground, acid, acidSpeed, gameWinIm, gameOverIm, restart;
var gameState, gameCount, life, gravity, speed, endText;
var playerIm, buttonIm, button2Im, pressedButtonIm, roomIm, platformIm, restartIm; 
var button, button2, buttonList, buttonPlatform, buttonPlatform2;
var platformG, jumpCount, jump, jumpHeight;
var door, openDoorIm, closedDoorIm, doorState;

function preload(){
   roomIm = loadImage("My Game Images/room.jpg");
   platformIm = loadImage("My Game Images/bigPlatform.png");
   playerIm = loadImage("My Game Images/player.png");
   buttonIm = loadImage("My Game Images/button.png");
   button2Im = loadImage("My Game Images/button2.png");
   pressedButtonIm = loadImage("My Game Images/pressedButton.png");
   openDoorIm = loadImage("My Game Images/opendoor.png");
   closedDoorIm = loadImage("My Game Images/closeddoor.png");
   gameWinIm = loadImage("My Game Images/gamewin.png");
   gameloseIm = loadImage("My Game Images/gamelose.png");
   restartIm = loadImage("My Game Images/images.png")
} 

function setup() {
  createCanvas(800,800);
  gameState = 1;
  gameCount = 0;
  
   //Person
   player = createSprite(200,710,40,100);
   player.addImage(playerIm); 

   //Ground
   ground = createSprite(200,710,1500,50);
   ground.visible = false;

   //Group of Platforms
   platformG = new Group();

   //Button Lists
   buttonList = createGroup();

   //Settings
   jumpCount = 0;
   jump = 0;
   jumpHeight = 21;
   gravity = 2;
   speed = 5;
   
   //Acid
   acid = createSprite(400,1600,1000,1000);
   acid.shapeColor = "#00FF0070"; 
   acidSpeed = 1.5;

   platformGeneration();

   //Door
   door = createSprite(platformG[0].x+80,platformG[0].y-35,40,65);
   door.addImage(closedDoorIm);
   door.scale = 0.5
   door.setCollider("rectangle",-160,0,60,85)
  
  //Button Platforms
  buttonPlatform = random(buttonList);

  button = createSprite(buttonPlatform.x,buttonPlatform.y-40,15,15);
  button.addImage(buttonIm);
  button.scale = 0.15;

  buttonPlatform2 = random(buttonList);
  platformG.remove(buttonPlatform2);
  buttonPlatform2.visible = false;

  if(buttonPlatform.isTouching(buttonPlatform2)){
    buttonPlatform2 = random(buttonList);
  }
  else{
    button2 = createSprite(buttonPlatform2.x,buttonPlatform2.y-40,15,15);
    button2.addImage(button2Im);
    button2.scale = 0.15;
    button2.visible = false;

    //Game Text & restart button
    endText = createSprite(400,350,200,120);
    endText.addImage(gameWinIm);
    endText.scale = 1.5;

    restart = createSprite(400,450,50,50);
    restart.addImage(restartIm);
    restart.scale = 0.3;

    endText.visible = false;
    restart.visible = false;
  }

 
  }

function draw() {
  background(roomIm);
  if(gameState===1){
    endText.visible = false;
    restart.visible = false

    //Gravity
    player.collide(ground);
    player.collide(platformG);
    player.velocityY += gravity;

    button2Clicked();

    acid.velocityY = -acidSpeed;

    if(player.x<-30||player.x>830){
      player.x=400;
    }
    if(player.y>850){
      player.y = 710;
    }
  
    //Key Functions
    if(keyDown("LEFT_ARROW")){
      player.x += -speed;
   }
    if(keyDown("RIGHT_ARROW")){
      player.x += speed;
    }
    
    console.log(gameState)

    if(keyDown("space")&&jump===true){
      player.velocityY = -jumpHeight;
    }

    if(gameCount===3){
      gameState = 2;
    }

    if(player.isTouching(acid)){
      gameState = 0;
    }  
    
    if(player.isTouching(door)&&doorState===1){
       speedIncrement();
    }
  }  
  
  if(gameState===2){
    player.velocityY = 0;
    acid.velocityY = 0;
     
    endText.addImage(gameWinIm);
    endText.visible = true;

    restart.visible = true;

    if(mousePressedOver(restart)){
      resetClicked();
    }
  }

  if(gameState === 0){
    player.velocityY = 0;
    acid.velocityY = 0;

    endText.addImage(gameloseIm);
    endText.visible = true;

    restart.y = 520;
    restart.visible = true;
    restart.debug = true;

    if(mousePressedOver(restart)){
      resetClicked();
    }
  }

  
   
  drawSprites();

  jumpCheck();
  button1Clicked();
}

function jumpCheck(){
  //Jump Check
  if(((player.y>=639)||player.isTouching(platformG)||(player.velocityY >= 2 && player.velocityY <=3))&&jumpCount===0){
    jump = true;
  }
  else{
    jump = false;
  }
  
  if(keyDown("space")){
      jump = false;
      jumpCount = 0;
  }
  if(player.velocityY===-jumpHeight){
     jumpCount = 1;
  }
}

function platformGeneration(){
   var x = 540;
   var y = 100;
   
  for(var i=0;i<20;i+=1){
    platform = createSprite(x, y, 120,20);
    platform.addImage(platformIm);
    platform.scale = 0.2;
    
    //Positioning
    if(x<=550 && y<=750) {
      x +=150;
      y+=25;
    }
    else if(x>=550 && y>=750){
      x -=400;
      y -=25;
    }
    else if (x>=550 && y<=750){
      x-=500;
      y+=25;
    }
    else {
      y -=25;
      x+=200;
    }
     
    //Adding to ButtonList
    if(i>=5&&i<=13){
      buttonList.add(platform);
    }

    platformG.add(platform);
  }
}

function button1Clicked(){
  if(player.isTouching(button)){
    platformG.add(buttonPlatform2);
    buttonPlatform2.visible = true;
    button2.visible = true;
    
    button.addImage(pressedButtonIm);
  }
}

function button2Clicked(){
  if(player.isTouching(button2)&& button2.visible){
    door.addImage(openDoorIm);
    door.x = (platformG[0].x-70);
    doorState = 1;
    door.setCollider("rectangle",90,0,0,0);
    
    button2.addImage(pressedButtonIm);
  }
}

function speedIncrement(){
  speed = speed * 1.3;
  gameCount += 1;
  
  acid.y = 1600
  acid.y += -200;


  platformG.remove(buttonPlatform2);
  buttonPlatform2.visible = false;
  button2.visible = false;

  player.x = 200;
  player.y = 700;
 
  button.addImage(buttonIm);
  button2.addImage(button2Im);

  door.addImage(closedDoorIm);
  doorState = 0;

  door.setCollider("rectangle",-160,0,60,85)
  door.x = platformG[0].x+80;
}

function resetClicked(){
  gameState = 1;
  gameCount = 0;

  jumpCount = 0;
  jump = 0;
  jumpHeight = 21;
  gravity = 2;
  speed = 5;
  acidSpeed = 2;

  acid.y = 1600;

  player.x = 200;
  player.y = 710;

  platformG.remove(buttonPlatform2);
  buttonPlatform2.visible = false;
  button2.visible = false;

  door.addImage(closedDoorIm);
  doorState = 0;

  button.addImage(buttonIm);
  button2.addImage(button2Im);

  door.setCollider("rectangle",-160,0,60,85)
  door.x = platformG[0].x+80;
}