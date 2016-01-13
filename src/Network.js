/**
 * Created by Administrator on 1/2/2016.
 */
var Network = cc.Class.extend({
    inputNode : 2,
    outputNode : 1,
    hiddenNode : 6,
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
            this.X.push(Math.random());
        }
        for	(i = 0; i < this.hiddenNode; i++) {
            this.W1.push([]);
            this.b1.push(Math.random());
            for	(j = 0; j < this.inputNode; j++) {
                this.W1[i].push(Math.random());
            }
        }
        for	(i = 0; i < this.outputNode; i++) {
            this.Y.push(Math.random());
            this.W2.push([]);
            this.b2.push(Math.random());
            for	(j = 0; j < this.hiddenNode; j++) {
                this.W2[i].push(Math.random());
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
    sub: function(vector1, vector2){
        var temp = [];
        for(var i = 0; i < vector1.length; i++){
            temp.push(vector1[i] - vector2[i]);
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
    sigmoidAndDerivation: function(vector){
        var temp = [];
        var dh = [];
        for(var i = 0; i < vector.length; i++){
            var a = 1/(1+Math.pow(Math.E, -vector[i]));
            temp.push(a);
            dh.push(a*(1-a));
        }
        return [temp, dh];
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
    MapIndexedVector: function(r,funcIndex){
        var temp = [];
        for(var i = 0; i < r; i++){
            temp.push(funcIndex(i));
        }
        return temp;
    },
    MapIndexedInPlace: function(r,c, funcIndex){
        var temp = [];
        for(var i = 0; i < r; i++){
            var tArray = [];
            for(var j = 0; j < c; j++){
                tArray.push(funcIndex(i,j));
            }
            temp.push(tArray);
        }
        return temp;
    },
    backProp: function(alpha, W1grad, b1grad, W2grad, b2grad){
        var funcW1 = function(i,j){
            return this.W1[i][j] - alpha*W1grad[i][j];
        }.bind(this);
        this.W1 = this.MapIndexedInPlace(this.W1.length, this.W1[0].length, funcW1);
        var funcW2 = function(i,j){
            return this.W2[i][j] - alpha*W2grad[i][j];
        }.bind(this);
        this.W2 = this.MapIndexedInPlace(this.W2.length, this.W2[0].length, funcW2);
        var funcB1 = function(i){
            return this.b1[i] - alpha*b1grad[i];
        }.bind(this);
        this.b1 = this.MapIndexedVector(this.b1.length, funcB1);
        var funcB2 = function(i){
            return this.b2[i] - alpha*b2grad[i];
        }.bind(this);
        this.b2 = this.MapIndexedVector(this.b2.length, funcB2);
    },
    forPropForBackProp: function(dataInput, dataOutput){
        this.X = dataInput;
        var h1 = dataInput;
        var temp = this.dot(this.W1, dataInput);
        temp = this.add(temp, this.b1);

        var k2 = this.sigmoidAndDerivation(temp);// [h,dh]
        temp = this.dot(this.W2, k2[0]);
        temp = this.add(temp, this.b2);
        var k3 = this.sigmoidAndDerivation(temp);
        var diff = this.sub(k3[0], dataOutput);
        var funcJ = function(i){
            var temp = k3[0][i] - dataOutput[i];
            return temp*temp;
        };
        var J = this.MapIndexedVector(k3[0].length, funcJ);
        var funcB2 = function(i){
            return k3[1][i]*2*diff[i];
        };
        var b2grad = this.MapIndexedVector(this.b2.length, funcB2);
        var funcW2 = function(i,j){
            return b2grad[i]*k2[0][j];
        };
        var W2grad = this.MapIndexedInPlace(this.W2.length, this.W2[0].length,funcW2);
        var funcB1 = function(r){
            var value = 0;
            for(var i = 0; i < b2grad.length; i++){
                value += b2grad[i]*this.W2[i][r]*k2[1][r];
            }
            return value;
        }.bind(this);
        var b1grad = this.MapIndexedVector(this.b1.length,funcB1);
        var funcW1 = function(i,j){
            return b1grad[i]*dataInput[j];
        };
        var W1grad = this.MapIndexedInPlace(this.W1.length, this.W1[0].length, funcW1);

        this.backProp(0.2, W1grad, b1grad, W2grad, b2grad);
        /*
         b2grad.MapIndexedInplace((i, j, c) => dh3[i, 0] * 2 * diff[i, 0]);
         W2grad.MapIndexedInplace((i, j, c) => b2grad[i, 0] * h2[j, 0]);
         b1grad.MapIndexedInplace((i, j, c) => factorb1grad(i, j));
         W1grad.MapIndexedInplace((i, j, c) => b1grad[i, 0] * data[j, 0]);


        h1 = Xi;
        temp = dot(W1, Xi)
        temp = add(temp, b1)
            [h2, dh2] = sigmoid(temp) # activation at layer 1, and its derivative
        temp = dot(W2, h2)
        temp = add(temp, b2)
            [h3, dh3] = sigmoid(temp) # activation at layer 2, and its derivative

        diff = (h3[0] - Yi)
        J = diff * diff;

        return [J, diff, h1, h2, dh2, h3, dh3]
        */
        //return t1;
    },
    forPropForCheck: function(X,Y,W1,W2,b1,b2){
        var h1 = X;
        var temp = this.dot(W1, X);
        temp = this.add(temp, b1);

        var k2 = this.sigmoidAndDerivation(temp);// [h,dh]
        temp = this.dot(W2, k2[0]);
        temp = this.add(temp, b2);
        var k3 = this.sigmoidAndDerivation(temp);
        var diff = this.sub(k3[0], Y);
        var funcJ = function(i){
            var temp = k3[0][i] - Y[i];
            return temp*temp;
        };
        var J = this.MapIndexedVector(k3[0].length, funcJ);
        return J;
    },
    checkGrad: function(dataInput, dataOutput){
        this.X = dataInput;
        var h1 = dataInput;
        var temp = this.dot(this.W1, dataInput);
        temp = this.add(temp, this.b1);

        var k2 = this.sigmoidAndDerivation(temp);// [h,dh]
        temp = this.dot(this.W2, k2[0]);
        temp = this.add(temp, this.b2);
        var k3 = this.sigmoidAndDerivation(temp);
        var diff = this.sub(k3[0], dataOutput);
        var funcJ = function(i){
            var temp = k3[0][i] - dataOutput[i];
            return temp*temp;
        };
        var J = this.MapIndexedVector(k3[0].length, funcJ);
        var funcB2 = function(i){
            return k3[1][i]*2*diff[i];
        };
        var b2grad = this.MapIndexedVector(this.b2.length, funcB2);
        var funcW2 = function(i,j){
            return b2grad[i]*k2[0][j];
        };
        var W2grad = this.MapIndexedInPlace(this.W2.length, this.W2[0].length,funcW2);
        var funcB1 = function(r){
            var value = 0;
            for(var i = 0; i < b2grad.length; i++){
                value += b2grad[i]*this.W2[i][r]*k2[1][r];
            }
            return value;
        }.bind(this);
        var b1grad = this.MapIndexedVector(this.b1.length,funcB1);
        var funcW1 = function(i,j){
            return b1grad[i]*dataInput[j];
        };
        var W1grad = this.MapIndexedInPlace(this.W1.length, this.W1[0].length, funcW1);

        cc.log("b2grad: " + b2grad);
        cc.log("W2grad: " + W2grad);
        cc.log("b1grad: " + b1grad);
        cc.log("W1grad: " + W1grad);
        cc.log("J: " + J);
        //Check grad
        var epsilon = 0.001;
        var tolerance = epsilon;
        var checkW2 = function(i,j){
            var newW2 = jQuery.extend(true, {}, this.W2);
            newW2[i][j] += epsilon;
            var newJ = this.forPropForCheck(dataInput,dataOutput, this.W1, newW2, this.b1, this.b2);
            var subH = 0;
            for(var l = 0; l < newJ.length; l++){
                subH += Math.abs(newJ[l]-J[l]);
            }
            subH = subH/epsilon - W2grad[i][j];
            cc.log(subH);
            if(subH > epsilon){
                cc.log("Error");
                //cc.log(i);
                //cc.log(j);
            }
        }.bind(this);
        this.MapIndexedInPlace(this.W2.length, this.W2[0].length, checkW2);
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