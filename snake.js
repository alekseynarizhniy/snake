export default class Snake{

    prevEvent;

    constructor(fieldsize = 200){
      this.fieldsize = fieldsize;
      this.lives = 3;
      this.score = 0;
      this.newRender();
      this.intId;
      this.pointId;
    }

    //Generation of main menu
    newRender(){
      let menu = document.createElement('DIV');
      menu.classList = 'menu';
      menu.style.cssText = `box-sizing: border-box; color: white; background-color: black; position: relative; width: 200px; height: 250px; `;
      menu.innerHTML += `<p style="margin:0; display: block; color: green; margin-left: 20%; padding-top: 10%;font-size: 46px;">Snake</p>\n`;
   
      let button = document.createElement('INPUT');
      button.type = "button";
      button.value = "START";
      button.style.cssText =`width: auto; height: auto; margin-left: 35%; margin-top: 20px;`;
      button.addEventListener("click",  this.render);

      menu.append(button);
   
      menu.insertAdjacentHTML('beforeend', `<p style="margin:0; display: block; color: white; margin-top: 90px; margin-left:5px; font-size: 18px;">For control use: UP, DOWN, LEFT, RIGHT.</p>\n`);
   
      document.body.append(menu);
    }
  
    /// Render of work space
    render = () =>{
      let menu = document.querySelector('.menu');
      menu.remove();

      let ui = document.createElement('DIV');
      ui.classList = 'ui';
      ui.style.cssText = `box-sizing: border-box; color: white; background-color: black; position: relative; border: 5px solid white; width: ${this.fieldsize}px; height: 50px; `;
  
      let lives = document.createElement('DIV');
      lives.classList = 'lives';
      lives.style.cssText = `float: left; vertical-align: middle; margin-left: 5px; margin-top: 10px; display: inline-block;`;
      lives.innerHTML = `Lives: ${this.lives}`;
  
      let score = document.createElement('DIV');
      score.classList = 'score';
      score.style.cssText = `float: right; vertical-align: middle; margin-right: 5px; margin-top: 10px; display: inline-block;`;
      score.innerHTML = `Score: ${this.score}`;
  
      ui.append(lives, score);
  
      document.body.append(ui);
  
      let field = document.createElement('DIV');
      field.classList = 'field';
      field.style.cssText = `background-color: black;  color: white; position: relative; width: ${this.fieldsize}px; height: ${this.fieldsize}px; `;
  
      let  arrSnakeParts = this.snakePartGenerator(3);
  
      field.append(...arrSnakeParts);
  
      document.addEventListener('keydown', this.snakeMover);
  
      document.body.append(field);

      this.somefunction();
      this.pointGenerator();
    }
  
    ///Genearator snake part
    snakePartGenerator(size){
      let  arrSnakeParts = [];
  
      for( let i = 1; i <= size; i++){
        let snake = document.createElement('DIV');
        snake.classList = `snake part${i}`;
        snake.style.cssText = `background-color: green; position: absolute; width: 10px; height: 10px; top: ${100}px; left: ${110 - i*10}px; `;
  
        arrSnakeParts.push(snake);
      }
  
      return arrSnakeParts;
    }
  
    somefunction(){
  
      this.field = document.querySelector('.field');
      this.fieldGetLeft = this.field.getBoundingClientRect().left;
      this.fieldGetTop = this.field.getBoundingClientRect().top;
      this.fieldLimitTop = Math.round(this.fieldGetTop);
      this.fieldLimitLeft = Math.round(this.fieldGetLeft);
      this.fieldLimitDown = Math.round(this.fieldGetTop + this.field.offsetHeight);
      this.fieldLimitRight = Math.round(this.fieldGetLeft + this.field.offsetWidth);
  
    }
  
    /// Event to move snake
    snakeMover = (event) => { 
  
      if( !(event.key == 'ArrowLeft' || event.key == 'ArrowRight' ||  event.key == 'ArrowUp'  ||  event.key == 'ArrowDown') )return;
  
     this.evKey = event.key;
  
      clearInterval(this.intId);
  
      this.intId = setInterval( this.mover, 200);
    }
  
  
     ///Move interval of snake
    mover = () =>{
  
      let snakeParts = document.body.querySelectorAll('.snake');
  
      ///Add snake parts
      if(document.body.querySelector('.point') != null){
  
        let point = document.body.querySelector('.point');
        let pointCoordLeft = point.getBoundingClientRect().left;
        let pointCoordTop = point.getBoundingClientRect().top;
        let newgetLeft = snakeParts[0].getBoundingClientRect().left;
        let newgetTop = snakeParts[0].getBoundingClientRect().top;
  
        if((pointCoordLeft == newgetLeft) && (pointCoordTop == newgetTop)){
  
          let snake = document.createElement('DIV');
          snake.classList = `snake part${snakeParts.length}`;
          snake.style.cssText = `background-color: green; position: absolute; width: 10px; height: 10px; top: -300px; left: -300px; `;
          this.field.append(snake);
          this.score += 100;
          this.updateScore();
          point.remove();
        }
  
      }
  
      ///Process of moving
      let positionKeeper = [];
      for( let i = 0; i < snakeParts.length; i++){
        let snakeLeft = Math.round(snakeParts[i].getBoundingClientRect().left) - this.fieldLimitLeft;
        let snakeTop = Math.round(snakeParts[i].getBoundingClientRect().top) - this.fieldLimitTop;
        positionKeeper.push([snakeLeft, snakeTop]);
      }
  
      
      ///Destroy and generate a new snake
      for( let i = 1; i < positionKeeper.length; i++){
  
        if( (positionKeeper[0][0] == positionKeeper[i][0]) && (positionKeeper[0][1] == positionKeeper[i][1]) ){
              
         Array.from(document.body.querySelectorAll('.snake')).map(val => val.remove());
  
         let  newSnakeParts = this.snakePartGenerator(3);
  
          this.lives--;
  
          if(this.lives == 0 ){
            this.gameOver();
          }else{
            this.updateLives();
            this.score = 0;
            this.updateScore();
          }
  
  
          this.field.append(...newSnakeParts);
          break;
  
        }
      }
  
      if(this.evKey == 'ArrowLeft' && (positionKeeper[1][0] == (positionKeeper[0][0] - 10) ) ){ this.evKey = "ArrowRight";}
      if(this.evKey == 'ArrowRight' && (positionKeeper[1][0] == (positionKeeper[0][0]  + 10) ) ){this.evKey = "ArrowLeft"; }
      if(this.evKey == 'ArrowUp' && (positionKeeper[1][1] == (positionKeeper[0][1]  - 10) ) ){this.evKey = "ArrowDown"; }
      if(this.evKey == 'ArrowDown' && (positionKeeper[1][1] == (positionKeeper[0][1] + 10) ) ){this.evKey = "ArrowUp"; }
  
      switch(this.evKey){
        case 'ArrowLeft': snakeParts[0].style.left = positionKeeper[0][0] - 10 + 'px'; break;
        case 'ArrowRight': snakeParts[0].style.left = positionKeeper[0][0] + 10 + 'px'; break;
        case 'ArrowUp': snakeParts[0].style.top = positionKeeper[0][1] - 10 + 'px'; break;
        case 'ArrowDown': snakeParts[0].style.top = positionKeeper[0][1] + 10 + 'px'; break;
      }
  
      let getLeft = Math.round(snakeParts[0].getBoundingClientRect().left);
      let getTop = Math.round(snakeParts[0].getBoundingClientRect().top);
      if(getLeft < this.fieldLimitLeft ) snakeParts[0].style.left = this.field.offsetWidth - 10 + 'px';
      if(getLeft > this.fieldLimitRight - 10) snakeParts[0].style.left = 0 + 'px';
      if(getTop < this.fieldLimitTop ) snakeParts[0].style.top = this.field.offsetHeight - 10 + 'px';
      if(getTop > this.fieldLimitDown - 10) snakeParts[0].style.top = 0 + 'px';
  
      for( let i = 1; i < snakeParts.length; i++){
        snakeParts[i].style.left = positionKeeper[i-1][0] + 'px';
        snakeParts[i].style.top = positionKeeper[i-1][1] + 'px';
      }
  
      this.prevEvent = this.evKey;
    }
  
    updateScore(){
      let score = document.querySelector('.score')
      score.innerHTML = `Score: ${this.score}`;
    }
  
    updateLives(){
      let lives = document.querySelector('.lives')
      lives.innerHTML = `Lives: ${this.lives}`;
    }
  
    gameOver(){
  
      clearInterval(this.intId);
      clearInterval(this.pointId);
  
      let ui = document.querySelector('.ui');
      ui.style.border = 'black';
      ui.innerHTML = '';
      this.field.innerHTML = `<p style="margin:0; display: block; margin-left: 30%;">Game Over</p>\n<p style="margin:0; display: block; margin-left: 25%;">Your Score: ${this.score}</p>`;
    }
  
    ///Generator of grown point
    pointGenerator(){
  
      let point = document.createElement('DIV');
      point.classList = `point`;
      point.style.cssText = `background-color: red; position: absolute; width: 10px; height: 10px; display: none;`;
  
      function createPoint(){
  
        if(document.body.querySelector('.point') != null) document.body.querySelector('.point').remove();
  
        let horizontal = this.randomInteger(10, this.field.offsetWidth - 10);
        let vertical = this.randomInteger( 10, this.field.offsetHeight - 10);
  
        point.style.top = Math.floor(vertical / 10)*10 + 'px';
        point.style.left = Math.floor(horizontal / 10)*10 + 'px';
        point.style.display = 'block';
  
        this.field.append(point);
      }
  
      this.pointId = setInterval( createPoint.bind(this), 7000);
    }
  
    ////Generator of random number
    randomInteger(min, max) {
      let rand = min + Math.random() * (max + 1 - min);
      return Math.floor(rand);
    }
    
  }
  
  
  


