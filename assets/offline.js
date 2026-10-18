/* Keep updates explicit: a new tab preserves forms and timers in existing tabs. */
function showFormUpdate() {
  if (document.getElementById('formUpdateNotice')) return;
  const notice = document.createElement('aside');
  notice.id = 'formUpdateNotice';
  notice.className = 'notice';
  notice.setAttribute('aria-label', 'App update');
  notice.style.cssText = 'margin:12px;display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap';
  const text = document.createElement('span');
  text.textContent = 'A FORM update is ready. Your current tabs and saved workouts stay in place.';
  const link = document.createElement('a');
  link.href = './update.html';
  link.target = '_blank';
  link.rel = 'noopener';
  link.className = 'primary';
  link.style.cssText = 'text-decoration:none;display:inline-block';
  link.textContent = 'Update in a new tab';
  notice.append(text, link);
  document.body.prepend(notice);
}

if ('serviceWorker' in navigator && window.isSecureContext) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', {updateViaCache:'none'}).then(reg => {
      const watch = worker => {
        if (!worker) return;
        const check = () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) showFormUpdate();
        };
        worker.addEventListener('statechange', check);
        check();
      };
      if (reg.waiting) showFormUpdate();
      watch(reg.installing);
      reg.addEventListener('updatefound', () => watch(reg.installing));
    }).catch(() => { /* Settings reports offline availability explicitly. */ });
  });
}

async function offlineStatus() {
  const out = document.getElementById('offlineStatus');
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    out.textContent = reg?.active
      ? 'Offline app installed on this browser. External videos need internet. On iPhone: Safari → Share → Add to Home Screen. '
      : 'Offline app not ready yet. Open using HTTPS (or localhost), wait, then check again. ';
    const link = document.createElement('a');
    link.href = './update.html';
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'Check for app updates ↗';
    out.append(link);
  } catch {
    out.textContent = 'Offline installation is unavailable in this browser.';
  }
}
