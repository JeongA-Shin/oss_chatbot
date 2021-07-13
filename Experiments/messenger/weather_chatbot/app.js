var express = require('express');//express 모듈을 사용
var qs = require('querystring')
const request = require('request');//request 모듈을 사용
const TARGET_URL = 'https://api.line.me/v2/bot/message/reply'
const fs = require('fs')
var NOW = new Date()
var YEAR = NOW.getFullYear()
var MONTH= NOW.getMonth()+1
var DATE= NOW.getDate();
var NOWDATE= YEAR.toString().padStart(4, '0') + MONTH.toString().padStart(2, '0') + DATE.toString().padStart(2, '0')
var WEATHER_URL=`http://apis.data.go.kr/1360000/VilageFcstInfoService/getVilageFcst?serviceKey=StHx15%2FPZFKIJvR5AtCu8uyowAtnEYHpAXR%2B5XYYN6OWDt%2BCz15z%2Fxn%2FDiV%2FLN9%2BY5YSPZUPUnCq982CiBupmw%3D%3D&numOfRows=1000&pageNo=1&base_date=${NOWDATE}&base_time=0230&nx=60&ny=120&dataType=JSON`

var region = JSON.parse(fs.readFileSync('region.json', 'utf8'));

const TOKEN = 'RbPAXRYWub0evg2yyi7oiHytZsZsE0JtbZgRYZNZDU1vjpJkOwGqwh+aKTYKVhVHh6LZOUVZLl84NQQlNWNbXR9hUhPEiLEK0cie4O3OlKUuEe/3wAsjPu7HbRi1zn9BsR3Qr4pcqmiIKP8HRUKvEwdB04t89/1O/w1cDnyilFU='

const path = require('path');
const HTTPS = require('https');
const domain = "www.osschat.tk"
const sslport = 23023;
const bodyParser = require('body-parser');
var app = express();
var premessage='premessage'
//var check = false


app.use(bodyParser.json());

fs.readFile('region.json', 'utf8', function(err, data){
        console.log(data);
    });



app.post('/hook', function (req, res) {

    var eventObj = req.body.events[0];
    var source = eventObj.source;
    var message = eventObj.message;

    // request log
    console.log('======================', new Date() ,'======================');
    console.log('[request]', req.body);
    console.log('[request source] ', eventObj.source);
    console.log('[request message]', eventObj.message);

    //if (check == false){
    start(eventObj.replyToken, eventObj.message.text)//}
    //else{
    info(eventObj.replyToken, eventObj.message.text)//}

    

    res.sendStatus(200);
});



function info (replyToken, message){ 

   /* if(check==false)
    {
        return
    }
    */
    
    
   // if(check == true)
    //{
        var s = message.split(' ');
        var m= false

        for(i=0; i<region.length; i++){
            if (s[0] == region[i].l1 && s[1]== region[i].l2 && s[2]==region[i].l3)
            {
                m= true
                var rx=region[i].x
                var ry=region[i].y
                WEATHER_URL = `http://apis.data.go.kr/1360000/VilageFcstInfoService/getVilageFcst?serviceKey=StHx15%2FPZFKIJvR5AtCu8uyowAtnEYHpAXR%2B5XYYN6OWDt%2BCz15z%2Fxn%2FDiV%2FLN9%2BY5YSPZUPUnCq982CiBupmw%3D%3D&numOfRows=1000&pageNo=1&base_date=${NOWDATE}&base_time=0230&nx=${rx}&ny=${ry}&dataType=JSON`

            }
        }
        //if(m == false){
            //return
        //}
   // }
      request.get(
      {
       url:WEATHER_URL,
       json:true
    },(error, response, body) => {
        if(!error && response.statusCode == 200) {
            console.log(body.message);
            var rainMessage = "우산을 굳이 챙길 필요가 없습니다. "
            for(var item of body.response.body.items.item) {
                if(item.category == 'POP') {
                    if(item.fcstValue >= 50) {
                        rainMessage = "꼭! 우산을 챙기세요. ";
                    }                    
                 }
                 if(item.category == 'WSD'){
                     if(item.fcstValue < 8 ){
                         var windmessage ="기분이 좋을 정도의 바람입니다."
                     }else if(item.fcstValue>=8 && item.fcstVaule <14){
                         var windmessage =" 바람이 강한 편입니다."
                     }else{
                         var windmessage ="바람이 매우 강합니다. 야외활동을 자제해주세요"
                     }
                 }
                 if (item.category == 'REH'){
                     if(item.fcstValue < 30){
                         var watermessage = "너무 건조합니다."
                     }else if(item.fcstValue<=70 && item.fcstValue >=40){
                         var watermessage="습도는 적당합니다."
                     }else{
                         var watermessage =" 너무 습합니다."
                     }
                 }
                    if(item.category == 'TMX') {
                        if(item.fcstValue>=28){
                            var clothesMessage = `날씨가 매우 덥습니다. 건강에 유의해주세요. 추천 옷: 민소매, 반팔, 반바지, 여름용 치마, 린넨 소재의 옷`
                        }else if(23<=item.fcstValue && item.fcstValue<=27){
                            var clothesMessage = `날이 덥습니다. 가벼운 옷차림을 추천합니다. 추천 옷: 반팔, 얇은 셔츠, 반바지, 면바지 `
                        }else if(20<=item.fcstValue && item.fcstValue<=22){
                            var clothesMessage = `초여름/ 늦여름 날씨입니다. 일교차에 주의해주세요. 추천 옷: 블라우스, 얇은 긴팔 티, 면바지, 슬랙스, 반팔과 가디건`
                        }else if(17<=item.fcstValue && item.fcstValue<=19){
                            var clothesMessage=`아직 조금은 쌀쌀합니다. 건강에 유의해주세요. 추천 옷: 얇은 가디건, 니트, 맨투맨, 후드, 긴 바지`
                        }else if(12<=item.fcstValue && item.fcstValue<=16){
                            var clothesMessage=`날이 쌀쌀합니다. 추천 옷: 자켓, 가디건, 청자켓, 니트, 청바지`
                        }else if(9<=item.fcstValue && item.fcstValue<=11){
                            var clothesMessage =`날이 아직 춥습니다. 따뜻한 옷이 좋습니다. 추천 옷: 트렌치코트, 야상, 점퍼, 기모바지`
                        }else if(5<=item.fcstValue && item.fcstValue<=8){
                            var clothesMessage =` 날이 춥습니다. 따뜻하게 입어주세요. 추천 옷: 두꺼운 코트, 히트텍, 가죽 옷, 기모 소재의 옷`
                        }else{
                            var clothesMessage= `날씨가 매우 춥습니다. 건강에 유의하세요 .추천 옷: 패딩, 두꺼운 코트, 누빔 옷, 기모 소재의 옷, 히트텍, 목도리, 장갑`
                        }
                    }
                
            }
            request.post(
                {
                    url: TARGET_URL,
                    headers: {
                        'Authorization': `Bearer ${TOKEN}`
                    },
                    json: {
                        "replyToken":replyToken,
                        "messages":[
                            {
                                "type":"text",
                                "text":rainMessage+windmessage+watermessage
                            },
                            {
                                "type":"text",
                                "text":clothesMessage
                           }
                        ]
                    }
                },(error, response, body) => {
                    console.log(body)
                });
        }
    });
}


function start (replyToken, message){ 
    if(message != '시작')
    {
        //check = false
        return
    }

    /*
    if(message == '시작'){
        //check= true
    }
    */
    
      var startMessage= '[[특별 혹은 광역시/도]]   [[시/구/군/(특별시와 광역시를 제외하고는 시와 구를 붙여주세요)]]   [[읍/면/동]](동은 몇 동인지)으로 입력해주세요. 예)서울특별시 종로구 사직동, 경기도 용인시기흥구 기흥동, 대구광역시 수성구 범어4동 '  
         request.post(
            {
                url: TARGET_URL,
                headers: {
                    'Authorization': `Bearer ${TOKEN}`
                },
                json: {
                    "replyToken":replyToken,
                    "messages":[
                        {
                             "type":"text",
                            "text":startMessage
                        }
                    ]
                }
            },(error, response, body) => {
                console.log(body)
             });   
}



try {
    const option = {
      ca: fs.readFileSync('/etc/letsencrypt/live/' + domain +'/fullchain.pem'),
      key: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/' + domain +'/privkey.pem'), 'utf8').toString(),
      cert: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/' + domain +'/cert.pem'), 'utf8').toString(),
    };
  
    HTTPS.createServer(option, app).listen(sslport, () => {
      console.log(`[HTTPS] Server is started on port ${sslport}`);
    });
  } catch (error) {
    console.log('[HTTPS] HTTPS 오류가 발생하였습니다. HTTPS 서버는 실행되지 않습니다.');
    console.log(error);
  }
  

           