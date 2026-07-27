
// Single source of truth for the site version — bump this one line per release.
// It is rendered into every .header-version badge on load.
const SITE_VERSION = 'v1.0.16';

function getProjectRoot(){
  const path = window.location.pathname;
  if(path.includes('/pages/destinations/')) return '../../';
  if(path.includes('/pages/')) return '../';
  return '';
}

const PROJECT_ROOT = getProjectRoot();

async function fetchJson(path){
  const res = await fetch(`${PROJECT_ROOT}${path}`);
  if(!res.ok) throw new Error(`Unable to load ${path}`);
  return res.json();
}

async function loadDestinationManifest(){
  return fetchJson('data/destinations/index.json');
}

async function loadDestination(id){
  return fetchJson(`data/destinations/${id}.json`);
}

async function loadAllDestinations(){
  const manifest = await loadDestinationManifest();
  const items = await Promise.all(manifest.order.map(loadDestination));
  return { manifest, items };
}

function money(v,c='€'){
  return `${c}${Number(v).toLocaleString('en-US')}`;
}

function setActiveNav(){
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(a=>{
    if(a.getAttribute('href').endsWith(current)) a.classList.add('active');
  });
}

function renderVersion(){
  document.querySelectorAll('.header-version').forEach(el=>{ el.textContent = SITE_VERSION; });
}

document.addEventListener('DOMContentLoaded', ()=>{
  setActiveNav();
  renderVersion();
});
