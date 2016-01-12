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
    xI: [600, 580, 70, 70],
    yI:[70, 420, 70, 440],
    angleI: [135, 45, -135, -45],
    xO:[10, 10, 640, 690],
    yO:[500, 10, 480, 10],
    indexI: 0,
    currentIndividual: 0,
    textResult: null,
    textGeneration: null,
    textFitness: null,
    textHighestFitness: null,
    checkTurn: false,
    timeTurn: 0,
    isDrawDot: true,
    hasWall: false,
    fitnessValue: 0,
    destinationSprite: null,
    die: false,
    freeLeft: 0,
    freeRight: 0,
    freeAngleSprite: null,
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
        this.textGeneration.anchorX = 0;

        this.textResult = new cc.LabelTTF("Individual: 1", "Arial", 15);
        // position the label on the center of the screen
        this.textResult.x = 50;
        this.textResult.y = size.height - 35;
        this.textResult.anchorX = 0;

        this.textFitness = new cc.LabelTTF("Fitness: 0", "Arial", 15);
        // position the label on the center of the screen
        this.textFitness.x = 50;
        this.textFitness.y = size.height - 50;
        this.textFitness.anchorX = 0;

        this.textHighestFitness = new cc.LabelTTF("Highest Fitness: 0", "Arial", 15);
        // position the label on the center of the screen
        this.textHighestFitness.x = 50;
        this.textHighestFitness.y = size.height - 75;
        this.textHighestFitness.anchorX = 0;

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
        this.carSprite = new CarSprite(this.xI[this.indexI],this.yI[this.indexI]);
        this.carSprite.setRotation(this.angleI[this.indexI]);
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
        this.lineArray.push(new LineDraw(0,180,550, 800));
        this.lineArray.push(new LineDraw(-0.2,400,0, 80));
        this.lineArray.push(new LineDraw(-60,60*390+520,390, 392));

        for(var i = 0; i < this.lineArray.length; i++){
            this.addChild(this.lineArray[i],1);
        }
        this.destinationSprite = new cc.DrawNode();
        this.destinationSprite.drawCircle(cc.p(this.xO[this.indexI], this.yO[this.indexI]), 3, 0.3, 15, false, 7, cc.color(0,250,255));
        this.addChild(this.destinationSprite);

        this.drawNode = new cc.DrawNode();
        this.addChild(this.drawNode, 2);

        this.freeAngleSprite = new cc.DrawNode();
        this.addChild(this.freeAngleSprite, 1);
        //Set
        this.carSprite.setVisible(!this.carSprite.isVisible());
        this.carSprite.setShowRadar();
        this.isDrawDot = !this.isDrawDot;
        for(var i = 0; i < this.lineArray.length; i++){
            this.lineArray[i].setVisible(!this.lineArray[i].isVisible());
        }


        if( 'keyboard' in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed:function(key, event) {
                    var target = event.getCurrentTarget();
                    cc.log("Key: " + key);
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
                        case 72:
                            target.carSprite.setVisible(!target.carSprite.isVisible());
                            break;
                        case 49:
                            target.carSprite.setShowRadar();
                            break;
                        case 50:
                            target.isDrawDot = !target.isDrawDot;
                            break;
                        case 51:
                            for(var i = 0; i < target.lineArray.length; i++){
                                target.lineArray[i].setVisible(!target.lineArray[i].isVisible());
                            }
                            break;
                        case 83:    //s
                            target.autoRun(700);
                            break;
                        case 65:    //a
                            target.unscheduleUpdate();
                            break;
                        case 68:    //d
                            target.scheduleUpdate();
                            break;
                        case 70:    //f
                            target.forwardToIndividual(49);
                            break;
                        case 77:    //m
                            break;
                        case 81:    //q
                            target.update(0.015);
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
        if(!this.isDrawDot)
            return;
        for(var i = 0; i < this.posRadar.length; i++){
            if(this.posRadar[i].distance < 100)
                this.drawNode.drawCircle(this.posRadar[i].point, 3, 0.3, 15, false, 7, cc.color(0,0,255));
        }
    },
    drawFreeAngle: function(center, radius, degreesFrom, degreesTo, segments){
        this.freeAngleSprite.clear();
        if(degreesTo<degreesFrom){
            var temp = degreesTo;
            degreesTo = degreesFrom;
            degreesFrom = temp;
        }
        var i;
        for(i=degreesFrom; i<=degreesTo;i++){
            this.freeAngleSprite.drawCircle(center, radius, cc.degreesToRadians(-i+90), segments, true);
        }
    },
    scanRadar: function(a,b,minX,maxX){
        this.findRadar(-90,0,a,b,minX,maxX);
        this.findRadar(-60,1,a,b,minX,maxX);this.findRadar(-30,2,a,b,minX,maxX);
        this.findRadar(0,3,a,b,minX,maxX);this.findRadar(30,4,a,b,minX,maxX);
        this.findRadar(60,5,a,b,minX,maxX);this.findRadar(90,6,a,b,minX,maxX);
    },
    autoDrive: function(key){
        var target = this;
        switch(key) {
            case 37:
                target.angleCar -= 4;
                if(target.angleCar < 0){;
                    target.angleCar += 360;
                }
                target.velocityCar = 0;
                if(!this.checkTurn){
                    this.checkTurn = true;
                }
                break;
            case 39:
                target.angleCar += 4;
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
    runCar: function(input, dt){
        var output = this.GAs.population[this.currentIndividual].individual.forprop(input);

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
    },
    updateResult: function(){
        //this.GAs.population[this.currentIndividual].fitness = this.s/this.timeout + this.timeout/10;
        var addValue = 0;
        if(this.timeTurn >= 30){
            addValue -= 100;
        }
        if(this.die){
            addValue -= 50;
        }
        this.die = false;
        this.timeout = 0;
        this.timeTurn = 0;
        this.checkTurn = false;
        this.s = 0;
        for(var i = 0; i < 7; i++){
            this.posRadar[i].distance = 100;
        }
        //var indexT = 0;//this.randomInteger(0,3);
        //cc.log(indexT);
        if(this.indexI >= 3){
            this.GAs.population[this.currentIndividual].fitness = this.fitnessValue;
            if(this.GAs.population[this.currentIndividual].fitness !== this.GAs.population[this.currentIndividual].fitness) {
                cc.log("NaN: " + this.timeout);
                cc.log("Individual: " + this.currentIndividual);
                cc.log("TimeTurn: " + this.timeTurn);
                cc.log(this.posRadar);
            }
            this.textResult.setString("Individual: " + this.currentIndividual);
            this.textFitness.setString("Fitness: " + this.GAs.population[this.currentIndividual].fitness);
            this.indexI = 0;
            this.fitnessValue = 0;
        }
        else{
            this.fitnessValue += addValue - Math.sqrt(Math.pow((this.carSprite.x-this.xO[this.indexI]),2)+Math.pow((this.carSprite.y-this.yO[this.indexI]),2)) - this.timeout;
            this.indexI++;
        }

        this.carSprite.x = this.xI[this.indexI];
        this.carSprite.y = this.yI[this.indexI];
        //this.carSprite.rotation = ;
        this.angleCar = this.angleI[this.indexI];
        this.destinationSprite.clear();
        this.destinationSprite.drawCircle(cc.p(this.xO[this.indexI], this.yO[this.indexI]), 3, 0.3, 15, false, 7, cc.color(0,250,255));
        this.velocityCar = 0;
        if(this.indexI != 0){
            return;
        }
        this.currentIndividual++;
        if(this.currentIndividual >= this.GAs.sizePop){
            this.currentIndividual = 0;
            this.GAs.evolve();
            cc.log("Generation: " + this.GAs.generation);
            this.textGeneration.setString("Generation: " + this.GAs.generation);
            this.textHighestFitness.setString("Highest Fitness: " + this.GAs.highestFitness);
        }
    },
    testIndividual: function(dt){
        this.timeout += dt*10;
        if(this.checkTurn)
            this.timeTurn +=dt*10;
        //cc.log(this.timeout);
        var input = this.posRadar.map(function(a) {return a.distance;});
        var deltaAngleDirection = this.getDeltaAngle();
        if(deltaAngleDirection > 180)
            deltaAngleDirection -= 360;
        if(deltaAngleDirection < -180)
            deltaAngleDirection += 360;
        this.carSprite.setDirectionAngle(deltaAngleDirection*Math.PI/180);

        input.push(deltaAngleDirection);
        var middleAngleIndex = deltaAngleDirection/30 + 3;
        //cc.log(deltaAngleDirection);
        var checkL = false;
        var checkR = false;
        if(deltaAngleDirection > 90 || deltaAngleDirection < -90){
            if(deltaAngleDirection > 90)
                middleAngleIndex -= 6;
            else
                middleAngleIndex += 6;
            //cc.log(middleAngleIndex);
            for(var k = 0; k < 7; k++){
                if(k < middleAngleIndex){               //Right
                    if(this.posRadar[k].distance < 30){     //Wall

                    } else {                                //No Wall
                        if(this.freeRight < (30*k)){
                            this.freeRight = 30*k;
                            break;
                        }
                    }
                } else {                                //Left
                    if(this.posRadar[k].distance < 30){     //Wall

                    } else {                                //No Wall
                        if(this.freeLeft < (30*(k-middleAngleIndex)))
                            this.freeLeft = 30*(k-middleAngleIndex);
                    }
                }
            }
            //cc.log([1,this.freeLeft, this.freeRight]);
        } else {
            for(var k = 0; k < 7; k++){
                if(k < middleAngleIndex){               //Left
                    if(this.posRadar[k].distance < 30){     //Wall

                    } else {                                //No Wall
                        this.freeLeft = 180 - 30*(middleAngleIndex - k);
                        checkL = true;
                    }
                } else {                                //Right
                    if(this.posRadar[k].distance < 30){     //Wall

                    } else {                                //No Wall
                        this.freeRight = 180 - 30*(k - middleAngleIndex);
                        checkR = true;
                        break;
                    }
                }
            }
            if(middleAngleIndex > 0 && !checkL && this.freeLeft > (180 - 30*middleAngleIndex)){
                this.freeLeft = 180 - 30*middleAngleIndex;
            }
            if(middleAngleIndex < 6 && !checkR && this.freeRight > (180 - 30*(6-middleAngleIndex))){
                this.freeRight = 180 - 30*(6-middleAngleIndex);
            }
            //cc.log([0,this.freeLeft, this.freeRight]);
        }

        input.push(this.freeLeft);
        input.push(this.freeRight);
        //cc.log([this.freeLeft, this.freeRight]);
        //cc.log(input);
        this.runCar(input, dt);


        var distanceCheck = (Math.pow((this.carSprite.x-this.xO[this.indexI]),2)+Math.pow((this.carSprite.y-this.yO[this.indexI]),2));
        if(this.timeTurn > 30 || this.timeout > 200 || distanceCheck < 10000){//|| this.timeout > 200
            this.updateResult();
            return;
        }
        for(var i = 0; i < this.posRadar.length; i++){
            if(this.posRadar[i].distance < 20){
                this.die = true;
                this.updateResult();
            }
        }
    },
    autoRun:function(numOfGeneration){
        cc.log("Start auto run: " + numOfGeneration);
        this.unscheduleUpdate();
        cc.log("Current generation: " + this.GAs.generation);
        for(var i = 0; i < this.lineArray.length; i++){
            this.lineArray[i].setVisible(false);
        }
        var desGeneration = this.GAs.generation + numOfGeneration;
        while(desGeneration > this.GAs.generation){
            this.carSprite.rotation = this.angleCar;
            if(this.velocityCar != 0){
                this.carSprite.x += this.velocityCar*0.016*Math.sin(Math.PI*this.angleCar/180);
                this.carSprite.y += this.velocityCar*0.016*Math.cos(Math.PI*this.angleCar/180);
            }
            this.resetRadar();
            for(var i = 0; i < this.lineArray.length; i++){
                this.scanRadar(this.lineArray[i].a,this.lineArray[i].b,this.lineArray[i].minX,this.lineArray[i].maxX);
            }
            //this.drawRadar();
            this.testIndividual(0.016);
        }
        cc.log("End auto run");
        this.scheduleUpdate();
    },
    forwardToIndividual: function(num){
        if(this.currentIndividual >= num){
            cc.log("Please choose larger position");
            return;
        }
        cc.log("Start auto run: " + num);
        this.unscheduleUpdate();
        cc.log("Current individual: " + this.currentIndividual);
        //var desGeneration = this.GAs.generation + numOfGeneration;
        while(num > this.currentIndividual){
            this.carSprite.rotation = this.angleCar;
            if(this.velocityCar != 0){
                this.carSprite.x += this.velocityCar*0.016*Math.sin(Math.PI*this.angleCar/180);
                this.carSprite.y += this.velocityCar*0.016*Math.cos(Math.PI*this.angleCar/180);
            }
            this.resetRadar();
            for(var i = 0; i < this.lineArray.length; i++){
                this.scanRadar(this.lineArray[i].a,this.lineArray[i].b,this.lineArray[i].minX,this.lineArray[i].maxX);
            }
            //this.drawRadar();
            this.testIndividual(0.016);
        }
        cc.log("End auto run");
        this.scheduleUpdate();
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
        //this.drawFreeAngle(cc.p(this.carSprite.x,this.carSprite.y), 60, this.angleCar-this.freeLeft, this.angleCar+this.freeRight, 5);
        this.testIndividual(dt);
    },
    randomInteger: function(min,max)
    {
        //cc.log(min + " " + max);
        return Math.floor(Math.random()*(max-min+1)+min);
    },
    getDeltaAngle: function(){
        if(this.carSprite.x == this.xO[this.indexI]){
            if(this.carSprite.y > this.yO[this.indexI]){
                return (180 - this.angleCar);
            } else {
                return (-this.angleCar);
            }
        } else {
            var goc = -90+Math.atan(-(this.carSprite.y-this.yO[this.indexI])/(this.carSprite.x-this.xO[this.indexI]))*180/Math.PI;
            //cc.log("Goc: "+ goc);
            if(this.carSprite.x > this.xO[this.indexI])
                return (goc-this.angleCar);
            else
                return (180+goc-this.angleCar);
        }
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

