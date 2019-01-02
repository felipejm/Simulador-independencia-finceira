import { Server } from './client/www'
import { HomeRoute } from './client/routes/home-route'

const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');
const express = require('express');

class ClientApp{
    constructor(){
        this.app = new express()
    }

    startServer(){
        const server = new Server()
        server.start(this.app)
    }

    configure(){
        this.app.set('views', path.join(__dirname, 'client/view'))
        this.app.set('view engine', 'jade')
        this.app.use(logger('dev'))
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: false }))
        this.app.use(cookieParser())
        this.app.use(express.static(path.join(__dirname, 'client/public')))
        this.configureRoutes()   
        this.configureErrorHandler()
    } 

    configureRoutes(){
        new HomeRoute().register(this.app)
    }
    

    configureErrorHandler(){
        this.app.use(function(err, req, res, next) {
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            res.status(err.status || 500);
            res.render('error', {message: err.message});
        });
    }
}
const clientApp = new ClientApp()
clientApp.configure()
clientApp.startServer()