import {StockSymbolDAO} from './model/dao/stock-dao'

export class AutoCompleteStockUseCase{
    dao = new StockSymbolDAO()
    async run(request){
        const queryParam = request.query['query']
        return this.dao.fetchByQuery(queryParam)
    }
}