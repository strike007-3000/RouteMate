/** @typedef {import('./db').TripExpense} TripExpense */

/**
 * @param {string} value
 * @returns {string[]}
 */
function parseParticipants(value) {
  const participants = new Map();
  for (const entry of value.split(',')) {
    const name = entry.trim();
    if (name && !participants.has(name.toLocaleLowerCase())) {
      participants.set(name.toLocaleLowerCase(), name);
    }
  }
  return [...participants.values()];
}

/**
 * @param {Array<Pick<TripExpense, 'amount' | 'payer' | 'participants'>>} expenses
 * @returns {Record<string, number>}
 */
function calculateBalances(expenses) {
  /** @type {Record<string, number>} */
  const balances = {};

  for (const expense of expenses) {
    if (!Number.isFinite(expense.amount) || expense.participants.length === 0) continue;

    const share = expense.amount / expense.participants.length;
    balances[expense.payer] = (balances[expense.payer] ?? 0) + expense.amount;

    for (const participant of expense.participants) {
      balances[participant] = (balances[participant] ?? 0) - share;
    }
  }

  return balances;
}

/**
 * @param {TripExpense[]} expenses
 * @returns {Record<string, TripExpense[]>}
 */
function groupExpensesByCurrency(expenses) {
  return expenses.reduce((groups, expense) => {
    const currency = expense.currency.trim().toUpperCase();
    (groups[currency] ??= []).push(expense);
    return groups;
  }, /** @type {Record<string, TripExpense[]>} */ ({}));
}

module.exports = { calculateBalances, groupExpensesByCurrency, parseParticipants };
