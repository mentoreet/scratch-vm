const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

class Scratch3MlBlocks {
    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'mlblocks',
            name: 'ML Blocks',
            blocks: [
                {
                    opcode: 'sendTextToAI',
                    blockType: BlockType.REPORTER,
                    text: 'AI에게 텍스트 전달하기 [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "hello"
                        }
                    }
                },
                {
                    opcode: 'sendImageToAI',
                    blockType: BlockType.REPORTER,
                    text: 'AI에게 사진찍어 보내기'
                },{
                    opcode: 'select1Of2',
                    blockType: BlockType.REPORTER,
                    text: '[TEXT1], [TEXT2] 중에 하나 고르기',
                    arguments: {
                        TEXT1: {
                            type: ArgumentType.STRING,
                            defaultValue: "항목1"
                        },
                        TEXT2: {
                            type: ArgumentType.STRING,
                            defaultValue: "항목2"
                        }
                    }
                },                
                {
                    opcode: 'select1Of3',
                    blockType: BlockType.REPORTER,
                    text: '[TEXT1], [TEXT2], [TEXT3] 중에 하나 고르기',
                    arguments: {
                        TEXT1: {
                            type: ArgumentType.STRING,
                            defaultValue: "항목1"
                        },
                        TEXT2: {
                            type: ArgumentType.STRING,
                            defaultValue: "항목2"
                        },
                        TEXT3: {
                            type: ArgumentType.STRING,
                            defaultValue: "항목3"
                        }
                    }
                },
                {
                    opcode: 'select1Of4',
                    blockType: BlockType.REPORTER,
                    text: '[TEXT1], [TEXT2], [TEXT3], [TEXT4] 중에 하나 고르기',
                    arguments: {
                        TEXT1: {
                            type: ArgumentType.STRING,
                            defaultValue: "항목1"
                        },
                        TEXT2: {
                            type: ArgumentType.STRING,
                            defaultValue: "항목2"
                        },
                        TEXT3: {
                            type: ArgumentType.STRING,
                            defaultValue: "항목3"
                        },
                        TEXT4: {
                            type: ArgumentType.STRING,
                            defaultValue: "항목4"
                        }
                    }
                }
            ],
            menus: {
            }
        };
    }

    sendTextToAI (args) {
        const text = Cast.toString(args.TEXT);
        log.log(text);
        var prediction = '';
        var data = new Object();
        //data.appid = "f355a6e9-fb53-4f93-9499-b7b7b089a682";
        //data.token = "c95f17a3-d79d-4295-8234-adcc32ae1c44";
        data.query = text;

        //http://127.0.0.1:9000/predict
        //{"appid":"79361a39-be99-4208-ac57-1bac9fc4e154","token":"241de7c8-f099-4088-af48-0cdfcf9d8dd8","query":"바보"}

        // parent에 postMessage 날리고,
        // 여기서는 이벤트 리스너 등록하고, 대기.

        var messageData = new Object();
        messageData.type = 'get';
        messageData.func = 'predict';
        messageData.data = text;
        parent.postMessage(messageData,"*");

        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
        // Listen to message from child window
        eventer(messageEvent, function (e) {
            console.log('iframe received message!:  ', e);
            console.log('e.origin ==>' + e.origin);
            console.log('e.data ==>' + e.data);
            /*
            if (~event.origin.indexOf('http://localhost:5060')) { 
                console.log('origin true'); 
                var jsonData = JSON.parse(e.data);
                console.log(jsonData);
                console.log(jsonData.prediction);
                prediction = jsonData.prediction;
                //return jsonData.prediction;
            } else { 
                console.log('origin false'); 
                //return '';
            } */
            var jsonData = JSON.parse(e.data);
            console.log(jsonData);
            console.log(jsonData.prediction);
            prediction = jsonData.prediction;
        }, false);

        var delay = function(time) {
            return new Promise(function(resolve, reject){
                setTimeout(resolve, time);
            });
        };

        // var Thread = {
        //     sleep: function(ms) {
        //        var start = Date.now();
               
        //        while (true) {
        //           var clock = (Date.now() - start);
        //           if (clock >= ms) break;
        //        }
               
        //     }
        // };

        // while(prediction === '')
        // {
        //     this.delay(1000);
        // }

        // return prediction;

        return delay(4000)
        .then(function(){
            return prediction;
        });
        

        // var timer = setInterval(function (){
        //     if (prediction != '')
        //     {
        //         console.log('setInterval - prediction ==> ' + prediction);
        //         clearInterval(timer);
        //         return prediction;
        //     }
        // }, 1000);  
        
        // return 'test';
    }

    sendImageToAI (args) {
        var prediction = '';
        // parent에 postMessage 날리고,
        // 여기서는 이벤트 리스너 등록하고, 대기.
        var messageData = new Object();
        messageData.type = 'get';
        messageData.func = 'predict_image';
        parent.postMessage(messageData,"*");

        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
        // Listen to message from child window
        eventer(messageEvent, function (e) {
            console.log('iframe received message!:  ', e);
            console.log('e.origin ==>' + e.origin);
            console.log('e.data ==>' + e.data);
           
            var jsonData = JSON.parse(e.data);
            console.log(jsonData);
            console.log(jsonData.prediction);
            prediction = jsonData.prediction;
        }, false);

        var delay = function(time) {
            return new Promise(function(resolve, reject){
                setTimeout(resolve, time);
            });
        };

        return delay(10000)
        .then(function(){
            console.log('return value =>' + prediction);
            return prediction;
        });        
    }

    select1Of4 (args) {
        const text1 = Cast.toString(args.TEXT1);
        const text2 = Cast.toString(args.TEXT2);
        const text3 = Cast.toString(args.TEXT3);
        const text4 = Cast.toString(args.TEXT4);
        log.log(text1 + "," + text2 + "," + text3 + "," + text4);
        var textArray = [text1, text2, text3, text4];
        var index = Math.floor((Math.random() * 10)) % 4;
        return textArray[index];
    }

    select1Of3 (args) {
        const text1 = Cast.toString(args.TEXT1);
        const text2 = Cast.toString(args.TEXT2);
        const text3 = Cast.toString(args.TEXT3);
        log.log(text1 + "," + text2 + "," + text3);
        var textArray = [text1, text2, text3];
        var index = Math.floor((Math.random() * 10)) % 3;
        return textArray[index];
    }

    select1Of2 (args) {
        const text1 = Cast.toString(args.TEXT1);
        const text2 = Cast.toString(args.TEXT2);
        log.log(text1 + "," + text2);
        var textArray = [text1, text2];
        var index = Math.floor((Math.random() * 10)) % 2;
        return textArray[index];
    }
}

module.exports = Scratch3MlBlocks;