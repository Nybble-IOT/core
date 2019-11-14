import "jest-extended";

import { Contracts, Container } from "@arkecosystem/core-kernel";
import { Utils, Identities } from "@arkecosystem/crypto";
import secrets from "@packages/core-test-framework/src/internal/secrets.json";

jest.setTimeout(1200000);

import { Sandbox } from "@arkecosystem/core-test-framework";

const sandbox: Sandbox = new Sandbox();

export const setUp = async (): Promise<Contracts.Kernel.Application> => {
    process.env.CORE_RESET_DATABASE = "1";

    await sandbox.setUp(async ({ app }) => {
        await app.bootstrap({
            flags: {
                token: "ark",
                network: "unitnet",
                env: "test",
                processType: "core",
            },
            plugins: {
                include: [
                    "@arkecosystem/core-transactions",
                    "@arkecosystem/core-state",
                    "@arkecosystem/core-magistrate-transactions",
                    "@arkecosystem/core-database",
                    "@arkecosystem/core-database-postgres",
                    "@arkecosystem/core-transaction-pool",
                    "@arkecosystem/core-p2p",
                    "@arkecosystem/core-blockchain",
                    "@arkecosystem/core-api",
                    "@arkecosystem/core-forger",
                ],
                options: {
                    "@arkecosystem/core-blockchain": {
                        networkStart: true,
                    },
                },
            },
        });

        await app.boot();

        const databaseService = app.get<Contracts.Database.DatabaseService>(Container.Identifiers.DatabaseService);
        await databaseService.buildWallets();
        await databaseService.saveRound(
            secrets.map((secret, i) => {
                const wallet = databaseService.walletRepository.findByPublicKey(
                    Identities.PublicKey.fromPassphrase(secret),
                );

                wallet.setAttribute("delegate", {
                    username: `genesis_${i + 1}`,
                    voteBalance: Utils.BigNumber.make("300000000000000"),
                    forgedFees: Utils.BigNumber.ZERO,
                    forgedRewards: Utils.BigNumber.ZERO,
                    producedBlocks: 0,
                    round: 1,
                    rank: undefined,
                });

                return wallet;
            }),
        );

        await (databaseService as any).initializeActiveDelegates(1);
    });

    return sandbox.app;
};

export const tearDown = async (): Promise<void> => {
    // const databaseService = sandbox.app.get<Contracts.Database.DatabaseService>(Container.Identifiers.DatabaseService);
    // await databaseService.reset();

    await sandbox.tearDown();
};

export const passphrases = {
    passphrase: "this is top secret passphrase number 1",
    secondPassphrase: "this is top secret passphrase number 2",
};
