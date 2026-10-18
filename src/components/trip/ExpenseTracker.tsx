'use client';

import React, { useState } from 'react';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import type { TripExpense } from '@/lib/db';
import { calculateBalances, groupExpensesByCurrency } from '@/lib/expenses';

interface ExpenseTrackerProps {
  tripId: number;
}

export const ExpenseTracker = ({ tripId }: ExpenseTrackerProps) => {
  const expenses = useLiveQuery(
    () => db.tripExpenses.where('tripId').equals(tripId).toArray(),
    [tripId]
  ) as TripExpense[] | undefined;

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [payer, setPayer] = useState('');
  const [participants, setParticipants] = useState('');
  const [notes, setNotes] = useState('');

  const handleAdd = async () => {
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0 || !currency.trim() || !payer.trim() || !participants.trim()) return;
    const participantsArr = participants.split(',').map(s => s.trim()).filter(Boolean);
    if (participantsArr.length === 0) return;
    await db.tripExpenses.add({
      tripId,
      amount: parsedAmount,
      currency: currency.trim().toUpperCase(),
      payer: payer.trim(),
      participants: participantsArr,
      notes,
      createdAt: new Date().toISOString()
    });
    setAmount('');
    setPayer('');
    setParticipants('');
    setNotes('');
  };

  const expenseGroups = groupExpensesByCurrency(expenses ?? []);

  return (
    <div className="glass-card rounded-[24px] p-6">
      <h3 className="text-white font-bold uppercase tracking-[0.2em] text-sm mb-4">Expenses</h3>
      <div className="space-y-3">
        <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount" className="auth-input w-full" />
        <input value={currency} onChange={e=>setCurrency(e.target.value)} placeholder="Currency" className="auth-input w-full" />
        <input value={payer} onChange={e=>setPayer(e.target.value)} placeholder="Payer" className="auth-input w-full" />
        <input value={participants} onChange={e=>setParticipants(e.target.value)} placeholder="Participants comma separated" className="auth-input w-full" />
        <input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Notes" className="auth-input w-full" />
        <button onClick={handleAdd} className="btn-primary w-full">Add Expense</button>
      </div>
      <div className="mt-6 text-white/80 text-sm">
        {Object.entries(expenseGroups).map(([expenseCurrency, currencyExpenses]) => {
          const total = currencyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
          const balances = calculateBalances(currencyExpenses);

          return (
            <div key={expenseCurrency} className="mb-4 last:mb-0">
              <p className="font-bold">Total: {total.toFixed(2)} {expenseCurrency}</p>
              <ul className="mt-2 space-y-1">
                {Object.entries(balances).map(([person, balance]) => (
                  <li key={person} className="text-xs text-zinc-400">
                    {person}: {balance >= 0 ? 'is owed' : 'owes'} {Math.abs(balance).toFixed(2)} {expenseCurrency}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        <ul className="mt-3 space-y-1">
          {expenses?.map(e => (
            <li key={e.id} className="text-xs text-zinc-400">
              {e.amount} {e.currency} by {e.payer} for {e.participants.join(', ')}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
