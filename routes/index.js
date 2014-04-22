var express = require('express');
var router = express.Router();
var unirest = require('unirest');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Tsukkomi' });
});

/* GET Access Token of Weibo */
router.post('/getAccessToken', function(req, res){
    if(req.body.code){
        // Here client_id is your App Key of weibo, and client_secret is App Secret, I've hiden mine.
        var data = {'client_id': '###', 'client_secret': '###', 'grant_type': 'authorization_code', 'redirect_uri': 'tsukkomi.gucheen.pro'};
        data.code = req.body.code;
        unirest.post('https://api.weibo.com/oauth2/access_token').send(data).end(function(response){
            var resp = JSON.parse(response.body);
            var weiboAccessToken = resp.access_token;
            unirest.get('https://api.weibo.com/2/statuses/friends_timeline.json?&count=10&access_token='+ weiboAccessToken).end(function(response){
                res.send({access_token: weiboAccessToken, weibos: response.body.statuses});
            });
        })
    }else{
        res.send('Some errors');
    }
})

/* GET weibo */
router.post('/getWeibo', function(req, res){
    if(req.body.access_token){
//        Validate Weibo Access Token
//        unirest.post('https://api.weibo.com/oauth2/get_token_info').send({'access_token': req.body.access_token}).end(function(data){
//            console.log(data.body);
//        })
        unirest.get('https://api.weibo.com/2/statuses/friends_timeline.json?count=10&access_token='+ req.body.access_token).end(function(response){
            res.send({weibos: response.body.statuses});
        });
    }else{
        res.send('Some errors');
    }
})

module.exports = router;