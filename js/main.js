"use strict";
document.addEventListener("DOMContentLoaded",()=>{
  let cvs,ctx;
  //キャンバスサイズ定義(分割代入)
  const [width,height]=[500,600];
  const stars=[];//背景の星
  let px,py;
  let status="ready";
  let points=[];
  let points_2=[];
  let bullets=[];
  let bullets_2=[];
  let startTime;
  let prevTime;
  let elapsedTime;
  let time=0;

  class Point{
    constructor(){
      this.x=Math.floor(Math.random()*(width-50))+25;
      this.y=Math.floor(Math.random()*(height-50))+25;
      this.r=width/2;
    }
    move(){
      this.r-=this.r/20;
      drawCircle(this.x,this.y,this.r,null,"cyan");
    }
  }
  class Point2{
    constructor(){
      this.x=Math.floor(Math.random()*(width-50))+25;
      this.y=Math.floor(Math.random()*(height-50))+25;
      this.r=width/2;
    }
    move(){
      if(this.r>5){
        this.r-=this.r/20;
        drawCircle(this.x,this.y,this.r,null,"tomato");
      }else{
        this.r-=this.r/1.1;
        drawCircle(this.x,this.y,this.r,null,"tomato");
      }
    }
  }


  class Bullet{
    constructor(x,y,angle,delay=0){
      this.x=x;
      this.y=y;
      this.r=10;
      this.x_x = px -this.x;
      this.y_y = py -this.y;
      this.v = Math.sqrt(this.x_x*this.x_x + this.y_y*this.y_y);
      this.angle=angle;
      this.delay=delay;

    }
    move(){
      this.delay--;
      if(this.delay < 0){
        this.x += Math.cos(this.angle) * 2;
        this.y += Math.sin(this.angle) * 2;
        drawCircle(this.x,this.y,this.r,"lightyellow","lime");
      }
    }
    move2(){
      this.delay--;
      if(this.delay < 0){
        this.x += (this.x_x/this.v)*2;
        this.y += (this.y_y/this.v)*2;
        drawCircle(this.x,this.y,this.r,"lighttomato","tomato");
      }
    }
  }

  class Bullet2{
    constructor(x,y,delay=0){
      this.x=x;
      this.y=y;
      this.r=10;
      this.x_x = px -this.x;
      this.y_y = py -this.y;
      this.v = Math.sqrt(this.x_x*this.x_x + this.y_y*this.y_y);
      this.delay=delay;

    }
    move(){
      this.delay--;
      if(this.delay < 0){
        this.x += (this.x_x/this.v)*5;
        this.y += (this.y_y/this.v)*5;
        drawCircle(this.x,this.y,this.r,"lighttomato","tomato");
      }
    }
  }
  


  const init=()=>{
    //キャンバス取得(画用紙)
    cvs =document.getElementById("space");
    //コンテキスト取得(筆、絵の具)
    ctx=cvs.getContext("2d");
    //キャンバスの大きさ設定
    [cvs.width,cvs.height]=[width,height];
    //背景に表示する星の作成
    for(let i=0;i<100;i++){
      const star={
        x:Math.random() * width,
        y:Math.random() * height,
        r:Math.random() * 1.5
      };
      stars.push(star);
    }
    cvs.addEventListener("click",startGame);
    cvs.addEventListener("mousemove",movePlayer);
    update();
  }

  const startGame=(e)=>{
    if(status != "play"){
      points=[];
      points_2=[];
      bullets=[];
      bullets_2=[];
      [startTime,prevTime,elapsedTime]=[Date.now(),Date.now(),0];
      status="play";
    }
  };
  const movePlayer=(e)=>{
    const cvsRect = cvs.getBoundingClientRect()
    px=e.clientX-cvsRect.left;
    py=e.clientY-cvsRect.top;
  };

  const update=()=>{
    //塗りの設定
    ctx.fillStyle="rgba(0,0,0,0.4)";//塗りつぶしにα(透明度)を加えることで残像効果
    //塗りつぶし(黒の背景)
    ctx.fillRect(0,0,cvs.width,cvs.height);
    //星の描画
    for(const star of stars){
      //10回に１回非表示にして瞬きを表現
      if(Math.random() > 0.5){
        drawCircle(star.x,star.y,star.r,"white");
      }
    }
    if(status=="play"){
      drawPlayer();
      elapsedTime += Date.now() -prevTime;
      [prevTime,time]=[Date.now(),Date.now()-startTime];
    }
    if(elapsedTime==500){
      elapsedTime=0;
      points_2.push(new Point2());
    }
    if(elapsedTime>1000){
      elapsedTime=0;
      points.push(new Point());
    }
    for(let i=points.length-1;i>=0;i--){
      if(points[i].r<=1){
        const[x,y]=[points[i].x,points[i].y];
        let angle=0;
        //Bullet
        if((time/1000>10)&&(Math.random()>0.5)){
          for(let j=0;j<16;j++){
            angle+=Math.PI*2/16;
            bullets.push(new Bullet(x,y,angle));
          }
        }else if((time/1000>20)&&(Math.random()>0.5)){
          for(let j=0;j<64;j++){
            angle+=Math.PI2/18;
            bullets.push(new Bullet(x.y,angle,63-j));
          }
        }else{
          for(let j=0;j<5;j++){
            angle+=Math.PI*2*Math.random();
            bullets.push(new Bullet(x,y,angle));
          }
        }
        points.splice(i,1);
      }else{
        points[i].move();
      }
    }
    for(let i=points_2.length-1;i>=0;i--){
      if(points_2[i].r<=5){
        const[x,y]=[points_2[i].x,points_2[i].y];
        let angle=0;
        //Bullet
        for(let j=0;j<5;j++){
          bullets_2.push(new Bullet2(x,y,angle));
        }
        points_2.splice(i,1);
      }else{
        points_2[i].move();
      }
    }
    for(let i=bullets.length-1;i>=0;i--){
      bullets[i].move();
      const [x,y,r]=[bullets[i].x,bullets[i].y,bullets[i].r];
      if(Math.hypot(px-x,py-y)<14){
        status = "end";
      }
      if((x<-r)||(x>width+r)||(y<-r)||(y>height+r)){
        bullets.splice(i,1);
      }
    }
    for(let i=bullets_2.length-1;i>=0;i--){
      bullets_2[i].move();
      const [x,y,r]=[bullets_2[i].x,bullets_2[i].y,bullets_2[i].r];
      if(Math.hypot(px-x,py-y)<14){
        status = "end";
      }
      if((x<-r)||(x>width+r)||(y<-r)||(y>height+r)){
        bullets_2.splice(i,1);
      }
    }
    drawText(`TIME:${(time/1000).toFixed(1)}`,5,5,20,"white","left","top");
    if(status=="end"){
      drawText("GAMEOVER",width/2,height/2-30,50,"red");
      drawText("Click here to start",width/2,height/2+20,30,"red");
    }
    //ディスプレイのリフレッシュレートのタイミングで実行される(基本１秒間に60回)
    window.requestAnimationFrame(update);
  };
  //円描画関数(中心x,中心y,半径r,塗り色,線色)
  const drawCircle=(x,y,r,color1,color2=null) =>{
    ctx.lineWidth=4;
    ctx.fillStyle=color1;
    ctx.strokeStyle=color2;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    if(color2 != null) ctx.stroke();
    if(color1 != null) ctx.fill();
  };
  const drawPlayer=()=>{
    const shape =[
      [0,10],
      [15,20],
      [0,-20],
      [-15,20],
    ];
    ctx.fillStyle="tomato";
    ctx.moveTo(px+shape[0][0],py+shape[0][1]);
    for(let i=1;i<shape.length;i++){
      ctx.lineTo(px+shape[i][0],py+shape[i][1]);
      ctx.fill();
    }
  }
  const drawText=(text,x,y,size,color,align="center",base="middle")=>{
    ctx.font=`${size}px Arial Black`;
    ctx.textAlign=align;
    ctx.textBaseline=base;
    ctx.fillStyle=color;
    ctx.fillText(text,x,y);
  }
  init();
}); 