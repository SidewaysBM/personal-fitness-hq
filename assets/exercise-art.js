/* Original FORM vector movement sequences. Coordinates describe distinct poses,
 * not generic muscle-group symbols. View is side-on unless labelled otherwise. */
(() => {
  'use strict';
  const path = (d, colour, width = 6) => `<path d="${d}" fill="none" stroke="${colour}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const bar = (x, y) => path(`M${x-45} ${y}h90 M${x-35} ${y-10}v20 M${x+35} ${y-10}v20`, '#b6f47c', 5);
  const db = (x, y) => path(`M${x-10} ${y}h20 M${x-10} ${y-6}v12 M${x+10} ${y-6}v12`, '#b6f47c', 5);
  const box = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#29434b" stroke="#7da4ad" stroke-width="2"/>`;
  const bench = box(35, 137, 115, 9) + path('M45 146v34 M140 146v34', '#7da4ad', 4);
  // head, shoulder, hip, far limbs, near limbs, equipment, neck base optional
  const p = (head, shoulder, hip, far, near, equipment = '') => ({head, shoulder, hip, far, near, equipment});
  const upright = p([99,50],[96,70],[90,123], 'M96 73L78 95L82 115 M90 123L78 153L75 180', 'M96 73L115 94L108 111 M90 123L103 153L105 180');
  const squat = p([118,82],[108,101],[77,135], 'M108 101L91 116L102 96 M77 135L110 144L96 180', 'M108 101L126 122L132 99 M77 135L127 143L112 180');
  const overhead = p([100,68],[100,87],[100,130], 'M100 87L82 59L78 30 M100 130L85 155L81 180', 'M100 87L121 59L123 30 M100 130L114 156L120 180');
  const dip = p([100,65],[99,84],[90,128], 'M99 84L80 103L80 78 M90 128L78 149L82 180', 'M99 84L119 106L124 78 M90 128L117 148L113 180');
  const plank = p([50,113],[65,122],[116,141], 'M65 122L57 150L52 177 M116 141L150 158L183 175', 'M65 122L70 150L67 177 M116 141L148 162L177 180');
  const lowPush = p([45,151],[61,155],[115,165], 'M61 155L84 162L60 180 M115 165L151 172L181 178', 'M61 155L88 167L68 180 M115 165L148 177L176 180');
  const poses = {
    'back-squat': [['Stand', {...upright, far:'M96 73L77 94L69 75 M90 123L78 153L75 180',near:'M96 73L113 96L123 75 M90 123L103 153L105 180',equipment:bar(96,75)}], ['Lower & return', {...squat,equipment:bar(108,99)}]],
    'push-press': [['Shallow dip', {...dip,equipment:bar(100,78)}], ['Drive & press', {...overhead,equipment:bar(100,30)}]],
    'box-jumps': [['Load & take off', p([75,85],[65,103],[46,137], 'M65 103L39 117L25 108 M46 137L77 145L60 180', 'M65 103L40 127L22 123 M46 137L89 144L73 180',box(125,115,60,65))], ['Land on both feet',p([145,36],[138,54],[113,81],'M138 54L157 64L166 46 M113 81L150 87L144 115','M138 54L163 73L177 59 M113 81L164 89L155 115',box(125,115,60,65))]],
    'tricep-extension': [['Bend elbows', p([105,64],[102,84],[99,129],'M102 84L86 39L77 73 M99 129L84 155L80 180','M102 84L97 35L79 72 M99 129L113 154L118 180',db(78,73))], ['Extend elbows',p([105,64],[102,84],[99,129],'M102 84L87 50L91 20 M99 129L84 155L80 180','M102 84L102 51L94 20 M99 129L113 154L118 180',db(94,20))]],
    'leg-raise': [['Still hang',p([95,66],[95,86],[95,130],'M95 86L76 51L74 20 M95 130L86 158L86 181','M95 86L111 51L112 20 M95 130L100 158L100 181',path('M48 20H142','#b6f47c',5))],['Raise straight legs',p([83,66],[83,86],[83,130],'M83 86L69 51L70 20 M83 130L124 126L163 126','M83 86L105 51L108 20 M83 130L124 136L168 136',path('M48 20H142','#b6f47c',5))]],
    'single-leg-squat': [['Rear foot supported',p([84,48],[82,68],[82,116],'M82 68L65 91L52 72 M82 116L122 139L159 135','M82 68L101 91L109 72 M82 116L77 151L70 180',box(148,135,43,45)+bar(82,72))],['Lower & return',p([92,75],[88,95],[78,137],'M88 95L72 114L58 99 M78 137L119 163L159 135','M88 95L108 117L118 99 M78 137L54 143L68 180',box(148,135,43,45)+bar(88,99))]],
    'bench': [['Lower to chest',p([39,124],[57,126],[115,128],'M57 126L78 132L77 105 M115 128L144 147L151 177','M57 126L60 143L76 105 M115 128L133 148L141 180',bench+bar(76,105))],['Press upwards',p([39,124],[57,126],[115,128],'M57 126L69 94L78 57 M115 128L144 147L151 177','M57 126L65 94L76 57 M115 128L133 148L141 180',bench+bar(76,57))]],
    'ring-row': [['Arms extended',p([31,140],[50,135],[109,122],'M50 135L53 106L55 76 M109 122L144 115L180 108','M50 135L69 106L78 77 M109 122L146 119L184 113',box(170,113,30,67)+path('M55 15V66 M78 15V67','#7da4ad',2)+'<g fill="none" stroke="#b6f47c" stroke-width="3"><ellipse cx="55" cy="73" rx="7" ry="9"/><ellipse cx="78" cy="74" rx="7" ry="9"/></g>')],['Pull chest to rings',p([31,80],[50,82],[109,95],'M50 82L34 107L55 76 M109 95L145 102L180 108','M50 82L65 111L78 77 M109 95L146 107L184 113',box(170,113,30,67)+path('M55 15V66 M78 15V67','#7da4ad',2)+'<g fill="none" stroke="#b6f47c" stroke-width="3"><ellipse cx="55" cy="73" rx="7" ry="9"/><ellipse cx="78" cy="74" rx="7" ry="9"/></g>')]],
    'sit-up': [['Lie with knees bent',p([30,166],[50,168],[109,168],'M50 168L69 153L85 165 M109 168L144 128L175 176','M50 168L69 147L84 161 M109 168L136 124L164 180')],['Curl & lower slowly',p([85,83],[93,104],[109,168],'M93 104L112 118L100 135 M109 168L144 128L175 176','M93 104L121 120L101 139 M109 168L136 124L164 180')]],
    'side-plank': [['Elbow under shoulder',p([31,117],[50,129],[108,174],'M50 129L72 145L104 160 M108 174L145 174L180 174','M50 129L50 180L78 180 M108 174L145 180L185 180')],['Lift hips & hold',p([30,115],[49,125],[105,147],'M49 125L75 119L105 147 M105 147L145 162L180 174','M49 125L49 180L78 180 M105 147L145 165L185 180')]],
    'deadbug': [['Tabletop setup',p([31,169],[51,170],[110,170],'M51 170L63 137L67 107 M110 170L126 123L158 126','M51 170L50 135L51 105 M110 170L113 118L148 119')],['Opposite arm & leg',p([31,169],[51,170],[110,170],'M51 170L29 149L9 139 M110 170L126 123L158 126','M51 170L50 135L51 105 M110 170L151 161L190 158')]],
    'thruster': [['Full squat', {...squat,far:'M108 101L91 121L96 94 M77 135L110 144L96 180',near:'M108 101L126 124L130 94 M77 135L127 143L112 180',equipment:db(96,94)+db(130,94)}], ['Stand into press', {...overhead,equipment:db(78,30)+db(123,30)}]],
    'neutral-push': [['Palms in · shallow dip', {...dip,equipment:db(80,78)+db(124,78)}], ['Drive & press', {...overhead,equipment:db(78,30)+db(123,30)}]],
    'lunge': [['Step backwards',p([82,51],[82,72],[82,120],'M82 72L66 96L62 115 M82 120L124 148L165 180','M82 72L101 98L111 108 M82 120L75 152L67 180')],['Lower & return',p([87,77],[87,98],[86,142],'M87 98L66 113L61 130 M86 142L124 174L164 180','M87 98L105 117L112 127 M86 142L53 143L62 180')]],
    'pushup': [['Strong plank',plank],['Lower as one unit',lowPush]],
    'burpee': [['Floor phase',lowPush],['Return & jump',p([99,48],[99,68],[99,112],'M99 68L76 44L72 17 M99 112L85 140L80 161','M99 68L121 44L125 17 M99 112L114 140L120 161',path('M74 180h12 M116 180h12','#7da4ad',2))]]
  };
  function figure(pose) {
    const {head:h,shoulder:s,hip:t,far,near,equipment} = pose;
    return equipment + path('M12 185H198','#3b535c',2) + path(far,'#789d9f',8) +
      path(`M${s}L${t}`,'#dceee4',16) + path(`M${s}L${h}`,'#dceee4',7) +
      path(near,'#dceee4',9) + `<circle cx="${h[0]}" cy="${h[1]}" r="10" fill="#dceee4"/>` +
      `<circle cx="${t[0]}" cy="${t[1]}" r="9" fill="#6eab94"/>`;
  }
  window.FormArt = (id, name, sequence = false) => {
    const frames = poses[id];
    if (!frames) return '<span class="custom-art">CUSTOM<br>MOVEMENT</span>';
    const safe = String(name).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const selected = sequence ? frames : [frames[id === 'thruster' ? 0 : 1]];
    return `<svg viewBox="0 0 ${sequence ? 440 : 210} 220" role="img" aria-label="${safe}: ${selected.map(f=>f[0]).join(' then ')}"><title>${safe} — movement reference</title>` + selected.map(([label,pose],i)=>`<g transform="translate(${i*230},0)">${figure(pose)}${sequence ? `<text x="105" y="211" text-anchor="middle" fill="#c5d8d6" font-size="11" font-family="system-ui">${i+1}. ${label.replaceAll('&','&amp;')}</text>` : ''}</g>`).join('') + '</svg>';
  };
})();
