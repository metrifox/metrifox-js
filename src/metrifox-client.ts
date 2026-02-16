import { MetrifoxConfig } from "./core/base_client";
import { CustomersModule } from "./modules/customers";
import { UsagesModule } from "./modules/usages";
import { CheckoutModule } from "./modules/checkout";
import { SubscriptionsModule } from "./modules/subscriptions";

export interface MetrifoxClient {
    customers: CustomersModule;
    usages: UsagesModule;
    checkout: CheckoutModule;
    subscriptions: SubscriptionsModule;
}

export function createClient(config: MetrifoxConfig = {}): MetrifoxClient {
    return {
        customers: new CustomersModule(config),
        usages: new UsagesModule(config),
        checkout: new CheckoutModule(config),
        subscriptions: new SubscriptionsModule(config),
    };
}