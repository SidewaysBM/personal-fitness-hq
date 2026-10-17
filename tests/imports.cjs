const assert=require('node:assert/strict');require('../assets/workout-import.js');require('../assets/activities.js');
const row={name:'Bench press',sets:'3',reps:'5',rest:'90',weight:'',unit:'reps',instructions:'Keep original instructions'};
const library=[{id:'bench',name:'Bench press',group:'Chest',sets:5,reps:5,weights:[30]}];const before=JSON.stringify(library);
const result=FormImport.prepare([row],library)[0];assert.equal(result.sourceExerciseId,'bench');assert.deepEqual(result.weights,[]);assert.equal(result.instructions,row.instructions);assert.equal(JSON.stringify(library),before);assert.equal(result.confirmed,undefined);
for(const override of [{sets:''},{reps:''},{rest:''},{sets:'1.5'},{weight:'NaN'},{reps:'-1'},{name:''}])assert.throws(()=>FormImport.prepare([{...row,...override}],library));
assert.equal(FormImport.prepare([{...row,name:'My own movement'}],library)[0].sourceExerciseId,null);
const activity={id:'synthetic',date:'2026-10-17',category:'Walking',minutes:20,distanceKm:null,confirmed:false,notes:''};assert.deepEqual(FormActivities.validate([activity]),[activity]);
for(const override of [{date:'2026-02-30'},{minutes:NaN},{confirmed:'true'},{distanceKm:-1},{category:'Unknown'},{minutes:0,confirmed:true}])assert.throws(()=>FormActivities.validate([{...activity,...override}]));
assert.throws(()=>FormActivities.validate([activity,activity]));console.log('PASS imports and activities: required fields, unknown matches, missing loads, source preservation, no completion, valid units and duplicate IDs');
