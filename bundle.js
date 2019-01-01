!function(e){var r={};function a(t){if(r[t])return r[t].exports;var i=r[t]={i:t,l:!1,exports:{}};return e[t].call(i.exports,i,i.exports,a),i.l=!0,i.exports}a.m=e,a.c=r,a.d=function(t,i,e){a.o(t,i)||Object.defineProperty(t,i,{enumerable:!0,get:e})},a.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(i,t){if(1&t&&(i=a(i)),8&t)return i;if(4&t&&"object"==typeof i&&i&&i.__esModule)return i;var e=Object.create(null);if(a.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:i}),2&t&&"string"!=typeof i)for(var r in i)a.d(e,r,function(t){return i[t]}.bind(null,r));return e},a.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return a.d(i,"a",i),i},a.o=function(t,i){return Object.prototype.hasOwnProperty.call(t,i)},a.p="",a(a.s=2)}([function(t,i){var e=document.getElementById("canvas1"),r=e.getContext("2d"),a=document.getElementById("canvas2"),n=a.getContext("2d"),s={imgUrl:"./images/",can1:e,ctx1:r,can2:a,ctx2:n,canWid:e.width,canHei:e.height,mx:.5*e.width,my:.5*e.height,aneOb:{},fruitOb:{},momOb:{},babyOb:{},scoreOb:{},waveOb:{},haloOb:{},dustOb:{},diffframetime:0};t.exports=s},function(t,i){window.requestAnimFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t,i){return window.setTimeout(t,1e3/60)};var e={calLength2:function(t,i,e,r){return Math.sqrt(Math.pow(t-e,2)+Math.pow(i-r,2))},lerpAngle:function(t,i,e){var r=i-t;return r>Math.PI&&(r-=2*Math.PI),r<-Math.PI&&(r+=2*Math.PI),t+r*e},lerpDistance:function(t,i,e){return t+(i-t)*e},distance:function(t,i,e,r,a){var n=Math.abs(t-e),s=Math.abs(i-r);return n<a&&s<a}};t.exports=e},function(t,i,e){var r=e(3);e(12),r.startgame()},function(t,i,e){var r,a,n,s,o,h,m,u,d,y=e(0),f=e(1),b=e(4),l=e(5),c=e(6),x=e(7),p=e(8),g=e(9),v=e(10),w=e(11),I=y.can1,T=y.ctx1,E=y.ctx2,O=y.canWid,A=y.canHei,M=f.calLength2,B={startgame:function(){B.init(),d=Date.now(),B.gameLoop()},drawBackgorund:function(){var t=new Image;t.src=y.imgUrl+"background.jpg",E.drawImage(t,0,0,O,A)},init:function(){T.fillStyle="white",T.font="20px 微软雅黑",T.textAlign="center",I.addEventListener("mousemove",B.onMouseMove,!1),I.addEventListener("click",B.onClick,!1),y.mx=.5*O,y.my=.5*A,(r=y.aneOb=new b).init(),(a=y.fruitOb=new x).init(),(n=y.momOb=new g).init(),(s=y.babyOb=new l).init(),o=y.scoreOb=new v,(h=y.waveOb=new w).init(),(m=y.haloOb=new p).init(),(u=y.dustOb=new c).init()},gameLoop:function(){requestAnimFrame(B.gameLoop);var t=Date.now();y.diffframetime=t-d,d=t,40<y.diffframetime&&(y.diffframetime=40),E.clearRect(0,0,O,A),B.drawBackgorund(),r.drawAne(),a.computeFruit(),a.drawFruit(),T.clearRect(0,0,O,A),n.drawMom(),s.drawBaby(),o.gameOver||(B.momEatFruit(),B.momFoodBaby()),o.drawScore(),h.drawWave(),m.drawHalo(),u.drawDust()},onMouseMove:function(t){o.gameOver||(t.offsetX||t.layerX)&&(y.mx=null==t.offsetX?t.layerX:t.offsetX,y.my=null==t.offsetY?t.layerY:t.offsetY)},onClick:function(){o.gameOver&&(o.gameOver=!1,a.init(),n.init(),s.init(),o.init())},momEatFruit:function(){for(var t=0;t<a.num;t++){if(a.alive[t]&&a.grow[t])M(a.x[t],a.y[t],n.x,n.y)<30&&(a.dead(t),h.born(t),o.fruitNum++,n.momBodyIndex=7==n.momBodyIndex?n.momBodyIndex:n.momBodyIndex+1,"blue"==a.type[t]&&o.doubleNum++)}},momFoodBaby:function(){if(0<o.fruitNum&&M(n.x,n.y,s.x,s.y)<30){m.born(),n.momBodyIndex=0;var t=o.doubleNum*o.fruitNum,i=s.babyBodyIndex-t;i<0&&(i=0);var e=o.strength+(i/2).toFixed(0);10<e&&(e=10),o.strength=e,s.babyBodyIndex=i,o.computeScore()}}};t.exports=B},function(t,i,e){var r=e(0),a=r.ctx2,n=r.canHei,s=function(){this.num=50,this.rootx=[],this.headx=[],this.heady=[],this.amp=[],this.beta=0};s.prototype.init=function(){for(var t=0;t<this.num;t++)this.rootx[t]=18*t+30*Math.random(),this.headx[t]=this.rootx[t],this.heady[t]=n-220+50*Math.random(),this.amp[t]=50*Math.random()+60},s.prototype.drawAne=function(){this.beta+=8e-4*r.diffframetime;var t=Math.sin(this.beta);a.save(),a.globalAlpha=.7,a.lineWidth=20,a.lineCap="round",a.strokeStyle="#3b154e";for(var i=0;i<this.num;i++){var e=this.headx[i]+t*this.amp[i];a.beginPath(),a.moveTo(this.rootx[i],n),a.quadraticCurveTo(this.rootx[i],n-100,e,this.heady[i]),a.stroke()}a.restore()},t.exports=s},function(t,i,e){var h=e(0),r=e(1),a=h.imgUrl,m=h.ctx1,u=h.can1,n=h.canWid,s=h.canHei,d=r.lerpAngle,y=r.lerpDistance,o=function(){this.x=0,this.y=0,this.angle,this.babyTailArr=[],this.babyTailTimer=0,this.babyTailIndex=0,this.babyEyeArr=[],this.babyEyeTimer=0,this.babyEyeIndex=0,this.babyEyeInterval=1e3,this.babyBodyArr=[],this.babyBodyTimer=0,this.babyBodyIndex=0};o.prototype.init=function(){this.x=.5*n-50,this.y=.5*s+50,this.babyBodyIndex=0;for(var t=this.angle=0;t<8;t++)this.babyTailArr[t]=new Image,this.babyTailArr[t].src=a+"babyTail"+t+".png";for(t=0;t<2;t++)this.babyEyeArr[t]=new Image,this.babyEyeArr[t].src=a+"babyEye"+t+".png";for(t=0;t<20;t++)this.babyBodyArr[t]=new Image,this.babyBodyArr[t].src=a+"babyFade"+t+".png"},o.prototype.drawBaby=function(){var t=h.momOb,i=h.scoreOb;this.x=y(t.x,this.x,.98),this.y=y(t.y,this.y,.99);var e=t.x-this.x,r=t.y-this.y,a=Math.atan2(r,e)+Math.PI;this.angle=d(a,this.angle,.6),this.babyTailTimer+=h.diffframetime,50<this.babyTailTimer&&(this.babyTailIndex=(this.babyTailIndex+1)%8,this.babyTailTimer%=50),this.babyEyeTimer+=h.diffframetime,this.babyEyeTimer>this.babyEyeInterval&&(this.babyEyeIndex=(this.babyEyeIndex+1)%2,this.babyEyeTimer%=this.babyEyeInterval,0==this.babyEyeIndex?this.babyEyeInterval=1500*Math.random()+1500:this.babyEyeInterval=200),this.babyBodyTimer+=h.diffframetime,550<this.babyBodyTimer&&(this.babyBodyIndex+=1,this.babyBodyTimer%=550,i.strength=((20-this.babyBodyIndex)/2).toFixed(0),19<this.babyBodyIndex&&(this.babyBodyIndex=19,i.gameOver=!0,u.style.cursor="pointer")),m.save(),m.translate(this.x,this.y),m.rotate(this.angle);var n=this.babyTailArr[this.babyTailIndex];m.drawImage(n,.5*-n.width+24,.5*-n.height);var s=this.babyBodyArr[this.babyBodyIndex];m.drawImage(s,.5*-s.width,.5*-s.height);var o=this.babyEyeArr[this.babyEyeIndex];m.drawImage(o,.5*-o.width,.5*-o.height),m.restore()},t.exports=o},function(t,i,e){var r=e(0),a=r.ctx1,n=r.imgUrl,s=r.canWid,o=r.canHei,h=function(){this.num=30,this.dustPic=[],this.x=[],this.y=[],this.amp=[],this.index=[],this.beta=0};h.prototype.init=function(){for(var t=0;t<7;t++)this.dustPic[t]=new Image,this.dustPic[t].src=n+"dust"+t+".png";for(t=0;t<this.num;t++)this.x[t]=Math.random()*s,this.y[t]=Math.random()*o,this.amp=20+Math.random()+15,this.index[t]=Math.floor(7*Math.random())},h.prototype.drawDust=function(){for(var t=0;t<this.num;t++){var i=this.index[t];a.drawImage(this.dustPic[i],this.x,this.y)}},t.exports=h},function(t,i,e){var a=e(0),r=a.ctx2,n=a.imgUrl,s=function(){this.num=30,this.x=[],this.y=[],this.size=[],this.type=[],this.speed=[],this.grow=[],this.alive=[],this.orange=new Image,this.blue=new Image};s.prototype.init=function(){this.orange.src=n+"fruit.png",this.blue.src=n+"blue.png";for(var t=0;t<this.num;t++)this.x[t]=this.y[t]=0,this.speed[t]=.015*Math.random()+.005,this.alive[t]=!1,this.grow[t]=!1,this.type[t]=""},s.prototype.drawFruit=function(){for(var t=0;t<this.num;t++)if(this.alive[t]){this.size[t]<=16?(this.grow[t]=!1,this.size[t]+=this.speed[t]*a.diffframetime*.8):(this.grow[t]=!0,this.y[t]-=5*this.speed[t]*a.diffframetime);var i=this.orange;"blue"==this.type[t]&&(i=this.blue),r.drawImage(i,this.x[t]-.5*this.size[t],this.y[t]-.5*this.size[t],this.size[t],this.size[t]),this.y[t]<8&&(this.alive[t]=!1)}},s.prototype.born=function(t){var i=a.aneOb,e=Math.floor(Math.random()*i.num);this.x[t]=i.headx[e],this.y[t]=i.heady[e],this.size[t]=0,this.alive[t]=!0;var r=Math.random();this.type[t]=r<.1?"blue":"orange"},s.prototype.dead=function(t){this.alive[t]=!1},s.prototype.computeFruit=function(){for(var t=a.fruitOb,i=0,e=0;e<t.num;e++)t.alive[e]&&i++;if(i<15)return function(){for(var t=a.fruitOb,i=0;i<t.num;i++)if(!t.alive[i])return t.born(i)}(),!1},t.exports=s},function(t,i,e){var r=e(0),a=r.ctx1,n=r.canWid,s=r.canHei,o=function(){this.num=5,this.x=[],this.y=[],this.r=[],this.status=[]};o.prototype.init=function(){for(var t=0;t<this.num;t++)this.x[t]=.5*n,this.y[t]=.5*s,this.status[t]=!1,this.r[t]=0},o.prototype.drawHalo=function(){a.save(),a.lineWidth=4;for(var t=0;t<this.num;t++)if(this.status[t]){if(this.r[t]+=.08*r.diffframetime,100<this.r[t])return this.status[t]=!1;var i=1-this.r[t]/100;a.strokeStyle="rgba(203, 91, 0, "+i+")",a.beginPath(),a.arc(this.x[t],this.y[t],this.r[t],0,2*Math.PI),a.stroke()}a.restore()},o.prototype.born=function(){for(var t=r.babyOb,i=0;i<this.num;i++)if(!this.status[i])return this.status[i]=!0,this.x[i]=t.x,this.y[i]=t.y,!(this.r[i]=10)},t.exports=o},function(t,i,e){var o=e(0),r=e(1),h=o.ctx1,a=o.imgUrl,n=o.canWid,s=o.canHei,m=r.lerpAngle,u=r.lerpDistance,d=function(){this.x=0,this.y=0,this.angle,this.momTailArr=[],this.momTailTimer=0,this.momTailIndex=0,this.momEyeArr=[],this.momEyeTimer=0,this.momEyeIndex=0,this.momEyeInterval=1e3,this.momOrangeArr=[],this.momBlueArr=[],this.momBodyIndex=0};d.prototype.init=function(){this.x=.5*n,this.y=.5*s;for(var t=this.angle=0;t<8;t++)this.momTailArr[t]=new Image,this.momTailArr[t].src=a+"bigTail"+t+".png";for(t=0;t<2;t++)this.momEyeArr[t]=new Image,this.momEyeArr[t].src=a+"bigEye"+t+".png";for(t=0;t<8;t++)this.momOrangeArr[t]=new Image,this.momOrangeArr[t].src=a+"bigSwim"+t+".png",this.momBlueArr[t]=new Image,this.momBlueArr[t].src=a+"bigSwimBlue"+t+".png"},d.prototype.drawMom=function(){var t=o.scoreOb;this.x=u(o.mx,this.x,.96),this.y=u(o.my,this.y,.98);var i=o.mx-this.x,e=o.my-this.y,r=Math.atan2(e,i)+Math.PI;this.angle=m(r,this.angle,.6),this.momTailTimer+=o.diffframetime,50<this.momTailTimer&&(this.momTailIndex=(this.momTailIndex+1)%8,this.momTailTimer%=50),this.momEyeTimer+=o.diffframetime,this.momEyeTimer>this.momEyeInterval&&(this.momEyeIndex=(this.momEyeIndex+1)%2,this.momEyeTimer%=this.momEyeInterval,0==this.momEyeIndex?this.momEyeInterval=1500*Math.random()+1500:this.momEyeInterval=200),h.save(),h.translate(this.x,this.y),h.rotate(this.angle);var a,n=this.momTailArr[this.momTailIndex];h.drawImage(n,.5*-n.width+30,.5*-n.height),a=1!=t.doubleNum?this.momBlueArr[this.momBodyIndex]:this.momOrangeArr[this.momBodyIndex],h.drawImage(a,.5*-a.width,.5*-a.height);var s=this.momEyeArr[this.momEyeIndex];h.drawImage(s,.5*-s.width,.5*-s.height),h.restore()},t.exports=d},function(t,i,e){var r=e(0),a=r.ctx1,n=r.canWid,s=r.canHei,o=function(){this.fruitNum=0,this.doubleNum=1,this.score=0,this.strength=10,this.alpha=0,this.gameOver=!1};o.prototype.init=function(){this.fruitNum=0,this.doubleNum=1,this.score=0},o.prototype.drawScore=function(){var t=r.scoreOb;a.fillText("num: "+this.fruitNum,.5*n,s-30),a.fillText("double: "+this.doubleNum,.5*n,s-70),a.save(),a.font="30px verdana",a.fillText("SCORE: "+this.score,.5*n,50),a.font="20px verdana",a.fillText("strength: ",650,45),t.strength<=3&&(a.fillStyle="red"),a.fillText(t.strength,710,45),t.gameOver&&(this.alpha+=5e-4*r.diffframetime,1<this.alpha&&(this.alpha=1),a.font="40px verdana",a.shadowBlur=10,a.shadowColor="white",a.fillStyle="rgba(255, 255, 255, "+this.alpha+")",a.fillText("GAME OVER",.5*n,.5*s-25),a.save(),a.font="25px verdana",a.fillText("CLICK TO RESTART",.5*n,.5*s+25),a.restore()),a.restore()},o.prototype.computeScore=function(){var t=r.scoreOb;t.score+=t.fruitNum*t.doubleNum,this.fruitNum=0,this.doubleNum=1},t.exports=o},function(t,i,e){var r=e(0),a=r.ctx1,n=r.canWid,s=r.canHei,o=function(){this.num=10,this.x=[],this.y=[],this.r=[],this.status=[]};o.prototype.init=function(){for(var t=0;t<this.num;t++)this.x[t]=.5*n,this.y[t]=.5*s,this.status[t]=!1,this.r[t]=0},o.prototype.drawWave=function(){a.save(),a.lineWidth=3;for(var t=0;t<this.num;t++)if(this.status[t]){if(this.r[t]+=.04*r.diffframetime,60<this.r[t])return this.status[t]=!1;var i=1-this.r[t]/60;a.strokeStyle="rgba(255, 255, 255, "+i+")",a.beginPath(),a.arc(this.x[t],this.y[t],this.r[t],0,2*Math.PI),a.stroke()}a.restore()},o.prototype.born=function(t){for(var i=r.fruitOb,e=0;e<this.num;e++)if(!this.status[e])return this.status[e]=!0,this.x[e]=i.x[t],this.y[e]=i.y[t],!(this.r[e]=10)},t.exports=o},function(t,i,e){}]);