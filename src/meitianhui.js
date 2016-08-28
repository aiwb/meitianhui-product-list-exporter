var request = require('request');
var cheerio = require('cheerio');
var generateSheet = require('./generateSheet');

var get = function(username, password) {

  var count = 0;
  var data = [];

  new Promise(function(resolve) {
    request(
      {
        url: 'http://h.meitianhui.com/shop/passport/signin.html',  //请求的URL
        method: 'POST',  //POST方式请求
        encoding: null,  //由于Node默认是UTF-8，而图书馆用的GB2312，所以不进行转码
        headers: {  //请求头的设置
          ContentType: 'application/x-www-form-urlencoded'
        },
        form: {  //请求体，参数
          hgj: '',
          login_account: username || '',
          login_password: password || ''
        }
      },
      function (err, res, body) {   //接收回调
        cookie = res.headers['set-cookie'];
        body = JSON.parse(body.toString());
        if (body.success === true) {
          resolve(cookie);
        } else {
          console.log(body);
        }
      }
    );
  }).then(function(cookie) {
    return new Promise(function(resolve) {
      query(cookie, 1, resolve)
    });
  }).then(function(data) {
    // console.log('data: ', data);
    // console.log('generateSheet: ', generateSheet);
    generateSheet(data, '/Users/eqielb/Desktop/' + username + '.xlsx');
  })

  function query(cookie, page, resolve) {
    request.get({
      url: 'http://h.meitianhui.com/shop/item/itemList.html?status=0&is_deleted=0&pages=' + page,
      headers: {
          Cookie: cookie  //这里是关键，设置Cookie为之前请求到的以Cookie形式呈现的SessionID
      }
    }, function(error, response, body) {
      $ = cheerio.load(body);
      var tableTr = $('#data_node tr');

      for (var i = 0; i < tableTr.length; i++) {
        var dom = tableTr.eq(i);
        var name = dom.find('.goods a').text().trim();
        var id = dom.find('td').eq(2).text().trim();
        var url = dom.find('.goods a').attr('href').trim();
        var price = dom.find('td').eq(4).find('span').text().trim();
        data.push({
          name: name,
          id: id,
          url: url,
          price: price
        });
        count++;
      }
      var nav = $('.pagination');
      var activeNav = nav.find('.active');

      for (var i = 0; i < activeNav.length; i++) {
        if (activeNav.eq(i).find('span').length > 0) {
          activeNav = activeNav.eq(i);
          break;
        }
      }

      var nextNav = activeNav.next()
      if (!nextNav.hasClass('disabled')) {
        query(cookie, (page + 1), resolve);
      } else {
        resolve(data);
      }
    });
  }

};

module.exports = get;
