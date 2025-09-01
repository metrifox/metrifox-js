import { MetrifoxConfig } from "./core/base_client";
import { CustomersModule } from "./modules/customers";
import { UsagesModule } from "./modules/usages";
import { CheckoutModule } from "./modules/checkout";

export interface MetrifoxClient {
    customers: CustomersModule;
    usages: UsagesModule;
    checkout: CheckoutModule;
}

export function createClient(config: MetrifoxConfig = {}): MetrifoxClient {
    return {
        customers: new CustomersModule(config),
        usages: new UsagesModule(config),
        checkout: new CheckoutModule(config),
    };
}