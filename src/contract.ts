import {v4 as uuidv4} from 'uuid';

import Claim from './claim';
import Product from './product';
import TermsAndConditions from './terms_and_conditions';
import SubscriptionRenewed from './subscription_renewed';
import CustomerReimbursementRequested from './customer_reimbursement_requested';

/**
 Contract represents an extended warranty for a covered product.
 A contract is in a PENDING state prior to the effective date,
 ACTIVE between effective and expiration dates, and EXPIRED after
 the expiration date.
*/

export default class Contract {
  id:                     string;   // Unique ID

  purchase_price:         number;
  covered_product:        Product;
  terms_and_conditions:   TermsAndConditions;

  status:                 string;
  events:                 [SubscriptionRenewed, CustomerReimbursementRequested];

  claims:                 Claim[];

  constructor(purchase_price:       number,
              product:              Product,
              terms_and_conditions: TermsAndConditions) {
    this.purchase_price       = purchase_price;
    this.covered_product      = product;
    this.terms_and_conditions = terms_and_conditions;

    this.id                = uuidv4(); // Autoassigned
    this.status            = 'PENDING';
    this.claims            = [];
    this.events            = [];
  }

  covers(claim: Claim) {
    return this.in_effect_for(claim.failure_date) &&
           this.within_limit_of_liability(claim.amount);
  }

  in_effect_for(date: Date) {
    return this.terms_and_conditions.status(date) == 'ACTIVE' &&
           this.status == 'ACTIVE';
  }

  within_limit_of_liability(amount: number) {
    return amount < this.limit_of_liability();
  }

  limit_of_liability() {
    const liability_percentage = 0.8;
    return (this.purchase_price * liability_percentage) - this.claim_total();
  }

  claim_total() {
    var claim_total = 0.0;
    this.claims.forEach(claim => claim_total += claim.amount);

    return claim_total;
  }

  extend_annual_subscription() {
    this.terms_and_conditions = this.terms_and_conditions.annually_extended();
    this.events.push(new SubscriptionRenewed(this.id, 'Automatic Annual Renewal'))
  }

  terminate(rep_name, reason) {
    this.status = 'FULFILLED';
    this.events.push(new CustomerReimbursementRequested(this.id, rep_name, reason));
  }

  // Show an alternate way: Use events to derive current state
  status_derived_from_events(date: Date) {
    const has_been_reimbursed = (event) => event instanceof CustomerReimbursementRequested;
    if (this.events.some(has_been_reimbursed)) return 'FULFILLED';

    return this.status;
  }
}
