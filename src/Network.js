/**
 * Created by Administrator on 1/2/2016.
 */
var Network = cc.Class.extend({
    inputNode : 2,
    outputNode : 1,
    hiddenNode : 3,
    X : [],
    W1 : [],
    b1 : [],
    W2 : [],
    b2 : [],
    Y : [],
    ctor: function(iN, oN, hN){
        this.X = [];
        this.W1 = [];
        this.b1 = [];
        this.W2 = [];
        this.b2 = [];
        this.Y = [];
        this.inputNode = iN;
        this.outputNode = oN;
        this.hiddenNode = hN;
        this.setup();
    },
    setup: function(){
        var i = 0;
        var j = 0;
        for	(i = 0; i < this.inputNode; i++) {
            this.X.push(0);
        }
        for	(i = 0; i < this.hiddenNode; i++) {
            this.W1.push([]);
            this.b1.push(0);
            for	(j = 0; j < this.inputNode; j++) {
                this.W1[i].push(0);
            }
        }
        for	(i = 0; i < this.outputNode; i++) {
            this.Y.push(0);
            this.W2.push([]);
            this.b2.push(0);
            for	(j = 0; j < this.hiddenNode; j++) {
                this.W2[i].push(0);
            }
        }
    },
    setData: function(data){
        this.W1 = data["W1"];
        this.b1 = data["b1"];
        this.W2 = data["W2"];
        this.b2 = data["b2"];
    },
    dot: function(mMatrix, vVector){
        var temp = [];
        for(var i = 0; i < mMatrix.length; i++){
            var tArray = 0;
            for(var j = 0; j < vVector.length; j++){
                tArray += vVector[j]*mMatrix[i][j];
            }
            temp.push(tArray);
        }
        return temp;
    },
    add: function(vector1, vector2){
        var temp = [];
        for(var i = 0; i < vector1.length; i++){
            temp.push(vector1[i] + vector2[i]);
        }
        return temp;
    },
    sigmoid: function(vector){
        var temp = [];
        for(var i = 0; i < vector.length; i++){
            temp.push(1/(1+Math.pow(Math.E, -vector[i])));
        }
        return temp;
    },
    forprop: function(dataInput){
        this.X = dataInput;
        var t1 = this.dot(this.W1, this.X);
        t1 = this.add(t1, this.b1);
        t1 = this.sigmoid(t1);

        t1 = this.dot(this.W2, t1);
        t1 = this.add(t1, this.b2);
        t1 = this.sigmoid(t1);
        return t1;
    },
    encode:function(){
        var gen = [];
        var i = 0;
        var j = 0;
        for(i = 0; i < this.W1.length; i++){
            for(j = 0; j < this.W1[i].length; j++){
                gen.push(this.W1[i][j]);
            }
        }

        for(i = 0; i < this.b1.length; i++){
            gen.push(this.b1[i]);
        }

        for(i = 0; i < this.W2.length; i++){
            for(j = 0; j < this.W2[i].length; j++){
                gen.push(this.W2[i][j]);
            }
        }

        for(i = 0; i < this.b2.length; i++){
            gen.push(this.b2[i]);
        }

        if(gen.length != (10*16+16+16*3+3)){
            cc.log("Wrong Encode: " + gen.length);
            cc.log("Wrong Encode: " + this.W1.length);
            cc.log("Wrong Encode: " + this.b1.length);
            cc.log("Wrong Encode: " + this.W2.length);
            cc.log("Wrong Encode: " + this.b2.length);
        }
        return gen;
    },
    decode: function(gen){
        var i = 0;
        var j = 0;
        var index = 0;
        for(i = 0; i < this.W1.length; i++){
            for(j = 0; j < this.W1[i].length; j++){
                this.W1[i][j] = gen[index];
                index++;
            }
        }
        for(i = 0; i < this.b1.length; i++){
            this.b1[i] = gen[index];
            index++;
        }
        for(i = 0; i < this.W2.length; i++){
            for(j = 0; j < this.W2[i].length; j++){
                this.W2[i][j] = gen[index];
                index++;
            }
        }
        for(i = 0; i < this.b2.length; i++){
            this.b2[i] = gen[index];
            index++;
        }
        if(index != (10*16+16+16*3+3))
            cc.log("Wrong decode: " + gen.length);
    },
    writeWeight: function(){
        cc.log("X: ");
        cc.log(this.X);
        cc.log("W1: ");
        cc.log(this.W1);
        cc.log("b1: ");
        cc.log(this.b1);
        cc.log("W2: ");
        cc.log(this.W2);
        cc.log("b2: ");
        cc.log(this.b2);
        cc.log("Y: ");
        cc.log(this.Y);
    }
});