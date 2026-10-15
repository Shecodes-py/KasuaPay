(function(root){
const categories=['Food','Transport','Data','Academics','Emergency','Flexible'];
const weights=[.30,.20,.125,.175,0,.20];
function balance(s){return s.transactions.reduce((n,t)=>n+(t.type==='income'?t.amount:-t.amount),0)-s.goals.reduce((n,g)=>n+g.saved,0);}
function spent(s,c){return s.transactions.filter(t=>t.type==='expense'&&t.category===c).reduce((n,t)=>n+t.amount,0);}
function safe(s,today=new Date()){const day=new Date(today.getFullYear(),today.getMonth(),today.getDate());const end=new Date(s.nextDate+'T00:00:00');const days=Math.max(1,Math.ceil((end-day)/86400000));const emergency=Math.max(0,(s.budgets.Emergency||0)-spent(s,'Emergency'));return {days,available:Math.max(0,balance(s)-emergency),daily:Math.floor(Math.max(0,balance(s)-emergency)/days)};}
const api={categories,weights,balance,spent,safe};if(typeof module!=='undefined')module.exports=api;root.Finance=api;
})(typeof window==='undefined'?globalThis:window);
