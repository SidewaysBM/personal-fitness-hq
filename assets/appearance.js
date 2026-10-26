/* Appearance is a device preference, independent of training data and backups. */
(() => {
 const key='form-appearance';
 let theme='light';try{if(localStorage.getItem(key)==='dark')theme='dark'}catch{}
 function apply(value){theme=value;document.documentElement.dataset.theme=value;document.querySelectorAll('meta[name="theme-color"]').forEach(meta=>meta.content=value==='light'?'#f3f5f0':'#10151c');document.querySelectorAll('[data-theme-toggle]').forEach(b=>{b.textContent=value==='light'?'Dark appearance':'Light appearance';b.setAttribute('aria-label','Switch to '+(value==='light'?'dark':'light')+' appearance')})}
 apply(theme);
 document.addEventListener('DOMContentLoaded',()=>{const b=document.createElement('button');b.className='ghost appearance-toggle';b.dataset.themeToggle='';document.querySelector('.main').before(b);apply(theme);b.addEventListener('click',()=>{apply(theme==='light'?'dark':'light');try{localStorage.setItem(key,theme)}catch{}})});
})();
