/* This recovery page is intentionally outside the cached shell. It never reads or writes workout storage. */
(() => {
  const status = document.getElementById('updateStatus');
  const button = document.getElementById('applyUpdate');
  let registration;
  let candidate;

  function waitForState(worker, states) {
    return new Promise((resolve, reject) => {
      const finish = error => {
        clearTimeout(timeout);
        worker.removeEventListener('statechange', check);
        error ? reject(error) : resolve();
      };
      const check = () => {
        if (states.includes(worker.state)) finish();
        else if (worker.state === 'redundant') finish(new Error('This update was replaced. Check again.'));
      };
      const timeout = setTimeout(() => finish(new Error('The update is taking longer than expected. Check your connection and try again.')), 20000);
      worker.addEventListener('statechange', check);
      check();
    });
  }

  function failed(error) {
    status.textContent = error.message || 'The update could not be checked. Connect to the internet and try again.';
    button.textContent = 'Check again';
    button.disabled = false;
    button.onclick = check;
  }

  async function check() {
    button.disabled = true;
    button.textContent = 'Checking…';
    status.textContent = 'Checking for an update…';
    try {
      if (!window.isSecureContext || !('serviceWorker' in navigator)) {
        throw new Error('App updates need HTTPS or localhost. Open FORM at its usual secure address.');
      }
      registration = await navigator.serviceWorker.register('./sw.js', {updateViaCache:'none'});
      // An already downloaded update is still usable if the connection has since dropped.
      try { await registration.update(); }
      catch (error) { if (!registration.waiting && !registration.installing) throw error; }
      if (registration.installing) await waitForState(registration.installing, ['installed','activating','activated']);
      candidate = registration.waiting || registration.active;
      if (!candidate) throw new Error('The update is not ready yet. Check again in a moment.');
      status.textContent = registration.waiting
        ? 'The latest version is ready. Open it here without closing your other FORM tabs.'
        : 'This browser has the latest available version. Open it here to see the current artwork.';
      button.textContent = registration.waiting ? 'Apply update and open FORM' : 'Open updated FORM';
      button.disabled = false;
      button.onclick = apply;
    } catch (error) { failed(error); }
  }

  async function apply() {
    button.disabled = true;
    button.textContent = 'Opening FORM…';
    status.textContent = 'Applying the update. Your saved workout data stays in place.';
    try {
      candidate = registration.waiting || registration.active || candidate;
      if (candidate.state !== 'activated') {
        const ready = waitForState(candidate, ['activated']);
        candidate.postMessage({type:'FORM_APPLY_UPDATE'});
        await ready;
      }
      // Navigation adopts the new worker. No clients.claim() or reload of other tabs.
      location.replace(new URL('./', location.href).href);
    } catch (error) { failed(error); }
  }

  check();
})();
