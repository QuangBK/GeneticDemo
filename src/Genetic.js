/**
 * Created by Administrator on 1/3/2016.
 */
var Genetic = cc.Class.extend({
    population: [],
    sizePop: 20,//must even number
    inputNode : 7,
    outputNode : 3,
    hiddenNode : 15,
    totalScore: 0,
    probability: [],
    genLength: 0,
    generation : 1,
    highestFitness: 0,
    ctor: function() {
        this.setup();
        //this.population[50].individual.writeWeight();
        //this.population[20].individual.writeWeight();
    },
    setup: function(){
        this.genLength = (this.inputNode+1)*this.hiddenNode + (this.hiddenNode+1)*this.outputNode;
        for(var i = 0; i < this.sizePop; i++){
            this.totalScore += i+1;
            var tempData = this.seedRandom();
            var tempIndividual = new Network(this.inputNode,this.outputNode,this.hiddenNode);
            tempIndividual.setData(tempData);
            this.population.push({"individual" : tempIndividual,"fitness" : 0});
        }
        var sum = 0;
        for(var i = 0; i < this.sizePop; i++){
            this.probability.push(sum + (i+1)/this.totalScore);
            sum += (i+1)/this.totalScore;
        }
    },
    seedRandom: function() {
        var data = {};
        var W1 = [];
        var b1 = [];
        var W2 = [];
        var b2 = [];
        var i = 0;
        var j = 0;
        for (i = 0; i < this.hiddenNode; i++) {
            W1.push([]);
            b1.push(Math.random() * 1000 - 500);
            for (j = 0; j < this.inputNode; j++) {
                W1[i].push(Math.random() * 1000 - 500);
            }
        }
        for (i = 0; i < this.outputNode; i++) {
            W2.push([]);
            b2.push(Math.random() * 1000 - 500);
            for (j = 0; j < this.hiddenNode; j++) {
                W2[i].push(Math.random() * 1000 - 500);
            }
        }
        data["W1"] = W1;
        data["b1"] = b1;
        data["W2"] = W2;
        data["b2"] = b2;
        return data;
    },
    randomInteger: function(min,max)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    },
    comparator: function (a,b) {
        return a.fitness - b.fitness;
    },
    sortIndividual: function(){
        //var tempData = this.population[this.sizePop-1].fitness;
        this.population.sort(this.comparator);
        if(this.highestFitness > this.population[this.sizePop-1].fitness){
            cc.log("Something wrong");
            /*
            for(var k = 0; k < this.population.length; k++){
                cc.log(this.population[k].fitness);
            }
            */
            cc.log("Delta: " + (this.highestFitness - this.population[this.sizePop-1].fitness));
            //cc.log("Temp: " + tempData);
            //cc.log(this.population)
        }
        this.highestFitness = this.population[this.sizePop-1].fitness;
        //cc.log("Highest fitness: " + this.population[this.sizePop-1].fitness);
    },
    selectIndividual: function(){
        var temp = Math.random();
        for(var i = 0; i < this.sizePop; i++){
            if(temp < this.probability[i])
            return i;
        }
        return this.sizePop-1;
    },
    crossOver: function(){
        var individual1 = this.selectIndividual();
        var individual2 = this.selectIndividual();
        if(individual1 != individual2){
            var gen1 = this.population[individual1].individual.encode();
            var gen2 = this.population[individual2].individual.encode();
            var crossOverPoint = this.randomInteger(1, gen1.length-1);
            var newGen1 = [];
            var newGen2 = [];
            for(var i = 0; i < gen1.length; i++){
                if(i < crossOverPoint){
                    newGen1.push(gen1[i]);
                    newGen2.push(gen2[i]);
                } else {
                    newGen1.push(gen2[i]);
                    newGen2.push(gen1[i]);
                }
            }
            return [newGen1, newGen2];
        } else {
            var gen12 = this.population[individual1].individual.encode();
            return [gen12, gen12];
        }
    },
    evolve: function(){
        this.sortIndividual();
        this.generation++;
        var newGenPopulation = [];
        for(var i = 0; i < Math.round(this.sizePop/2); i++){
            //var newIndividual1 = new Network(this.inputNode,this.outputNode,this.hiddenNode);
            //var newIndividual2 = new Network(this.inputNode,this.outputNode,this.hiddenNode);
            var new2Gen = this.crossOver();
            newGenPopulation.push(new2Gen[0]);
            newGenPopulation.push(new2Gen[1]);
            //newIndividual1.decode(new2Gen[0]);
            //newIndividual2.decode(new2Gen[1]);
            //newPopulation.push({"individual" : newIndividual1,"fitness" : 0});
            //newPopulation.push({"individual" : newIndividual2,"fitness" : 0});
        }
        var numCrossover = 0;
        for(var i = 0; i < this.sizePop-2; i++){
            if(Math.random() < 0.1){
                for(var k = 0; k < newGenPopulation[0].length; k++){
                    if(Math.random() < 0.2){
                        newGenPopulation[i][k]= Math.random()*1000 - 500;
                        numCrossover++;
                    }
                }
            }
            /*
             while(Math.random() < 0.2){
             var mutePoint = this.randomInteger(0, newGenPopulation[0].length-1);
             newGenPopulation[i][mutePoint]= Math.random()*1000 - 500;
             numCrossover++;
             }
            */
            this.population[i].individual.decode(newGenPopulation[i]);
            //this.population[i].fitness = 0;
        }
        //cc.log("numCrossover: " + numCrossover);
    }
});