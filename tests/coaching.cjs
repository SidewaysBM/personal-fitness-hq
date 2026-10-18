const assert=require('node:assert/strict');require('../assets/coaching.js');
const data={exercises:[{id:'lift',kind:'reps',name:'Lift'},{id:'hold',kind:'seconds',name:'Hold'}],logs:{}};
const set=(confirmed,reps=5,weight=20,exerciseId='lift')=>({exerciseId,index:0,reps,weight,confirmed});
data.logs['2026-10-12']={sets:[set(false)]};assert.equal(FormCoach.analyse(data,'2026-10-17').sets,0);
data.logs['2026-10-13']={sets:[set(true)]};data.logs['2026-10-15']={sets:[set(true,6),{...set(true,30,5,'hold'),index:1}]};
data.logs['2026-10-20']={sets:[set(true,1000)]};
const before=JSON.stringify(data),review=FormCoach.analyse(data,'2026-10-17');assert.equal(review.sets,3);assert.equal(review.volume,220);assert.equal(review.week,2);assert.equal(review.sessions,2);assert(review.reviews.some(r=>r.id.startsWith('progress-')));assert.equal(JSON.stringify(data),before);
data.logs['2026-10-15'].sets[0].weight=25;assert(!FormCoach.analyse(data,'2026-10-17').reviews.some(r=>r.id.startsWith('progress-')));
assert(FormCoach.analyse(data,'2026-11-17').reviews.some(r=>r.id.startsWith('review-')));
console.log('PASS coaching: confirmed-only records, comparable performance, timed-volume exclusion, future exclusion, checkpoints and no data mutation');

// Session units, not a subsequently edited library entry, control volume and comparison.
data.logs['2026-10-15'].plan={exercises:[{id:'lift',kind:'seconds'},{id:'hold',kind:'seconds'}]};
assert.equal(FormCoach.analyse(data,'2026-10-17').volume,100);
assert(!FormCoach.analyse(data,'2026-10-17').reviews.some(r=>r.id.startsWith('progress-')));
