/* Version-2 storage boundary. No migration or writes occur while loading. */
(function (root) {
  'use strict';
  const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
  const number = v => typeof v === 'number' && Number.isFinite(v) && v >= 0;
  const id = v => typeof v === 'string' && /^[a-zA-Z0-9_-]+$/.test(v) && !['__proto__', 'constructor', 'prototype'].includes(v);
  const date = v => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v;
  function validate(v) {
    const require = (test, field) => { if (!test) throw new Error('Invalid backup: ' + field); };
    require(object(v) && v.version === 2, 'expected version 2');
    require(object(v.profile) && ['age', 'height', 'weight'].every(k => number(v.profile[k])), 'profile');
    require(Array.isArray(v.exercises) && v.exercises.length > 0, 'exercises');
    function prescription(e) {
      require(Number.isInteger(e.sets) && e.sets >= 0 && e.sets <= 100 && number(e.reps) && (e.rest === null || number(e.rest)), 'exercise prescription');
      require(typeof e.kind === 'string' && Array.isArray(e.weights) && e.weights.every(w => w === null || w === '' || number(w)), 'prescribed weights');
    }
    function exercises(items) {
      require(Array.isArray(items), 'exercise list'); const ids = new Set();
      for (const e of items) {
        require(object(e) && id(e.id) && !ids.has(e.id), 'unique exercise ID'); ids.add(e.id);
        require(typeof e.name === 'string' && typeof e.group === 'string', 'exercise details'); prescription(e);
      }
      return ids;
    }
    const ids = exercises(v.exercises);
    require(Array.isArray(v.routines) && v.routines.length >= 3, 'three scheduling routines');
    const routines = new Set();
    for (const r of v.routines) {
      require(object(r) && id(r.id) && !routines.has(r.id), 'unique routine ID'); routines.add(r.id);
      require(typeof r.name === 'string' && typeof r.note === 'string' && Array.isArray(r.ids) && r.ids.every(i => ids.has(i)), 'routine');
      if(r.prescriptions !== undefined){require(object(r.prescriptions), 'routine prescriptions');for(const [eid,p] of Object.entries(r.prescriptions)){require(r.ids.includes(eid) && object(p) && Object.keys(p).every(k=>['sets','reps','rest','weights','kind'].includes(k)), 'prescription movement');prescription(p)}}
    }
    if(v.periodPlans!==undefined){
      require(Array.isArray(v.periodPlans), 'dated plans');const seen=new Set();
      for(const p of v.periodPlans){
        require(object(p)&&id(p.id)&&!seen.has(p.id)&&routines.has(p.routine)&&date(p.from)&&date(p.to)&&p.from<=p.to&&p.from>='1900-01-01'&&p.to<='9998-12-31', 'dated plan identity and dates');seen.add(p.id);
        const plan=p.plan;require(object(plan)&&plan.provenance==='recorded'&&object(plan.routine)&&plan.routine.id===p.routine&&typeof plan.routine.name==='string'&&typeof plan.routine.note==='string', 'dated plan snapshot');
        const movementIds=exercises(plan.exercises);require(Array.isArray(plan.routine.ids)&&plan.routine.ids.length>0&&plan.routine.ids.length===movementIds.size&&new Set(plan.routine.ids).size===movementIds.size&&plan.routine.ids.every(i=>movementIds.has(i)), 'dated plan movements');
        require(plan.exercises.every(e=>e.sets>=1&&Number.isInteger(e.reps)&&['strength','reps','seconds'].includes(e.kind)&&e.weights.length<=e.sets&&e.weights.every(w=>w!=='')), 'dated plan targets');
        require(object(plan.period)&&plan.period.id===p.id&&plan.period.from===p.from&&date(plan.period.to)&&plan.period.to>=p.to, 'dated plan source window');
        require(!v.periodPlans.some(other=>other!==p&&other.routine===p.routine&&other.from<=p.to&&other.to>=p.from), 'overlapping dated plans');
      }
    }
    require(object(v.overrides) && Object.entries(v.overrides).every(([d, r]) => date(d) && (r === null || routines.has(r))), 'schedule overrides');
    if(v.scheduleChanges !== undefined){
      require(Array.isArray(v.scheduleChanges), 'schedule revisions');const dates=new Set();
      for(const revision of v.scheduleChanges){
        require(object(revision) && date(revision.from) && !dates.has(revision.from), 'schedule effective date');dates.add(revision.from);
        require(object(revision.days) && Object.keys(revision.days).length===7 && [0,1,2,3,4,5,6].every(d=>Object.hasOwn(revision.days,d)&&(revision.days[d]===null||routines.has(revision.days[d]))), 'weekly schedule');
      }
    }
    const totals = t => object(t)&&['sessions','sets','volume','minutes'].every(k=>number(t[k]))&&Number.isInteger(t.sessions)&&Number.isInteger(t.sets);
    const reviewReport = (r,b,when) => object(r)&&(r.from===undefined||(date(r.from)&&r.from<=b.start))&&(r.through===null||(date(r.through)&&r.through>=b.start&&r.through<=b.end&&r.through<=when))&&totals(r.current)&&(r.previous===null||(totals(r.previous)&&date(r.previous.from)&&date(r.previous.to)&&r.previous.from<=r.previous.to&&r.previous.to<b.start))&&Number.isInteger(r.drafts)&&r.drafts>=0&&Number.isInteger(r.skipped)&&r.skipped>=0;
    if(v.progressionReviews !== undefined){
      require(Array.isArray(v.progressionReviews), 'progression reviews');const seen=new Set();
      for(const p of v.progressionReviews){require(object(p)&&id(p.id)&&!seen.has(p.id)&&routines.has(p.routine)&&ids.has(p.exercise)&&Number.isInteger(p.reps)&&p.reps>=0&&['pending','approved','dismissed'].includes(p.status)&&typeof p.baseline==='string'&&date(p.created)&&typeof p.kind==='string', 'progression review');seen.add(p.id);
        if(p.target!==undefined){prescription(p.target);require(p.target.sets>=1&&p.target.weights.length<=p.target.sets&&p.target.kind===p.kind&&p.target.reps===p.reps&&['strength','reps','seconds'].includes(p.kind), 'review target');}
        if(p.previous!==undefined){prescription(p.previous);require(p.previous.kind===p.kind, 'previous target unit');}
        if(p.note!==undefined)require(typeof p.note==='string', 'review note');
        if(p.resolved!==undefined)require(date(p.resolved)&&p.resolved>=p.created&&p.status!=='pending', 'review resolution');
        if(p.evidence!==undefined){require(Array.isArray(p.evidence)&&p.evidence.length===2&&p.evidence[0].date!==p.evidence[1].date, 'review evidence dates');for(const e of p.evidence){require(object(e)&&date(e.date)&&e.date<=p.created&&(e.sessionId===''||id(e.sessionId))&&Array.isArray(e.sets)&&e.sets.length>0, 'review evidence');const indexes=new Set();for(const set of e.sets){require(object(set)&&set.exerciseId===p.exercise&&Number.isInteger(set.index)&&set.index>=0&&!indexes.has(set.index)&&Number.isInteger(set.reps)&&set.reps>=0&&(set.weight===null||number(set.weight))&&set.confirmed===true, 'review confirmed evidence');indexes.add(set.index)}}}
      }
    }
    if(v.trainingBlocks !== undefined){
      require(Array.isArray(v.trainingBlocks), 'training blocks');let last='';
      for(const b of v.trainingBlocks){require(object(b)&&date(b.start)&&date(b.end)&&date(b.review)&&b.end>=b.start&&b.start>last&&b.review>=b.start&&b.review<=b.end&&typeof b.focus==='string'&&typeof b.recovery==='string'&&typeof b.reviewed==='boolean'&&(b.reviewType===undefined||['annual','block'].includes(b.reviewType)), 'training block');last=b.end;if(b.reviewEntries!==undefined){require(Array.isArray(b.reviewEntries), 'block review entries');for(const entry of b.reviewEntries)require(object(entry)&&date(entry.date)&&typeof entry.focus==='string'&&typeof entry.recovery==='string'&&typeof entry.note==='string'&&reviewReport(entry.report,b,entry.date), 'block review snapshot')}}
    }
    require(object(v.logs), 'workout logs');
    const logs=Object.entries(v.logs);
    if(v.extraSessions!==undefined){require(Array.isArray(v.extraSessions), 'additional sessions');const seen=new Set();for(const s of v.extraSessions){require(object(s)&&id(s.id)&&!seen.has(s.id)&&date(s.date)&&object(s.log)&&s.log.plan!==undefined, 'additional session identity and snapshot');seen.add(s.id);logs.push([s.date,s.log])}}
    for (const [d, log] of logs) {
      require(date(d) && object(log) && log.date === d && Array.isArray(log.sets), 'workout date and sets');
      require(log.sessionNote===undefined||typeof log.sessionNote==='string', 'session notes');
      if(log.plan !== undefined){
        const p=log.plan;require(object(p) && ['recorded','legacy-reference'].includes(p.provenance) && object(p.routine), 'session snapshot');
        const snapshotIds=exercises(p.exercises),r=p.routine;
        require(id(r.id) && typeof r.name==='string' && typeof r.note==='string' && Array.isArray(r.ids) && r.ids.length===snapshotIds.size && new Set(r.ids).size===r.ids.length && r.ids.every(i=>snapshotIds.has(i)), 'snapshot routine');
        if(log.targetEdits!==undefined){require(object(log.targetEdits), 'session targets');for(const [eid,pres] of Object.entries(log.targetEdits)){require(snapshotIds.has(eid)&&object(pres)&&Object.keys(pres).every(k=>['sets','reps','rest','weights','kind'].includes(k))&&pres.kind===p.exercises.find(e=>e.id===eid).kind, 'session target identity');prescription(pres)}}
        const actualIds=new Set(snapshotIds);
        if(log.changes !== undefined){
          require(object(log.changes), 'session changes');
          for(const [original,c] of Object.entries(log.changes)){
            require(snapshotIds.has(original) && object(c) && ['skipped','substituted'].includes(c.status) && typeof c.note==='string' && typeof c.updatedAt==='string' && Number.isFinite(Date.parse(c.updatedAt)), 'session change details');
            if(c.status==='substituted'){
              exercises([c.replacement]);require(!actualIds.has(c.replacement.id) && typeof c.remainingSkipped==='boolean', 'unique substitute');actualIds.add(c.replacement.id);
            }else require(c.replacement===undefined, 'skipped exercise cannot hide a substitute');
          }
        }
        require(log.sets.every(s=>actualIds.has(s.exerciseId)), 'record missing from snapshot');
      }
      require(log.targetEdits===undefined||log.plan!==undefined, 'session targets need original snapshot');
      require(log.changes===undefined||log.plan!==undefined, 'session changes need an original prescription');
      const seen = new Set();
      for (const s of log.sets) {
        require(object(s) && id(s.exerciseId) && Number.isInteger(s.index) && s.index >= 0, 'recorded set identity');
        const key = s.exerciseId + ':' + s.index; require(!seen.has(key), 'duplicate recorded set'); seen.add(key);
        require(typeof s.confirmed === 'boolean', 'explicit confirmation');
        require((number(s.reps) && Number.isInteger(s.reps) || s.reps === null && !s.confirmed) && (s.weight === null || number(s.weight)), 'actual performance');
      }
    }
    if(v.customMetrics!==undefined){require(Array.isArray(v.customMetrics),'custom measurements');const seen=new Set();for(const m of v.customMetrics){require(object(m)&&id(m.id)&&!seen.has(m.id)&&date(m.date)&&typeof m.name==='string'&&m.name.trim().length>0&&m.name.length<=80&&typeof m.unit==='string'&&m.unit.trim().length>0&&m.unit.length<=24&&number(m.value)&&typeof m.notes==='string','custom measurement');seen.add(m.id)}}
    require(Array.isArray(v.measurements) && v.measurements.every(m => object(m) && date(m.date) && number(m.weight)), 'measurements');
    require(typeof v.restrictions === 'string' && typeof v.notes === 'string', 'notes and restrictions');
    if(v.exercisePreferences!==undefined)root.FormPreferences.validate(v.exercisePreferences,v);
    if(v.progressionRules!==undefined)root.FormProgressionRules.validate(v.progressionRules,v);
    if (v.activities !== undefined) root.FormActivities.validate(v.activities);
    if(v.healthImports!==undefined)root.FormHealthHistory.validate(v.healthImports);
    return v;
  }
  function open(storage, key, defaults) {
    let raw = null, value = null, error = null;
    try { raw = storage.getItem(key); value = raw === null ? structuredClone(defaults()) : validate(JSON.parse(raw)); }
    catch (e) { error = e; }
    return {
      get value() { return value; }, get raw() { return raw; }, get error() { return error; },
      write(next, restoring = false) {
        validate(next);
        if (error && !restoring) throw new Error('Saved data needs recovery before editing.');
        if (storage.getItem(key) !== raw) throw new Error('Your data changed in another tab. Reload before editing to avoid overwriting it.');
        const encoded = JSON.stringify(next);
        // A restore must retain the exact prior bytes before replacing anything.
        if (restoring && raw !== null) storage.setItem(key + '-before-restore', raw);
        storage.setItem(key, encoded);
        raw = encoded; value = structuredClone(next); error = null;
        return value;
      }
    };
  }
  function summary(value){
    if(!value)return null;
    const entries=Object.entries(value.logs).concat((value.extraSessions||[]).map(s=>[s.date,s.log])),sets=entries.flatMap(([,log])=>log.sets),dates=entries.map(([date])=>date).sort();
    return {sessions:entries.length,confirmed:sets.filter(s=>s.confirmed).length,drafts:sets.filter(s=>!s.confirmed).length,activities:(value.activities||[]).length,measurements:value.measurements.length+(value.customMetrics||[]).length,first:dates[0]||null,last:dates.at(-1)||null,preferences:(value.exercisePreferences||[]).length,healthImports:(value.healthImports||[]).length,archivedActivities:(value.healthImports||[]).reduce((n,b)=>n+b.archivedIds.length,0),periodPlans:(value.periodPlans||[]).length,trainingBlocks:(value.trainingBlocks||[]).length,reviews:(value.progressionReviews||[]).length,rules:(value.progressionRules||[]).length,scheduleChanges:(value.scheduleChanges||[]).length};
  }
  root.FormStore = { validate, open, summary };
})(typeof window === 'undefined' ? globalThis : window);
