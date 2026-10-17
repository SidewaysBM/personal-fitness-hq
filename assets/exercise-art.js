/* Original FORM vector movement sequences. Coordinates describe distinct poses,
 * not generic muscle-group symbols. View is side-on unless labelled otherwise. */
(() => {
  'use strict';
  const path = (d, colour, width = 6) => `<path d="${d}" fill="none" stroke="${colour}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const bar = (x, y) => path(`M${x-46} ${y}h92`, '#d8e2e6', 3) +
    [-35,35].map(offset=>`<rect x="${x+offset-4}" y="${y-13}" width="8" height="26" rx="2" fill="#aeea79" stroke="#d5ffb0" stroke-width="1"/><rect x="${x+offset-1}" y="${y-10}" width="2" height="20" rx="1" fill="#7daf59"/>`).join('');
  const db = (x, y) => path(`M${x-10} ${y}h20`, '#dae3e7', 3) +
    [-10,10].map(offset=>`<path d="M${x+offset-4} ${y-7}h8l2 3v8l-2 3h-8l-2-3v-8z" fill="#b6f47c" stroke="#d5ffb0" stroke-width="1"/>`).join('');
  const box = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#29434b" stroke="#7da4ad" stroke-width="1.5"/><path d="M${x+1} ${y+5}h${w-2} M${x+w-7} ${y+5}v${h-7}" fill="none" stroke="#577a83" stroke-width="1"/><rect x="${x+w*.35}" y="${y+h*.45}" width="${w*.3}" height="4" rx="2" fill="#10242e"/>`;
  const bench = `<rect x="25" y="136" width="125" height="9" rx="4" fill="#577a83" stroke="#94b5bc" stroke-width="1.5"/>` + path('M43 146v34 M137 146v34 M33 181h20 M127 181h20', '#7da4ad', 4);
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
  // Tapered segments preserve the reviewed joint positions while depicting a
  // clothed athlete, recognisable hands/feet, and near/far limb depth.
  const mix = (a,b,t) => a.map((v,i)=>v+(b[i]-v)*t);
  const disk = (a,r,fill) => `<circle cx="${a[0]}" cy="${a[1]}" r="${r}" fill="${fill}"/>`;
  function segment(a,b,ra,rb,fill){
    const length=Math.hypot(b[0]-a[0],b[1]-a[1])||1;
    const n=[-(b[1]-a[1])/length,(b[0]-a[0])/length];
    const points=[[a[0]+n[0]*ra,a[1]+n[1]*ra],[b[0]+n[0]*rb,b[1]+n[1]*rb],[b[0]-n[0]*rb,b[1]-n[1]*rb],[a[0]-n[0]*ra,a[1]-n[1]*ra]];
    return `<polygon points="${points.map(p=>p.join(',')).join(' ')}" fill="${fill}"/>`+disk(a,ra,fill)+disk(b,rb,fill);
  }
  function limbs(d,far){
    const skin=far?'#aa8771':'#e4b99a',shorts=far?'#243449':'#354b65';
    return d.trim().split(/\s*M/).filter(Boolean).map((part,index)=>{
      const values=part.match(/-?\d+(?:\.\d+)?/g).map(Number);
      const [a,b,c]=[0,2,4].map(i=>[values[i],values[i+1]]);
      const leg=index===1;
      let result=segment(a,b,leg?6.3:4.6,leg?4.7:3.6,skin)+segment(b,c,leg?4.5:3.5,leg?2.8:2.4,skin);
      if(leg){
        result+=segment(a,mix(a,b,.52),7,6.4,shorts);
        result+=segment(mix(b,c,.8),c,3.1,3,'#d1dcdf');
        result+=`<path d="M${c[0]-3} ${c[1]-2}q5 0 9 3l2 3h-13z" fill="${far?'#50616b':'#e5edef'}" stroke="#172a33" stroke-width=".7"/>`;
      }else result+=disk(c,3.1,skin);
      return result;
    }).join('');
  }
  function figure(pose) {
    const {head:h,shoulder:s,hip:t,far,near,equipment} = pose;
    const waist=mix(s,t,.82);
    return `<ellipse cx="106" cy="188" rx="83" ry="3" fill="#07141e" opacity=".45"/>`+
      path('M12 185H198','#47616d',1)+equipment+limbs(far,true)+
      segment(s,h,4,4,'#cfa185')+
      segment(s,waist,10.5,7.5,'#80bdad')+segment(waist,t,7.5,8.5,'#354b65')+
      path(`M${s[0]-3} ${s[1]+7}L${waist[0]-3} ${waist[1]-4}`,'#a2d6c5',2)+
      limbs(near,false)+disk(h,9,'#e4b99a')+
      `<path d="M${h[0]-8} ${h[1]+1}q-4-12 7-12q10 0 10 9q-8-5-17 3" fill="#263647"/>`+
      disk([h[0]-1,h[1]+2],2,'#cfa185');
  }
  const arrows={
    'back-squat':['M156 88v39','M163 135V94'],
    'push-press':['M155 70v34','M161 97V45'],
    'box-jumps':['M90 77Q105 45 130 60','M184 55v28'],
    'tricep-extension':['M139 40q20 16 0 32','M139 70q20-16 0-32'],
    'leg-raise':['M123 167q36-2 41-30','M175 149q-3 25-30 29'],
    'single-leg-squat':['M32 90v36','M32 132V97'],
    'bench':['M178 63v46','M178 111V66'],
    'ring-row':['M110 97V65','M118 57v30'],
    'sit-up':['M39 120q14-28 40-24','M45 99q-17 10-16 33'],
    'side-plank':['M115 145v-30',null],
    'deadbug':['M170 98l15 31','M15 113l17 13'],
    'thruster':['M165 100v34','M163 105V48'],
    'neutral-push':['M156 77v29','M163 104V49'],
    'lunge':['M128 93l33 15','M35 140V100'],
    'pushup':['M140 105v26','M139 141V110'],
    'burpee':['M144 119V82','M161 135V84']
  };
  function arrow(d){
    if(!d)return '';
    // Draw the head from the final segment direction; no shared SVG IDs.
    const vals=d.match(/-?\d+(?:\.\d+)?/g).map(Number);
    let x=vals[0],y=vals[1],dx=0,dy=0;
    const commands=d.match(/[MLQVvlq][^MLQVvlq]*/g);
    for(const command of commands.slice(1)){
      const v=command.slice(1).match(/-?\d+(?:\.\d+)?/g).map(Number),c=command[0];
      if(c==='v'){dx=0;dy=v[0];y+=dy}
      if(c==='V'){dx=0;dy=v[0]-y;y=v[0]}
      if(c==='l'){[dx,dy]=v;x+=dx;y+=dy}
      if(c==='q'){dx=v[2]-v[0];dy=v[3]-v[1];x+=v[2];y+=v[3]}
      if(c==='Q'){dx=v[2]-v[0];dy=v[3]-v[1];x=v[2];y=v[3]}
    }
    const length=Math.hypot(dx,dy)||1,ux=dx/length,uy=dy/length;
    return path(d,'#b6f47c',1.8)+path(`M${x-ux*6-uy*3} ${y-uy*6+ux*3}L${x} ${y}L${x-ux*6+uy*3} ${y-uy*6-ux*3}`,'#b6f47c',1.8);
  }
  window.FormArt = (id, name, sequence = false) => {
    const frames = poses[id];
    if (!frames) return '<span class="custom-art">CUSTOM<br>MOVEMENT</span>';
    const safe = String(name).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const selected = sequence ? frames : [frames[id === 'thruster' ? 0 : 1]];
    return `<svg class="movement-illustration" viewBox="0 0 ${sequence ? 440 : 210} ${sequence?240:200}" role="img" aria-label="${safe}: ${selected.map(f=>f[0]).join(' then ')}"><title>${safe} — movement reference</title>` + selected.map(([label,pose],i)=>`<g transform="translate(${i*230},0)">${sequence?'<rect x="2" y="3" width="206" height="230" rx="14" fill="#10242e" stroke="#344d58" stroke-width="1"/>':''}${figure(pose)}${sequence?arrow(arrows[id]?.[i]):''}${sequence ? `<circle cx="19" cy="213" r="10" fill="#b6f47c"/><text x="19" y="217" text-anchor="middle" fill="#10242e" font-size="11" font-weight="700" font-family="system-ui">${i+1}</text><text x="35" y="217" fill="#dce9e7" font-size="12" font-weight="600" font-family="system-ui">${label.replaceAll('&','&amp;')}</text>` : ''}</g>`).join('') + '</svg>';
  };
})();
