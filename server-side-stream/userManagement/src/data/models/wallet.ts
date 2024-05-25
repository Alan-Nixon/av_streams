import mongoose, { Schema, Document } from "mongoose";

interface Transaction {
    amount: number;
    credited: boolean;
    createdTime: string;
}

export interface IWallet extends Document {
    userId: string;
    userName: string;
    Balance: number;
    Transactions: Transaction[];
}

const walletSchema = new Schema<IWallet>({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    Balance: { type: Number, required: true, default: 0 },
    Transactions: { type: [{ amount: Number, credited: Boolean, createdTime: String, transactionId: String }], default: [] }
});

const WalletModel = mongoose.model<IWallet>("wallets", walletSchema);

export default WalletModel;

 