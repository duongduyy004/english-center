export class Transaction {
    id: string;

    amount: number;

    description: string;

    transaction_at: Date;

    category: {
        id: number
        type: string;
        name: string;
    }
}