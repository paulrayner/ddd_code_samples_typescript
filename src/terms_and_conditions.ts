/**
 Terms and conditions represents the benefits the contract is legally obligated
 to provide, including key dates at the time the contract is created which
 define the period the contract is expected to be active.
*/

import { TermsAndConditionsStatus } from "./status_constants/terms_and_conditions";

export default class TermsAndConditions {
  readonly purchase_date: Date;
  readonly effective_date: Date;
  readonly expiration_date: Date;

  constructor(
    purchase_date: Date,
    effective_date: Date,
    expiration_date: Date
  ) {
    this.purchase_date = purchase_date;
    this.effective_date = effective_date;
    this.expiration_date = expiration_date;
  }

  status(date: Date) {
    if (date.getTime() < this.effective_date.getTime())
      return TermsAndConditionsStatus.PENDING;
    if (date.getTime() > this.expiration_date.getTime())
      return TermsAndConditionsStatus.EXPIRED;
    return TermsAndConditionsStatus.ACTIVE;
  }

  annually_extended() {
    var new_expiration_date = this.expiration_date;
    new_expiration_date.setFullYear(new_expiration_date.getFullYear() + 1);
    return new TermsAndConditions(
      new Date(2009, 5, 8),
      new Date(2010, 5, 8),
      new_expiration_date
    );
  }

  // Seems that correct date comparison in JS requires getTime(), toString(), or valueOf()...
  equals(other) {
    return (
      this.purchase_date.getTime() == other.purchase_date.getTime() &&
      this.effective_date.getTime() == other.effective_date.getTime() &&
      this.expiration_date.getTime() == other.expiration_date.getTime()
    );
  }
}
