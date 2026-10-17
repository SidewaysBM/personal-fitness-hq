/* FORM movement references. Original SVG diagrams and independently written cues.
 * Reference content is deliberately separate from saved exercise prescriptions.
 * No network requests or storage writes are made by this module.
 */
(() => {
  'use strict';
  const guide = (variant, steps, cue, source, publisher, title, note = '') =>
    ({variant, steps, cue, source, publisher, title, note, reviewed: '2026-10-17'});
  const guides = {
    'back-squat': guide('Barbell back squat', [
      'Set the rack safeties and place the bar across your upper back, clear of your neck. Grip evenly and step back into your usual stance.',
      'Brace your trunk. Bend your hips and knees together, keeping your whole foot grounded and your knees following your toes.',
      'Descend only to the depth prescribed for you, maintaining control of your trunk and bar.',
      'Push through your feet to stand. Settle your balance before the next repetition and re-rack carefully.'
    ], 'Keep the bar balanced over your feet; do not crane your neck upwards.', 'https://www.crossfit.com/essentials/the-back-squat', 'CrossFit', 'The Back Squat'),
    'push-press': guide('Barbell dip, drive and press', [
      'Hold the bar at the front of your shoulders with an even grip and feet around hip width.',
      'Make a shallow knee-and-hip dip with your torso upright and feet planted.',
      'Drive your legs straight, then press the moving bar overhead. Finish balanced without dipping under the bar again.',
      'Lower to the shoulders under control and reset before repeating.'
    ], 'Use a shallow dip, not a full squat. Keep your ribs controlled as the bar rises.', 'https://www.crossfit.com/essentials/the-push-press', 'CrossFit', 'The Push Press'),
    'box-jumps': guide('Two-foot take-off and landing', [
      'Use a stable box at your prescribed height. Stand facing it with space for both feet to land fully.',
      'Bend your hips and knees and bring your arms back to prepare.',
      'Drive off both feet and swing your arms forwards. Land with both feet on the box, bending your knees to absorb the landing.',
      'Stand balanced on the box, then step down carefully and reset.'
    ], 'Land quietly with knees tracking over toes. Reset each jump rather than bouncing off the floor.', 'https://www.crossfit.com/essentials/the-box-jump', 'CrossFit', 'The Box Jump', 'The reference includes jumping down; this guide shows a step-down reset. Follow your clinician’s prescribed return.'),
    'tricep-extension': guide('Two hands holding one dumbbell', [
      'Stand or sit upright and support one dumbbell securely with both hands overhead.',
      'Keep your upper arms beside your head. Bend your elbows to lower the weight behind your head within your prescribed range.',
      'Straighten your elbows to raise the dumbbell while keeping your trunk still.',
      'Lower slowly for the next repetition. Keep the weight clear of your head and neck.'
    ], 'Move at the elbows; avoid arching your back to lift the weight.', 'https://www.catalystathletics.com/exercise/828/Dumbbell-Overhead-Tricep-Extension/', 'Catalyst Athletics', 'Dumbbell Overhead Tricep Extension', 'Two-hand dumbbell example. The original name does not confirm equipment or whether one or two arms were prescribed.'),
    'leg-raise': guide('Straight-leg raise to hip height', [
      'Take a secure grip on the overhead bar and establish a still, supported hang.',
      'Keep your knees straight and lift both legs forwards from your hips towards an L shape, within your prescribed range.',
      'Pause without swinging your trunk or throwing your head backwards.',
      'Lower your legs slowly to a still hang before repeating.'
    ], 'Control the lowering phase; this is not a kipping toes-to-bar movement.', 'https://nz.physitrack.com/home-exercise-video/hanging-leg-raise', 'Physitrack', 'Hanging leg raise', 'The source uses a neutral grip; retain the grip prescribed by your physiotherapist.'),
    'single-leg-squat': guide('Rear-foot-elevated barbell example — variant unconfirmed', [
      'First match the setup to your clinician’s instructions. This example uses a rear foot on a bench, not a free-standing pistol squat.',
      'For that variation, set a secure bench behind you and a bar across your upper back. Plant the working foot and support the rear foot on the bench.',
      'Bend the front hip and knee to lower with control, keeping the front foot grounded.',
      'Press through the working foot to stand. Follow your prescribed depth, loading and side order.'
    ], 'Do not adopt this variation unless it matches your prescription.', 'https://www.youtube.com/watch?v=9HNd6tmthjE', 'FITASTIC', 'Barbell Single Leg Squat', 'This name is used for both rear-foot-elevated squats and unsupported single-leg squats. The screenshots are unavailable here, so the intended variation cannot be verified. This is a labelled reference example, not a substitution.'),
    'bench': guide('Flat barbell bench press', [
      'Set the rack safeties or arrange a spotter. Lie on the bench with feet supported and an even grip on the bar.',
      'Unrack with control and position the bar above your chest with arms extended.',
      'Lower towards your chest while keeping your shoulders stable and wrists above your forearms.',
      'Press back up smoothly without bouncing the bar. Re-rack only when the bar is securely over both hooks.'
    ], 'Keep your head supported on the bench; do not lift it towards the bar.', 'https://www.crossfit.com/essentials/the-bench-press', 'CrossFit', 'The Bench Press'),
    'ring-row': guide('Feet elevated on a stable box', [
      'Check the rings and straps are secure. Place your heels on a stable box and hold one ring in each hand.',
      'Begin beneath the rings with straight arms and a firm line through your trunk and legs.',
      'Bend your elbows and draw your chest towards the rings, keeping your hips in line.',
      'Extend your arms slowly to lower. Keep your feet supported throughout.'
    ], 'Bring your chest to the rings without poking your chin forwards or sagging at the hips.', 'https://programme.app/exercises/feet-elevated-ring-row/319', 'Programme', 'Feet Elevated Ring Row', 'Decline is shown as feet elevated. Ring height and box height remain as prescribed; no height is inferred.'),
    'sit-up': guide('Bent knees, feet on the floor', [
      'Lie on your back with knees bent and feet flat. Position your arms as prescribed, without pulling on your neck.',
      'Engage your abdomen and curl your trunk forwards smoothly.',
      'Continue only through your prescribed range, keeping your head aligned with your upper body.',
      'Lower your trunk to the mat with control and reset.'
    ], 'Avoid throwing your arms or forcing your chin forwards to create momentum.', 'https://www.youtube.com/watch?v=1MdbYd2u9fs', 'The Pump Club', 'Bent Leg Sit Up', 'Arm position and range should follow your individual prescription.'),
    'side-plank': guide('Forearm support with straight legs', [
      'Lie on your side with your elbow below your shoulder and your forearm on the mat. Stack your straight legs.',
      'Lift your hips until your head, trunk and legs form one line.',
      'Breathe steadily while holding for the prescribed time, keeping your hips from dropping or rotating.',
      'Lower your hips with control. Repeat on the other side as prescribed.'
    ], 'Support yourself on the forearm, not a straight arm. Keep your neck in line with your trunk.', 'https://www.peak-physio.com.au/exercise/side-plank-full/', 'Peak Physio', 'Side Plank [Full]', 'Straight-leg example. Retain a bent-knee version if that is what your clinician prescribed.'),
    'deadbug': guide('Opposite arm and leg extension', [
      'Lie on your back with arms pointing upwards and hips and knees bent to roughly right angles.',
      'Keep your trunk still as you reach one arm behind you and extend the opposite leg forwards.',
      'Stop the reach before your lower back lifts away from the mat.',
      'Return to the start, then repeat with the other arm and leg. Keep breathing throughout.'
    ], 'Move the opposite arm and leg together; keep your head resting on the mat.', 'https://ca.physitrack.com/home-exercise-video/supine-dead-bugs', 'Physitrack', 'Supine dead bugs'),
    'thruster': guide('Two dumbbells: squat into overhead press', [
      'Hold the dumbbells at your shoulders and set your squat stance.',
      'Lower into your prescribed squat depth with your feet grounded and knees following your toes.',
      'Drive up from the squat, then use that momentum to press both dumbbells overhead.',
      'Return the dumbbells to your shoulders under control before moving into the next squat.'
    ], 'The squat flows into the press. Avoid leaning backwards at the top.', 'https://www.youtube.com/watch?v=u3wKkZjE8QM', 'CrossFit', 'The Dumbbell Thruster'),
    'neutral-push': guide('Two dumbbells, palms facing each other', [
      'Hold one dumbbell at each shoulder, with palms facing inwards towards each other.',
      'Keep your torso upright and make a shallow dip through your knees and hips.',
      'Drive through your legs, then press both dumbbells overhead, retaining the neutral grip.',
      'Bring the weights back to shoulder height under control and reset.'
    ], 'Keep your palms facing each other. Use a shallow dip rather than the full squat of a thruster.', 'https://sweat.com/exercises/dumbell-push-press', 'Sweat', 'Dumbbell Push Press (Neutral Grip)'),
    'lunge': guide('Bodyweight reverse lunge', [
      'Stand tall with enough room behind you to step back.',
      'Step one foot backwards and bend both knees, keeping your front foot grounded.',
      'Lower with control through your prescribed range and keep the front knee tracking with the toes.',
      'Push through the front foot to return to standing. Alternate sides or finish one side according to your prescription.'
    ], 'Keep a comfortable width between your feet rather than stepping onto a tightrope.', 'https://au.physitrack.com/home-exercise-video/reverse-lunge---alternating', 'Physitrack', 'Reverse lunge - alternating'),
    'pushup': guide('Full push-up from toes', [
      'Place your hands just outside shoulder width and extend your legs into a plank.',
      'Brace your trunk and bend your elbows to lower your chest towards the floor.',
      'Keep your head, trunk and legs moving together through your prescribed range.',
      'Press the floor away to return to straight arms without letting your hips sag.'
    ], 'Look towards the floor and move as one unit. Follow any prescribed incline or knee-supported modification.', 'https://www.crossfit.com/essentials/the-push-up', 'CrossFit', 'The Push-Up'),
    'burpee': guide('Floor-to-stand with jump example', [
      'From standing, bend your hips and knees and place your hands on the floor.',
      'Move your feet back into a plank. Lower to the floor only if that is part of your prescribed version.',
      'Press up and bring your feet back towards your hands, keeping control of your trunk.',
      'Stand and perform the prescribed jump, if included. Land softly before the next repetition.'
    ], 'Keep the sequence controlled. A push-up, jump or step-back should match your prescribed version.', 'https://www.crossfit.com/essentials/the-burpee', 'CrossFit', 'The Burpee', 'The reference shows a full floor-to-jump burpee. The original name does not confirm whether a push-up or jump is required.')
  };
  window.FormGuides = Object.freeze(guides);
})();
