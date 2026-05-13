# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-05-13

### Added

- `wallets` module with `list`, `listCreditAllocations`, and `getCreditAllocation` methods.
- `customers.archive(customerKey)` and `customers.unarchive(customerKey)`.
- `checkout.cardCollectionUrl({ subscriptionId?, orderId? })` for generating hosted card-collection URLs.
- `usages.listEvents({ customerKey?, featureKey?, page?, perPage? })` to list recorded usage events with filters and pagination.
- `meterServiceBaseUrl` config option (and `METRIFOX_METER_SERVICE_BASE_URL` env var) for overriding the meter service URL.

## [1.1.0] - 2025-10-03

### Added

- `checkout.url()` function to generate checkout URLs for customers
- Support for offering-based checkout URL generation
- Billing interval parameter support for checkout URLs
- Customer-specific checkout URL generation
- Enhanced checkout module with URL generation capabilities

### Documentation

- Updated README with checkout URL usage examples
- Added integration examples for custom pricing pages
- Documented checkout URL parameters and usage patterns

## [1.0.0] - 2024-01-01

### Added

- Initial release of Metrifox JavaScript SDK
- `checkAccess()` function to verify customer feature access
- `recordUsage()` function to track usage events
- Support for environment variable configuration (`METRIFOX_API_KEY`)
- TypeScript definitions and full type safety
- Support for ES modules, CommonJS, and UMD builds
- React/Next.js integration examples
- Node.js/Express integration examples
- Comprehensive error handling
- Full test suite with Jest
- Complete documentation and usage examples

### Features

- ✅ Check customer access to features
- ✅ Record usage events for billing/analytics
- ✅ TypeScript support with full type definitions
- ✅ Works in browsers and Node.js environments
- ✅ Easy integration with React, Next.js, and other frameworks
- ✅ Environment variable support for API keys
- ✅ Comprehensive error handling
- ✅ Multiple build formats (ES6, CommonJS, UMD)
- ✅ Zero dependencies (except dev dependencies)
- ✅ Full test coverage
