
document.addEventListener('DOMContentLoaded', async ()=>{
  const { items } = await loadAllDestinations();
  const tbody = document.querySelector('#compare-body');
  tbody.innerHTML = items.map(d=>`
    <tr>
      <td>${d.flag} ${d.name}</td>
      <td>${d.score}/10</td>
      <td>${money(d.budget.min,d.budget.currency)}–${money(d.budget.max,d.budget.currency)}</td>
      <td>${d.pros[0]}</td>
      <td>${d.cons[0]}</td>
    </tr>`).join('');
});
