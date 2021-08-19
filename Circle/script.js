
const canvas = document.querySelector("#canvas1");
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 350;
const CANVAS_HEIGHT = canvas.height = 470;
let canvasPosition = canvas.getBoundingClientRect();
let score = 0;
let passed = 0;
let gameFrame = 0;
let running = false;
let circleColor = '';
let coinsArray = [];
let particlesArray = []
document.querySelector('.start').onclick = ()=>{
    document.querySelector('.sair').style.display = 'block'
    document.querySelector('.start').style.display = 'none'
    document.querySelector('.restart').style.display = 'none'    
    document.querySelector('.score').style.display = 'block'    
    document.querySelector('.passed').style.display = 'block'    

    document.querySelectorAll('label').forEach(label=>{
        label.style.display = 'none'
    })
    document.querySelectorAll('select').forEach(select=>{
        select.style.display = 'none'
    })
    canvas.style.backgroundColor = document.querySelector('#cores-do-fundo').value 
    circleColor = document.querySelector('#colors').value
    running = true
    if(running){
        start()
    }
}
document.querySelector('.sair').onclick = ()=>{
    document.querySelector('.score').style.display = 'none'    
    document.querySelector('.passed').style.display = 'none'
    document.querySelectorAll('label').forEach(label=>{
        label.style.display = 'block'
    })
    document.querySelectorAll('select').forEach(select=>{
        select.style.display = 'block'
    })
    document.querySelector('.start').style.display = 'block'
    document.querySelector('.sair').style.display = 'none'
    document.querySelector('.restart').style.display = 'none'    

    circleColor = 'white'
    canvas.style.backgroundColor = 'white'
    setTimeout(() => {
        coinsArray = []
        running = false
        score = 0
        document.querySelector('.score').innerHTML = score
        passed = 0
        document.querySelector('.passed').innerHTML = passed
        ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT)
    }, 250);
}
document.querySelector('.restart').onclick = ()=>{
    document.querySelector('.restart').style.display = 'none'    
    document.querySelector('.sair').style.display = 'block'
    running = true
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT)
    coinsArray = []
    start()    
    document.querySelector('.score').style.display = 'block'    
    document.querySelector('.passed').style.display = 'block'
}
let circle = {
    x: 0,
    y: 0,
    size:14,
    color: circleColor,
}
  let mouse = {
    x: CANVAS_WIDTH/2,
    y: CANVAS_HEIGHT/2,
}
class Particle{
    constructor(x,y,size){
        this.x = x
        this.y = y
        this.size = size
        this.weight = Math.random()*1.5 + 1.5
        this.directionX = Math.random()*2
    }
    update(){
        this.y += this.weight
        this.x += this.directionX
        if(this.size >= 0.3)  this.size -= 0.2
    }
    draw(){
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = circleColor
        ctx.fill()
    }
}
/*buttonElements.forEach(button=> button.addEventListener('mouseenter', function(){
        activeButton = button.dataset.number;
    }))
buttonElements.forEach(button =>  button.addEventListener('mouseleave', function(){
        activeButton = -1;  
    }))*/

function handleParticles(){
        for(let i = 0; i < particlesArray.length; i++){
            particlesArray[i].update()
            particlesArray[i].draw()
            if(particlesArray[i].size <= 1){
                    particlesArray.splice(i,1)
                    i--
            }
        }
}
function createParticle(){  
        //if(activeButton > -1){
            let size = Math.random() * 9 + 5
            //let x  =  Math.random() * (buttonsMeasurements[activeButton].width - size*2) +
            //buttonsMeasurements[activeButton].x +size
            //let y  =  buttonsMeasurements[activeButton].y + 40
            particlesArray.push(new Particle(circle.x, circle.y, size))
        //}
}

function puxar(e){
    if(e.type === 'mousedown'){
        mouse.x = e.x - canvasPosition.left
        mouse.y = e.y - canvasPosition.top
    }
    else if(e.type === 'touchstart'){
        mouse.x = e.touches[0].pageX - canvasPosition.left
        mouse.y = e.touches[0].pageY - canvasPosition.top
    }
    //console.log('x: ',mouse.x, 'y: ',mouse.y)
}
canvas.addEventListener('mousedown',puxar)
canvas.addEventListener('touchstart',puxar)

function drawCircle(){
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT)
    /*ctx.fillStyle = squareColor
    ctx.fillRect(square.x, square.y,square.size,square.size)*/
        ctx.fillStyle = circleColor
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.size/2, 0 ,Math.PI*2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke(); 
}
function updateCircle(){
        const dx = circle.x - mouse.x 
        const dy = circle.y - mouse.y
        if(mouse.x != circle.x){
            circle.x -= dx/19
        }
        if(mouse.y != circle.y){
            circle.y -= dy/19
        }
}

const coin = new Image();
coin.src = 'coin1.png';
class Coin{
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = 0;
        this.radius = 20;
        this.speed = Math.random() * 4 + 1
        this.distance;
        this.sound = Math.random() <= 0.5 ? 'sound1': 'sound2';
        this.spriteWidth = 257
        this.spriteHeight = 257
    }
    drawCoin(){
        /*ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(this.x, this.y,this.radius,0,Math.PI*2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke(); */
        ctx.drawImage(coin,this.spriteWidth * 1, this.spriteHeight * 1, this.spriteWidth, this.spriteHeight, this.x-22, this.y-23, this.radius*2+3.5, this.radius*2+3)
}
    updateCoin(){
        this.y += this.speed;
        const dx = this.x - circle.x;
        const dy = this.y - circle.y;
        this.distance = Math.sqrt(dx*dx + dy*dy);
    }
}
    const coinSound1 = document.createElement('audio');
    coinSound1.src = 'coinSound1.wav';
    const coinSound2 = document.createElement('audio');
    coinSound2.src = 'coinSound2.wav';

    const gameover = document.createElement('audio');
    gameover.src = 'gameover1.wav';

function handleCoin(){
    if(gameFrame % 50 == 0){
        coinsArray.push(new Coin());
    }
    for(let i = 0; i < coinsArray.length; i++){
        coinsArray[i].updateCoin()
        coinsArray[i].drawCoin()
    }
    for(let i = 0; i < coinsArray.length; i++){
       if(coinsArray[i]){
        if(coinsArray[i].y > canvas.height){
            coinsArray.splice(i,1)
            passed++
            document.querySelector('.passed').innerHTML = passed
           }
        if(coinsArray[i].distance < coinsArray[i].radius + circle.size/2){
            coinsArray[i].sound == 'sound1'? coinSound1.play() : coinSound2.play();                 
            score++
            document.querySelector('.score').innerHTML = score
            coinsArray.splice(i,1) 
           }
       }
    }
}
function handleGameOver(){
    if(passed >=3){
        gameover.play()
        ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT)
        ctx.font = '50px MV Boli'
        ctx.fillStyle = 'red';
        ctx.fillText('GAME OVER!',20,80);
        ctx.fillStyle = 'yellow';
        ctx.fillText('pontos:' + score,50,CANVAS_HEIGHT/2);
        running = false
        document.querySelector('.sair').style.display = 'none'
        document.querySelector('.start').style.display = 'none'
        document.querySelector('.restart').style.display = 'block'    
        score = 0
        document.querySelector('.score').innerHTML = score
        passed = 0
        document.querySelector('.passed').innerHTML = passed
        document.querySelector('.score').style.display = 'none'    
        document.querySelector('.passed').style.display = 'none'
    }
}
function start(){
    if(running){
        updateCircle()
        drawCircle()
        handleCoin()
        handleGameOver()
        gameFrame++;
        createParticle()
        handleParticles()
        requestAnimationFrame(start)
    }
}
window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect();
});

