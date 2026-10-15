const {test}=require('node:test');const assert=require('node:assert/strict');const F=require('../dist/finance.js');
const state=()=>({transactions:[{type:'income',amount:50000},{type:'expense',amount:2000,category:'Food'}],goals:[{saved:5000}],budgets:{Emergency:5000},nextDate:'2026-10-25'});
test('savings reduce spendable balance without counting as expenses',()=>{assert.equal(F.balance(state()),43000);assert.equal(F.spent(state(),'Food'),2000);});
test('daily estimate protects savings and emergency reserve',()=>{const s=F.safe(state(),new Date(2026,9,15));assert.deepEqual(s,{days:10,available:38000,daily:3800});});
test('overdue allowance uses one day and spending reduces emergency reserve',()=>{const s=state();s.transactions.push({type:'expense',amount:1000,category:'Emergency'});assert.equal(F.safe(s,new Date(2026,9,27)).daily,38000);});
test('safe to spend never becomes negative',()=>{const s=state();s.budgets.Emergency=100000;assert.equal(F.safe(s).daily,0);});
