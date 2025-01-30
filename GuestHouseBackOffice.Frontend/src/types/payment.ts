export interface Payment {
    id?: number;
    name: string;
    comments: string;
    amount: number;
    isExpense: boolean;
    createdAt: Date;
}
