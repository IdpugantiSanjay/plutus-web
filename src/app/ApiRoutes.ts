import {baseUrl} from '../environments/environment'


class BaseRoute {
  private baseUrl = baseUrl;

  constructor( public routePrefix: string ) {

  }

  protected formRoute( route: string ) {
    return `${this.baseUrl}/${this.routePrefix}/${route}`
  }

  toString() {
    return `${this.baseUrl}/${this.routePrefix}`
  }
}

class UserRoutes extends BaseRoute {
  constructor() {
    super( 'users' )
  }

  get login() {
    return this.formRoute( 'authenticate' )
  }

  get register() {
    return this.formRoute( 'register' )
  }
}

class TransactionRoutes extends BaseRoute {
  constructor() {
    super( 'users/transactions' )
  }

  withId( id: string ) {
    return this.formRoute( `${id}` )
  }
}

class CategoryRoutes extends BaseRoute {
  /**
   *
   */
  constructor() {
    super( 'categories' )
  }
}

const users = new UserRoutes()
const transactions = new TransactionRoutes()
const categories = new CategoryRoutes()

const Api = {users, transactions, categories}

export {
  Api
}
