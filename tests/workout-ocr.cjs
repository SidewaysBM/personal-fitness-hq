const assert=require('node:assert/strict');require('../assets/workout-ocr.js');
const library=[{name:'Back squat'},{name:'Side plank on elbow'}];
const rows=FormOCR.draft('Warm up as supplied\nBack squat\nSets: 3\nRepetitions: 8\nWeight: 20 kg\nRest: 60 seconds\nKeep original instructions\nSide plank on elbow\nSets: 2\nHold: 30 seconds',library);
assert.equal(rows.length,2);assert.deepEqual([rows[0].sets,rows[0].reps,rows[0].weight,rows[0].rest,rows[0].unit],['3','8','20','60','reps']);assert.equal(rows[1].unit,'seconds');assert.equal(rows[1].rest,'');assert.match(rows[0].instructions,/Keep original instructions/);
const ambiguous=FormOCR.draft('Exercise: Mystery movement\nSets: 3\nSets: 4\nReps: 8\nHold: 30 seconds\nWeight: 20 lb\nRest: 1-2 minutes',library)[0];assert.equal(ambiguous.sets,'');assert.equal(ambiguous.reps,'');assert.equal(ambiguous.unit,'');assert.equal(ambiguous.weight,'');assert.equal(ambiguous.rest,'');
assert.throws(()=>FormOCR.draft('Unknown unlabeled heading\n3 x 8',library),/No exact/);assert.throws(()=>FormOCR.draft('x'.repeat(50001),library),/50,000/);
assert.equal(FormOCR.draft('Exercise: <img src=x>\nSets: 1',library)[0].name,'<img src=x>');
console.log('PASS conservative OCR draft mapping: explicit fields, unresolved ambiguity, unknown movements and source preservation');
