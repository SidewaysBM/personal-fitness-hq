/* Load publisher media only after an explicit play request. No workout data is read or written. */
(() => {
  'use strict';
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-play-video]');
    if (!button) return;
    const container = button.closest('[data-video-exercise]');
    const guide = window.FormGuides?.[container.dataset.videoExercise];
    const status = container.parentElement.querySelector('[data-video-status]');
    if (!guide?.video) {
      status.textContent = 'This demonstration cannot be loaded here. Use the publisher link below.';
      return;
    }
    if (!navigator.onLine) {
      status.textContent = 'You’re offline. Reconnect, then press Play again. Your workout stays available.';
      return;
    }
    const media = document.createElement(guide.video.type);
    if (guide.video.type === 'video') {
      media.controls = true;
      media.playsInline = true;
      media.preload = 'metadata';
      media.setAttribute('aria-label', guide.title + ' demonstration');
      media.addEventListener('error', () => {
        status.textContent = 'The video could not load. Check your connection or use the publisher link below.';
        container.replaceChildren(button);
      });
    } else {
      media.title = guide.title + ' demonstration';
      media.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
      media.allowFullscreen = true;
      // YouTube requires an origin referrer for embedded playback (error 153 otherwise).
      media.referrerPolicy = 'strict-origin-when-cross-origin';
    }
    media.src = guide.video.src;
    container.replaceChildren(media);
    media.focus();
    status.textContent = 'Use the player controls to play, pause or view fullscreen. Close the guide to return to your workout.';
    if (guide.video.type === 'video') media.play().catch(() => {
      if (media.isConnected) status.textContent = 'Press Play in the video controls to start the demonstration.';
    });
  });
})();
