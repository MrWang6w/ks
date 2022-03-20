const axios = require('axios');

//快手订单记录
async function kuaishouorder(pay_data, orderId) {
  let headersc = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'User-Agent':
      'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
  };
  let dataRes = await axios({
    headers: headersc,
    url: 'https://www.kuaishoupay.com/pay/order/pc/trade/query',
    method: 'post',
    data: pay_data,
  });
  var order_state = dataRes.data.order_state;
  console.log(order_state);
  var code, msg;
  if (order_state == 'SUCCESS') {
    code = 200;
    msg = '支付成功';
  } else {
    code = -1;
    msg = '等待支付中';
  }
  return {
    code,
    msg,
    order_state,
    nowTime: Date.now(),
  };
}

module.exports = kuaishouorder;
