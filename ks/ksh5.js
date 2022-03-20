const axios = require('axios');
// var item = {
//   pay_id: 32618349,
//   type: 1,
//   money: 3,
// };
// ksh5(item);
//挑起快手H5支付
async function ksh5(item) {
  var kspayProvider;
  var ksCoin = item.money * 10;
  if (item.type == 2) {
    kspayProvider = 'WECHAT';
  } else {
    kspayProvider = 'ALIPAY';
  }
  var fen = item.money * 100;
  axios.defaults.withCredentials = true;
  let headers = {
    Connection: 'keep-alive',
    'Content-Type': 'application/json;charset=UTF-8',
    'User-Agent':
      'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
  };
  let obj = `{"ksCoin":${ksCoin},"fen":${fen},"userId":${item.pay_id},"customize":true,"kpf": "PC_WEB","kpn": "KUAISHOU"}`;
  var rres = await axios({
    headers: headers,
    url: 'https://pay.ssl.kuaishou.com/payAPI/k/pay/kscoin/deposit/nlogin/kspay/cashier',
    method: 'post',
    data: obj,
  });
  let pay_datacheck = `merchant_id=${rres.data.merchantId}&out_order_no=${rres.data.outOrderNo}`;
  let pay_data = `provider=${kspayProvider}&merchant_id=${rres.data.merchantId}&out_order_no=${rres.data.outOrderNo}&redirect_url=https://www.kuaishoupay.com/services/h5-recharge?login_from_phone=1&order_id=${rres.data.outOrderNo}&platform=${kspayProvider}&amt=${ksCoin}&type=${item.type}&pay_amount=${fen}`;
  let headersb = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent':
      'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
  };
  let ares = await axios({
    headers: headersb,
    url: 'https://www.kuaishoupay.com/pay/order/h5/trade/create_pay_order',
    method: 'post',
    data: pay_data,
  });
  var urls;
  let { provider_config, gateway_prepay_no, provider } =
    ares.data.gateway_pay_param;
  if (item.type == 1) {
    urls = `https://openapi.alipay.com/gateway.do?charset=utf-8&${provider_config}`;
  } else {
    provider_config = JSON.parse(provider_config);
    urls = provider_config.mweb_url;
    let dres = await axios({
      headers: {
        Referer: 'https://www.kuaishoupay.com/',
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
      },
      url: urls,
    });
    let weixin1 = dres.data.indexOf('var url="');
    let weixin2 = dres.data.indexOf('var redirect_url="');
    let weixin3 = dres.data.slice(weixin1, weixin2);
    urls = weixin3.split('"')[1];
  }
  let orderId = gateway_prepay_no;
  return { orderId, urls, pay_datacheck };
}

module.exports = ksh5;
