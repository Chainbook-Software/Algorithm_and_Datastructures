/**
 * Linear Programming utilities for converting problems to canonical form.
 */

/**
 * Converts a Linear Program (LP) to Canonical Form.
 */
export class CanonicalLPConverter {

  /**
   * Converts a minimization problem to a maximization problem.
   * @param objectiveCoefficients The coefficients of the objective function.
   * @returns The negated coefficients for maximization.
   */
  static convertMinToMax(objectiveCoefficients: number[]): number[] {
    return objectiveCoefficients.map(c => -c);
  }

  /**
   * Converts a "greater than or equal to" constraint to a "less than or equal to" constraint.
   * @param constraintCoefficients The coefficients of the constraint.
   * @param rhs The right-hand side value of the constraint.
   * @returns The negated coefficients and right-hand side.
   */
  static convertGreaterThanToLessThan(constraintCoefficients: number[], rhs: number): { coefficients: number[], rhs: number } {
    return {
      coefficients: constraintCoefficients.map(c => -c),
      rhs: -rhs
    };
  }

  /**
   * Converts an equality constraint to two inequality constraints (<= and >=, then >= is converted to <=).
   * @param constraintCoefficients The coefficients of the constraint.
   * @param rhs The right-hand side value of the constraint.
   * @returns Two sets of coefficients and right-hand sides for the two <= constraints.
   */
  static convertEqualityToInequality(constraintCoefficients: number[], rhs: number): { coefficients1: number[], rhs1: number, coefficients2: number[], rhs2: number } {
    return {
      coefficients1: constraintCoefficients,
      rhs1: rhs,
      coefficients2: constraintCoefficients.map(c => -c),
      rhs2: -rhs
    };
  }

  /**
   * Handles an unrestricted variable by replacing it with two non-negative variables (x' - x'').
   * This affects both the objective function and the constraints.
   * @param coefficients The coefficients of a constraint or objective function.
   * @param variableIndex The index of the unrestricted variable.
   * @returns The updated coefficients, with the unrestricted variable replaced by two variables.
   */
  static handleUnrestrictedVariable(coefficients: number[], variableIndex: number): number[] {
    const newCoefficients: number[] = [];
    for (let i = 0; i < coefficients.length; i++) {
      if (i === variableIndex) {
        newCoefficients.push(coefficients[i]); // Coefficient for x'
        newCoefficients.push(-coefficients[i]); // Coefficient for x''
      } else {
        newCoefficients.push(coefficients[i]);
      }
    }
    return newCoefficients;
  }


  /**
   * Converts a Linear Program to Canonical Form.
   * @param objective The coefficients of the objective function.
   * @param constraints A matrix of constraint coefficients.
   * @param rhs The right-hand side values for the constraints.
   * @param objectiveType Whether the objective is "min" or "max".
   * @param constraintTypes An array of constraint types ("<=", ">=", "=").
   * @param unrestrictedVariables An array of boolean values indicating whether each variable is unrestricted.
   * @returns The converted objective, constraints, and rhs in canonical form.
   */
  static convertToCanonicalForm(
    objective: number[],
    constraints: number[][],
    rhs: number[],
    objectiveType: "min" | "max",
    constraintTypes: ("<=" | ">=" | "=")[],
    unrestrictedVariables: boolean[]
  ): {
    objective: number[];
    constraints: number[][];
    rhs: number[];
  } {

    let canonicalObjective = [...objective]; //copy
    let canonicalConstraints: number[][] = [];
    let canonicalRhs: number[] = [];

    // 1. Convert Minimization to Maximization
    if (objectiveType === "min") {
      canonicalObjective = CanonicalLPConverter.convertMinToMax(objective);
    }

    // 2. Handle Unrestricted Variables (expand objective function first)
    let numNewVariables = 0;
    for (let i = 0; i < unrestrictedVariables.length; i++) {
      if (unrestrictedVariables[i]) {
        canonicalObjective = CanonicalLPConverter.handleUnrestrictedVariable(canonicalObjective, i + numNewVariables); //adjust index for previously expanded variables
        numNewVariables++;
      }
    }

    // Expand each constraint
    for (let i = 0; i < constraints.length; i++) {
      let constraint = [...constraints[i]]; //copy
      numNewVariables = 0;
      for (let j = 0; j < unrestrictedVariables.length; j++) {
        if (unrestrictedVariables[j]) {
          constraint = CanonicalLPConverter.handleUnrestrictedVariable(constraint, j + numNewVariables); //adjust index for previously expanded variables
          numNewVariables++;
        }
      }

      // 3. Convert constraints to <=
      if (constraintTypes[i] === ">=") {
        const converted = CanonicalLPConverter.convertGreaterThanToLessThan(constraint, rhs[i]);
        canonicalConstraints.push(converted.coefficients);
        canonicalRhs.push(converted.rhs);
      } else if (constraintTypes[i] === "=") {
        const converted = CanonicalLPConverter.convertEqualityToInequality(constraint, rhs[i]);
        canonicalConstraints.push(converted.coefficients1);
        canonicalRhs.push(converted.rhs1);
        canonicalConstraints.push(converted.coefficients2);
        canonicalRhs.push(converted.rhs2);
      } else {
        canonicalConstraints.push(constraint);
        canonicalRhs.push(rhs[i]);
      }
    }

    return {
      objective: canonicalObjective,
      constraints: canonicalConstraints,
      rhs: canonicalRhs
    };
  }
}
