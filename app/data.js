// Meridia Statistics demonstration dataset. One internally consistent set of
// series for the fictional Republic of Meridia, reference years 2015-2025.
export const years = [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025];
export const series = {
  population: {label:"Population (millions)", unit:"m", values:[8.42,8.51,8.60,8.69,8.78,8.85,8.93,9.02,9.12,9.23,9.35]},
  gdpGrowth: {label:"Real GDP growth (%)", unit:"%", values:[2.8,3.1,3.4,2.9,2.6,-3.2,5.1,4.2,3.6,3.9,4.1]},
  gdpPerCapita: {label:"GDP per capita (USD)", unit:"$", values:[14200,14850,15620,16240,16890,16110,17480,18930,20140,21460,22810]},
  unemployment: {label:"Unemployment rate (%)", unit:"%", values:[7.4,7.1,6.8,6.5,6.3,8.9,7.6,6.4,5.9,5.6,5.4]},
  employment: {label:"Employment (millions)", unit:"m", values:[3.61,3.68,3.76,3.83,3.90,3.72,3.88,4.02,4.11,4.19,4.27]},
  inflation: {label:"Consumer price inflation (%)", unit:"%", values:[2.1,1.8,2.4,2.7,2.2,1.4,3.8,6.9,5.4,3.1,2.6]},
  exports: {label:"Exports of goods (USD bn)", unit:"bn", values:[31.2,32.8,35.1,37.4,38.9,34.6,41.8,48.2,50.6,53.9,57.4]},
  imports: {label:"Imports of goods (USD bn)", unit:"bn", values:[36.5,37.9,40.2,42.8,44.1,39.8,47.5,55.1,56.4,58.7,61.2]},
  births: {label:"Live births (thousands)", unit:"k", values:[118,116,115,113,111,109,112,110,108,107,106]},
  lifeExpectancy: {label:"Life expectancy at birth (years)", unit:"yrs", values:[76.2,76.5,76.8,77.0,77.3,76.9,77.1,77.5,77.8,78.0,78.2]},
};
export const ageGroups = [
  {band:"0–14", male:0.86, female:0.82}, {band:"15–24", male:0.58, female:0.55},
  {band:"25–34", male:0.66, female:0.64}, {band:"35–44", male:0.62, female:0.61},
  {band:"45–54", male:0.57, female:0.58}, {band:"55–64", male:0.49, female:0.52},
  {band:"65–74", male:0.34, female:0.39}, {band:"75+", male:0.18, female:0.26},
];
export const sectors = [
  {name:"Services", share:58.4, growth:4.6}, {name:"Manufacturing", share:16.2, growth:3.8},
  {name:"Construction", share:7.1, growth:2.9}, {name:"Agriculture & fishing", share:5.8, growth:1.7},
  {name:"Energy & mining", share:6.3, growth:5.2}, {name:"Public administration", share:6.2, growth:1.9},
];
export const cpiCategories = [
  {name:"Food & non-alcoholic drinks", change:3.4, weight:22.1}, {name:"Housing & utilities", change:2.9, weight:24.6},
  {name:"Transport", change:1.8, weight:14.2}, {name:"Health", change:3.9, weight:6.8},
  {name:"Education", change:4.2, weight:4.5}, {name:"Clothing & footwear", change:0.9, weight:4.9},
  {name:"Recreation & culture", change:2.4, weight:8.6}, {name:"Restaurants & hotels", change:3.1, weight:7.3},
  {name:"Other goods & services", change:2.2, weight:7.0},
];
export const partners = [
  {name:"Kestria", exports:11.8, imports:13.4}, {name:"Vardania", exports:9.6, imports:8.1},
  {name:"Solmar Union", exports:8.9, imports:12.7}, {name:"Ostrovia", exports:6.4, imports:5.2},
  {name:"Tavira", exports:5.1, imports:4.6}, {name:"Nordland", exports:4.8, imports:6.9},
  {name:"Almera", exports:3.7, imports:3.3}, {name:"Rest of world", exports:7.1, imports:7.0},
];
export const regions = [
  {name:"Port Meridia (capital)", pop:2.41, growth:1.8, gdpPc:31200, unemp:4.6, hue:174},
  {name:"North Coast", pop:1.36, growth:1.1, gdpPc:24100, unemp:5.2, hue:200},
  {name:"Central Plains", pop:1.58, growth:0.9, gdpPc:19800, unemp:5.8, hue:120},
  {name:"South Valleys", pop:1.24, growth:0.6, gdpPc:17600, unemp:6.1, hue:90},
  {name:"Eastern Highlands", pop:0.97, growth:0.4, gdpPc:16400, unemp:6.4, hue:36},
  {name:"Western Islands", pop:0.72, growth:1.3, gdpPc:21900, unemp:4.9, hue:215},
  {name:"River Delta", pop:1.07, growth:1.5, gdpPc:20800, unemp:5.5, hue:155},
];
export const releases = [
  {date:"2026-01-15", title:"Population estimate, 1 January 2026", topic:"Population"},
  {date:"2026-01-22", title:"Consumer prices, December 2025", topic:"Prices"},
  {date:"2026-02-05", title:"Labour force survey, Q4 2025", topic:"Labour"},
  {date:"2026-02-19", title:"Gross domestic product, Q4 2025 (preliminary)", topic:"Economy"},
  {date:"2026-03-03", title:"Foreign trade in goods, January 2026", topic:"Trade"},
  {date:"2026-03-17", title:"Regional accounts 2025", topic:"Regions"},
];
export const datasets = [
  {id:"pop-annual", title:"Population by age, sex and region", topic:"Population", format:"CSV", updated:"2025-12-10", rows: "11 years × 7 regions"},
  {id:"gdp-quarterly", title:"GDP by expenditure and industry", topic:"Economy", format:"CSV", updated:"2025-12-02", rows: "Quarterly, 2015–2025"},
  {id:"lfs", title:"Labour force survey micro-aggregates", topic:"Labour", format:"CSV", updated:"2025-11-28", rows: "Quarterly, 2015–2025"},
  {id:"cpi", title:"Consumer price index by category", topic:"Prices", format:"CSV", updated:"2025-12-12", rows: "Monthly index, 2015=100"},
  {id:"trade", title:"Trade in goods by partner and commodity", topic:"Trade", format:"CSV", updated:"2025-12-05", rows: "Annual, 2015–2025"},
  {id:"regions", title:"Regional accounts and population", topic:"Regions", format:"CSV", updated:"2025-11-20", rows: "7 regions, 2015–2025"},
];
export const indicators = [
  {name:"Population", page:"population", desc:"9.35 million at 1 January 2025"},
  {name:"GDP growth", page:"economy", desc:"Real growth of gross domestic product"},
  {name:"GDP per capita", page:"economy", desc:"Output per person in US dollars"},
  {name:"Unemployment rate", page:"labour", desc:"Share of the labour force without work"},
  {name:"Employment", page:"labour", desc:"People in work, millions"},
  {name:"Inflation (CPI)", page:"prices", desc:"Annual change in consumer prices"},
  {name:"Exports", page:"trade", desc:"Exports of goods by partner"},
  {name:"Imports", page:"trade", desc:"Imports of goods by partner"},
  {name:"Life expectancy", page:"population", desc:"Years of life expected at birth"},
  {name:"Regional GDP per capita", page:"regions", desc:"Output per person by region"},
];
