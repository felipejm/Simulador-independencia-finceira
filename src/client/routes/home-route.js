const express = require('express');
import { BacktestUseCase } from '../../service/features/backtester/backtest-use-case'
import { AutoCompleteStockUseCase } from '../../service/features/stocks/autocomplete-stock-use-case'

export class HomeRoute{

    register(app){
        const router = express.Router();

        app.use('/', router.get('/', function(req, res) {
            res.render('home/index', { title: 'Express' });
        }))

        app.use('/run-backtest', router.get('/run-backtest', function(request, response) {
            const useCase = new BacktestUseCase()
            useCase.run(request).then(result => {
                response.render('home/result', {result: result});
            })
        }))

        app.use('/stocks', router.get('/stocks', function(request, response) {
            const useCase = new AutoCompleteStockUseCase()
            useCase.run(request).then(result => {
                response.send(result)
            })
        }))
    }
}