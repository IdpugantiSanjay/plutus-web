import { TransactionType } from './transaction-type'

export type Category = {
  name: string
  transactionType: TransactionType,
  icon: string,
  id: string
}


export type CategoryWithIcon = Category & { icon: string; };
export type DebitCategory = Omit<CategoryWithIcon, 'TransactionType'> & { TransactionType: 1; };
export type CreditCategory = Omit<CategoryWithIcon, 'TransactionType'> & { TransactionType: 2; };