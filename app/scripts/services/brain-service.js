'use strict';

/**
 * @ngdoc service
 * @name doseAiApp.brainService
 * @description
 * # brainService
 * Service in the doseAiApp.
 */
angular.module('doseAiApp')
    .service('brainService', function (algorithmService) {
        var initialDoseAI = new brain.NeuralNetwork({
            hiddenLayers: [2, 7],
            learningRate: 0.6
        });
        initialDoseAI.fromJSON(loadBrain());

        return {
            sampleXorAI: sampleXorAI,
            trainAIForInitialDose: trainAIForInitialDose,
            calculateInitialDose: calculateInitialDose
        };

        function sampleXorAI(numbers) {
            var net = new brain.NeuralNetwork();

            var xor = [
                { input: [0, 0], output: [0]},
                { input: [0, 1], output: [1]},
                { input: [1, 0], output: [1]},
                { input: [1, 1], output: [0]}];

            net.train(xor);

            return net.run(numbers);
        }

        function calculateInitialDose(age, isBlack, isSmoker, height, weight, isDvtPe, isUsingAmiodarone) {
            return initialDoseAI.run({
                age: transformAgeToFraction(age),
                height: transformHeightToFraction(height),
                weight: transformWeightToFraction(weight),
                isBlack: isBlack,
                isSmoker: isSmoker,
                isDvtPe: isDvtPe,
                isUsingAmiodarone: isUsingAmiodarone
            });
        }

        function trainAIForInitialDose() {
            var options = {
                errorThresh: 0.0001,  // error threshold to reach
                iterations: 20000,   // maximum training iterations
                log: true,           // console.log() progress periodically
                logPeriod: 100,       // number of iterations between logging
                learningRate: 0.2    // learning rate
            };

            var data = buildTestData();

            initialDoseAI.train(data, options);
        }

        function buildTestData() {
            var patientDataList = [];

            for (var i = 0; i < 30000; i ++) {
                var age = getRandomNumberAndBetweenOneAndZero(18, 75);
                var height = getRandomNumberAndBetweenOneAndZero(120, 215);
                var weight = getRandomNumberAndBetweenOneAndZero(45, 135);
                var isBlack = getZeroOrOne();
                var isSmoker = getZeroOrOne();
                var isDvtPe = getZeroOrOne();
                var isUsingAmiodarone = getZeroOrOne();

                patientDataList.push({
                    input: {
                        age: age.betweenZeroAndOne,
                        height: height.betweenZeroAndOne,
                        weight: weight.betweenZeroAndOne,
                        isBlack: isBlack,
                        isSmoker: isSmoker,
                        isDvtPe: isDvtPe,
                        isUsingAmiodarone: isUsingAmiodarone
                    },
                    output: {dose: (algorithmService.calculateInitialDose(age.originalNumber, isBlack, isSmoker, height.originalNumber, weight.originalNumber, isDvtPe, isUsingAmiodarone) / 25)}
                });
            }

            return patientDataList;
        }

        function transformHeightToFraction(height) {
            return +(height / 215).toFixed(2);
        }

        function transformWeightToFraction(weight) {
            return +(weight / 135).toFixed(2);
        }

        function transformAgeToFraction(age) {
            return +(age / 75).toFixed(2);
        }

        function loadBrain() {
            return {layers:[{age:{},height:{},weight:{},isBlack:{},isSmoker:{},isDvtPe:{},isUsingAmiodarone:{}},{0:{bias:16.08536518276964,weights:{age:8.673184195513091,height:-12.990495535818996,weight:-8.545224705622237,isBlack:-2.403855078426348,isSmoker:-1.6637828450964898,isDvtPe:-1.193519521259943,isUsingAmiodarone:3.932674902556917}},1:{bias:2.9829944505646107,weights:{age:3.0991848995909277,height:-4.312243157096933,weight:-3.01487363782355,isBlack:-0.8620514842686487,isSmoker:-0.5844639393972311,isDvtPe:-0.4356227855458696,isUsingAmiodarone:1.423778738850274}}},{0:{bias:-0.749944505297956,weights:{0:-13.407831417391387,1:16.64812501081169}},1:{bias:5.330961003596281,weights:{0:-46.68335520659496,1:-8.844681975234332}},2:{bias:-1.7428541716310302,weights:{0:-6.836138096035348,1:26.91281831097983}},3:{bias:3.9563055819426225,weights:{0:-0.4521673652576925,1:-4.914310951366413}},4:{bias:-5.990342210947632,weights:{0:-3.6064504511280115,1:16.57910346515993}},5:{bias:-1.0860761057191235,weights:{0:-4.286023806297383,1:-0.8400172900637195}},6:{bias:-32.04210085785776,weights:{0:32.11362525299324,1:23.81914517753267}}},{dose:{bias:4.308580456165659,weights:{0:-2.167011040074872,1:0.8224674965757526,2:-0.8126636771448044,3:-5.408208438263825,4:-2.0010786565423664,5:3.0145878193034106,6:-0.429387736312528}}}],outputLookup:true,inputLookup:true};

        }

        function getRandomNumberAndBetweenOneAndZero(min, max) {
            var randomInt = getRandomInt(min, max);

            return {originalNumber: randomInt, betweenZeroAndOne: +(randomInt / max).toFixed(2)};
        }

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function getZeroOrOne() {
            return Math.round(getRandomInt(0, 1));
        }

    });