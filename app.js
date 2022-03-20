const express = require('express');
const app = express();
const checkKS = require('./ks/checkKSPay');
const ksh5 = require('./ks/ksh5');
let Payment = express.Router();
const port = 7661;
app.listen(port, () => {
  console.log('服务已经启动!http://127.0.0.1:' + port);
});

app.use(express.urlencoded());
app.use(express.json());
app.use(express.static('public'));

Payment.get('/ks', async (req, res) => {
  if (!req.query.pay_id) {
    res.send({ code: -1, msg: '无pay_id参数' });
    return;
  }
  if (!req.query.money) {
    res.send({ code: -1, msg: '无money参数' });
    return;
  }
  if (!req.query.type) {
    res.send({ code: -1, msg: '无type参数' });
    return;
  }
  let results = await ksh5(req.query);
  res.send({
    code: 200,
    amount: req.query.money,
    nowTime: Date.now(),
    msg: 'KuaiShouH5挑起成功!',
    Payurl: results.urls,
    OrderId: results.orderId,
    CheckOrder_Data: results.pay_datacheck,
  });
});

Payment.get('/CheckKs', async (req, res) => {
  if (!req.query.merchant_id) {
    res.send({ code: -1, msg: '无merchant_id参数!' });
    return;
  }
  if (!req.query.out_order_no) {
    res.send({ code: -1, msg: '无out_order_no参数!' });
    return;
  }
  let data = await checkKS(req._parsedOriginalUrl.search.slice(1));
  res.send({ ...data });
});

app.use('/', Payment);
