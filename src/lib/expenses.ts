import type { TripExpense } from './db';

export function calculateBalances(expenses: Pick<TripExpense, 'amount' | 'payer' | 'participants'>[]) {
  const balances: Record<string, number> = {};

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

export function groupExpensesByCurrency(expenses: TripExpense[]) {
  return expenses.reduce<Record<string, TripExpense[]>>((groups, expense) => {
    const currency = expense.currency.trim().toUpperCase();
    (groups[currency] ??= []).push(expense);
    return groups;
  }, {});
}
