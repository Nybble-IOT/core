import { app } from "./app";
import { walletRepository } from "./wallet-repository";
import { Container } from "@arkecosystem/core-kernel";
import { transactionReader } from "./transaction-reader";

@Container.injectable()
export class TransactionHandler {
    protected app = app;
    protected walletRepository = walletRepository;

    public applyToSender(transaction, customWalletRepository?) {

    }

    public revertForSender(transaction, customWalletRepository?) {

    }

    public throwIfCannotBeApplied(transaction, wallet, customWalletRepository?) {

    }

    protected getTransactionReader() {
        return transactionReader;
    }

    protected getConstructor() {
        return {
            staticFee: () => "50000000"
        };
    }
}