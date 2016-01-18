/**
 * Created by Administrator on 1/13/2016.
 */
var GraphTest = cc.Layer.extend({
    ANN: null,
    ctor:function () {
        this._super();
        this.ANN = new Network(2,1,6);
        //this.ANN.writeWeight();
        if( 'keyboard' in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed:function(key, event) {
                    var target = event.getCurrentTarget();
                    cc.log("Key: " + key);
                    switch(key) {
                        case 77:    //m
                            //var data = {"key" : 1};
                            cc.log(target.ANN.W1);
                            $.post( "http://localhost:3000/api/sendData", {"W2": target.ANN.W2,"b1": target.ANN.b1,"b2": target.ANN.b2});
                            break;
                        case 49:
                            target.testDemo();
                            break;
                        case 50:
                            target.testDemo1();
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
        //this.scheduleUpdate();
        return true;
    },
    testDemo: function(){
        cc.log("Begin");
        for(var i = 0; i < 10000; i++){
            var randNumX = Math.random()*1000 - 100;
            var randNumY = Math.random()*600;
            var outPut = 0;
            if(randNumY < this.funcTest(randNumX)){
                outPut = 1;
                cc.log("XXXX");
            }
            var dataTemp = [(randNumX+100)*4/1000, randNumY*4/600];
            this.ANN.forPropForBackProp(dataTemp, [outPut]);
        }
        //this.ANN.writeWeight();
        cc.log("Done");
        var graphDemo = new cc.DrawNode();
        for(var i = 0; i < 500; i++){
            var randNumX = Math.random()*1000 - 100;
            var randNumY = Math.random()*600;
            var result = this.ANN.forprop([(randNumX+100)*4/1000, randNumY*4/600]);
            if(result[0] < 0.5){
                //cc.log(randNumX);
                graphDemo.drawCircle(cc.p(randNumX, randNumY), 2, 0.3, 4, false, 7, cc.color(0,250,0));
            } else {
                graphDemo.drawCircle(cc.p(randNumX, randNumY), 2, 0.3, 4, false, 7, cc.color(255,0,0));
            }
        }
        this.addChild(graphDemo,1);
        cc.log("Draw Done");
    },
    testDemo1: function(){
        /*
        var W1 = [[0.7611729970667511,0.9843872827477753],
            [0.6247300098184496,0.9328937255777419],
            [0.6916288626380265,0.9645904337521642],
            [0.5007559519726783,0.6584333032369614],
            [0.29912337963469326,0.28175613679923117],
            [0.15201475284993649,0.7324055973440409]];
        var W2 = [[0.9154521955642849,0.8429607336875051,0.7583208826836199,0.6701189577579498,0.2014215188100934,0.7151281079277396]];
        var b1 = [0.7337655774317682,0.27715299371629953,0.8913417859002948,0.9429648565128446,0.47053662431426346,0.23506182059645653];
        var b2 = [0.9470303524285555];
        this.ANN.setData({"W1": W1, "W2": W2, "b1": b1, "b2": b2});
        this.ANN.forPropForBackProp([0.3, 0.7],[1]);
        */
        this.ANN.writeWeight();
    },
    funcTest : function(x){
        return  -4/625*x*x + 5.12*x - 624;
    },
    randomInteger: function(min,max)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    },
    update: function(dt){

    }
});