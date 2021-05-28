import { Category } from './category'
import { TransactionType } from './transaction-type'

export type Transaction = {
  id?: string
  amount: number
  description: string
  dateTime: string | Date
  transactionType: TransactionType
  category: Category
  isCredit?: boolean
  categoryId: string
}
