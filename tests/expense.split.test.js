const { calculateBalances, groupExpensesByCurrency, parseParticipants } = require('../src/lib/expenses.js');

function testSplit() {
  const expenses = [
    { amount: 100, payer: 'Alice', participants: ['Alice','Bob'] },
    { amount: 60, payer: 'Bob', participants: ['Alice','Bob','Carol'] }
  ];
  const balances = calculateBalances(expenses);
  // Alice paid 100, owes 50 on first, 20 on second => net +30
  // Bob paid 60, owes 50+20=70 => net -10
  // Carol owes 20 => net -20
  console.log(balances);
  if (Math.abs(balances['Alice'] - 30) > 0.001) throw new Error('Alice balance wrong');
  if (Math.abs(balances['Bob'] + 10) > 0.001) throw new Error('Bob balance wrong');
  if (Math.abs(balances['Carol'] + 20) > 0.001) throw new Error('Carol balance wrong');

  const grouped = groupExpensesByCurrency([
    { amount: 10, currency: 'eur', payer: 'Alice', participants: ['Alice'] },
    { amount: 20, currency: 'USD', payer: 'Bob', participants: ['Bob'] }
  ]);
  if (grouped.EUR.length !== 1 || grouped.USD.length !== 1) throw new Error('Currencies were mixed');
  const participants = parseParticipants('Alice, Bob, bob, , Alice');
  if (participants.length !== 2 || participants[0] !== 'Alice' || participants[1] !== 'Bob') throw new Error('Participants were not normalized');
  if (parseParticipants(',,').length !== 0) throw new Error('Empty participants were retained');
  console.log('PASS split calc');
}

testSplit();
