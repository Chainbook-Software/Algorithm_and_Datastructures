import { CanonicalLPConverter } from '../index';

describe('CanonicalLPConverter', () => {
  describe('convertMinToMax', () => {
    it('should convert minimization to maximization by negating coefficients', () => {
      const objectiveCoefficients = [1, 2, 3];
      const result = CanonicalLPConverter.convertMinToMax(objectiveCoefficients);
      expect(result).toEqual([-1, -2, -3]);
    });

    it('should handle zero coefficients correctly', () => {
      const objectiveCoefficients = [0, 1, 0];
      const result = CanonicalLPConverter.convertMinToMax(objectiveCoefficients);
      expect(result).toEqual([-0, -1, -0]);
    });
  });

  describe('convertGreaterThanToLessThan', () => {
    it('should convert greater-than constraints to less-than by negating coefficients and rhs', () => {
      const constraintCoefficients = [1, 2, 3];
      const rhs = 4;
      const result = CanonicalLPConverter.convertGreaterThanToLessThan(constraintCoefficients, rhs);
      expect(result.coefficients).toEqual([-1, -2, -3]);
      expect(result.rhs).toBe(-4);
    });
  });

  describe('convertEqualityToInequality', () => {
    it('should convert equality constraints to two inequality constraints', () => {
      const constraintCoefficients = [1, 2, 3];
      const rhs = 4;
      const result = CanonicalLPConverter.convertEqualityToInequality(constraintCoefficients, rhs);
      expect(result.coefficients1).toEqual([1, 2, 3]);
      expect(result.rhs1).toBe(4);
      expect(result.coefficients2).toEqual([-1, -2, -3]);
      expect(result.rhs2).toBe(-4);
    });
  });

  describe('handleUnrestrictedVariable', () => {
    it('should split unrestricted variables into positive and negative parts', () => {
      const coefficients = [1, 2, 3];
      const variableIndex = 1; // variable x2 is unrestricted

      const result = CanonicalLPConverter.handleUnrestrictedVariable(coefficients, variableIndex);

      // Should have 4 variables now (x1, x2+, x2-, x3)
      expect(result).toHaveLength(4);
      expect(result).toEqual([1, 2, -2, 3]);
    });

    it('should handle unrestricted variable at the beginning', () => {
      const coefficients = [1, 2, 3];
      const variableIndex = 0; // variable x1 is unrestricted

      const result = CanonicalLPConverter.handleUnrestrictedVariable(coefficients, variableIndex);

      expect(result).toHaveLength(4);
      expect(result).toEqual([1, -1, 2, 3]);
    });
  });

  describe('convertToCanonicalForm', () => {
    it('should convert a complete linear program to canonical form', () => {
      const objective = [1, 2, 3];
      const constraints = [
        [1, 0, 1],  // x1 + x3 <= 5
        [0, 1, 0],  // x2 >= 3
        [1, 1, 1]   // x1 + x2 + x3 = 10
      ];
      const rhs = [5, 3, 10];
      const objectiveType = "min" as const;
      const constraintTypes: ("<=" | ">=" | "=")[] = ["<=", ">=", "="];
      const unrestrictedVariables = [false, true, false]; // x2 is unrestricted

      const result = CanonicalLPConverter.convertToCanonicalForm(
        objective,
        constraints,
        rhs,
        objectiveType,
        constraintTypes,
        unrestrictedVariables
      );

      // Should be maximization now (coefficients negated)
      expect(result.objective).toEqual([-1, -2, 2, -3]); // x1, x2+, x2-, x3 with negation for min->max

      // All constraints should be <=
      expect(result.constraints).toHaveLength(4); // Original 3 constraints, but equality becomes 2
      expect(result.rhs).toHaveLength(4);
    });

    it('should handle linear programs that are already in canonical form', () => {
      const objective = [1, 2, 3];
      const constraints = [
        [1, 0, 1],
        [0, 1, 0]
      ];
      const rhs = [5, 3];
      const objectiveType = "max" as const;
      const constraintTypes: ("<=" | ">=" | "=")[] = ["<=", "<="];
      const unrestrictedVariables = [false, false, false];

      const result = CanonicalLPConverter.convertToCanonicalForm(
        objective,
        constraints,
        rhs,
        objectiveType,
        constraintTypes,
        unrestrictedVariables
      );

      expect(result.objective).toEqual([1, 2, 3]);
      expect(result.constraints).toEqual(constraints);
      expect(result.rhs).toEqual(rhs);
    });
  });
});
