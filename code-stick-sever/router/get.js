const Router = require('koa-router')
const getUsersInfo = require("../utils/options");
const getRouter = new Router()

// 判断是否过期
function isTimestampAfterCurrent(timestamp) {
    var currentTimestamp = Date.now();
    if (timestamp > currentTimestamp) {
        return true;
    } else {
        return false;
    }
}

getRouter.get('/getContent', async (ctx) => {
    const { randomValue } = ctx.request.query;
    const res = await getUsersInfo(`select * from codestick where randomValue = "${randomValue}";`)
    console.log(res[0]);
    if (!res[0]) {
        ctx.body = {
            code: 0,
            msg: `访问的代码不存在:${res}!`,
            data: '访问的代码不存在或作者设置了“阅后即焚”'
        }
    } else {
        const dateStr = res[0].timestamp_out;
        const burn = res[0].burn;
        const dateObj = new Date(Number(dateStr));
        const timestamp = dateObj.getTime();
        if (burn) {
            await getUsersInfo(`delete from codestick where randomValue = "${randomValue}";`)
        }
        if (isTimestampAfterCurrent(timestamp)) {
            ctx.body = {
                code: 1,
                msg: `获取到content了:${res}!`,
                data: res[0].content
            }
        } else {
            ctx.body = {
                code: 1,
                msg: `获取到content了:${res}!`,
                data: '已过期！'
            }
        }
    }
})

module.exports = getRouter;