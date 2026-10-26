/* Original FORM vector movement sequences. Coordinates describe distinct poses,
 * not generic muscle-group symbols. View is side-on unless labelled otherwise. */
(() => {
  'use strict';
  const path = (d, colour, width = 6) => `<path d="${d}" fill="none" stroke="${colour}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const bar = (x, y) => path(`M${x-46} ${y}h92`, '#d8e2e6', 2.8) +
    [-35,35].map(offset=>`<ellipse cx="${x+offset}" cy="${y}" rx="6.5" ry="14" fill="#54783e" stroke="#b6e08c" stroke-width=".8"/><ellipse cx="${x+offset+2}" cy="${y}" rx="4.5" ry="13" fill="#a4d477"/><ellipse cx="${x+offset+2}" cy="${y}" rx="2" ry="4" fill="#66844e"/><path d="M${x+offset-2} ${y}h8" stroke="#e0e7e4" stroke-width="2.5"/>`).join('');
  const db = (x, y, angle=0) => (path(`M${x-11} ${y}h22`, '#bfccd0', 3.5) +
    [-10,10].map(offset=>`<path d="M${x+offset-4} ${y-7}h8l2 3v8l-2 3h-8l-2-3v-8z" fill="#354b58" stroke="#8a9fa4" stroke-width=".8"/><path d="M${x+offset-4} ${y-7}h8l2 3h-12Z" fill="#738991"/><path d="M${x+offset+4} ${y-5}v10" stroke="#a9d77b" stroke-width="1.4"/><path d="M${x+offset-2} ${y-4}v8" stroke="#1c303e" stroke-width="1"/>`).join('')).replaceAll('<path ',`<path transform="rotate(${angle} ${x} ${y})" `);
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
    'box-jumps': [['Load & take off', p([75,85],[65,103],[46,137], 'M65 103L39 117L25 108 M46 137L77 145L60 180', 'M65 103L40 127L22 123 M46 137L89 144L73 180',box(125,115,60,65))], ['Land on both feet',p([145,36],[138,54],[113,81],'M138 54L157 64L166 46 M113 81L150 87L144 109','M138 54L163 73L177 59 M113 81L164 89L155 109',box(125,115,60,65))]],
    'tricep-extension': [['Bend working elbow', p([105,64],[102,84],[99,129],'M102 84L86 39L77 73 M99 129L84 155L80 180','M102 84L97 35L79 72 M99 129L113 154L118 180',db(78,82,90))], ['Extend working elbow',p([105,64],[102,84],[99,129],'M102 84L86 51L90 20 M99 129L84 155L80 180','M102 84L106 51L100 20 M99 129L113 154L118 180',db(94,27,90))]],
    'leg-raise': [['Still hang',p([95,66],[95,86],[95,130],'M95 86L76 51L74 20 M95 130L86 158L86 181','M95 86L111 51L112 20 M95 130L100 158L100 181',path('M48 20H142','#b6f47c',5))],['Raise straight legs',p([83,66],[83,86],[83,130],'M83 86L69 51L70 20 M83 130L124 126L163 126','M83 86L105 51L108 20 M83 130L124 136L168 136',path('M48 20H142','#b6f47c',5))]],
    'single-leg-squat': [['Front foot bears weight',p([53,48],[56,68],[66,116],'M56 68L40 90L26 72 M66 116L99 139L128 130','M56 68L75 91L85 72 M66 116L58 148L56 180',box(117,135,43,45)+bar(56,72))],['Lower over front leg',p([42,80],[50,98],[74,137],'M50 98L34 117L20 102 M74 137L104 156L128 130','M50 98L69 119L79 102 M74 137L40 145L53 180',box(117,135,43,45)+bar(50,102))]],
    'bench': [['Lower to chest',p([39,124],[57,126],[115,128],'M57 126L77 142L77 119 M115 128L144 147L151 177','M57 126L76 144L76 119 M115 128L133 148L141 180',bench+bar(76,119))],['Press upwards',p([39,124],[57,126],[115,128],'M57 126L67 94L78 57 M115 128L144 147L151 177','M57 126L66 94L76 57 M115 128L133 148L141 180',bench+bar(76,57))]],
    'ring-row': [['Arms extended',p([31,140],[50,135],[109,122],'M50 135L53 106L55 76 M109 122L144 115L180 108','M50 135L69 106L78 77 M109 122L146 119L184 113',box(170,113,30,67)+path('M55 15V66 M78 15V67','#7da4ad',2)+'<g fill="none" stroke="#b6f47c" stroke-width="3"><ellipse cx="55" cy="73" rx="7" ry="9"/><ellipse cx="78" cy="74" rx="7" ry="9"/></g>')],['Pull chest to rings',p([31,80],[50,82],[109,95],'M50 82L34 107L55 76 M109 95L145 102L180 108','M50 82L65 111L78 77 M109 95L146 107L184 113',box(170,113,30,67)+path('M55 15V66 M78 15V67','#7da4ad',2)+'<g fill="none" stroke="#b6f47c" stroke-width="3"><ellipse cx="55" cy="73" rx="7" ry="9"/><ellipse cx="78" cy="74" rx="7" ry="9"/></g>')]],
    'sit-up': [['Lie with knees bent',p([30,166],[50,168],[109,168],'M50 168L69 153L85 165 M109 168L144 128L175 176','M50 168L69 147L84 161 M109 168L136 124L164 180')],['Curl & lower slowly',p([85,83],[93,104],[109,168],'M93 104L112 118L100 135 M109 168L144 128L175 176','M93 104L121 120L101 139 M109 168L136 124L164 180')]],
    'side-plank': [['Elbow under shoulder',p([31,140],[50,148],[108,174],'M50 148L76 146L104 165 M108 174L145 174L180 174','M50 148L50 180L78 180 M108 174L145 180L185 180')],['Lift hips & hold',p([30,140],[49,148],[108,162],'M49 148L76 139L108 158 M108 162L145 168L180 174','M49 148L49 180L78 180 M108 162L145 171L185 180')]],
    'deadbug': [['Tabletop setup',p([43,169],[62,170],[115,170],'M62 170L71 142L73 114 M115 170L128 132L161 134','M62 170L62 142L62 114 M115 170L117 129L150 131')],['Opposite arm & leg',p([43,169],[62,170],[115,170],'M62 170L37 161L11 155 M115 170L128 132L161 134','M62 170L62 142L62 114 M115 170L149 163L183 157')]],
    'thruster': [['Full squat', {...squat,far:'M108 101L91 121L96 94 M77 135L110 144L96 180',near:'M108 101L126 124L130 94 M77 135L127 143L112 180',equipment:db(96,94)+db(130,94)}], ['Stand into press', {...overhead,equipment:db(78,30)+db(123,30)}]],
    'neutral-push': [['Palms in · shallow dip', {...dip,equipment:db(80,78)+db(124,78)}], ['Drive & press', {...overhead,equipment:db(78,30)+db(123,30)}]],
    'lunge': [['Step backwards',p([82,51],[82,72],[82,120],'M82 72L66 96L62 115 M82 120L124 148L165 180','M82 72L101 98L111 108 M82 120L75 152L67 180')],['Lower & return',p([87,77],[87,98],[86,142],'M87 98L66 113L61 130 M86 142L124 174L164 180','M87 98L105 117L112 127 M86 142L53 143L62 180')]],
    'pushup': [['Strong plank',plank],['Lower as one unit',lowPush]],
    'burpee': [['Floor phase',lowPush],['Return & jump',p([99,48],[99,68],[99,112],'M99 68L76 44L72 17 M99 112L85 140L80 161','M99 68L121 44L125 17 M99 112L114 140L120 161',path('M74 180h12 M116 180h12','#7da4ad',2))]]
  };
  // Original anatomical vector artwork. All geometry stays local to each SVG;
  // no remote images, shared gradient IDs, or changes to exercise prescriptions.
  const mix = (a,b,t) => a.map((v,i)=>v+(b[i]-v)*t);
  let artworkSerial=0;
  let palette={};
  const gradient=(id,stops)=>`<linearGradient id="${id}" x1="0" y1="0" x2="1" y2=".7">${stops.map(([offset,colour])=>`<stop offset="${offset}" stop-color="${colour}"/>`).join('')}</linearGradient>`;
  function materials(prefix){
    palette={skin:`url(#${prefix}-skin)`,farSkin:`url(#${prefix}-far-skin)`,shirt:`url(#${prefix}-shirt)`,shorts:`url(#${prefix}-shorts)`,farShorts:`url(#${prefix}-far-shorts)`};
    return '<defs>'+gradient(prefix+'-skin',[[0,'#edc5a1'],[.38,'#dca67d'],[.76,'#c18a64'],[1,'#aa7253']])+gradient(prefix+'-far-skin',[[0,'#ba9278'],[.6,'#a57a64'],[1,'#795747']])+gradient(prefix+'-shirt',[[0,'#93cbb0'],[.35,'#5aa78d'],[.78,'#38796e'],[1,'#285951']])+gradient(prefix+'-shorts',[[0,'#536779'],[.4,'#354a5f'],[1,'#1e3143']])+gradient(prefix+'-far-shorts',[[0,'#415a6e'],[1,'#1c2d3d']])+'</defs>';
  }
  const point = a => a.map(n=>Number(n.toFixed(2))).join(' ');
  function segment(a,b,ra,rb,fill,definition=true){
    const length=Math.hypot(b[0]-a[0],b[1]-a[1])||1;
    const n=[-(b[1]-a[1])/length,(b[0]-a[0])/length];
    const at=(t,r)=>{const c=mix(a,b,t);return [c[0]+n[0]*r,c[1]+n[1]*r]};
    // Curved muscle bellies taper into wrists/ankles rather than capsule joints.
    const d=`M${point(at(0,ra*.7))} Q${point(at(.35,ra*1.28))} ${point(at(.72,rb*1.18))} Q${point(at(1,rb))} ${point(at(1.04,0))} Q${point(at(1,-rb))} ${point(at(.72,-rb))} Q${point(at(.28,-ra*1.13))} ${point(at(0,-ra*.7))} Q${point(at(-.1,0))} ${point(at(0,ra*.7))}Z`;
    const cloth=`M${point(at(0,ra))}Q${point(at(.5,ra*1.04))} ${point(at(1,rb))}L${point(at(1,-rb))}Q${point(at(.5,-ra))} ${point(at(0,-ra))}Q${point(at(-.26,0))} ${point(at(0,ra))}Z`;
    return `<path d="${definition?d:cloth}" fill="${fill}"/>`+
      (definition?path(`M${point(at(.2,ra*.5))}Q${point(at(.36,ra*.65))} ${point(at(.62,rb*.65))}`,'#f8d9ba',.85).replace('/>',' opacity=".34"/>')+path(`M${point(at(.23,-ra*.6))}Q${point(at(.45,-ra*.8))} ${point(at(.73,-rb*.62))}`,'#704d40',.65).replace('/>',' opacity=".24"/>'):'');
  }
  const offset=(a,n,r)=>[a[0]+n[0]*r,a[1]+n[1]*r];
  function axes(a,b){
    const length=Math.hypot(b[0]-a[0],b[1]-a[1])||1;
    const u=[(b[0]-a[0])/length,(b[1]-a[1])/length];
    return {u,n:[-u[1],u[0]],length};
  }
  // A single silhouette spans both bones. Elbows and knees stay connected even
  // in tightly flexed poses, with no circular joint overlays or skin seams.
  function anatomy(a,b,c,leg,far){
    const x=axes(a,b),y=axes(b,c);
    const sum=[x.n[0]+y.n[0],x.n[1]+y.n[1]],size=Math.hypot(...sum)||1;
    const j=sum.map(v=>v/size);
    const root=leg?8.8:6.1,joint=leg?4.3:3.1,tip=leg?2.65:2.05;
    const upper=leg?9.9:6.7,lower=leg?6:4.25;
    const aa=k=>point(offset(a,x.n,k)),bb=k=>point(offset(b,j,k)),cc=k=>point(offset(c,y.n,k));
    const ab=(t,r)=>point(offset(mix(a,b,t),x.n,r)),bc=(t,r)=>point(offset(mix(b,c,t),y.n,r));
    const d=`M${aa(root*.8)}C${ab(.12,upper*1.05)} ${ab(.35,upper)} ${ab(.58,upper*.68)}Q${ab(.77,joint*1.05)} ${ab(.9,joint)}Q${bb(joint*1.15)} ${bc(.1,joint)}C${bc(.23,lower*1.06)} ${bc(.49,lower*.92)} ${bc(.71,tip*1.2)}L${cc(tip)}Q${point(mix(b,c,1.04))} ${cc(-tip)}C${bc(.71,-tip*1.14)} ${bc(.39,-lower*.79)} ${bc(.15,-joint)}Q${bb(-joint*1.1)} ${ab(.9,-joint)}C${ab(.67,-upper*.73)} ${ab(.26,-upper*.94)} ${aa(-root*.8)}Q${point(mix(a,b,-.12))} ${aa(root*.8)}Z`;
    const skin=far?palette.farSkin:palette.skin;
    return `<path d="${d}" fill="${skin}" stroke="${far?'#6c5143':'#aa785b'}" stroke-width=".35"/>`+
      // Broad translucent forms model muscle volume; no outlined muscle map.
      `<path d="M${ab(.1,upper*.45)}C${ab(.28,upper*.96)} ${ab(.51,upper*.62)} ${ab(.68,joint*.28)}Q${ab(.4,upper*.15)} ${ab(.1,upper*.45)}Z" fill="#ffe2c1" opacity="${far?.08:.26}"/>`+
      `<path d="M${ab(.18,-upper*.64)}C${ab(.4,-upper*.93)} ${ab(.71,-joint*.85)} ${ab(.85,-joint*.5)}Q${ab(.46,-upper*.28)} ${ab(.18,-upper*.64)}Z" fill="#794b34" opacity=".19"/>`+
      `<path d="M${bc(.13,-lower*.6)}Q${bc(.29,-lower*.9)} ${bc(.68,-tip*.72)}Q${bc(.4,-lower*.17)} ${bc(.13,-lower*.6)}Z" fill="#70472e" opacity=".2"/>`+
      path(`M${bc(.32,lower*.55)}Q${bc(.59,tip*.8)} ${bc(.86,tip*.48)}`,'#fbe1c4',far?.25:.6).replace('/>',' opacity=".4"/>')+
      (leg?
        path(`M${point(offset(b,j,-joint*.65))}Q${point(offset(mix(b,c,.07),j,-.4))} ${point(offset(b,j,joint*.46))}`,'#8b5f45',.55).replace('/>',' opacity=".32"/>'):
        path(`M${ab(.12,-upper*.44)}Q${ab(.24,upper*.18)} ${ab(.35,upper*.53)}M${ab(.92,-joint*.55)}Q${bb(-.4)} ${bc(.08,joint*.42)}`,'#986345',.5).replace('/>',' opacity=".38"/>'));
  }
  function garment(a,b,ra,rb,far){
    const {n}=axes(a,b),at=(t,r)=>point(offset(mix(a,b,t),n,r));
    return `<path d="M${at(0,ra)}Q${at(.4,ra*1.08)} ${at(.93,rb)}L${at(1,rb*.74)}Q${at(.91,0)} ${at(1,-rb)}Q${at(.45,-ra*.96)} ${at(0,-ra)}Q${at(-.25,0)} ${at(0,ra)}Z" fill="${far?palette.farShorts:palette.shorts}" stroke="#243747" stroke-width=".45"/>`+
      `<path d="M${at(.12,ra*.7)}Q${at(.42,ra*.87)} ${at(.9,rb*.72)}L${at(.9,rb*.26)}Q${at(.45,ra*.37)} ${at(.12,ra*.7)}Z" fill="#8c9fab" opacity="${far?.07:.19}"/>`+
      path(`M${at(.94,rb*.7)}Q${at(.86,0)} ${at(.94,-rb*.88)}`,far?'#425568':'#8195a3',.6)+
      path(`M${at(.13,ra*.55)}Q${at(.39,ra*.67)} ${at(.7,rb*.52)}M${at(.6,-ra*.7)}L${at(.83,-rb*.85)}`,far?'#405265':'#7b8e9d',.5);
  }
  function hand(c,b,skin,prone,grip){
    const angle=Math.atan2(c[1]-b[1],c[0]-b[0])*180/Math.PI-90;
    if(prone)return `<g class="athlete-palm" transform="translate(${2*c[0]} 0) scale(-1 1)"><path d="M${c[0]-2.3} ${c[1]-1}L${c[0]+2.2} ${c[1]}Q${c[0]+2} 181 ${c[0]+5} 182L${c[0]+11} 184Q${c[0]+12} 186 ${c[0]+9} 186H${c[0]-4}Q${c[0]-4} 183 ${c[0]-2.3} ${c[1]-1}Z" fill="${skin}" stroke="#996c50" stroke-width=".35"/>`+path(`M${c[0]+3} 184.5h6m-8-2q2 0 3 1.2`,'#9c7055',.5)+'</g>';
    if(grip)return `<path d="M${c[0]-2.5} ${c[1]+3.2}L${c[0]-3.4} ${c[1]-.8}Q${c[0]-3.7} ${c[1]-3.5} ${c[0]-1.3} ${c[1]-3.9}Q${c[0]+.2} ${c[1]-4.4} ${c[0]+2.8} ${c[1]-2.3}L${c[0]+4} ${c[1]+.5}Q${c[0]+3.7} ${c[1]+3.1} ${c[0]+1.7} ${c[1]+3.4}Z" fill="${skin}" stroke="#9b7055" stroke-width=".45"/>`+
      path(`M${c[0]-1.3} ${c[1]-2.1}l3.4 1.2m-3.6.4 3.6 1.3m-2.9.3 2.7 1.1M${c[0]-2.6} ${c[1]+1.2}q1.6-2.1 3 .2`,'#96694e',.4)+
      path(`M${c[0]-1.5} ${c[1]-3}l2 .5`,'#f1cbab',.6);
    return `<path d="M${c[0]-2.1} ${c[1]-1}L${c[0]+2} ${c[1]-1}L${c[0]+2.7} ${c[1]+2}L${c[0]+4.1} ${c[1]+4}Q${c[0]+4.2} ${c[1]+5.6} ${c[0]+2.5} ${c[1]+4.6}L${c[0]+2} ${c[1]+8}Q${c[0]+1} ${c[1]+9} ${c[0]-.4} ${c[1]+8}L${c[0]-2} ${c[1]+5}Z" fill="${skin}" stroke="#a8795c" stroke-width=".35" transform="rotate(${angle} ${c[0]} ${c[1]})"/>`;
  }
  function footwear(c,b,far,left,raisedRear,toeSupport,heelSupport){
    const angle=toeSupport?50:raisedRear?22:heelSupport?-90:c[1]>=174?0:Math.atan2(c[1]-b[1],c[0]-b[0])*180/Math.PI-90;
    const transform=`translate(${point(c)}) scale(${left&&!raisedRear?-1:1} 1) rotate(${angle})`;
    return `<g class="athlete-shoe" data-support="${toeSupport?'toe':raisedRear?'rear-platform':heelSupport?'heel-platform':'pose'}" transform="${transform}">`+
      '<path d="M-3.6-4.2Q-.5-2.6 2-4.1L4.5-.2 9.1 1.5Q12.2 2.3 11.9 4.4L11 6H-4.2Q-5.3 1.2-3.6-4.2Z" fill="'+(far?'#627785':'#dbe6e3')+'" stroke="#263e4a" stroke-width=".55"/>'+
      '<path d="M-3.3-3.2Q-.7-1.8 1.5-3.2L3 .2-.4 2-3.5 1.3Z" fill="'+(far?'#334c5c':'#83a1a7')+'"/>'+
      '<path d="M3.6.2Q5 1.4 8.6 2.2L10.6 3.4 7.2 4.1 2.5 2Z" fill="'+(far?'#7f939c':'#f0f4ed')+'"/>'+
      '<path d="M-4.7 3.5Q2 4.7 11.9 4.4L11 6H-4.2Z" fill="'+(far?'#9cabb0':'#c2d3cf')+'"/>'+
      path('M-3.7 5.5H10.7',far?'#455e6c':'#5d777f',.55)+
      path('M.1-.9l3 1M1 .5l3.1 1m-2.1.2 3.2 1',far?'#b2c0c1':'#718e97',.55)+
      path('M-2.5 1.2l2.8 1.8 3.1-.8',far?'#3c5867':'#3d8b7f',1.1)+
      '<path d="M-3-4.2v-1.3" stroke="'+(far?'#7f969e':'#b9cfc9')+'" stroke-width="1.4"/>'+ '</g>';
  }
  function limbs(d,far,prone,grip,rearSupport,facingLeft,bodyNormal,id){
    const skin=far?palette.farSkin:palette.skin;
    return d.trim().split(/\s*M/).filter(Boolean).map((part,index)=>{
      const values=part.match(/-?\d+(?:\.\d+)?/g).map(Number);
      const [original,b,endpoint]=[0,2,4].map(i=>[values[i],values[i+1]]);
      const leg=index===1;
      const toeSupport=leg&&(prone||(id==='lunge'&&far));
      const heelSupport=leg&&id==='ring-row',raisedRear=leg&&rearSupport&&far;
      // The toe is the contact anchor. Move the ankle with the shoe so the shin
      // stays connected; never rotate a shoe below a fixed ground-level ankle.
      const toeRise=11*Math.sin(50*Math.PI/180)+6*Math.cos(50*Math.PI/180);
      const rearRise=11*Math.sin(22*Math.PI/180)+6*Math.cos(22*Math.PI/180);
      const c=toeSupport?[endpoint[0],186-toeRise]:raisedRear?[endpoint[0],135-rearRise]:heelSupport?[endpoint[0],108.3]:leg&&['bench','sit-up'].includes(id)?[endpoint[0],180]:endpoint;
      // Stagger shoulders in depth; maintain every elbow, wrist and support point.
      const a=leg?original:offset(original,bodyNormal,far?-2:2.2);
      let result=anatomy(a,b,c,leg,far);
      if(leg){
        result+=garment(a,mix(a,b,.53),10,8.5,far);
        result+=segment(mix(b,c,.83),c,3.2,2.9,far?'#7e9196':'#c2d1d0',false);
        result+=footwear(c,b,far,facingLeft||prone,raisedRear,toeSupport,heelSupport);
      }else result+=hand(c,b,skin,prone,grip);
      return result;
    }).join('');
  }
  function portrait(h,s,left){
    const angle=Math.atan2(h[1]-s[1],h[0]-s[0])*180/Math.PI+90;
    const transform=`translate(${h[0]} ${h[1]}) rotate(${angle}) scale(${left?-1:1} 1)`;
    const shape=(d,fill,extra='')=>`<path d="${d}" fill="${fill}" transform="${transform}" ${extra}/>`;
    return shape('M-7.4-5.9C-6.6-10.3-1.1-12 3.8-9.2C6.1-7.9 7.1-5.3 6.5-2.7L8.7.4Q9.4 1.8 7 2.2L6.6 4.6Q7 7.6 3.1 9.5L-1.9 8.7-6.9 3.9Z',palette.skin,'stroke="#a5775b" stroke-width=".3"')+
      shape('M-2.2-4.1Q1.5-7.3 4.9-5L5.9-2.1 3.9-1.2Q1.4-3-2.2-1.2Z','#ffe0bc','opacity=".33"')+
      shape('M-2.2-.8Q2.4-3.4 5.8-1.1L5.2 2.5 3.4 5.4-1.6 6.9-4 3.7Z','#edbd96','opacity=".48"')+
      shape('M-2.3 1.3Q.2 1.2 2.8 3L1.2 5.5-2.8 5.6-4 3.6Z','#b17d5d','opacity=".24"')+
      shape('M-6.9 3.7L-2.7 4.2.2 6.4 5.7 5.5Q5.8 7.8 3.1 9L-1.9 8.4Z','#6f5345','opacity=".28"')+
      shape('M-7.2 3.3C-10.3.4-10.7-5.7-7.5-9.1C-5.1-12.1.9-13.1 4.8-10.7L7.2-7.2 5.7-5.6 3.5-7.1Q-.3-8.1-3.4-4.6L-3.6.9-5.6 2.1Z','#29313a')+
      shape('M-7.6-6.4Q-3.8-11.1.9-9.7M-6.9-4.6Q-3.3-8.1-.5-7.9','none','stroke="#68717a" stroke-width=".55" opacity=".55"')+
      shape('M-4.5-.6C-7-2-7.7.4-6.5 2.7Q-5.4 4.6-3.5 2.7L-3.6.1Z','#ca9674')+
      shape('M-5.8.1Q-4.2-.4-4.7 2','none','stroke="#9d6e54" stroke-width=".55" stroke-linecap="round"')+
      shape('M2.5-3.8Q4.3-4.5 5.8-3.4','none','stroke="#574b41" stroke-width=".8" stroke-linecap="round"')+
      shape('M3.2-2.3Q4.4-3.1 5.6-2.1L4.2-1.8Z','#f3dec3')+
      shape('M3.2-2.4Q4.6-3 5.6-2.1','none','stroke="#594c42" stroke-width=".6" stroke-linecap="round"')+
      shape('M4.9-2.5v.6','none','stroke="#394342" stroke-width=".55" stroke-linecap="round"')+
      shape('M5.7 2.3L7 2M3.7 5Q5 5.5 6.4 4.7','none','stroke="#9e6953" stroke-width=".55" stroke-linecap="round"');
  }
  function figure(pose,id,prone=false) {
    const {head:h,shoulder:s,hip:t,far,near,equipment} = pose;
    const grip=Boolean(equipment)&&id!=='box-jumps';
    const frontEquipment=id==='tricep-extension',rearSupport=id==='single-leg-squat';
    const facingLeft=rearSupport||id==='lunge',front=prone||facingLeft?-1:1;
    const ground=id==='leg-raise'?198:186;
    const {u,length}=axes(s,t),n=[u[1],-u[0]];
    const at=(f,w)=>[s[0]+u[0]*length*f+n[0]*w*front,s[1]+u[1]*length*f+n[1]*w*front];
    const pt=(f,w)=>point(at(f,w));
    // An athletic singlet follows the chest, back, waist and hip contours.
    const torso=`M${pt(-.09,-5)}Q${pt(-.03,-11.5)} ${pt(.14,-12.3)}Q${pt(.4,-12)} ${pt(.68,-8.9)}L${pt(.91,-10.4)}Q${pt(.98,0)} ${pt(.91,10)}L${pt(.67,8.1)}Q${pt(.44,12.9)} ${pt(.24,14)}Q${pt(.05,13)} ${pt(-.05,6)}Q${pt(.08,1)} ${pt(-.09,-5)}Z`;
    const chest=`M${pt(.04,5)}Q${pt(.16,12.7)} ${pt(.33,12)}Q${pt(.46,8)} ${pt(.44,4)}Q${pt(.18,6)} ${pt(.04,5)}Z`;
    return `<ellipse cx="106" cy="${ground+2}" rx="76" ry="2.2" fill="#07141e" opacity=".45"/>`+
      path(`M12 ${ground}H198`,'#47616d',.7)+(frontEquipment?'':equipment)+limbs(far,true,prone,grip,rearSupport,facingLeft,n,id)+
      segment(mix(s,h,.12),mix(s,h,.76),5,4,'#bc8c6b',false)+
      `<path d="${torso}" fill="${palette.shirt}" stroke="#274d4c" stroke-width=".45"/>`+
      `<path d="${chest}" fill="#b7dfc5" opacity=".27"/>`+
      `<path d="M${pt(.29,12.9)}Q${pt(.39,8)} ${pt(.4,2)}Q${pt(.5,5)} ${pt(.45,11.8)}Z" fill="#255c53" opacity=".35"/>`+
      `<path d="M${pt(.44,1)}Q${pt(.62,7)} ${pt(.79,6)}L${pt(.83,2)}Q${pt(.62,2)} ${pt(.44,1)}Z" fill="#acd9bc" opacity=".12"/>`+
      `<path d="M${pt(.12,-10)}Q${pt(.38,-7)} ${pt(.78,-7)}L${pt(.9,-10)}Q${pt(.45,-11)} ${pt(.12,-10)}Z" fill="#244f4c" opacity=".5"/>`+
      path(`M${pt(-.04,-4)}Q${pt(.13,1)} ${pt(-.01,6)}`,'#244b48',1.1)+
      path(`M${pt(-.025,-3.5)}Q${pt(.095,1)} ${pt(.005,5.6)}`,'#a6d2b9',.45)+
      path(`M${pt(.04,10)}Q${pt(.16,7.1)} ${pt(.27,9.6)}`,'#2c5f56',.9)+
      path(`M${pt(.36,10)}Q${pt(.45,5)} ${pt(.5,1)}`,'#3d7a70',.65)+
      path(`M${pt(.69,-6)}Q${pt(.75,-1)} ${pt(.7,5)}M${pt(.79,6)}l${n[0]*-5*front+u[0]*2} ${n[1]*-5*front+u[1]*2}`,'#39766c',.65)+
      path(`M${pt(.8,-7)}Q${pt(.84,-3)} ${pt(.82,1)}`,'#aad7b9',.45)+
      segment(at(.87,0),t,10.8,10.1,palette.shorts,false)+
      limbs(near,false,prone,grip,rearSupport,facingLeft,n,id)+
      path(`M${pt(.86,-8)}Q${pt(.9,0)} ${pt(.86,8)}`,'#97aaa8',.6)+
      portrait(h,s,prone||facingLeft)+(frontEquipment?equipment:'');
  }
  const arrows={
    'back-squat':['M156 88v39','M163 135V94'],
    'push-press':['M155 70v34','M161 97V45'],
    'box-jumps':['M90 77Q105 45 130 60','M184 55v28'],
    'tricep-extension':['M139 40q20 16 0 32','M139 70q20-16 0-32'],
    'leg-raise':['M123 167q36-2 41-30','M175 149q-3 25-30 29'],
    'single-leg-squat':['M178 83v39','M178 129V90'],
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
    // Reviewed local 3D reference; preserve the same accessible frame interface.
    // Each panel clips one half of the original asset without changing its pixels.
    if(frames){
      const serial=++artworkSerial;
      const asset=id==='single-leg-squat'?'single-leg-squat-isometric-v2.webp':id==='tricep-extension'?'tricep-extension-single-arm-v2.webp':id+'-cast-v1.webp';
      const indices=sequence?[0,1]:[1];
      return `<svg class="movement-illustration isometric-art" viewBox="0 0 ${sequence?440:210} ${sequence?240:200}" role="img" aria-label="${safe}: ${indices.map(i=>frames[i][0]).join(' then ')}"><title>${safe} — three-quarter movement reference</title>`+indices.map((frame,i)=>{
        const clip=`form-iso-${serial}-${i}`;
        return `<g transform="translate(${i*230},0)"><defs><clipPath id="${clip}"><rect x="9" y="4" width="192" height="192" rx="8"/></clipPath></defs><image class="exercise-reference-image" href="assets/exercise-images/${asset}" x="${8-frame*194}" y="3" width="388" height="194" preserveAspectRatio="xMidYMid meet" clip-path="url(#${clip})"/>${sequence?`<circle cx="19" cy="213" r="10" fill="#b6f47c"/><text x="19" y="217" text-anchor="middle" fill="#10242e" font-size="11" font-weight="700" font-family="system-ui">${i+1}</text><text x="35" y="217" fill="#dce9e7" font-size="12" font-weight="600" font-family="system-ui">${frames[frame][0]}</text>`:''}</g>`;
      }).join('')+'</svg>';
    }
    const defs=materials(`form-art-${++artworkSerial}`);
    const selected = sequence ? frames : [frames[id === 'thruster' ? 0 : 1]];
    return `<svg class="movement-illustration" viewBox="0 0 ${sequence ? 440 : 210} ${sequence?240:200}" role="img" aria-label="${safe}: ${selected.map(f=>f[0]).join(' then ')}"><title>${safe} — movement reference</title>${defs}` + selected.map(([label,pose],i)=>`<g transform="translate(${i*230},0)">${sequence?'<rect x="2" y="3" width="206" height="230" rx="14" fill="#10242e" stroke="#344d58" stroke-width="1"/>':''}${figure(pose,id,id === 'pushup' || (id === 'burpee' && pose === lowPush))}${sequence?arrow(arrows[id]?.[i]):''}${sequence ? `<circle cx="19" cy="213" r="10" fill="#b6f47c"/><text x="19" y="217" text-anchor="middle" fill="#10242e" font-size="11" font-weight="700" font-family="system-ui">${i+1}</text><text x="35" y="217" fill="#dce9e7" font-size="12" font-weight="600" font-family="system-ui">${label.replaceAll('&','&amp;')}</text>` : ''}</g>`).join('') + '</svg>';
  };
})();
