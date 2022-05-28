const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
exports.main = async (event, context) => {
  const res = await cloud.cloudPay.unifiedOrder({
    "body" : "二手交易平台",
    "outTradeNo" : "1217752501201407033233368018",//商户订单号
    "spbillCreateIp" : "127.0.0.1",
    "subMchId" : "1900009231",//子商户号
    "totalFee" : 1,
    "envId": "cloud1-5gkp8gvb02539afe",
    "functionName": "myFunctions"
  })
  return res
}