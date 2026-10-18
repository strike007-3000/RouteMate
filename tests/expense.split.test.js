// RED phase: test expense split calculation
function calculateBalances(expenses) {
  const balances = {};
  for (const e of expenses) {
    if (!balances[e.payer]) balances[e.payer] = 0;
    const share = e.amount / e.participants.length;
    for (const p of e.participants) {
      if (!balances[p]) balances[p] = 0;
      balances[p] -= share;
    }
    balances[e.payer] += e.amount;
  }
  return balances;
}

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
  console.log('PASS split calc');
}

testSplit();
