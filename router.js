const KoaRouter = require('koa-router')
const path = require('path')
const fs = require('fs')
const exeBat = require('./exe-bat')

const router = new KoaRouter()

let lastPullDate = new Date()
const pullBatPath = path.join(__dirname, './pull.bat')
const forcePullBatPath = path.join(__dirname, 'force-pull.bat')

const getMTime = (time) => {
    return Math.max(Math.round(time / (1000 * 60)), 1)
}

//默认时间间隔为 3 分钟
const checkLastPullTime = (m = 3) => {
    const nowDate = new Date()

    const minTime = 1000 * 60 * m

    const passTime = nowDate.getTime() - lastPullDate.getTime()
    const stillTime = Math.max(minTime - passTime, 0)

    const res = {
        isFreeTime: passTime > minTime,
        passMTime: getMTime(passTime),
        stillMTime: getMTime(stillTime)
    }
    return res
}

router.get('/', async (ctx, next) => {
    ctx.type = 'html'
    ctx.body = fs.readFileSync(path.join(__dirname, './pages/index.html'))
    next()
})

router.post('/pull', async (ctx, next) => {
    const { isFreeTime, passMTime, stillMTime } = checkLastPullTime()
    if (isFreeTime) {
        lastPullDate = new Date()
        ctx.body = JSON.stringify({
            code: 1,
            message: '提交成功，准备开始执行，请 2-3 分钟后查看效果'
        })
        exeBat(pullBatPath)
    } else {
        ctx.body = JSON.stringify({
            code: 0,
            message: `距离上一次有人发起的命令才刚过 ${passMTime} 分钟，请在 ${stillMTime} 分钟后再申请拉取吧`
        })
    }
    next()
})

router.post('/force-pull', async (ctx, next) => {
    const { isFreeTime, passMTime, stillMTime } = checkLastPullTime()
    if (isFreeTime) {
        lastPullDate = new Date()
        ctx.body = JSON.stringify({
            code: 1,
            message: '提交成功，准备开始执行，请 4-6 分钟后查看效果'
        })
        exeBat(forcePullBatPath)
    } else {
        ctx.body = JSON.stringify({
            code: 0,
            message: `距离上一次有人发起的命令才刚过 ${passMTime} 分钟，请在 ${stillMTime} 分钟后再申请拉取吧`
        })
    }
    next()
})

module.exports = router