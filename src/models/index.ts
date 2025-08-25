import { ICollectionData } from './ICollection';
import {
  PayCycle,
  LoanOffer,
  OfferCounter,
  Application,
  ApplicationDocument,
  DebiCheckEvent,
  Payment,
  BankingDetails,
} from './schema';

// -----------------------------------------------------------
// Typed aliases for nodes (optional sugar)
// -----------------------------------------------------------

export type PayCycleNode = ICollectionData<PayCycle>;
export type LoanOfferNode = ICollectionData<LoanOffer>;
export type OfferCounterNode = ICollectionData<OfferCounter>;
export type ApplicationNode = ICollectionData<Application>;
export type ApplicationDocumentNode = ICollectionData<ApplicationDocument>;
export type DebiCheckEventNode = ICollectionData<DebiCheckEvent>;
export type PaymentNode = ICollectionData<Payment>;
export type BankingDetailsNode = ICollectionData<BankingDetails>;
