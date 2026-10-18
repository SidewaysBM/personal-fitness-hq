const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
for(const file of ['session-changes','program','training-tools','activities','data-store'])require('../assets/'+file+'.js');
const html=fs.readFileSync('index.html','utf8');const fixture=html.slice(html.indexOf('const base='),html.indexOf(';let data;'));const d=vm.runInNewContext(fixture+';initial()', {structuredClone});
for(const date of ['2026-10-14','2026-10-16']){d.overrides[date]='A';FormProgram.record(d,'Ben',date).sets=[{exerciseId:'back-squat',index:0,reps:3,weight:30,confirmed:true},{exerciseId:'back-squat',index:1,reps:999,weight:999,confirmed:false}]}
assert.equal(FormTraining.evidence(d,'back-squat','2026-10-15').length,1);assert.equal(FormTraining.history(d,'2026-10-18')[0].volume,90);
const p=FormTraining.propose(d,'A','back-squat',4,'2026-10-18');d.progressionReviews=[p];const before=JSON.stringify(d.logs);const approved=FormTraining.resolve(d,'Ben',p.id,'approve','2026-10-18');assert.equal(approved.routines[0].prescriptions['back-squat'].reps,4);assert.equal(JSON.stringify(approved.logs),before);assert.equal(d.progressionReviews[0].status,'pending');assert.throws(()=>FormTraining.resolve(approved,'Ben',p.id,'approve','2026-10-18'));
d.logs['2026-10-16'].sets[0].reps=2;assert.throws(()=>FormTraining.resolve(d,'Ben',p.id,'approve','2026-10-18'),/changed/);assert.equal(FormTraining.resolve(d,'Ben',p.id,'dismiss','2026-10-18').progressionReviews[0].status,'dismissed');
approved.trainingBlocks=FormTraining.blocks('2026-10-18');assert.equal(approved.trainingBlocks.length,13);approved.trainingBlocks.push(...FormTraining.blocks(FormTraining.day(approved.trainingBlocks.at(-1).end,1)));assert.equal(approved.trainingBlocks.length,26);assert.equal(FormStore.validate(approved),approved);
const bad=structuredClone(approved);bad.trainingBlocks[1].start=bad.trainingBlocks[0].start;assert.throws(()=>FormStore.validate(bad));bad.trainingBlocks=approved.trainingBlocks;bad.progressionReviews[0].reps=-1;assert.throws(()=>FormStore.validate(bad));
console.log('PASS training tools: confirmed evidence, future/draft exclusion, stale approvals, immutable history, repeat approval prevention, multi-year blocks and backup validation');

const latest=structuredClone(d);delete latest.progressionReviews;latest.progressionReviews=[FormTraining.propose(latest,'A','back-squat',4,'2026-10-18')];latest.exercises[0].rest+=10;assert.throws(()=>FormTraining.resolve(latest,'Ben',latest.progressionReviews[0].id,'approve','2026-10-18'),/changed/);
assert.equal(FormTraining.records(d,'back-squat','strength','2026-10-18').load.weight,30);assert.equal(FormTraining.records(d,'back-squat','seconds','2026-10-18').repetitions,null);
assert.equal(FormTraining.reviewSummary(d,'2026-10-01','2026-10-31','2026-10-15').sets,1);
const mixed=structuredClone(d);delete mixed.progressionReviews;mixed.logs['2026-10-16'].plan.exercises[0].kind='seconds';assert.throws(()=>FormTraining.propose(mixed,'A','back-squat',4,'2026-10-18'),/units/);
console.log('PASS records/reviews: unit separation, dated confirmed records, review ranges, future exclusion and exercise-definition approval invalidation');

const completeData=structuredClone(d);delete completeData.progressionReviews;
for(const log of Object.values(completeData.logs)){const e=log.plan.exercises[0];log.sets=Array.from({length:e.sets},(_,index)=>({exerciseId:e.id,index,reps:e.reps,weight:e.weights[index],confirmed:true}))}
const untouched=JSON.stringify(completeData);assert.equal(FormTraining.reviewSignals(completeData,'2026-10-18').length,1);assert.equal(JSON.stringify(completeData),untouched);
let variant=structuredClone(completeData);variant.logs['2026-10-16'].sets[0].confirmed=false;assert.equal(FormTraining.reviewSignals(variant,'2026-10-18').length,0);
variant=structuredClone(completeData);variant.logs['2026-10-16'].sets[0].weight=null;assert.equal(FormTraining.reviewSignals(variant,'2026-10-18').length,0);
variant=structuredClone(completeData);variant.routines[0].prescriptions={'back-squat':{...variant.exercises[0],reps:999}};assert.equal(FormTraining.reviewSignals(variant,'2026-10-18').length,0);
assert.equal(FormTraining.reviewSignals(completeData,'2026-10-15').length,0);assert.equal(FormTraining.weekly(completeData,'2026-10-18').at(-1).days,2);assert.equal(FormTraining.weekly(completeData,'2026-10-18',52).length,52);
variant=structuredClone(completeData);variant.extraSessions=[{id:'same-day',date:'2026-10-16',log:structuredClone(variant.logs['2026-10-16'])}];assert.equal(FormTraining.reviewSignals(variant,'2026-10-18').length,0);assert.equal(FormTraining.weekly(variant,'2026-10-18').at(-1).days,2);assert.equal(FormTraining.weekly(variant,'2026-10-18').at(-1).sessions,3);
console.log('PASS review prompts and weekly summaries: full targets, separate dates, known loads, changed targets, future exclusion, no mutations, distinct training days and sessions');
