import TermsAndConditions from "../terms_and_conditions";
import { TermsAndConditionsStatus } from "../status_constants/terms_and_conditions";

test("terms and conditions status", () => {
  var terms_and_conditions = new TermsAndConditions(
    new Date(2009, 5, 8),
    new Date(2010, 5, 8),
    new Date(2013, 5, 8)
  );

  // Should be pending prior to effective date
  expect(terms_and_conditions.status(new Date(2010, 5, 7))).toEqual(
    TermsAndConditionsStatus.PENDING
  );
  // Should be active if between effective and expiration dates (inclusive)
  expect(terms_and_conditions.status(new Date(2010, 5, 8))).toEqual(
    TermsAndConditionsStatus.ACTIVE
  );
  expect(terms_and_conditions.status(new Date(2013, 5, 8))).toEqual(
    TermsAndConditionsStatus.ACTIVE
  );
  // Should be expired if after expiration date
  expect(terms_and_conditions.status(new Date(2013, 5, 9))).toEqual(
    TermsAndConditionsStatus.EXPIRED
  );
});

test("terms and conditions extend annually", () => {
  var terms_and_conditions = new TermsAndConditions(
    new Date(2009, 5, 8),
    new Date(2010, 5, 8),
    new Date(2013, 5, 8)
  );

  var extended_terms_and_conditions = new TermsAndConditions(
    new Date(2009, 5, 8),
    new Date(2010, 5, 8),
    new Date(2014, 5, 8)
  );

  expect(
    terms_and_conditions
      .annually_extended()
      .equals(extended_terms_and_conditions)
  ).toEqual(true);
});

// Terms and Conditions is an example of a value object. See https://martinfowler.com/bliki/ValueObject.html for more details

test("terms and conditions equality by properties", () => {
  // A value object must be created whole
  var terms_and_conditions = new TermsAndConditions(
    new Date(2009, 5, 8),
    new Date(2010, 5, 8),
    new Date(2013, 5, 8)
  );

  // Demonstrate equality by property - uses custom "equals" method in this example
  expect(
    new TermsAndConditions(
      new Date(2009, 5, 8),
      new Date(2010, 5, 8),
      new Date(2013, 5, 8)
    ).equals(terms_and_conditions)
  ).toBe(true);
});

test("terms and conditions inequality", () => {
  var terms_and_conditions = new TermsAndConditions(
    new Date(2009, 5, 8),
    new Date(2010, 5, 8),
    new Date(2013, 5, 8)
  );

  // Demonstrate inequality by property
  expect(
    new TermsAndConditions(
      new Date(2009, 5, 9),
      new Date(2010, 5, 8),
      new Date(2013, 5, 8)
    ).equals(terms_and_conditions)
  ).toBe(false);
  expect(
    new TermsAndConditions(
      new Date(2009, 5, 8),
      new Date(2010, 5, 9),
      new Date(2013, 5, 8)
    ).equals(terms_and_conditions)
  ).toBe(false);
  expect(
    new TermsAndConditions(
      new Date(2009, 5, 8),
      new Date(2010, 5, 8),
      new Date(2013, 5, 9)
    ).equals(terms_and_conditions)
  ).toBe(false);
});
