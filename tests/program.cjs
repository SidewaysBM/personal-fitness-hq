const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
require('../assets/program.js');require('../assets/activities.js');require('../assets/data-store.js');
const source=fs.readFileSync('index.html','utf8');
const fresh=()=>JSON.parse(vm.runInNewContext(source.slice(source.indexOf('const base='),source.indexOf(';let data;'))+';JSON.stringify(initial())'));
let data=fresh(),original=JSON.stringify(data);
assert.equal(FormProgram.scheduled(data,'Ben','2026-10-19'),'A');assert.equal(FormProgram.scheduled(data,'Georgie','2026-10-19'),null);
assert.equal(FormProgram.scheduled(data,'Ben','2038-10-18'),'A');assert.equal(JSON.stringify(data),original);
const log=FormProgram.record(data,'Ben','2026-10-19');log.sets.push({exerciseId:'back-squat',index:0,reps:4,weight:35,confirmed:true});const history=JSON.stringify(log);
const changed=FormProgram.editRoutine(data,'Ben','A',{name:'Updated plan',ids:['back-squat'],prescriptions:{'back-squat':{sets:2,reps:8,weights:[50,null],rest:90,kind:'reps'}}});
FormStore.validate(changed);assert.equal(JSON.stringify(changed.logs['2026-10-19']),history);assert.equal(FormProgram.plan(changed,'Ben','2026-10-19').exercises[0].reps,3);assert.equal(FormProgram.plan(changed,'Ben','2026-10-26').exercises[0].reps,8);assert.equal(data.routines[0].name,'Strength & Power');assert.equal(changed.exercises[0].reps,3);
const days={0:null,1:null,2:'A',3:null,4:'B',5:null,6:'C'};
const scheduled=FormProgram.setSchedule(changed,'Ben','2026-10-26',days);FormStore.validate(scheduled);
assert.equal(FormProgram.scheduled(scheduled,'Ben','2026-10-19'),'A');assert.equal(FormProgram.scheduled(scheduled,'Ben','2026-10-26'),null);assert.equal(FormProgram.scheduled(scheduled,'Ben','2026-10-27'),'A');assert.equal(JSON.stringify(scheduled.logs['2026-10-19']),history);
scheduled.overrides['2026-10-27']=null;assert.equal(FormProgram.scheduled(scheduled,'Ben','2026-10-27'),null);
const legacy=fresh();legacy.logs['2026-10-19']={date:'2026-10-19',sets:[{exerciseId:'back-squat',index:7,reps:9,weight:80,confirmed:true},{exerciseId:'removed-movement',index:0,reps:10,weight:null,confirmed:false}],finishedAt:'2026-10-19T00:00:00Z',privateMetadata:{retain:true}};
const legacyRaw=JSON.stringify(legacy),migrated=FormProgram.setSchedule(legacy,'Ben','2026-10-26',days);FormStore.validate(migrated);assert.equal(JSON.stringify(legacy),legacyRaw);assert.deepEqual(migrated.logs['2026-10-19'].sets,legacy.logs['2026-10-19'].sets);assert.equal(migrated.logs['2026-10-19'].plan.provenance,'legacy-reference');assert.equal(migrated.logs['2026-10-19'].plan.exercises[0].sets,8);assert.deepEqual(migrated.logs['2026-10-19'].privateMetadata,{retain:true});
assert.deepEqual(FormProgram.preserve(migrated,'Ben'),migrated);
for(const mutate of [v=>v.scheduleChanges[0].days[0]='missing',v=>v.scheduleChanges[0].from='2026-02-30',v=>v.logs['2026-10-19'].plan.exercises[0].reps=-1,v=>v.logs['2026-10-19'].plan.routine.ids=[],v=>v.routines[0].prescriptions={'back-squat':{sets:1,reps:1,weights:[],rest:0,kind:'reps'},unknown:{sets:1,reps:1,weights:[],rest:0,kind:'reps'}}]){const bad=structuredClone(scheduled);mutate(bad);assert.throws(()=>FormStore.validate(bad));}
console.log('PASS programming: effective schedules, overrides, immutable snapshots, routine-specific targets, legacy preservation, unknown movements and strict restore validation');
