
document.addEventListener('DOMContentLoaded', async ()=>{
  const key=document.body.dataset.destination;
  const d=await loadDestination(key);

  document.title = `${d.name} · טיול חברים`;
  document.querySelector('#title').textContent=`${d.flag} ${d.name}`;
  document.querySelector('#tagline').textContent=d.tagline;
  document.querySelector('#score').textContent=`${d.score}/10`;
  document.querySelector('#budget').textContent=
    `${money(d.budget.min,d.budget.currency)}–${money(d.budget.max,d.budget.currency)}`;
  document.querySelector('#highlights').innerHTML=
    d.highlights.map(x=>`<span class="badge">${x}</span>`).join('');
  document.querySelector('#pros').innerHTML=d.pros.map(x=>`<li>${x}</li>`).join('');
  document.querySelector('#cons').innerHTML=d.cons.map(x=>`<li>${x}</li>`).join('');
  document.querySelector('#itinerary-body').innerHTML=d.itinerary.map(x=>`
    <tr>
      <td>${x.day}</td>
      <td>${x.morning}</td>
      <td>${x.afternoon}</td>
      <td>${x.evening}</td>
    </tr>`).join('');
  document.querySelector('#costs-body').innerHTML=d.costs.map(x=>`
    <tr>
      <td>${x[0]}</td>
      <td>${money(x[1],d.budget.currency)}</td>
      <td>${money(x[2],d.budget.currency)}</td>
    </tr>`).join('');

  const weather = document.querySelector('#weather-details');
  if(weather){
    weather.innerHTML = `
      <div class="weather-metrics">
        <div class="weather-metric"><span>🌡️ יום</span><strong>${d.weather.dayTemperature}</strong></div>
        <div class="weather-metric"><span>🌙 לילה</span><strong>${d.weather.nightTemperature}</strong></div>
        <div class="weather-metric"><span>🌧️ גשם</span><strong>${d.weather.rainChance}</strong></div>
        <div class="weather-metric"><span>☀️ שעות אור</span><strong>${d.weather.daylight}</strong></div>
        <div class="weather-metric"><span>🌅 זריחה</span><strong>${d.weather.sunrise}</strong></div>
        <div class="weather-metric"><span>🌇 שקיעה</span><strong>${d.weather.sunset}</strong></div>
        <div class="weather-metric weather-comfort"><span>⭐ נוחות</span><strong>${d.weather.comfort}</strong></div>
      </div>
      <p class="weather-summary">${d.weather.summary}</p>`;
  }

  await loadDestinationFlights(key);
});


async function loadDestinationFlights(destinationId){
  const host=document.querySelector('#destination-flights');
  const summary=document.querySelector('#flight-route-summary');
  if(!host) return;
  try{
    const response=await fetch('../../data/flights/index.json');
    if(!response.ok) throw new Error('Flight data request failed');
    const data=await response.json();
    const route=data.destinations.find(item=>item.id===destinationId);
    if(!route) throw new Error('Destination flight data missing');

    summary.textContent=`TLV → ${route.airport} · משך ממוצע ${route.avgDuration} · ${route.routePrice}`;
    host.innerHTML=`
      <div class="destination-flight-meta">
        <div><span class="flight-meta-label">טיסות ישירות</span><strong>${route.directAirlines}</strong></div>
        <div><span class="flight-meta-label">מקור</span><strong>${data.source}</strong></div>
      </div>
      <div class="destination-flight-list">
        ${route.options.map(option=>flightRow(option, route.avgDuration)).join('')}
      </div>
      <p class="flight-source-note">${route.sourceNote} המחירים, שעות הטיסה והכבודה עשויים להשתנות ויש לאמת אותם בחיפוש החי.</p>`;
  }catch(error){
    host.innerHTML='<div class="notice">לא ניתן לטעון את נתוני הטיסות. יש לפתוח את האתר דרך GitHub Pages או שרת מקומי.</div>';
  }
}

function flightRow(option, averageDuration){
  return `<article class="destination-flight-row">
    <div class="flight-row-option"><span class="option-letter">${option.id}</span></div>
    <div class="flight-row-dates">
      <strong>${formatFlightDate(option.outboundDate)} → ${formatFlightDate(option.returnDate)}</strong>
      <span>הלוך: ${option.outboundWindow} · חזור: ${option.returnWindow}</span>
    </div>
    <div class="flight-row-details">
      <span><small>חברה / מספר טיסה</small>${option.airline} · ${option.flightNumber}</span>
      <span><small>מחיר לאדם</small>${option.price}</span>
      <span><small>משך</small>${averageDuration} בממוצע</span>
      <span><small>ישירה</small>${option.direct}</span>
      <span><small>כבודה</small>${option.baggage}</span>
      <span><small>נוחות</small>${option.comfort}</span>
    </div>
    <a class="btn flight-row-link" href="${option.url}" target="_blank" rel="noopener" aria-label="פתח חיפוש Skyscanner לפי התאריכים והשעות שנבחרו">פתח ב‑Skyscanner</a>
  </article>`;
}

function formatFlightDate(value){
  const [year,month,day]=value.split('-');
  return `${day}/${month}/${year}`;
}
