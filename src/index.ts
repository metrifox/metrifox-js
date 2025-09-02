import { MetrifoxConfig } from "./core/base_client";
import { createClient, MetrifoxClient } from "./metrifox-client";

// Export types
export * from "./utils/interface";
export type { MetrifoxClient };

// Main initialization function
export function init(config: MetrifoxConfig = {}): MetrifoxClient {
  return createClient(config);
}

// Alternatively
export const Metrifox = {
  init
};

// We can do both import { init } from 'metrifox' OR import * as Metrifox from 'metrifox'
// with these
