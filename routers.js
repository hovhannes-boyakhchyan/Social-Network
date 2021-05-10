module.exports = (app) => {
    app.use('/user', require('./routers/users'));
    app.use('/post', require('./routers/posts'));
    app.use('/auth', require('./routers/auth'));
    app.use('/profile', require('./routers/profile'));
}