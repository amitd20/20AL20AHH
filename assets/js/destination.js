
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
  await loadDestinationLodging(key);
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


function lodgingStorageKey(destinationId){
  return `lodging:${destinationId}`;
}

function readLocalLodging(destinationId){
  try{
    const raw=localStorage.getItem(lodgingStorageKey(destinationId));
    const parsed=raw?JSON.parse(raw):[];
    return Array.isArray(parsed)?parsed:[];
  }catch(error){
    return [];
  }
}

function writeLocalLodging(destinationId, listings){
  try{
    localStorage.setItem(lodgingStorageKey(destinationId), JSON.stringify(listings));
  }catch(error){
    /* storage unavailable (private mode / quota) — row stays in memory only */
  }
}

async function loadDestinationLodging(destinationId){
  const host=document.querySelector('#destination-lodging');
  if(!host) return;

  let shared=[];
  try{
    const response=await fetch('../../data/lodging/index.json');
    if(!response.ok) throw new Error('Lodging data request failed');
    const data=await response.json();
    const entry=data.destinations.find(item=>item.id===destinationId);
    shared=(entry && Array.isArray(entry.listings))?entry.listings:[];
  }catch(error){
    host.innerHTML='<div class="notice">לא ניתן לטעון את נתוני הלינה. יש לפתוח את האתר דרך GitHub Pages או שרת מקומי.</div>';
    return;
  }

  const renderList=()=>{
    const local=readLocalLodging(destinationId);
    const rows=[
      ...shared.map(item=>lodgingRow(item,false)),
      ...local.map((item,index)=>lodgingRow(item,true,index))
    ];
    host.innerHTML=`
      <div class="destination-lodging-list">
        ${rows.length?rows.join(''):'<p class="muted">אין עדיין אפשרויות לינה. הוסיפו לינה או הדביקו קישור Airbnb ל-Claude.</p>'}
      </div>
      <p class="flight-source-note">מחירי Airbnb אינם נשלפים אוטומטית — יש לאמת בקישור החי. כדי לשמור לינה לכולם, הדביקו את הקישור ל-Claude.</p>`;

    host.querySelectorAll('[data-remove-local]').forEach(button=>{
      button.addEventListener('click', ()=>{
        const idx=Number(button.dataset.removeLocal);
        const list=readLocalLodging(destinationId);
        list.splice(idx,1);
        writeLocalLodging(destinationId,list);
        renderList();
      });
    });
  };

  renderList();
  wireLodgingForm(destinationId, renderList);
}

function wireLodgingForm(destinationId, onSaved){
  const toggle=document.querySelector('#add-lodging');
  const form=document.querySelector('#lodging-form');
  if(!toggle || !form) return;

  toggle.addEventListener('click', ()=>{
    const showing=form.hasAttribute('hidden');
    if(showing) form.removeAttribute('hidden'); else form.setAttribute('hidden','');
    toggle.textContent=showing?'סגירת הטופס':'הוסף לינה';
  });

  form.addEventListener('submit', event=>{
    event.preventDefault();
    const value=name=>form.querySelector(`[name="${name}"]`).value.trim();
    const url=value('url');
    if(url && !/airbnb\./i.test(url)){
      form.querySelector('[name="url"]').setCustomValidity('נא להדביק קישור Airbnb תקין');
      form.querySelector('[name="url"]').reportValidity();
      return;
    }
    form.querySelector('[name="url"]').setCustomValidity('');

    const listing={
      name:value('name')||'לינה ללא שם',
      url,
      price:value('price')||null,
      rating:value('rating')||'',
      location:value('location')||'',
      guests:value('guests')||'',
      notes:value('notes')||''
    };

    const list=readLocalLodging(destinationId);
    list.push(listing);
    writeLocalLodging(destinationId,list);

    form.reset();
    form.setAttribute('hidden','');
    toggle.textContent='הוסף לינה';
    onSaved();
  });
}

function lodgingRow(listing, isLocal, localIndex){
  const nameHtml=listing.url
    ? `<a href="${listing.url}" target="_blank" rel="noopener">${listing.name}</a>`
    : `${listing.name}`;

  const priceHtml=listing.price
    ? `${listing.price}`
    : (listing.priceNote || 'בדיקה חיה ב-Airbnb');

  const capacityBits=[];
  if(listing.guests) capacityBits.push(`👥 ${listing.guests} אורחים`);
  if(listing.bedrooms) capacityBits.push(`🛏️ ${listing.bedrooms} חדרים`);
  if(listing.beds) capacityBits.push(`${listing.beds} מיטות`);
  if(listing.bathrooms) capacityBits.push(`🚿 ${listing.bathrooms} מקלחות`);

  const ratingHtml=listing.rating
    ? `⭐ ${listing.rating}${listing.reviews?` · ${listing.reviews} ביקורות`:''}`
    : '';

  const removeHtml=isLocal
    ? `<button type="button" class="lodging-remove" data-remove-local="${localIndex}" aria-label="הסרת לינה מקומית">הסרה</button>`
    : '';

  return `<article class="destination-lodging-row">
    <div class="lodging-row-main">
      <strong class="lodging-name">${nameHtml}${isLocal?' <span class="tag-local">מקומי</span>':''}</strong>
      ${listing.location?`<span class="lodging-location">📍 ${listing.location}</span>`:''}
      ${capacityBits.length?`<span class="lodging-capacity">${capacityBits.join(' · ')}</span>`:''}
      ${listing.notes?`<span class="lodging-notes muted">${listing.notes}</span>`:''}
    </div>
    <div class="lodging-row-side">
      <div class="lodging-price"><small>מחיר</small><strong>${priceHtml}</strong></div>
      ${ratingHtml?`<div class="lodging-rating">${ratingHtml}</div>`:''}
      ${removeHtml}
    </div>
  </article>`;
}
