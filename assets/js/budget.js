
document.addEventListener('DOMContentLoaded', async ()=>{
  const { items } = await loadAllDestinations();
  const byId = Object.fromEntries(items.map(d=>[d.id,d]));
  const select = document.querySelector('#destination');

  items.forEach(d=>{
    const opt=document.createElement('option');
    opt.value=d.id;
    opt.textContent=`${d.flag} ${d.name}`;
    select.appendChild(opt);
  });

  const update=()=>{
    const d=byId[select.value];
    const people=Number(document.querySelector('#people').value || 1);
    document.querySelector('#per-person').textContent=
      `${money(d.budget.min,d.budget.currency)}–${money(d.budget.max,d.budget.currency)}`;
    document.querySelector('#group-total').textContent=
      `${money(d.budget.min*people,d.budget.currency)}–${money(d.budget.max*people,d.budget.currency)}`;
  };

  select.addEventListener('change',update);
  document.querySelector('#people').addEventListener('input',update);
  update();
});
