(function(root){
  // Only a simulation is shipped. An authorized provider must implement this
  // contract through a server, verified callbacks and provider idempotency.
  function simulated(engine){return {
    describe(s){return {provider:'Simulated provider',label:'BMoney concept · no partnership or API integration verified',status:s.card.status,category:s.card.category,balance:engine.ledger(s).balances[s.card.category],limit:s.card.limit};},
    purchase(s,input){if(s.card.status!=='active')throw Error('The simulated card is frozen.');const previous=s.events.find(e=>e.ref===input.ref);if(previous)return engine.spend(s,{...input,category:s.card.category,card:true});const month=input.date.slice(0,7);const used=engine.total(s.events.filter(e=>e.card&&e.date.slice(0,7)===month).map(e=>e.amount));if(used+input.amount>s.card.limit)throw Error('Monthly simulated card spending limit reached.');return engine.spend(s,{...input,category:s.card.category,card:true});}
  };}
  const api={simulated};if(typeof module!=='undefined')module.exports=api;root.CardProviders=api;
})(typeof window==='undefined'?globalThis:window);
