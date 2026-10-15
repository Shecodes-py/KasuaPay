const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
test('income, expense, goal contribution, allocation and persistence work together',()=>{
  const nodes=new Map(),listeners={};let stored=null;
  function node(selector){if(!nodes.has(selector))nodes.set(selector,{textContent:'',innerHTML:'',dataset:{},classList:{add(){},remove(){}},addEventListener(name,fn){listeners[selector+':'+name]=fn;},showModal(){},close(){}});return nodes.get(selector);}
  const context=vm.createContext({console,Date,Math,Number,String,Object,Array,JSON,Error,Intl,Map,Set,crypto:require('node:crypto').webcrypto,setTimeout(){return 1;},clearTimeout(){},location:{hash:''},localStorage:{getItem(){return stored;},setItem(k,v){stored=v;}},document:{querySelector:node,querySelectorAll(){return [];},addEventListener(){}},window:{addEventListener(){}},FormData:class{constructor(){return Object.entries(context.formInput);}}});
  vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist/finance.js'),'utf8'),context);
  context.Finance=context.window.Finance;
  vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist/app.js'),'utf8'),context);
  function submit(kind,data,id=''){context.formInput=data;node('#modal-form').dataset.id=id;vm.runInContext(`formKind=${JSON.stringify(kind)}`,context);listeners['#modal-form:submit']({preventDefault(){},target:node('#modal-form')});assert.equal(node('#form-error').textContent,'');}
  submit('income',{amount:'50000',note:'Allowance',date:'2026-10-15'});
  submit('expense',{amount:'2000',note:'Lunch',category:'Food',date:'2026-10-15'});
  submit('goal',{name:'Project materials',target:'10000',due:''});
  const id=JSON.parse(stored).goals[0].id;
  submit('contribute',{amount:'5000'},id);
  submit('allocate',{Food:'12000',Transport:'8000',Data:'5000',Academics:'7000',Emergency:'5000',Flexible:'8000'});
  const state=JSON.parse(stored);assert.equal(state.transactions.length,2);assert.equal(state.goals[0].saved,5000);assert.equal(state.budgets.Emergency,5000);assert.equal(vm.runInContext('F.balance(state)',context),43000);
  assert.match(node('#app').innerHTML,/43,000/);
  context.formInput={amount:'999999',note:'Too much',category:'Food',date:'2026-10-15'};vm.runInContext("formKind='expense'",context);listeners['#modal-form:submit']({preventDefault(){},target:node('#modal-form')});assert.match(node('#form-error').textContent,/larger than/);assert.equal(JSON.parse(stored).transactions.length,2);
});
