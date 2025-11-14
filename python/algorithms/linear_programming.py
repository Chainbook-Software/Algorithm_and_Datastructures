"""
Linear Programming utilities for converting problems to canonical form.
"""

from typing import List, Dict, Any

class CanonicalLPConverter:
  """Converts a Linear Program (LP) to Canonical Form."""

  @staticmethod
  def convert_min_to_max(objective_coefficients: List[float]) -> List[float]:
    """Converts a minimization problem to a maximization problem.

    Args:
      objective_coefficients: The coefficients of the objective function.

    Returns:
      The negated coefficients for maximization.
    """
    return [-c for c in objective_coefficients]

  @staticmethod
  def convert_greater_than_to_less_than(constraint_coefficients: List[float], rhs: float) -> Dict[str, Any]:
    """Converts a "greater than or equal to" constraint to a "less than or equal to" constraint.

    Args:
      constraint_coefficients: The coefficients of the constraint.
      rhs: The right-hand side value of the constraint.

    Returns:
      The negated coefficients and right-hand side.
    """
    return {
      'coefficients': [-c for c in constraint_coefficients],
      'rhs': -rhs
    }

  @staticmethod
  def convert_equality_to_inequality(constraint_coefficients: List[float], rhs: float) -> Dict[str, Any]:
    """Converts an equality constraint to two inequality constraints (<= and >=, then >= is converted to <=).

    Args:
      constraint_coefficients: The coefficients of the constraint.
      rhs: The right-hand side value of the constraint.

    Returns:
      Two sets of coefficients and right-hand sides for the two <= constraints.
    """
    return {
      'coefficients1': constraint_coefficients,
      'rhs1': rhs,
      'coefficients2': [-c for c in constraint_coefficients],
      'rhs2': -rhs
    }

  @staticmethod
  def handle_unrestricted_variable(coefficients: List[float], variable_index: int) -> List[float]:
    """Handles an unrestricted variable by replacing it with two non-negative variables (x' - x'').

    This affects both the objective function and the constraints.

    Args:
      coefficients: The coefficients of a constraint or objective function.
      variable_index: The index of the unrestricted variable.

    Returns:
      The updated coefficients, with the unrestricted variable replaced by two variables.
    """
    new_coefficients = []
    for i in range(len(coefficients)):
      if i == variable_index:
        new_coefficients.append(coefficients[i])  # Coefficient for x'
        new_coefficients.append(-coefficients[i])  # Coefficient for x''
      else:
        new_coefficients.append(coefficients[i])
    return new_coefficients

  @staticmethod
  def convert_to_canonical_form(
    objective: List[float],
    constraints: List[List[float]],
    rhs: List[float],
    objective_type: str,
    constraint_types: List[str],
    unrestricted_variables: List[bool]
  ) -> Dict[str, Any]:
    """Converts a Linear Program to Canonical Form.

    Args:
      objective: The coefficients of the objective function.
      constraints: A matrix of constraint coefficients.
      rhs: The right-hand side values for the constraints.
      objective_type: Whether the objective is "min" or "max".
      constraint_types: An array of constraint types ("<=", ">=", "=").
      unrestricted_variables: An array of boolean values indicating whether each variable is unrestricted.

    Returns:
      The converted objective, constraints, and rhs in canonical form.
    """

    canonical_objective = objective.copy()  # copy
    canonical_constraints = []
    canonical_rhs = []

    # 1. Convert Minimization to Maximization
    if objective_type == "min":
      canonical_objective = CanonicalLPConverter.convert_min_to_max(objective)

    # 2. Handle Unrestricted Variables (expand objective function first)
    num_new_variables = 0
    for i in range(len(unrestricted_variables)):
      if unrestricted_variables[i]:
        canonical_objective = CanonicalLPConverter.handle_unrestricted_variable(canonical_objective, i + num_new_variables)  # adjust index for previously expanded variables
        num_new_variables += 1

    # Expand each constraint
    for i in range(len(constraints)):
      constraint = constraints[i].copy()  # copy
      num_new_variables = 0
      for j in range(len(unrestricted_variables)):
        if unrestricted_variables[j]:
          constraint = CanonicalLPConverter.handle_unrestricted_variable(constraint, j + num_new_variables)  # adjust index for previously expanded variables
          num_new_variables += 1

      # 3. Convert constraints to <=
      if constraint_types[i] == ">=":
        converted = CanonicalLPConverter.convert_greater_than_to_less_than(constraint, rhs[i])
        canonical_constraints.append(converted['coefficients'])
        canonical_rhs.append(converted['rhs'])
      elif constraint_types[i] == "=":
        converted = CanonicalLPConverter.convert_equality_to_inequality(constraint, rhs[i])
        canonical_constraints.append(converted['coefficients1'])
        canonical_rhs.append(converted['rhs1'])
        canonical_constraints.append(converted['coefficients2'])
        canonical_rhs.append(converted['rhs2'])
      else:
        canonical_constraints.append(constraint)
        canonical_rhs.append(rhs[i])

    return {
      'objective': canonical_objective,
      'constraints': canonical_constraints,
      'rhs': canonical_rhs
    }
