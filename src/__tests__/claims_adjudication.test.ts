import Contract from "../contract";
import Product from "../product";
import TermsAndConditions from "../terms_and_conditions";
import Claim from "../claim";
import ClaimsAdjudication from "../claims_adjudication";
import { ContractStatus } from "../status_constants/contract";

function fakeContract() {
  var product = new Product(
    "dishwasher",
    "OEUOEU23",
    "Whirlpool",
    "7DP840CWDB0"
  );
  var terms_and_conditions = new TermsAndConditions(
    new Date(2009, 5, 8),
    new Date(2010, 5, 8),
    new Date(2012, 5, 8)
  );

  var contract = new Contract(100.0, product, terms_and_conditions);
  contract.status = ContractStatus.ACTIVE;

  return contract;
}

// Now that we have this logic moved to Contract, we could use Jest to mock out contract.covers() and simplify these tests
test("Adjudicate valid claim", () => {
  var contract = fakeContract();
  var claim = new Claim(79.0, new Date(2010, 5, 8));

  new ClaimsAdjudication().adjudicate(contract, claim);

  expect(contract.claims.length).toBe(1);
  expect(contract.claims[0].amount).toBe(79.0);
  expect(contract.claims[0].failure_date).toEqual(new Date(2010, 5, 8));
});

test("Adjudicate claim with invalid amount", () => {
  var contract = fakeContract();
  var claim = new Claim(81.0, new Date(2010, 5, 8));

  new ClaimsAdjudication().adjudicate(contract, claim);

  expect(contract.claims.length).toBe(0);
});

test("Adjudicate claim for pending contract", () => {
  var contract = fakeContract();
  contract.status = ContractStatus.PENDING;
  var claim = new Claim(79.0, new Date(2010, 5, 8));

  new ClaimsAdjudication().adjudicate(contract, claim);

  expect(contract.claims.length).toBe(0);
});

test("Adjudicate claim for pending contract", () => {
  var contract = fakeContract();
  contract.status = ContractStatus.EXPIRED;
  var claim = new Claim(79.0, new Date(2010, 5, 8));

  new ClaimsAdjudication().adjudicate(contract, claim);

  expect(contract.claims.length).toBe(0);
});

test("Adjudicate claim prior to effective date", () => {
  var contract = fakeContract();
  var claim = new Claim(79.0, new Date(2010, 5, 5));

  new ClaimsAdjudication().adjudicate(contract, claim);

  expect(contract.claims.length).toBe(0);
});

test("Adjudicate claim after expiration date", () => {
  var contract = fakeContract();
  var claim = new Claim(79.0, new Date(2012, 5, 9));

  new ClaimsAdjudication().adjudicate(contract, claim);

  expect(contract.claims.length).toBe(0);
});
