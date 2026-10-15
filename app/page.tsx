'use client';

import { useEffect, useMemo, useState } from 'react';

type Status = 'pending' | 'visited' | 'followup' | 'complete';
type Visit = { id: string; label: string; area: string; status: Status; date: string; note: string };
type Lang = 'en' | 'mr';

const copy = {
  en: {
    eyebrow: 'FIELDWORK COMPANION', title: 'SIR Saathi', subtitle: 'A calmer way to organise your SIR duty.',
    local: 'Your work stays on this device', privacy: 'Use house/serial codes only. Do not enter voter names, EPIC numbers, Aadhaar, phone numbers, document photos, or other personal details.',
    dashboard: 'Overview', visits: 'Household tracker', checklist: 'Field checklist', guide: 'Process guide', add: '+ Add visit',
    assigned: 'Households listed', done: 'Completed', follow: 'Follow-ups', remaining: 'Still to do', progress: 'Overall progress',
    trackerTitle: 'Household visits', trackerSub: 'Track progress using a house code or serial number—not a person’s name.',
    search: 'Search house code or area', all: 'All statuses', pending: 'Pending', visited: 'Visited', followup: 'Follow-up', complete: 'Complete',
    house: 'House / serial code *', area: 'Area / lane (optional)', status: 'Status', date: 'Visit date', note: 'Short note (no personal data)', save: 'Save visit', cancel: 'Cancel', edit: 'Edit', remove: 'Delete', empty: 'No visits yet', emptySub: 'Add a house code to begin tracking.',
    checklistTitle: 'Before you leave the field', checklistSub: 'A practical reminder list. Your supervisor’s latest instructions and official forms always take priority.',
    guideTitle: 'SIR field process', guideSub: 'Use this as a reminder, not as a replacement for official training.',
    steps: [ ['1. Check your assignment', 'Confirm your polling part, household list, route, reporting deadline and supervisor contact.'], ['2. Explain the purpose', 'Introduce yourself and explain that you are performing official electoral-roll revision duty. Follow the approved script and identification rules.'], ['3. Verify using the official workflow', 'Use only the official enumeration form/app and the exact fields required by current instructions. Do not guess or alter answers for a household.'], ['4. Handle missing information carefully', 'Record unresolved cases as instructed. Do not independently decide that someone should be added or deleted from the roll.'], ['5. Protect records', 'Keep paper forms and official devices secure. Never photograph or store identity documents in this helper app.'], ['6. Submit and follow up', 'Submit through the official channel, note only a non-identifying house code here, and escalate unclear cases to your supervisor.'] ],
    checklist: ['Carry official ID and assignment details', 'Check the latest instructions and forms', 'Confirm household / part list before starting', 'Explain the process respectfully', 'Record only required details in the official system', 'Mark unresolved cases for supervisor follow-up', 'Secure paper forms and official devices', 'Submit daily progress through the prescribed channel'],
    linksTitle: 'Official resources', linksSub: 'Open the official portal for current forms, instructions and status. This app does not submit voter data.',
    eci: 'ECI Voters’ Service Portal', district: 'Chhatrapati Sambhajinagar SIR page', ceo: 'Chief Electoral Officer, Maharashtra',
    important: 'Important', importantText: 'The app is an independent organiser, not an Election Commission system. Local instructions, current forms, deadlines and eligibility decisions must come from your authorised election officer.',
    export: 'Export visit list (codes only)', clear: 'Clear all local data', confirmClear: 'Delete all locally saved visits and checklist ticks?', saved: 'Saved on this device', noResults: 'No matching visits.',
    modalTitle: 'Add household visit', lang: 'Language', english: 'English', marathi: 'मराठी', today: 'Today', deleteConfirm: 'Delete this visit?',
    checklistDone: 'items checked', allData: 'Local data', storage: 'Saved in this browser only. Clearing browser data may erase it. No account or cloud sync is configured.'
  },
  mr: {
    eyebrow: 'क्षेत्रीय कामासाठी सहाय्यक', title: 'SIR साथी', subtitle: 'SIR ड्युटीचे काम सोप्या पद्धतीने व्यवस्थित ठेवा.',
    local: 'तुमची माहिती याच डिव्हाइसवर राहते', privacy: 'फक्त घर क्रमांक/अनुक्रमांक वापरा. मतदाराचे नाव, EPIC क्रमांक, आधार, फोन क्रमांक, कागदपत्रांचे फोटो किंवा वैयक्तिक माहिती येथे टाकू नका.',
    dashboard: 'आढावा', visits: 'घरभेट नोंद', checklist: 'क्षेत्रीय तपासणी यादी', guide: 'प्रक्रिया मार्गदर्शक', add: '+ भेट जोडा',
    assigned: 'नोंदवलेली घरे', done: 'पूर्ण', follow: 'पुन्हा भेट', remaining: 'बाकी', progress: 'एकूण प्रगती',
    trackerTitle: 'घरभेटी', trackerSub: 'व्यक्तीच्या नावाऐवजी घर क्रमांक किंवा अनुक्रमांक वापरून प्रगती नोंदवा.',
    search: 'घर क्रमांक किंवा परिसर शोधा', all: 'सर्व स्थिती', pending: 'बाकी', visited: 'भेट दिली', followup: 'पुन्हा भेट', complete: 'पूर्ण',
    house: 'घर / अनुक्रमांक *', area: 'परिसर / गल्ली (ऐच्छिक)', status: 'स्थिती', date: 'भेटीची तारीख', note: 'छोटी नोंद (वैयक्तिक माहिती नको)', save: 'भेट जतन करा', cancel: 'रद्द करा', edit: 'बदला', remove: 'हटवा', empty: 'अजून भेटी नोंदवलेल्या नाहीत', emptySub: 'नोंद सुरू करण्यासाठी घर क्रमांक जोडा.',
    checklistTitle: 'क्षेत्रात जाण्यापूर्वी', checklistSub: 'ही एक स्मरण यादी आहे. पर्यवेक्षकांच्या अद्ययावत सूचना आणि अधिकृत फॉर्म यांनाच प्राधान्य द्या.',
    guideTitle: 'SIR क्षेत्रीय प्रक्रिया', guideSub: 'हे स्मरणासाठी आहे; अधिकृत प्रशिक्षणाचा पर्याय नाही.',
    steps: [['१. नेमणूक तपासा', 'तुमचा मतदान भाग, घरांची यादी, मार्ग, अहवालाची अंतिम तारीख आणि पर्यवेक्षकाचा संपर्क तपासा.'], ['२. उद्देश समजावून सांगा', 'स्वतःची ओळख करून द्या आणि मतदार यादी पुनरीक्षणाचे अधिकृत काम असल्याचे सांगा. मान्य केलेली ओळखपत्र व संवाद पद्धत पाळा.'], ['३. अधिकृत प्रक्रियेनुसार पडताळणी करा', 'फक्त अधिकृत गणना फॉर्म/अॅप आणि सध्याच्या सूचनांमध्ये मागितलेली माहिती वापरा. कुटुंबाच्या उत्तरांचा अंदाज लावू नका किंवा बदलू नका.'], ['४. अपूर्ण माहिती काळजीपूर्वक हाताळा', 'सूचनेनुसार प्रलंबित प्रकरणे नोंदवा. कोणाला मतदार यादीत समाविष्ट किंवा वगळायचे हे स्वतः ठरवू नका.'], ['५. नोंदी सुरक्षित ठेवा', 'कागदी फॉर्म आणि अधिकृत उपकरणे सुरक्षित ठेवा. या अॅपमध्ये ओळखपत्रांचे फोटो काढू किंवा साठवू नका.'], ['६. नोंद सादर करा व पाठपुरावा करा', 'अधिकृत माध्यमातून माहिती सादर करा, येथे फक्त ओळख न पटणारा घर क्रमांक नोंदवा आणि शंका पर्यवेक्षकांकडे पाठवा.']],
    checklist: ['अधिकृत ओळखपत्र आणि नेमणुकीची माहिती सोबत ठेवा', 'अद्ययावत सूचना व फॉर्म तपासा', 'सुरू करण्यापूर्वी घरांची/मतदान भागाची यादी तपासा', 'प्रक्रिया नम्रपणे समजावून सांगा', 'अधिकृत प्रणालीत आवश्यक माहितीच नोंदवा', 'प्रलंबित प्रकरणे पर्यवेक्षकाकडे पाठवण्यासाठी नोंदवा', 'कागदी फॉर्म व अधिकृत उपकरणे सुरक्षित ठेवा', 'निर्धारित माध्यमातून दैनंदिन प्रगती सादर करा'],
    linksTitle: 'अधिकृत स्रोत', linksSub: 'सध्याचे फॉर्म, सूचना आणि स्थितीसाठी अधिकृत संकेतस्थळ उघडा. हे अॅप मतदारांची माहिती सादर करत नाही.',
    eci: 'भारत निवडणूक आयोगाचे मतदार सेवा पोर्टल', district: 'छत्रपती संभाजीनगर SIR पृष्ठ', ceo: 'मुख्य निवडणूक अधिकारी, महाराष्ट्र',
    important: 'महत्त्वाचे', importantText: 'हे अॅप स्वतंत्र नोंद व्यवस्थापक आहे; निवडणूक आयोगाची प्रणाली नाही. स्थानिक सूचना, सध्याचे फॉर्म, मुदती आणि पात्रतेचे निर्णय अधिकृत निवडणूक अधिकाऱ्यांकडूनच घ्या.',
    export: 'भेट यादी निर्यात करा (फक्त कोड)', clear: 'सर्व स्थानिक माहिती पुसा', confirmClear: 'सर्व जतन केलेल्या भेटी आणि तपासणीच्या खुणा हटवायच्या?', saved: 'या डिव्हाइसवर जतन', noResults: 'जुळणाऱ्या भेटी नाहीत.',
    modalTitle: 'घरभेट जोडा', lang: 'भाषा', english: 'English', marathi: 'मराठी', today: 'आज', deleteConfirm: 'ही भेट हटवायची?',
    checklistDone: 'घटक तपासले', allData: 'स्थानिक माहिती', storage: 'माहिती फक्त या ब्राउझरमध्ये जतन होते. ब्राउझरची माहिती पुसल्यास ती नष्ट होऊ शकते. खाते किंवा क्लाउड समक्रमण नाही.'
  }
} as const;

const initialChecklist = Array(8).fill(false) as boolean[];
const STORAGE_KEY = 'sir-saathi-v1';
const todayISO = () => new Date().toISOString().slice(0, 10);

export default function Home() {
  const [lang, setLang] = useState<Lang>('en');
  const [tab, setTab] = useState<'home'|'visits'|'checklist'|'guide'>('home');
  const [visits, setVisits] = useState<Visit[]>([]);
  const [ticks, setTicks] = useState<boolean[]>(initialChecklist);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all'|Status>('all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string|null>(null);
  const [form, setForm] = useState({ label: '', area: '', status: 'pending' as Status, date: todayISO(), note: '' });
  const t = copy[lang];

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data.visits)) setVisits(data.visits);
        if (Array.isArray(data.ticks) && data.ticks.length === 8) setTicks(data.ticks);
        if (data.lang === 'mr' || data.lang === 'en') setLang(data.lang);
      }
    } catch { /* Ignore malformed local data. */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify({ visits, ticks, lang }));
  }, [visits, ticks, lang, loaded]);

  const stats = useMemo(() => ({
    total: visits.length,
    complete: visits.filter(v => v.status === 'complete').length,
    follow: visits.filter(v => v.status === 'followup').length,
    remaining: visits.filter(v => v.status === 'pending' || v.status === 'visited').length,
  }), [visits]);
  const progress = stats.total ? Math.round(stats.complete / stats.total * 100) : 0;
  const filtered = visits.filter(v => (filter === 'all' || v.status === filter) && `${v.label} ${v.area}`.toLowerCase().includes(query.toLowerCase()));

  function openNew() {
    setEditing(null); setForm({ label: '', area: '', status: 'pending', date: todayISO(), note: '' }); setShowForm(true);
  }
  function openEdit(v: Visit) {
    setEditing(v.id); setForm({ label: v.label, area: v.area, status: v.status, date: v.date, note: v.note }); setShowForm(true);
  }
  function saveVisit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.label.trim()) return;
    const next: Visit = { ...form, label: form.label.trim(), area: form.area.trim(), note: form.note.trim(), id: editing || (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now())) };
    setVisits(old => editing ? old.map(v => v.id === editing ? next : v) : [next, ...old]);
    setShowForm(false);
  }
  function exportCSV() {
    const safe = visits.map(v => [v.label, v.area, v.status, v.date, v.note].map(s => `"${String(s).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([[['House code','Area','Status','Date','Note'].join(','), safe].filter(Boolean).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'sir-visit-codes.csv'; a.click(); URL.revokeObjectURL(url);
  }
  function clearAll() {
    if (window.confirm(t.confirmClear)) { setVisits([]); setTicks(initialChecklist); localStorage.removeItem(STORAGE_KEY); }
  }
  const statusLabel = (s: Status) => ({ pending: t.pending, visited: t.visited, followup: t.followup, complete: t.complete }[s]);

  return <main className="app-shell">
    <header className="topbar">
      <a className="brand" href="#top" onClick={() => setTab('home')}><span className="brand-mark">S</span><span><b>SIR Saathi</b><small>MAHARASHTRA · 2026</small></span></a>
      <div className="top-actions"><span className="secure"><span className="dot"/> {t.local}</span><label className="lang-picker"><span className="sr-only">{t.lang}</span><select value={lang} onChange={e => setLang(e.target.value as Lang)} aria-label={t.lang}><option value="en">EN</option><option value="mr">मराठी</option></select></label></div>
    </header>

    <section className="hero" id="top">
      <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line"/>{t.eyebrow}</div><h1>{t.title}<span className="period">.</span></h1><p>{t.subtitle}</p><div className="hero-badges"><span>◈ {lang === 'en' ? 'Bilingual' : 'द्विभाषिक'}</span><span>◉ {lang === 'en' ? 'Offline-friendly' : 'ऑफलाइनसाठी अनुकूल'}</span><span>⌁ {lang === 'en' ? 'Privacy-first' : 'गोपनीयतेला प्राधान्य'}</span></div></div>
      <div className="hero-art" aria-hidden="true"><div className="sun"/><div className="hill hill-back"/><div className="hill hill-front"/><div className="path"/><div className="pin"><span>✓</span></div><div className="art-card"><span className="art-check">✓</span><span><b>{lang === 'en' ? 'Field ready' : 'क्षेत्रासाठी तयार'}</b><small>{lang === 'en' ? 'One step at a time' : 'एकावेळी एक पाऊल'}</small></span></div></div>
    </section>

    <div className="privacy-strip"><span className="privacy-icon">⌑</span><div><b>{t.local}</b><p>{t.privacy}</p></div></div>

    <nav className="tabs" aria-label="Main navigation">
      {(['home','visits','checklist','guide'] as const).map((id, i) => <button key={id} className={`tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}><span className="tab-icon">{['◫','⌂','☑','≡'][i]}</span><span>{[t.dashboard,t.visits,t.checklist,t.guide][i]}</span></button>)}
    </nav>

    {tab === 'home' && <>
      <section className="section-head"><div><div className="eyebrow muted">{lang === 'en' ? 'YOUR FIELD DESK' : 'तुमचे क्षेत्रीय डेस्क'}</div><h2>{t.dashboard}</h2><p>{lang === 'en' ? 'A quick view of your local work log.' : 'तुमच्या स्थानिक कामाची झटपट माहिती.'}</p></div><button className="primary" onClick={openNew}>{t.add}</button></section>
      <section className="stats-grid">
        <article className="stat-card stat-total"><div className="stat-top"><span>{t.assigned}</span><span className="stat-icon">⌂</span></div><strong>{stats.total}</strong><small>{lang === 'en' ? 'House codes added' : 'घर क्रमांक नोंदवले'}</small></article>
        <article className="stat-card"><div className="stat-top"><span>{t.done}</span><span className="stat-icon green">✓</span></div><strong>{stats.complete}</strong><small>{lang === 'en' ? 'Marked complete' : 'पूर्ण म्हणून नोंद'}</small></article>
        <article className="stat-card"><div className="stat-top"><span>{t.follow}</span><span className="stat-icon amber">↻</span></div><strong>{stats.follow}</strong><small>{lang === 'en' ? 'Need another action' : 'पुढील कार्यवाही आवश्यक'}</small></article>
        <article className="stat-card"><div className="stat-top"><span>{t.remaining}</span><span className="stat-icon blue">◷</span></div><strong>{stats.remaining}</strong><small>{lang === 'en' ? 'Pending or visited' : 'बाकी किंवा भेट दिली'}</small></article>
      </section>
      <section className="content-grid">
        <article className="panel progress-panel"><div className="panel-head"><div><h3>{t.progress}</h3><p>{lang === 'en' ? 'Based on visits marked complete' : 'पूर्ण म्हणून नोंदवलेल्या भेटींवर आधारित'}</p></div><span className="progress-number">{progress}%</span></div><div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }}/></div><div className="progress-foot"><span>{stats.complete} {lang === 'en' ? 'completed' : 'पूर्ण'}</span><span>{Math.max(0, stats.total - stats.complete)} {lang === 'en' ? 'to review' : 'पुनरावलोकन बाकी'}</span></div><button className="text-button" onClick={() => setTab('visits')}>{lang === 'en' ? 'View household tracker' : 'घरभेट नोंद पहा'} <span>→</span></button></article>
        <article className="panel quick-panel"><div className="panel-head"><div><h3>{lang === 'en' ? 'Ready for the field?' : 'क्षेत्रात जाण्यास तयार?'}</h3><p>{lang === 'en' ? 'Keep your essentials in order.' : 'आवश्यक गोष्टी तयार ठेवा.'}</p></div><span className="quick-icon">✳</span></div><div className="mini-check"><span className={ticks[0] ? 'mini-box checked' : 'mini-box'}>{ticks[0] ? '✓' : ''}</span><span>{t.checklist[0]}</span></div><div className="mini-check"><span className={ticks[1] ? 'mini-box checked' : 'mini-box'}>{ticks[1] ? '✓' : ''}</span><span>{t.checklist[1]}</span></div><button className="text-button" onClick={() => setTab('checklist')}>{lang === 'en' ? 'Open field checklist' : 'तपासणी यादी उघडा'} <span>→</span></button></article>
      </section>
      <section className="panel recent-panel"><div className="panel-head"><div><h3>{lang === 'en' ? 'Recent visits' : 'अलीकडील भेटी'}</h3><p>{lang === 'en' ? 'Your latest saved house codes.' : 'अलीकडे जतन केलेले घर क्रमांक.'}</p></div><button className="subtle-button" onClick={() => setTab('visits')}>{lang === 'en' ? 'View all' : 'सर्व पहा'} →</button></div>{visits.length ? <div className="visit-list">{visits.slice(0, 4).map(v => <VisitRow key={v.id} visit={v} lang={lang} statusLabel={statusLabel} onEdit={() => openEdit(v)} onDelete={() => window.confirm(t.deleteConfirm) && setVisits(old => old.filter(x => x.id !== v.id))}/>)}</div> : <EmptyState title={t.empty} subtitle={t.emptySub} />}</section>
    </>}

    {tab === 'visits' && <>
      <section className="section-head"><div><div className="eyebrow muted">{lang === 'en' ? 'FIELD LOG' : 'क्षेत्रीय नोंद'}</div><h2>{t.trackerTitle}</h2><p>{t.trackerSub}</p></div><button className="primary" onClick={openNew}>{t.add}</button></section>
      <section className="panel tracker-panel"><div className="filter-row"><div className="search-wrap"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder={t.search} aria-label={t.search}/></div><select className="filter-select" value={filter} onChange={e => setFilter(e.target.value as 'all'|Status)} aria-label={t.all}><option value="all">{t.all}</option>{(['pending','visited','followup','complete'] as Status[]).map(s => <option key={s} value={s}>{statusLabel(s)}</option>)}</select></div>{filtered.length ? <div className="visit-list">{filtered.map(v => <VisitRow key={v.id} visit={v} lang={lang} statusLabel={statusLabel} onEdit={() => openEdit(v)} onDelete={() => window.confirm(t.deleteConfirm) && setVisits(old => old.filter(x => x.id !== v.id))}/>)}</div> : <EmptyState title={visits.length ? t.noResults : t.empty} subtitle={t.emptySub}/>}<div className="tracker-footer"><span>{t.saved}</span><button className="subtle-button" onClick={exportCSV} disabled={!visits.length}>{t.export}</button></div></section>
    </>}

    {tab === 'checklist' && <>
      <section className="section-head"><div><div className="eyebrow muted">{lang === 'en' ? 'READY CHECK' : 'तयारी तपासणी'}</div><h2>{t.checklistTitle}</h2><p>{t.checklistSub}</p></div><div className="check-count">{ticks.filter(Boolean).length}/8</div></section>
      <section className="panel checklist-panel"><div className="checklist-progress"><div className="progress-track"><div className="progress-fill" style={{ width: `${ticks.filter(Boolean).length / 8 * 100}%` }}/></div><span>{ticks.filter(Boolean).length} / 8 {t.checklistDone}</span></div>{t.checklist.map((item, i) => <label className={`check-item ${ticks[i] ? 'is-checked' : ''}`} key={i}><input type="checkbox" checked={ticks[i]} onChange={e => setTicks(old => old.map((v, j) => i === j ? e.target.checked : v))}/><span className="custom-check">✓</span><span>{item}</span></label>)}<div className="checklist-bottom"><button className="subtle-button" onClick={() => setTicks(initialChecklist)}>{lang === 'en' ? 'Reset checklist' : 'यादी पुन्हा सुरू करा'}</button><span>{lang === 'en' ? 'Ticks are saved locally.' : 'खुणा स्थानिक पातळीवर जतन होतात.'}</span></div></section>
    </>}

    {tab === 'guide' && <>
      <section className="section-head"><div><div className="eyebrow muted">{lang === 'en' ? 'QUICK REFERENCE' : 'झटपट संदर्भ'}</div><h2>{t.guideTitle}</h2><p>{t.guideSub}</p></div><span className="guide-symbol">≋</span></section>
      <section className="steps-list">{t.steps.map((step, i) => <article className="step-card" key={i}><div className="step-number">{i + 1}</div><div><h3>{step[0].replace(/^\d+\.\s*/, '')}</h3><p>{step[1]}</p></div></article>)}</section>
      <section className="panel links-panel"><h3>{t.linksTitle}</h3><p>{t.linksSub}</p><a className="official-link" href="https://voters.eci.gov.in/" target="_blank" rel="noreferrer"><span className="link-symbol">↗</span><span><b>{t.eci}</b><small>voters.eci.gov.in</small></span><span className="link-arrow">↗</span></a><a className="official-link" href="https://chhatrapatisambhajinagar.maharashtra.gov.in/en/special-intensive-revision-sir-2026/" target="_blank" rel="noreferrer"><span className="link-symbol">↗</span><span><b>{t.district}</b><small>chhatrapatisambhajinagar.maharashtra.gov.in</small></span><span className="link-arrow">↗</span></a><a className="official-link" href="https://ceoelection.maharashtra.gov.in/" target="_blank" rel="noreferrer"><span className="link-symbol">↗</span><span><b>{t.ceo}</b><small>ceoelection.maharashtra.gov.in</small></span><span className="link-arrow">↗</span></a></section>
      <section className="notice"><span className="notice-icon">!</span><div><b>{t.important}</b><p>{t.importantText}</p></div></section>
    </>}

    <footer className="footer"><div className="footer-brand"><span className="brand-mark small-mark">S</span><span><b>SIR Saathi</b><small>{t.allData}</small></span></div><p>{t.storage}</p><button className="danger-link" onClick={clearAll}>{t.clear}</button></footer>

    {showForm && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setShowForm(false); }}><form className="visit-modal" onSubmit={saveVisit}><div className="modal-head"><div><div className="eyebrow muted">{lang === 'en' ? 'LOCAL WORK LOG' : 'स्थानिक कामाची नोंद'}</div><h2>{editing ? t.edit : t.modalTitle}</h2></div><button type="button" className="close-button" onClick={() => setShowForm(false)} aria-label={t.cancel}>×</button></div><label className="field-label">{t.house}<input autoFocus required maxLength={60} value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder={lang === 'en' ? 'e.g. H-014 or Serial 014' : 'उदा. H-014 किंवा अनुक्रमांक 014'}/></label><label className="field-label">{t.area}<input maxLength={80} value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} placeholder={lang === 'en' ? 'e.g. Lane 2' : 'उदा. गल्ली २'}/></label><div className="form-row"><label className="field-label">{t.status}<select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Status })}>{(['pending','visited','followup','complete'] as Status[]).map(s => <option key={s} value={s}>{statusLabel(s)}</option>)}</select></label><label className="field-label">{t.date}<input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}/></label></div><label className="field-label">{t.note}<textarea maxLength={160} rows={2} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder={lang === 'en' ? 'e.g. Return after 5 pm' : 'उदा. संध्याकाळी ५ नंतर पुन्हा भेट'}/></label><p className="form-warning">⌑ {t.privacy}</p><div className="modal-actions"><button type="button" className="secondary" onClick={() => setShowForm(false)}>{t.cancel}</button><button type="submit" className="primary">{t.save}</button></div></form></div>}
  </main>;
}

function VisitRow({ visit, lang, statusLabel, onEdit, onDelete }: { visit: Visit; lang: Lang; statusLabel: (s: Status) => string; onEdit: () => void; onDelete: () => void }) {
  return <article className="visit-row"><div className="visit-avatar">⌂</div><div className="visit-main"><div className="visit-title"><b>{visit.label}</b><span className={`status-pill ${visit.status}`}>{statusLabel(visit.status)}</span></div><div className="visit-meta">{visit.area || (lang === 'en' ? 'Area not added' : 'परिसर नमूद नाही')} <span>·</span> {visit.date || '—'}</div>{visit.note && <p className="visit-note">{visit.note}</p>}</div><div className="row-actions"><button onClick={onEdit} aria-label={lang === 'en' ? 'Edit visit' : 'भेट बदला'} title={lang === 'en' ? 'Edit' : 'बदला'}>✎</button><button onClick={onDelete} aria-label={lang === 'en' ? 'Delete visit' : 'भेट हटवा'} title={lang === 'en' ? 'Delete' : 'हटवा'}>×</button></div></article>;
}
function EmptyState({ title, subtitle }: { title: string; subtitle: string }) { return <div className="empty-state"><div className="empty-icon">⌂</div><b>{title}</b><p>{subtitle}</p></div>; }
