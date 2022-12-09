const Koa = require('koa')
const Bodyparser = require('koa-bodyparser')
const router = require('./router')

const app = new Koa()
app.use(new Bodyparser())
app.use(router.routes())
app.use(router.allowedMethods())

const port = 8001
app.listen(port,()=>{
    console.log(`server listening : http://localhost:${port}`)
})