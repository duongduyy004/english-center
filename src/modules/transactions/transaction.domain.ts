export class Transaction {
    id: string;

    amount: number;

    description: string;

    transactionAt: Date;

    category: {
        id: number
        type: string;
        name: string;
    }
}