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
    const ids = new Set();
    for (const e of v.exercises) {
      require(object(e) && id(e.id) && !ids.has(e.id), 'unique exercise ID'); ids.add(e.id);
      require(typeof e.name === 'string' && typeof e.group === 'string' && typeof e.kind === 'string', 'exercise details');
      require(Number.isInteger(e.sets) && e.sets >= 0 && e.sets <= 100 && number(e.reps) && number(e.rest), 'exercise prescription');
      require(Array.isArray(e.weights) && e.weights.every(w => w === null || w === '' || number(w)), 'prescribed weights');
    }
    require(Array.isArray(v.routines) && v.routines.length >= 3, 'three scheduling routines');
    const routines = new Set();
    for (const r of v.routines) {
      require(object(r) && id(r.id) && !routines.has(r.id), 'unique routine ID'); routines.add(r.id);
      require(typeof r.name === 'string' && typeof r.note === 'string' && Array.isArray(r.ids) && r.ids.every(i => ids.has(i)), 'routine');
    }
    require(object(v.overrides) && Object.entries(v.overrides).every(([d, r]) => date(d) && (r === null || routines.has(r))), 'schedule overrides');
    require(object(v.logs), 'workout logs');
    for (const [d, log] of Object.entries(v.logs)) {
      require(date(d) && object(log) && log.date === d && Array.isArray(log.sets), 'workout date and sets');
      const seen = new Set();
      for (const s of log.sets) {
        require(object(s) && id(s.exerciseId) && Number.isInteger(s.index) && s.index >= 0, 'recorded set identity');
        const key = s.exerciseId + ':' + s.index; require(!seen.has(key), 'duplicate recorded set'); seen.add(key);
        require(typeof s.confirmed === 'boolean', 'explicit confirmation');
        require((number(s.reps) && Number.isInteger(s.reps) || s.reps === null && !s.confirmed) && (s.weight === null || number(s.weight)), 'actual performance');
      }
    }
    require(Array.isArray(v.measurements) && v.measurements.every(m => object(m) && date(m.date) && number(m.weight)), 'measurements');
    require(typeof v.restrictions === 'string' && typeof v.notes === 'string', 'notes and restrictions');
    if (v.activities !== undefined) root.FormActivities.validate(v.activities);
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
  root.FormStore = { validate, open };
})(typeof window === 'undefined' ? globalThis : window);
