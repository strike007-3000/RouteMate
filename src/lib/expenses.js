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
  /** @type {Map<string, string>} */
  const displayNames = new Map();

  for (const expense of expenses) {
    const payer = expense.payer.trim();
    if (payer) displayNames.set(payer.toLocaleLowerCase(), payer);
  }
  for (const expense of expenses) {
    for (const participant of expense.participants) {
      const name = participant.trim();
      if (name && !displayNames.has(name.toLocaleLowerCase())) {
        displayNames.set(name.toLocaleLowerCase(), name);
      }
    }
  }

  for (const expense of expenses) {
    if (!Number.isFinite(expense.amount) || expense.participants.length === 0) continue;

    const share = expense.amount / expense.participants.length;
    const payer = displayNames.get(expense.payer.trim().toLocaleLowerCase()) ?? expense.payer.trim();
    balances[payer] = (balances[payer] ?? 0) + expense.amount;

    for (const participant of expense.participants) {
      const name = displayNames.get(participant.trim().toLocaleLowerCase()) ?? participant.trim();
      balances[name] = (balances[name] ?? 0) - share;
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
