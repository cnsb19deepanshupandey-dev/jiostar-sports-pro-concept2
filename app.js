(() => {
  const app = document.querySelector('.experience');
  const demoButton = document.querySelector('[data-action="demo"]');
  const demoLabel = demoButton.querySelector('.demo-label');
  const toast = document.querySelector('.mode-toast');
  const progressTime = document.querySelector('.demo-progress span');
  const cursorGlow = document.querySelector('.cursor-glow');
  const statement = document.querySelector('.feature-statement');
  const predictionPanel = document.querySelector('.predict-panel');
  const timelines = [];
  let demoStart = 0;
  let timerFrame = 0;

  const featureNames = {
    camera: 'CONTROL / MULTICAM',
    insights: 'CONTEXT / LIVE INSIGHTS',
    audio: 'IMMERSION / SPATIAL AUDIO',
    together: 'CONNECTION / WATCH TOGETHER',
    predict: 'PLAY / FREE-TO-PLAY',
    xr: 'OPTIONAL XR EXPERIENCE'
  };

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('visible'), 1800);
  }

  function setScreen(screen) {
    app.dataset.screen = screen;
  }

  function setFeature(feature, announce = true) {
    if (app.dataset.screen !== 'live') setScreen('live');
    app.dataset.feature = feature;
    document.querySelectorAll('[data-feature]').forEach((button) => {
      const selected = button.dataset.feature === feature;
      button.classList.toggle('active', selected);
      if (button.getAttribute('role') === 'tab') button.setAttribute('aria-selected', String(selected));
    });
    statement.classList.remove('pulse');
    requestAnimationFrame(() => statement.classList.add('pulse'));
    if (announce) showToast(featureNames[feature]);
  }

  function setCamera(camera, announce = true) {
    app.dataset.camera = camera;
    document.querySelectorAll('[data-camera]').forEach((button) => button.classList.toggle('active', button.dataset.camera === camera));
    if (announce) showToast(`${camera.toUpperCase()} CAMERA`);
  }

  function selectAudio(audio) {
    document.querySelectorAll('[data-audio]').forEach((button) => button.classList.toggle('active', button.dataset.audio === audio));
    showToast(`${audio.toUpperCase()} AUDIO`);
  }

  function choosePrediction(choice = 'boundary', automated = false) {
    document.querySelectorAll('[data-predict]').forEach((button) => button.classList.toggle('active', button.dataset.predict === choice));
    predictionPanel.classList.remove('is-result');
    setTimeout(() => predictionPanel.classList.add('is-result'), automated ? 850 : 550);
  }

  function clearDemo() {
    timelines.splice(0).forEach(clearTimeout);
    cancelAnimationFrame(timerFrame);
    document.body.classList.remove('demo-running');
    demoLabel.textContent = 'PLAY DEMO';
    demoButton.querySelector('.demo-icon').textContent = '▶';
    progressTime.textContent = '00:00 / 00:45';
    predictionPanel.classList.remove('is-result');
  }

  function schedule(seconds, action) {
    timelines.push(setTimeout(action, seconds * 1000));
  }

  function updateDemoClock() {
    const elapsed = Math.min(45, Math.floor((performance.now() - demoStart) / 1000));
    progressTime.textContent = `00:${String(elapsed).padStart(2, '0')} / 00:45`;
    if (elapsed < 45 && document.body.classList.contains('demo-running')) timerFrame = requestAnimationFrame(updateDemoClock);
  }

  function playDemo() {
    if (document.body.classList.contains('demo-running')) {
      clearDemo();
      showToast('AUTO DEMO PAUSED');
      return;
    }
    clearDemo();
    setScreen('hero');
    setCamera('broadcast', false);
    app.dataset.feature = 'camera';
    document.body.classList.add('demo-running');
    demoLabel.textContent = 'PAUSE DEMO';
    demoButton.querySelector('.demo-icon').textContent = 'Ⅱ';
    demoStart = performance.now();
    updateDemoClock();
    schedule(4, () => { setScreen('live'); showToast('THE BROADCAST BECOMES YOURS'); });
    schedule(7, () => setCamera('batter'));
    schedule(10, () => setCamera('spider'));
    schedule(13, () => setFeature('insights'));
    schedule(19, () => setFeature('audio'));
    schedule(24, () => setFeature('together'));
    schedule(30, () => { setFeature('predict'); choosePrediction('boundary', true); });
    schedule(36, () => setFeature('xr'));
    schedule(42, () => setScreen('offer'));
    schedule(45, () => { clearDemo(); showToast('SPORTS PRO / ACADEMIC CONCEPT'); });
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    if (document.body.classList.contains('demo-running') && button.dataset.action !== 'demo') {
      clearDemo();
      showToast('MANUAL CONTROL');
    }
    if (button.dataset.feature) setFeature(button.dataset.feature);
    if (button.dataset.camera) setCamera(button.dataset.camera);
    if (button.dataset.audio) selectAudio(button.dataset.audio);
    if (button.dataset.predict) choosePrediction(button.dataset.predict);
    if (button.dataset.action === 'enter') { setScreen('live'); setFeature('camera', false); }
    if (button.dataset.action === 'home') { clearDemo(); setScreen('hero'); }
    if (button.dataset.action === 'offer') setScreen('offer');
    if (button.dataset.action === 'restart') { clearDemo(); setScreen('hero'); }
    if (button.dataset.action === 'demo') playDemo();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { clearDemo(); setScreen('hero'); }
    if (event.key.toLowerCase() === 'd') playDemo();
    if (event.key === 'ArrowRight' && app.dataset.screen === 'live') {
      const order = ['camera', 'insights', 'audio', 'together', 'predict', 'xr'];
      setFeature(order[(order.indexOf(app.dataset.feature) + 1) % order.length]);
    }
    if (event.key === 'ArrowLeft' && app.dataset.screen === 'live') {
      const order = ['camera', 'insights', 'audio', 'together', 'predict', 'xr'];
      setFeature(order[(order.indexOf(app.dataset.feature) - 1 + order.length) % order.length]);
    }
  });

  window.addEventListener('pointermove', (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
    if (app.dataset.feature === 'xr') {
      const x = (event.clientX / innerWidth - .5) * 12;
      const y = (event.clientY / innerHeight - .5) * 7;
      document.querySelector('.xr-horizon').style.transform = `translate(${x}px, ${y}px) scale(1.03)`;
    }
  }, { passive: true });

  if (new URLSearchParams(location.search).get('demo') === '1') setTimeout(playDemo, 500);
  document.querySelector('[data-feature="camera"][role="tab"]').setAttribute('aria-selected', 'true');
})();
