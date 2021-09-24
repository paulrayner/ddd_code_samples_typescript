import { v4 as uuidv4 } from "uuid";

import Contract from "../contract";
import Product from "../product";
import TermsAndConditions from "../terms_and_conditions";
import Claim from "../claim";
import { ContractStatus } from "../status_constants/contract";

test("contract is set up properly", () => {
  var product = new Product(
    "dishwasher",
    "OEUOEU23",
    "Whirlpool",
    "7DP840CWDB0"
  );
  var terms_and_conditions = new TermsAndConditions(
    new Date(2009, 5, 8),
    new Date(2010, 5, 8),
    new Date(2013, 5, 8)
  );

  var contract = new Contract(100.0, product, terms_and_conditions);

  expect(contract.id).toBeDefined();
  expect(contract.purchase_price).toBe(100.0);
  expect(contract.status).toEqual(ContractStatus.PENDING);
  expect(contract.terms_and_conditions.equals(terms_and_conditions)).toBe(true);

  expect(contract.covered_product.name).toEqual("dishwasher");
  expect(contract.covered_product.serial_number).toEqual("OEUOEU23");
  expect(contract.covered_product.make).toEqual("Whirlpool");
  expect(contract.covered_product.model).toEqual("7DP840CWDB0");
});

test("contract in effect based on status and effective and expiration date range", () => {
  var product = new Product(
    "dishwasher",
    "OEUOEU23",
    "Whirlpool",
    "7DP840CWDB0"
  );
  var terms_and_conditions = new TermsAndConditions(
    new Date(2009, 5, 8),
    new Date(2010, 5, 8),
    new Date(2013, 5, 8)
  );

  var contract = new Contract(100.0, product, terms_and_conditions);
  // check PENDING state
  expect(contract.in_effect_for(new Date(2010, 5, 9))).toBe(false);
  // check date range for ACTIVE contract
  contract.status = ContractStatus.ACTIVE;
  expect(contract.in_effect_for(new Date(2010, 5, 7))).toBe(false);
  expect(contract.in_effect_for(new Date(2010, 5, 8))).toBe(true);
  expect(contract.in_effect_for(new Date(2013, 5, 8))).toBe(true);
  expect(contract.in_effect_for(new Date(2013, 5, 9))).toBe(false);
});

test("limit of liability with no claims", () => {
  var product = new Product(
    "dishwasher",
    "OEUOEU23",
    "Whirlpool",
    "7DP840CWDB0"
  );
  var terms_and_conditions = new TermsAndConditions(
    new Date(2009, 5, 8),
    new Date(2010, 5, 8),
    new Date(2013, 5, 8)
  );

  var contract = new Contract(100.0, product, terms_and_conditions);

  expect(contract.limit_of_liability()).toBe(80.0);
});

test("claims total", () => {
  var product = new Product(
    "dishwasher",
    "OEUOEU23",
    "Whirlpool",
    "7DP840CWDB0"
  );
  var terms_and_conditions = new TermsAndConditions(
    new Date(2009, 5, 8),
    new Date(2010, 5, 8),
    new Date(2013, 5, 8)
  );

  var contract = new Contract(100.0, product, terms_and_conditions);
  contract.claims.push(new Claim(10.0, new Date(2010, 10, 1)));

  expect(contract.claim_total()).toBe(10.0);
});

test("claims total should be sum of claim amounts", () => {
  var product = new Product(
    "dishwasher",
    "OEUOEU23",
    "Whirlpool",
    "7DP840CWDB0"
  );
  var terms_and_conditions = new TermsAndConditions(
    new Date(2009, 5, 8),
    new Date(2010, 5, 8),
    new Date(2013, 5, 8)
  );

  var contract = new Contract(100.0, product, terms_and_conditions);
  contract.claims.push(new Claim(20.0, new Date(2010, 10, 1)));
  contract.claims.push(new Claim(23.0, new Date(2010, 10, 1)));

  expect(contract.claim_total()).toBe(43.0);
});

test("limit of liability with one claim", () => {
  var product = new Product(
    "dishwasher",
    "OEUOEU23",
    "Whirlpool",
    "7DP840CWDB0"
  );
  var terms_and_conditions = new TermsAndConditions(
    new Date(2009, 5, 8),
    new Date(2010, 5, 8),
    new Date(2013, 5, 8)
  );

  var contract = new Contract(100.0, product, terms_and_conditions);
  contract.claims.push(new Claim(10.0, new Date(2010, 10, 1)));

  expect(contract.limit_of_liability()).toBe(70.0);
  expect(contract.within_limit_of_liability(10.0)).toBe(true);
  expect(contract.within_limit_of_liability(69.0)).toBe(true);
  expect(contract.within_limit_of_liability(70.0)).toBe(false);
  expect(contract.within_limit_of_liability(80.0)).toBe(false);
});

test("limit of liability with multiple claims", () => {
  var product = new Product(
    "dishwasher",
    "OEUOEU23",
    "Whirlpool",
    "7DP840CWDB0"
  );
  var terms_and_conditions = new TermsAndConditions(
    new Date(2009, 5, 8),
    new Date(2010, 5, 8),
    new Date(2013, 5, 8)
  );

  var contract = new Contract(100.0, product, terms_and_conditions);
  contract.claims.push(new Claim(10.0, new Date(2010, 10, 1)));
  contract.claims.push(new Claim(20.0, new Date(2010, 10, 1)));

  expect(contract.limit_of_liability()).toBe(50.0);
  expect(contract.within_limit_of_liability(10.0)).toBe(true);
  expect(contract.within_limit_of_liability(49.0)).toBe(true);
  expect(contract.within_limit_of_liability(50.0)).toBe(false);
  expect(contract.within_limit_of_liability(80.0)).toBe(false);
});

test("extend annual subscription", () => {
  var product = new Product(
    "dishwasher",
    "OEUOEU23",
    "Whirlpool",
    "7DP840CWDB0"
  );
  var terms_and_conditions = new TermsAndConditions(
    new Date(2009, 5, 8),
    new Date(2010, 5, 8),
    new Date(2013, 5, 8)
  );

  var contract = new Contract(100.0, product, terms_and_conditions);

  contract.extend_annual_subscription();

  var extended_terms_and_conditions = new TermsAndConditions(
    new Date(2009, 5, 8),
    new Date(2010, 5, 8),
    new Date(2014, 5, 8)
  );
  expect(
    contract.terms_and_conditions.equals(extended_terms_and_conditions)
  ).toBe(true);
});

// entities compare by unique IDs, not properties
test("contract equality", () => {
  var product = new Product(
    "dishwasher",
    "OEUOEU23",
    "Whirlpool",
    "7DP840CWDB0"
  );
  var terms_and_conditions = new TermsAndConditions(
    new Date(2009, 5, 8),
    new Date(2010, 5, 8),
    new Date(2013, 5, 8)
  );

  var contract1 = new Contract(100.0, product, terms_and_conditions);
  var contract2 = new Contract(100.0, product, terms_and_conditions);
  var contract3 = new Contract(100.0, product, terms_and_conditions);

  var expected_id = uuidv4();
  contract1.id = expected_id;
  contract2.id = expected_id;
  expect(contract1.id).toEqual(contract2.id);

  contract3.id = uuidv4();
  expect(contract1.id).not.toEqual(contract3.id);
});
