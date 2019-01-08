import { ResultBacktestDAO } from './model/dao/result-dao'
import {BacktestOptions} from './model/backtest-configuration'

export class BacktestCreateResultKeyUseCase{
    async run(request){
        let params = {
            capital: request.query['capital-amount'],
            stocks: request.query['stocks'].split(','),
            allowDaytrade: request.query['allow-daytrade'] ? true : false,
            periodStart: request.query['period-start'],
            periodEnd: request.query['period-end'],
            position_strategy: request.query['position-strategy'],
            strategy: request.query['strategy'],
            risk_percent: request.query['risk-percent'],
            number_blocks: request.query['number-blocks'],
            donchian_top_channel: request.query['donchian-top-channel'],
            donchian_bottom_channel: request.query['donchian-bottom-channel'],
            onlySharesMultipleOf100: true
        }
        this.params = Object.assign(BacktestOptions, params)

        const id =  '_' + Math.random().toString(36).substr(2, 9)
        const link = "/result?id=" + id

        const dao = new ResultBacktestDAO()
        dao.create(id, this.params)

        return {link: link}
    }
}