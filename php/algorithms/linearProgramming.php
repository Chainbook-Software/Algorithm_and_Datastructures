<?php

/**
 * Linear Programming utilities for converting problems to canonical form.
 */

/**
 * Converts a Linear Program (LP) to Canonical Form.
 */
class CanonicalLPConverter {

  /**
   * Converts a minimization problem to a maximization problem.
   * @param array $objectiveCoefficients The coefficients of the objective function.
   * @return array The negated coefficients for maximization.
   */
  public static function convertMinToMax(array $objectiveCoefficients): array {
    return array_map(function($c) { return -$c; }, $objectiveCoefficients);
  }

  /**
   * Converts a "greater than or equal to" constraint to a "less than or equal to" constraint.
   * @param array $constraintCoefficients The coefficients of the constraint.
   * @param float $rhs The right-hand side value of the constraint.
   * @return array The negated coefficients and right-hand side.
   */
  public static function convertGreaterThanToLessThan(array $constraintCoefficients, float $rhs): array {
    return [
      'coefficients' => array_map(function($c) { return -$c; }, $constraintCoefficients),
      'rhs' => -$rhs
    ];
  }

  /**
   * Converts an equality constraint to two inequality constraints (<= and >=, then >= is converted to <=).
   * @param array $constraintCoefficients The coefficients of the constraint.
   * @param float $rhs The right-hand side value of the constraint.
   * @return array Two sets of coefficients and right-hand sides for the two <= constraints.
   */
  public static function convertEqualityToInequality(array $constraintCoefficients, float $rhs): array {
    return [
      'coefficients1' => $constraintCoefficients,
      'rhs1' => $rhs,
      'coefficients2' => array_map(function($c) { return -$c; }, $constraintCoefficients),
      'rhs2' => -$rhs
    ];
  }

  /**
   * Handles an unrestricted variable by replacing it with two non-negative variables (x' - x'').
   * This affects both the objective function and the constraints.
   * @param array $coefficients The coefficients of a constraint or objective function.
   * @param int $variableIndex The index of the unrestricted variable.
   * @return array The updated coefficients, with the unrestricted variable replaced by two variables.
   */
  public static function handleUnrestrictedVariable(array $coefficients, int $variableIndex): array {
    $newCoefficients = [];
    for ($i = 0; $i < count($coefficients); $i++) {
      if ($i === $variableIndex) {
        $newCoefficients[] = $coefficients[$i]; // Coefficient for x'
        $newCoefficients[] = -$coefficients[$i]; // Coefficient for x''
      } else {
        $newCoefficients[] = $coefficients[$i];
      }
    }
    return $newCoefficients;
  }

  /**
   * Converts a Linear Program to Canonical Form.
   * @param array $objective The coefficients of the objective function.
   * @param array $constraints A matrix of constraint coefficients.
   * @param array $rhs The right-hand side values for the constraints.
   * @param string $objectiveType Whether the objective is "min" or "max".
   * @param array $constraintTypes An array of constraint types ("<=", ">=", "=").
   * @param array $unrestrictedVariables An array of boolean values indicating whether each variable is unrestricted.
   * @return array The converted objective, constraints, and rhs in canonical form.
   */
  public static function convertToCanonicalForm(
    array $objective,
    array $constraints,
    array $rhs,
    string $objectiveType,
    array $constraintTypes,
    array $unrestrictedVariables
  ): array {

    $canonicalObjective = $objective; //copy
    $canonicalConstraints = [];
    $canonicalRhs = [];

    // 1. Convert Minimization to Maximization
    if ($objectiveType === "min") {
      $canonicalObjective = self::convertMinToMax($objective);
    }

    // 2. Handle Unrestricted Variables (expand objective function first)
    $numNewVariables = 0;
    for ($i = 0; $i < count($unrestrictedVariables); $i++) {
      if ($unrestrictedVariables[$i]) {
        $canonicalObjective = self::handleUnrestrictedVariable($canonicalObjective, $i + $numNewVariables); //adjust index for previously expanded variables
        $numNewVariables++;
      }
    }

    // Expand each constraint
    for ($i = 0; $i < count($constraints); $i++) {
      $constraint = $constraints[$i]; //copy
      $numNewVariables = 0;
      for ($j = 0; $j < count($unrestrictedVariables); $j++) {
        if ($unrestrictedVariables[$j]) {
          $constraint = self::handleUnrestrictedVariable($constraint, $j + $numNewVariables); //adjust index for previously expanded variables
          $numNewVariables++;
        }
      }

      // 3. Convert constraints to <=
      if ($constraintTypes[$i] === ">=") {
        $converted = self::convertGreaterThanToLessThan($constraint, $rhs[$i]);
        $canonicalConstraints[] = $converted['coefficients'];
        $canonicalRhs[] = $converted['rhs'];
      } else if ($constraintTypes[$i] === "=") {
        $converted = self::convertEqualityToInequality($constraint, $rhs[$i]);
        $canonicalConstraints[] = $converted['coefficients1'];
        $canonicalRhs[] = $converted['rhs1'];
        $canonicalConstraints[] = $converted['coefficients2'];
        $canonicalRhs[] = $converted['rhs2'];
      } else {
        $canonicalConstraints[] = $constraint;
        $canonicalRhs[] = $rhs[$i];
      }
    }

    return [
      'objective' => $canonicalObjective,
      'constraints' => $canonicalConstraints,
      'rhs' => $canonicalRhs
    ];
  }
}

?>
