import { MetrifoxConfig } from "./core/base_client";
import { CustomersModule } from "./modules/customers";
import { UsagesModule } from "./modules/usages";
import { CheckoutModule } from "./modules/checkout";
import { SubscriptionsModule } from "./modules/subscriptions";
import { WalletsModule } from "./modules/wallets";

export interface MetrifoxClient {
    customers: CustomersModule;
    usages: UsagesModule;
    checkout: CheckoutModule;
    subscriptions: SubscriptionsModule;
    wallets: WalletsModule;
}

export function createClient(config: MetrifoxConfig = {}): MetrifoxClient {
    return {
        customers: new CustomersModule(config),
        usages: new UsagesModule(config),
        checkout: new CheckoutModule(config),
        subscriptions: new SubscriptionsModule(config),
        wallets: new WalletsModule(config),
    };
}