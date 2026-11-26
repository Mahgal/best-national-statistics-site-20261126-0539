import {years, series, ageGroups, sectors, cpiCategories, partners, regions, releases, datasets, indicators} from "./data.js";
const app = document.getElementById("app");
const fmt = (v, d=1) => Number(v).toLocaleString("en-GB", {minimumFractionDigits:d, maximumFractionDigits:d});
const last = a => a[a.length-1];
const delta = (a) => { const v = last(a)-a[a.length-2]; return `<span class="${v>=0?"up":"down"}">${v>=0?"▲":"▼"} ${fmt(Math.abs(v),1)} on year</span>`; };

function lineChart(list, opts={}) {
  const W=640,H=300,P=44, all=list.flatMap(s=>s.values);
  let min=Math.min(...all), max=Math.max(...all); if(opts.zero){min=Math.min(0,min);}
  const pad=(max-min)*0.12||1; min-=pad; max+=pad;
  const x=i=>P+(W-2*P)*i/(years.length-1), y=v=>H-P-(H-2*P)*(v-min)/(max-min);
  let g="";
  for(let k=0;k<=4;k++){const v=min+(max-min)*k/4, yy=y(v); g+=`<line class="gridline" x1="${P}" x2="${W-P}" y1="${yy}" y2="${yy}"/><text class="axis" x="4" y="${yy+3}">${fmt(v, opts.dec??0)}</text>`;}
  years.forEach((yr,i)=>{ if(i%2===0||i===years.length-1) g+=`<text class="axis" x="${x(i)-10}" y="${H-12}">${yr}</text>`;});
  list.forEach(s=>{ const pts=s.values.map((v,i)=>`${x(i)},${y(v)}`).join(" ");
    g+=`<polyline fill="none" stroke="${s.color}" stroke-width="3" points="${pts}"/>`+s.values.map((v,i)=>`<circle cx="${x(i)}" cy="${y(v)}" r="3.5" fill="${s.color}"><title>${s.label} ${years[i]}: ${v}</title></circle>`).join("");});
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${opts.title||"Line chart"}">${g}</svg><div class="legend">${list.map(s=>`<span><i style="background:${s.color}"></i>${s.label}</span>`).join("")}</div>`;
}
function barChart(items, opts={}) {
  const W=640,H=300,P=44, max=Math.max(...items.map(d=>d.value))*1.15, min=Math.min(0,...items.map(d=>d.value));
  const bw=(W-2*P)/items.length, y=v=>H-P-(H-2*P)*(v-min)/(max-min), zero=y(0);
  let g=`<line class="gridline" x1="${P}" x2="${W-P}" y1="${zero}" y2="${zero}"/>`;
  items.forEach((d,i)=>{ const h=Math.abs(y(d.value)-zero), yy=Math.min(y(d.value),zero);
    g+=`<rect x="${P+i*bw+3}" y="${yy}" width="${bw-6}" height="${h}" rx="3" fill="${d.color||"#0e8a7b"}"><title>${d.label}: ${d.value}</title></rect><text class="axis" x="${P+i*bw+3}" y="${H-12}">${d.label}</text><text class="axis" x="${P+i*bw+3}" y="${yy-4}">${fmt(d.value,opts.dec??1)}</text>`;});
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${opts.title||"Bar chart"}">${g}</svg>`;
}
function donut(items) {
  const total=items.reduce((s,d)=>s+d.share,0); let a=-Math.PI/2, paths="";
  const cols=["#0b6e6e","#2456a6","#d98a1f","#7aa33d","#8a5aa6","#b3402e"];
  items.forEach((d,i)=>{ const a2=a+2*Math.PI*d.share/total, r=95,cx=130,cy=120, r2=55;
    const p=(ang,rr)=>`${cx+rr*Math.cos(ang)},${cy+rr*Math.sin(ang)}`;
    paths+=`<path d="M ${p(a,r)} A ${r} ${r} 0 ${a2-a>Math.PI?1:0} 1 ${p(a2,r)} L ${p(a2,r2)} A ${r2} ${r2} 0 ${a2-a>Math.PI?1:0} 0 ${p(a,r2)} Z" fill="${cols[i]}"><title>${d.name}: ${d.share}%</title></path>`; a=a2;});
  return `<svg class="chart" viewBox="0 0 260 240" role="img" aria-label="Share of GDP by sector">${paths}</svg><div class="legend">${items.map((d,i)=>`<span><i style="background:${cols[i]}"></i>${d.name} ${d.share}%</span>`).join("")}</div>`;
}
function pyramid() {
  const W=640,rowH=30,H=ageGroups.length*rowH+30,mid=W/2,max=0.9;
  let g=`<text class="axis" x="${mid-70}" y="14">Male</text><text class="axis" x="${mid+30}" y="14">Female</text>`;
  ageGroups.forEach((d,i)=>{ const y=24+i*rowH, wm=(mid-60)*d.male/max, wf=(mid-60)*d.female/max;
    g+=`<rect x="${mid-wm}" y="${y}" width="${wm}" height="20" fill="#2456a6"><title>Male ${d.band}: ${d.male}m</title></rect><rect x="${mid}" y="${y}" width="${wf}" height="20" fill="#d98a1f"><title>Female ${d.band}: ${d.female}m</title></rect><text class="axis" x="2" y="${y+14}">${d.band}</text>`;});
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Population pyramid 2025">${g}</svg>`;
}
function sortableTable(id, cols, rows) {
  const head=cols.map((c,i)=>`<th><button data-sort="${id}:${i}">${c.label} ⇕</button></th>`).join("");
  const body=rows.map(r=>`<tr>${cols.map(c=>`<td>${c.fmt?c.fmt(r[c.key]):r[c.key]}</td>`).join("")}</tr>`).join("");
  return `<table id="${id}"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table><p class="muted">Select a column heading to sort.</p>`;
}
function wireSort(id, cols, rows, render) {
  document.querySelectorAll(`[data-sort^="${id}:"]`).forEach(b=>b.onclick=()=>{ const i=+b.dataset.sort.split(":")[1], k=cols[i].key;
    const dir=b.dataset.dir==="asc"?-1:1; b.dataset.dir=dir===1?"asc":"desc";
    rows.sort((a,b2)=> (typeof a[k]==="number"? a[k]-b2[k] : String(a[k]).localeCompare(String(b2[k])))*dir); render(); });
}
function kpi(label, value, dhtml, href) { return `<a class="kpi" href="${href}" style="text-decoration:none;color:inherit"><div class="l">${label}</div><div class="v">${value}</div><div class="d">${dhtml}</div></a>`; }
function pageTitle(t, lede){ return `<h1 class="page">${t}</h1><p class="lede">${lede}</p>`; }
function csvDownload(name, header, rows) {
  const csv=[header.join(","), ...rows.map(r=>r.join(","))].join("\n");
  const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"})); a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),500);
}

const views = {
home(){ app.innerHTML=`
  <section class="hero"><h1>Meridia in figures</h1><p>Population, economy, work, prices, trade and regions — the official statistics of the Republic of Meridia, published with methods and open data for every series.</p></section>
  <div class="kpis">
    ${kpi("Population, 1 Jan 2025","9.35m",delta(series.population.values),"#/population")}
    ${kpi("Real GDP growth, 2025","4.1%",delta(series.gdpGrowth.values),"#/economy")}
    ${kpi("Unemployment rate","5.4%",delta(series.unemployment.values),"#/labour")}
    ${kpi("Inflation (CPI)","2.6%",delta(series.inflation.values),"#/prices")}
    ${kpi("Exports of goods","$57.4bn",delta(series.exports.values),"#/trade")}
  </div>
  <div class="grid">
    <section class="card"><h2>Growth and jobs since 2015</h2>${lineChart([{...series.gdpGrowth,color:"#0e8a7b"},{...series.unemployment,color:"#b3402e"}],{title:"GDP growth and unemployment",dec:0})}<p class="muted">Output rebounded after the 2020 contraction; unemployment is at its lowest in the series.</p></section>
    <section class="card"><h2>Next releases</h2>${releases.slice(0,4).map(r=>`<div class="release"><span><strong>${r.title}</strong><br><small>${r.topic}</small></span><span>${r.date}</span></div>`).join("")}<p><a href="#/methods">Full release calendar →</a></p></section>
  </div>
  <section class="card"><h2>Explore by theme</h2><div class="tiles">${[["Population","#/population","9.35m people, life expectancy 78.2 years"],["Economy","#/economy","GDP per capita $22,810"],["Labour","#/labour","4.27m in work"],["Prices","#/prices","Inflation 2.6%, calculator included"],["Trade","#/trade","Exports $57.4bn, imports $61.2bn"],["Regions","#/regions","Seven regions compared"]].map((t,i)=>`<a class="tile" href="${t[1]}" style="background:hsl(${160+i*24} 55% 32%);text-decoration:none"><strong>${t[0]}</strong><span>${t[2]}</span></a>`).join("")}</div></section>`; },
population(){ let mode="line"; const draw=()=>{ app.innerHTML=pageTitle("Population","9.35 million people lived in Meridia at 1 January 2025. Growth is driven by net migration; births have eased for a decade.")+`
  <div class="controls"><label>Chart</label><button data-m="line" aria-pressed="${mode==="line"}">Line</button><button data-m="bar" aria-pressed="${mode==="bar"}">Bars</button><button class="secondary" id="dl">Download CSV</button></div>
  <div class="grid"><section class="card"><h2>Population 2015–2025</h2>${mode==="line"?lineChart([{...series.population,color:"#0b6e6e"}],{dec:1}):barChart(years.map((y,i)=>({label:String(y).slice(2),value:series.population.values[i]})),{dec:1})}</section>
  <section class="card"><h2>Age structure, 2025 (millions)</h2>${pyramid()}<p class="muted">Median age 39.4 years. The 65+ share is 18.6%.</p></section></div>
  <section class="card"><h2>Vital statistics</h2>${lineChart([{...series.births,color:"#2456a6"},{...series.lifeExpectancy,color:"#d98a1f"}],{title:"Births and life expectancy"})}<p>Live births fell to 106,000 in 2025 while life expectancy reached 78.2 years (76.1 for men, 80.3 for women).</p></section>`;
  document.querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{mode=b.dataset.m;draw();});
  document.getElementById("dl").onclick=()=>csvDownload("meridia-population.csv",["year","population_millions","births_thousands","life_expectancy"],years.map((y,i)=>[y,series.population.values[i],series.births.values[i],series.lifeExpectancy.values[i]])); };
  draw(); },
economy(){ app.innerHTML=pageTitle("Economy","Real GDP grew 4.1% in 2025. Services produce well over half of output; energy and mining grew fastest.")+`
  <div class="grid"><section class="card"><h2>Real GDP growth (%)</h2>${barChart(years.map((y,i)=>({label:String(y).slice(2),value:series.gdpGrowth.values[i],color:series.gdpGrowth.values[i]<0?"#b3402e":"#0e8a7b"})),{title:"GDP growth"})}</section>
  <section class="card"><h2>Share of GDP by sector, 2025</h2>${donut(sectors)}</section></div>
  <section class="card"><h2>GDP per capita (USD)</h2>${lineChart([{...series.gdpPerCapita,color:"#2456a6"}],{dec:0})}</section>
  <section class="card"><h2>Sectors in 2025</h2><div id="tbl"></div></section>`;
  const cols=[{key:"name",label:"Sector"},{key:"share",label:"Share of GDP %",fmt:v=>fmt(v)},{key:"growth",label:"Growth %",fmt:v=>fmt(v)}]; const rows=[...sectors];
  const render=()=>{document.getElementById("tbl").innerHTML=sortableTable("sectors",cols,rows); wireSort("sectors",cols,rows,render);}; render(); },
labour(){ app.innerHTML=pageTitle("Labour market","Employment reached 4.27 million in 2025 and unemployment fell to 5.4%, the lowest rate in the series.")+`
  <div class="grid"><section class="card"><h2>Unemployment rate (%)</h2>${lineChart([{...series.unemployment,color:"#b3402e"}],{zero:true})}</section>
  <section class="card"><h2>Employment (millions)</h2>${barChart(years.map((y,i)=>({label:String(y).slice(2),value:series.employment.values[i]})),{dec:2})}</section></div>
  <section class="card"><h2>What the survey says</h2><p>The labour force survey interviews 18,000 households each quarter. In 2025 the employment rate for ages 15–64 was 71.8% (74.9% for men, 68.7% for women), median gross monthly pay was $2,410, and 22.4% of employees worked part-time.</p><button class="secondary" id="dl">Download labour CSV</button></section>`;
  document.getElementById("dl").onclick=()=>csvDownload("meridia-labour.csv",["year","employment_millions","unemployment_rate"],years.map((y,i)=>[y,series.employment.values[i],series.unemployment.values[i]])); },
prices(){ const draw=(amt=100, from=2015)=>{ const idx=years.map((y,i)=> series.inflation.values.slice(0,i+1).reduce((p,v)=>p*(1+v/100),100));
  const f=idx[years.indexOf(+from)], t=last(idx), out=amt*t/f;
  app.innerHTML=pageTitle("Prices and inflation","Consumer prices rose 2.6% in 2025. Education and health rose fastest; clothing was almost flat.")+`
  <div class="grid"><section class="card"><h2>Inflation (%)</h2>${lineChart([{...series.inflation,color:"#d98a1f"}],{zero:true})}</section>
  <section class="card"><h2>Inflation calculator</h2><p>What did a basket cost in another year?</p>
  <div class="controls"><label>Amount $ <input type="number" id="amt" value="${amt}" min="0" step="any"></label><label>In year <select id="yr">${years.map(y=>`<option ${y===+from?"selected":""}>${y}</option>`).join("")}</select></label><button id="calc">Calculate</button></div>
  <div class="result" id="res">$${fmt(amt,2)} in ${from} ≈ $${fmt(out,2)} in 2025</div><p class="muted">Based on the all-items CPI, 2015=100. Index in ${from}: ${fmt(f,1)}; in 2025: ${fmt(t,1)}.</p></section></div>
  <section class="card"><h2>Price change by category, 2025</h2><div id="tbl"></div></section>`;
  const cols=[{key:"name",label:"Category"},{key:"change",label:"Change %",fmt:v=>fmt(v)},{key:"weight",label:"Weight %",fmt:v=>fmt(v)}]; const rows=[...cpiCategories];
  const render=()=>{document.getElementById("tbl").innerHTML=sortableTable("cpi",cols,rows); wireSort("cpi",cols,rows,render);}; render();
  document.getElementById("calc").onclick=()=>draw(document.getElementById("amt").value, document.getElementById("yr").value); };
  draw(); },
trade(){ app.innerHTML=pageTitle("Foreign trade","Exports of goods were $57.4 billion in 2025 against imports of $61.2 billion — a goods deficit of $3.8 billion.")+`
  <section class="card"><h2>Exports and imports (USD bn)</h2>${lineChart([{...series.exports,color:"#0e8a7b"},{...series.imports,color:"#2456a6"}],{})}</section>
  <section class="card"><h2>Trade by partner, 2025</h2><div class="controls"><label>Filter <input type="search" class="field" id="q" placeholder="Partner name"></label></div><div id="tbl"></div></section>`;
  const cols=[{key:"name",label:"Partner"},{key:"exports",label:"Exports $bn",fmt:v=>fmt(v)},{key:"imports",label:"Imports $bn",fmt:v=>fmt(v)},{key:"balance",label:"Balance $bn",fmt:v=>fmt(v)}];
  let rows=partners.map(p=>({...p,balance:+(p.exports-p.imports).toFixed(1)}));
  const render=()=>{document.getElementById("tbl").innerHTML=sortableTable("trade",cols,rows); wireSort("trade",cols,rows,render);}; render();
  document.getElementById("q").oninput=e=>{ const q=e.target.value.toLowerCase(); rows=partners.map(p=>({...p,balance:+(p.exports-p.imports).toFixed(1)})).filter(p=>p.name.toLowerCase().includes(q)); render(); }; },
regions(){ app.innerHTML=pageTitle("Regions","Port Meridia holds a quarter of the population and the highest output per person. The Eastern Highlands grow slowest.")+`
  <div class="tiles">${regions.map(r=>`<div class="tile" style="background:hsl(${r.hue} 55% 34%)"><strong>${r.name}</strong><span>${fmt(r.pop,2)}m people · $${r.gdpPc.toLocaleString()} per capita · unemployment ${r.unemp}%</span></div>`).join("")}</div>
  <section class="card" style="margin-top:14px"><h2>Regional comparison, 2025</h2><div id="tbl"></div></section>`;
  const cols=[{key:"name",label:"Region"},{key:"pop",label:"Population m",fmt:v=>fmt(v,2)},{key:"growth",label:"Growth %",fmt:v=>fmt(v)},{key:"gdpPc",label:"GDP per capita $",fmt:v=>v.toLocaleString()},{key:"unemp",label:"Unemployment %",fmt:v=>fmt(v)}]; const rows=[...regions];
  const render=()=>{document.getElementById("tbl").innerHTML=sortableTable("regs",cols,rows); wireSort("regs",cols,rows,render);}; render(); },
data(){ app.innerHTML=pageTitle("Data and downloads","Every published series can be downloaded as CSV from this page. Files are generated in your browser from the same figures shown on the site.")+`
  <div class="controls"><label>Topic <select id="topic"><option value="">All topics</option>${[...new Set(datasets.map(d=>d.topic))].map(t=>`<option>${t}</option>`).join("")}</select></label></div><div id="list"></div>`;
  const render=()=>{ const t=document.getElementById("topic").value; const list=datasets.filter(d=>!t||d.topic===t);
    document.getElementById("list").innerHTML=list.map(d=>`<section class="card" style="margin:10px 0"><h3>${d.title}</h3><p class="muted">${d.topic} · ${d.format} · ${d.rows} · updated ${d.updated}</p><button data-dl="${d.id}">Download CSV</button></section>`).join("")||"<p>No datasets for this topic.</p>";
    document.querySelectorAll("[data-dl]").forEach(b=>b.onclick=()=>{ const d=datasets.find(x=>x.id===b.dataset.dl);
      if(d.id==="pop-annual") csvDownload(d.id+".csv",["year","population_millions"],years.map((y,i)=>[y,series.population.values[i]]));
      else if(d.id==="gdp-quarterly") csvDownload(d.id+".csv",["year","gdp_growth_pct","gdp_per_capita_usd"],years.map((y,i)=>[y,series.gdpGrowth.values[i],series.gdpPerCapita.values[i]]));
      else if(d.id==="lfs") csvDownload(d.id+".csv",["year","employment_millions","unemployment_rate"],years.map((y,i)=>[y,series.employment.values[i],series.unemployment.values[i]]));
      else if(d.id==="cpi") csvDownload(d.id+".csv",["category","change_pct_2025","weight_pct"],cpiCategories.map(c=>[c.name.replaceAll(",",";"),c.change,c.weight]));
      else if(d.id==="trade") csvDownload(d.id+".csv",["partner","exports_usd_bn","imports_usd_bn"],partners.map(p=>[p.name,p.exports,p.imports]));
      else csvDownload(d.id+".csv",["region","population_millions","gdp_per_capita_usd"],regions.map(r=>[r.name.replaceAll(",",";"),r.pop,r.gdpPc])); }); };
  document.getElementById("topic").onchange=render; render(); },
methods(){ app.innerHTML=pageTitle("Methods and release calendar","How Meridia's statistics are made, what the words mean, and when new figures appear.")+`
  <div class="grid"><section class="card"><h2>How figures are produced</h2><p>Population estimates combine the population register with migration records and are benchmarked to the census every ten years. GDP follows the system of national accounts: production, income and expenditure measures are reconciled quarterly. The labour force survey interviews 18,000 households per quarter; unemployment counts people without work who are available for and seeking work. The consumer price index prices a fixed basket of about 700 items each month, weighted by household spending.</p></section>
  <section class="card"><h2>Definitions</h2><p><strong>Employment rate:</strong> employed people as a share of the population aged 15–64.</p><p><strong>Real GDP growth:</strong> change in output after removing price change.</p><p><strong>Inflation:</strong> annual percentage change in the all-items consumer price index.</p><p><strong>Goods balance:</strong> exports of goods minus imports of goods.</p></section></div>
  <section class="card"><h2>Release calendar</h2>${releases.map(r=>`<div class="release"><span><strong>${r.title}</strong><br><small>${r.topic}</small></span><span>${r.date} · 09:00</span></div>`).join("")}</section>
  <p class="note">Revisions: quarterly GDP is revised twice; population estimates are revised after each census. Every release states its revision status.</p>`; },
};
function route(){ const h=location.hash.replace(/^#\/?/,""); const name=h.split("/")[0]||"home"; (views[name]||views.home)();
  document.querySelectorAll("[data-nav]").forEach(a=>a.classList.toggle("active", a.dataset.nav===name)); window.scrollTo(0,0); }
addEventListener("hashchange", route); route();
const si=document.getElementById("globalsearch"), sr=document.getElementById("searchresults");
si.addEventListener("input", ()=>{ const q=si.value.trim().toLowerCase(); if(!q){sr.hidden=true;return;}
  const hits=indicators.filter(i=>i.name.toLowerCase().includes(q)||i.desc.toLowerCase().includes(q));
  sr.innerHTML=hits.length?hits.map(i=>`<a href="#/${i.page}"><strong>${i.name}</strong><br><small>${i.desc}</small></a>`).join(""):`<a>No indicator matches “${q}”.</a>`; sr.hidden=false; });
sr.addEventListener("click", ()=>{sr.hidden=true; si.value="";});
document.addEventListener("click", e=>{ if(!e.target.closest(".searchbox")) sr.hidden=true; });
