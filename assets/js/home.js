
document.addEventListener('DOMContentLoaded', async ()=>{
  const { manifest, items } = await loadAllDestinations();
  const holder = document.querySelector('#destination-cards');
  const tones = {
    prague: 'tone-prague',
    krakow: 'tone-krakow',
    budapest: 'tone-budapest'
  };

  holder.innerHTML = items.map((d, index)=>`
    <a class="card destination-card ${tones[d.id] || ''}" href="pages/destinations/${d.id}.html">
      <div class="destination-topline">
        <span class="destination-rank">#${index + 1}</span>
        <span class="destination-score">${d.score}/10</span>
      </div>
      <div class="destination-name">${d.flag} ${d.name}</div>
      <div class="destination-country">${d.country}</div>
      <p>${d.tagline}</p>
      <div class="destination-highlights">
        ${d.highlights.slice(0,3).map(x=>`<span>${x}</span>`).join('')}
      </div>
      <div class="destination-footer">
        <div>
          <small>תקציב לאדם</small>
          <strong>${money(d.budget.min,d.budget.currency)}–${money(d.budget.max,d.budget.currency)}</strong>
        </div>
        <span class="card-arrow">←</span>
      </div>
    </a>`).join('');
});
