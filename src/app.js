/*
 this.sprite = new cc.Sprite(res.carPicture);
 this.sprite.attr({
 x: size.width / 2,
 y: size.height / 2,
 scale: 0.15,
 rotation: 0
 });
 this.addChild(this.sprite, 0);
 */
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    velocityCar:0,
    angleCar : 0,
    rockSprite: [],
    carSprite: null,
    line1:null,
    lineArray: [],
    posRadar: [],
    drawNode: null,
    GAs : null,
    timeout: 0,
    s:0,
    xI: [470, 470, 260,250],
    yI:[150, 400, 400,300],
    currentIndividual: 0,
    textResult: null,
    textGeneration: null,
    textFitness: null,
    textHighestFitness: null,
    checkTurn: false,
    timeTurn: 0,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = new cc.MenuItemImage(
            res.CloseNormal_png,
            res.CloseSelected_png,
            function () {
                cc.log("Menu is clicked!");
            }, this);
        closeItem.attr({
            x: size.width - 20,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        this.textGeneration = new cc.LabelTTF("Generation: 1", "Arial", 15);
        // position the label on the center of the screen
        this.textGeneration.x = 50;
        this.textGeneration.y = size.height - 20;

        this.textResult = new cc.LabelTTF("Individual: 1", "Arial", 15);
        // position the label on the center of the screen
        this.textResult.x = 50;
        this.textResult.y = size.height - 35;

        this.textFitness = new cc.LabelTTF("Fitness: 0", "Arial", 15);
        // position the label on the center of the screen
        this.textFitness.x = 50;
        this.textFitness.y = size.height - 50;

        this.textHighestFitness = new cc.LabelTTF("Highest Fitness: 0", "Arial", 15);
        // position the label on the center of the screen
        this.textHighestFitness.x = 50;
        this.textHighestFitness.y = size.height - 75;

        // add the label as a child to this layer
        this.addChild(this.textResult, 5);
        this.addChild(this.textFitness, 5);
        this.addChild(this.textGeneration, 5);
        this.addChild(this.textHighestFitness, 5);

        // add "HelloWorld" splash screen"

        this.GAs = new Genetic();
        for(var i = 0; i < 7; i++){
            this.posRadar.push({"point" : cc.p(0,0), "distance" : 100});
        }
        this.carSprite = new CarSprite(this.xI[this.randomInteger(0,3)],this.yI[this.randomInteger(0,3)]);
        this.addChild(this.carSprite, 2);

        //this.line1 = new LineDraw(0.6,150,100, 500);
        //this.addChild(this.line1, 1);
        this.lineArray.push(new LineDraw(200, -200, 1, 4));
        this.lineArray.push(new LineDraw(-8, 685*8, 540, 685));
        this.lineArray.push(new LineDraw(0, 0, 0, 799));
        this.lineArray.push(new LineDraw(-0.05, 497, 0, 730));

        this.lineArray.push(new LineDraw(0.6,150,100, 200));
        this.lineArray.push(new LineDraw(-0.6,550,280, 470));
        this.lineArray.push(new LineDraw(2,-2*250,250, 330));
        this.lineArray.push(new LineDraw(0.6,50,340, 560));
        this.lineArray.push(new LineDraw(-6,6*150,125, 147));
        this.lineArray.push(new LineDraw(6,-6*150+420,129, 147));
        this.lineArray.push(new LineDraw(0.4,-100,370, 500));
        this.lineArray.push(new LineDraw(6,-6*520,550, 565));

        for(var i = 0; i < this.lineArray.length; i++){
            this.addChild(this.lineArray[i],1);
        }
        this.drawNode = new cc.DrawNode();
        this.addChild(this.drawNode, 2);
        if( 'keyboard' in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed:function(key, event) {
                    var target = event.getCurrentTarget();
                    switch(key) {
                        case 37:
                            target.angleCar -= 8;
                            if(target.angleCar < 0){;
                                target.angleCar += 360;
                            }
                            break;
                        case 39:
                            target.angleCar += 8;
                            if(target.angleCar >= 360){
                                target.angleCar -= 360;
                            }
                            break;
                        case 38:
                            target.velocityCar = 80;
                            break;
                        case 40:
                            target.velocityCar = -80;
                            break;
                    }
                },
                onKeyReleased:function(key, event) {
                    var target = event.getCurrentTarget();
                    switch(key) {
                        case 37:
                            //target.angleCar -= 2;
                            //cc.log(target.angleCar);
                            break;
                        case 39:
                            //cc.log(target.angleCar);
                            //self.isSwipeRight = false;
                            break;
                        case 38:
                            target.velocityCar = 0;
                            break;
                        case 40:
                            target.velocityCar = 0;
                            break;
                    }
                }
            }, this);
        }
        this.scheduleUpdate();
        return true;
    },
    findRadar: function(angleAbs, index, a1, b1, minX, maxX){
        var x0 = 0;
        var y0 = 0;
        var angle = this.angleCar + angleAbs;
        var forward = false;
        if(angle >= 360)
            angle -= 360;
        if(angle < 0)
            angle += 360;
        if(angle != 0 && angle != 180) {
            var a0 = 1 / Math.tan(Math.PI * angle / 180);
            var b0 = this.carSprite.y - a0 * this.carSprite.x;
            if(a1 != a0){ // 2 duong khong song song
                x0 = (b0 - b1) / (a1 - a0);
                y0 = a0*x0 + b0;
            } else {
                return; // 2 duong song song thi return
            }
            forward = (Math.sin(angle*Math.PI/180)*(x0 - this.carSprite.x) > 0);
        } else {
            //cc.log(this.line1.b);
            x0 = this.carSprite.x;
            y0 = a1*x0 + b1;
            forward = (y0>this.carSprite.y);
            if(angle == 180){
                forward = !forward;
            }
        }
        var dis = Math.sqrt(Math.pow(this.carSprite.x - x0, 2) +
                            Math.pow(this.carSprite.y - y0, 2));
        if(forward && minX < x0 && maxX > x0 && dis < this.posRadar[index].distance){
            this.posRadar[index].distance = dis;
            this.posRadar[index].point.x = x0;
            this.posRadar[index].point.y = y0;
        }
    },
    resetRadar: function(){
        for(var i = 0; i < this.posRadar.length; i++){
            //this.posRadar.point = cc.p(0,100);
            this.posRadar[i].distance = 100;
        }
    },
    drawRadar: function(){
        this.drawNode.clear();
        for(var i = 0; i < this.posRadar.length; i++){
            if(this.posRadar[i].distance < 100)
                this.drawNode.drawCircle(this.posRadar[i].point, 3, 0.3, 15, false, 7, cc.color(0,0,255));
        }
    },
    scanRadar: function(a,b,minX,maxX){
        this.findRadar(0,0,a,b,minX,maxX);
        this.findRadar(30,1,a,b,minX,maxX);this.findRadar(-30,2,a,b,minX,maxX);
        this.findRadar(60,3,a,b,minX,maxX);this.findRadar(-60,4,a,b,minX,maxX);
        this.findRadar(90,5,a,b,minX,maxX);this.findRadar(-90,6,a,b,minX,maxX);
    },
    autoDrive: function(key){
        var target = this;
        switch(key) {
            case 37:
                target.angleCar -= 8;
                if(target.angleCar < 0){;
                    target.angleCar += 360;
                }
                target.velocityCar = 0;
                if(!this.checkTurn){
                    this.checkTurn = true;
                }
                break;
            case 39:
                target.angleCar += 8;
                if(target.angleCar >= 360){
                    target.angleCar -= 360;
                }
                target.velocityCar = 0;
                if(!this.checkTurn){
                    this.checkTurn = true;
                }
                break;
            case 38:
                target.velocityCar = 80;
                if(this.checkTurn){
                    this.checkTurn = false;
                    this.timeTurn = 0;
                }
                break;
            case 40:
                target.velocityCar = -80;
                if(this.checkTurn){
                    this.checkTurn = false;
                    this.timeTurn = 0;
                }
                break;
        }
    },
    updateResult: function(){
        this.GAs.population[this.currentIndividual].fitness = this.s/this.timeout + this.timeout/10;
        this.textResult.setString("Individual: " + this.currentIndividual);
        this.textFitness.setString("Fitness: " + this.GAs.population[this.currentIndividual].fitness);
        this.timeout = 0;
        this.timeTurn = 0;
        this.checkTurn = false;
        this.s = 0;
        var indexT = this.randomInteger(0,3);
        //cc.log(indexT);
        this.carSprite.x = this.xI[indexT];
        this.carSprite.y = this.yI[indexT];
        this.angleCar = 0;
        this.velocityCar = 0;
        this.currentIndividual++;
        if(this.currentIndividual >= this.GAs.sizePop){
            this.currentIndividual = 0;
            this.GAs.evolve();
            this.textGeneration.setString("Generation: " + this.GAs.generation);
            this.textHighestFitness.setString("Highest Fitness: " + this.GAs.highestFitness);
        }
    },
    testIndividual: function(dt){
        this.timeout += dt*10;
        if(this.checkTurn)
            this.timeTurn +=dt*10;
        //cc.log(this.timeout);
        var output = this.GAs.population[this.currentIndividual].individual.forprop(this.posRadar.map(function(a) {return a.distance;}));
        this.s += this.velocityCar*dt;
        if(output[0] > output[1] && output[0] > output[2]){
            this.autoDrive(38);
        } else {
            if(output[1] > output[2]){
                this.autoDrive(37);
            } else {
                this.autoDrive(39);
            }
        }
        if(this.timeTurn > 10 || this.timeout > 70){
            this.updateResult();
            return;
        }
        for(var i = 0; i < this.posRadar.length; i++){
            if(this.posRadar[i].distance < 20){
                this.updateResult();
            }
        }
    },
    update:function (dt) {
        //this.sprite.rotation = this.angleCar;
        this.carSprite.rotation = this.angleCar;
        if(this.velocityCar != 0){
            this.carSprite.x += this.velocityCar*dt*Math.sin(Math.PI*this.angleCar/180);
            this.carSprite.y += this.velocityCar*dt*Math.cos(Math.PI*this.angleCar/180);
        }
        this.resetRadar();
        for(var i = 0; i < this.lineArray.length; i++){
            this.scanRadar(this.lineArray[i].a,this.lineArray[i].b,this.lineArray[i].minX,this.lineArray[i].maxX);
        }
        this.drawRadar();
        this.testIndividual(dt);
        //cc.log("abx");
    },
    randomInteger: function(min,max)
    {
        //cc.log(min + " " + max);
        return Math.floor(Math.random()*(max-min+1)+min);
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

