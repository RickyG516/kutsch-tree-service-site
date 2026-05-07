// ====== AXEL CONVERSATION ENGINE — Kutsch Tree Service ======
const Axel = (() => {
  const state = {
    step: 'welcome',
    answers: {},
    transcript: []
  };

  const $fab = document.getElementById('axel-fab');
  const $panel = document.getElementById('axel-panel');
  const $close = document.getElementById('axel-close');
  const $messages = document.getElementById('axel-messages');
  const $options = document.getElementById('axel-options');
  const $inputWrap = document.getElementById('axel-input-wrap');
  const $input = document.getElementById('axel-input');
  const $send = document.getElementById('axel-send');
  const $badge = $fab.querySelector('.axel-badge');

  // Conversation tree
  const tree = {
    welcome: {
      msg: "Hey there! 🌲 I'm Axel — Kutsch Tree Service's helper. What can I get you a hand with today?",
      options: [
        { text: "I need a free estimate", next: 'service_pick' },
        { text: "It's an emergency", next: 'emergency' },
        { text: "Just have a question", next: 'question' }
      ]
    },
    emergency: {
      msg: "Got it — emergencies don't wait. Best move is calling Matt directly at 563-580-4175 right now. We answer 24/7. Want me to also log your info so the crew has it ready?",
      options: [
        { text: "Yes, log my info too", next: 'name', save: { service: 'EMERGENCY', timeline: 'ASAP' } },
        { text: "I'll just call now", action: 'close' }
      ]
    },
    service_pick: {
      msg: "Solid. What kind of tree work are you looking at?",
      options: [
        { text: "🪓 Tree removal", next: 'timeline', save: { service: 'Tree Removal' } },
        { text: "✂️ Tree trimming / pruning", next: 'timeline', save: { service: 'Tree Trimming' } },
        { text: "🌱 Stump grinding", next: 'timeline', save: { service: 'Stump Grinding' } },
        { text: "⛈️ Storm damage cleanup", next: 'timeline', save: { service: 'Storm Damage' } },
        { text: "🚜 Lot clearing", next: 'timeline', save: { service: 'Lot Clearing' } },
        { text: "Not sure / multiple", next: 'timeline', save: { service: 'Multiple / Unsure' } }
      ]
    },
    timeline: {
      msg: "Got it. When are you hoping to get this done?",
      options: [
        { text: "ASAP — emergency", next: 'name', save: { timeline: 'ASAP' } },
        { text: "Within the next week", next: 'name', save: { timeline: '1 Week' } },
        { text: "This month", next: 'name', save: { timeline: '1 Month' } },
        { text: "This season (1-3 mo)", next: 'name', save: { timeline: '1-3 Months' } },
        { text: "Just exploring for now", next: 'name', save: { timeline: 'Exploring' } }
      ]
    },
    name: {
      msg: "Cool. What's your name?",
      input: 'text',
      saveAs: 'name',
      next: 'phone'
    },
    phone: {
      msg: (s) => `Nice to meet you, ${s.answers.name}! What's the best phone number to reach you?`,
      input: 'tel',
      saveAs: 'phone',
      next: 'zip'
    },
    zip: {
      msg: "Perfect. What's the zip code where the work would be done?",
      input: 'text',
      saveAs: 'zip',
      next: 'submit'
    },
    submit: {
      msg: (s) => `You're all set, ${s.answers.name}! 🌲\n\nSending your info over to Matt at Kutsch Tree Service right now. Expect a call from 563-580-4175 — fast.\n\nIf it's urgent or storm-related, don't wait — call that number direct.`,
      submit: true,
      options: [
        { text: "Sounds good — thanks Axel!", next: 'done' },
        { text: "Actually, change my answer", next: 'welcome', reset: true }
      ]
    },
    done: {
      msg: "You got it. Stay safe out there. 🪵",
      options: [
        { text: "Close chat", action: 'close' }
      ]
    },
    question: {
      msg: "What's your question? I can help with pricing, timing, service area, emergency response, or anything else about Kutsch Tree Service.",
      options: [
        { text: "💰 How much does it cost?", next: 'q_pricing' },
        { text: "📍 What areas do you serve?", next: 'q_area' },
        { text: "⛈️ Storm / emergency response?", next: 'q_emergency' },
        { text: "🛡️ Are you licensed/insured?", next: 'q_license' },
        { text: "Something else", next: 'q_other' }
      ]
    },
    q_pricing: {
      msg: "Every tree job is priced custom — depends on size, location, access, and whether power lines or buildings are nearby. Best move: free on-site estimate, no obligation. Want me to set that up?",
      options: [
        { text: "Yes, let's do it", next: 'service_pick' },
        { text: "Maybe later", next: 'done' }
      ]
    },
    q_area: {
      msg: "We're based in Durango, IA and cover Dubuque plus a 30-mile radius — Asbury, Galena, Peosta, Bellevue, Cascade, all of it. Drop your zip and I'll let you know if you're in range.",
      options: [
        { text: "Check my zip", next: 'zip_check' },
        { text: "Get an estimate instead", next: 'service_pick' }
      ]
    },
    zip_check: {
      msg: "What's your zip code?",
      input: 'text',
      saveAs: 'zip_inquiry',
      next: 'zip_response'
    },
    zip_response: {
      msg: (s) => `Thanks! ${s.answers.zip_inquiry} should be in range — but Matt will confirm exact service area when he calls. Want to get a free estimate started?`,
      options: [
        { text: "Yes, let's do it", next: 'service_pick' },
        { text: "Maybe later", next: 'done' }
      ]
    },
    q_emergency: {
      msg: "Tree on the house? Power line down? Storm just rolled through? We answer 24-hours, 7 days a week. Call 563-580-4175 right now — don't fill out a form for emergencies.",
      options: [
        { text: "Got it — calling now", action: 'close' },
        { text: "Log my info too", next: 'name', save: { service: 'EMERGENCY', timeline: 'ASAP' } },
        { text: "More questions", next: 'question' }
      ]
    },
    q_license: {
      msg: "Yes — Kutsch Tree Service is fully licensed and insured in Iowa. Owner-operated, locally based in Durango. Any specific credentials questions, Matt can answer when he calls.",
      options: [
        { text: "Got it — let's get an estimate", next: 'service_pick' },
        { text: "Got more questions", next: 'question' }
      ]
    },
    q_other: {
      msg: "Type your question and I'll pass it along to Matt with your contact info. Same-day response.",
      input: 'text',
      saveAs: 'custom_question',
      next: 'name'
    }
  };

  function addMsg(text, who = 'bot') {
    const div = document.createElement('div');
    div.className = `axel-msg ${who}`;
    div.textContent = text;
    $messages.appendChild(div);
    $messages.scrollTop = $messages.scrollHeight;
    state.transcript.push(`${who.toUpperCase()}: ${text}`);
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'axel-typing';
    div.id = 'axel-typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    $messages.appendChild(div);
    $messages.scrollTop = $messages.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById('axel-typing');
    if (t) t.remove();
  }

  function clearOptions() {
    $options.innerHTML = '';
    $inputWrap.style.display = 'none';
  }

  function renderOptions(options) {
    clearOptions();
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'axel-option';
      btn.textContent = opt.text;
      btn.onclick = () => handleOption(opt);
      $options.appendChild(btn);
    });
  }

  function showInput() {
    clearOptions();
    $inputWrap.style.display = 'block';
    setTimeout(() => $input.focus(), 100);
  }

  function goTo(stepKey) {
    const step = tree[stepKey];
    if (!step) return;
    state.step = stepKey;

    showTyping();
    setTimeout(() => {
      hideTyping();
      const msg = typeof step.msg === 'function' ? step.msg(state) : step.msg;
      addMsg(msg, 'bot');

      if (step.input) {
        $input.type = step.input;
        $input.value = '';
        showInput();
      } else if (step.options) {
        renderOptions(step.options);
      }

      if (step.submit) {
        submitLead();
      }
    }, 600);
  }

  function handleOption(opt) {
    addMsg(opt.text, 'user');
    if (opt.save) Object.assign(state.answers, opt.save);
    if (opt.reset) state.answers = {};
    if (opt.action === 'close') return closePanel();
    if (opt.next) goTo(opt.next);
  }

  function handleInput() {
    const val = $input.value.trim();
    if (!val) return;
    const step = tree[state.step];
    if (!step.input) return;

    addMsg(val, 'user');
    state.answers[step.saveAs] = val;
    $input.value = '';
    if (step.next) goTo(step.next);
  }

  function submitLead() {
    const formData = new FormData();
    formData.append('form-name', 'axel-lead');
    formData.append('name', state.answers.name || '');
    formData.append('phone', state.answers.phone || '');
    formData.append('email', state.answers.email || '');
    formData.append('service', state.answers.service || '');
    formData.append('timeline', state.answers.timeline || '');
    formData.append('zip', state.answers.zip || state.answers.zip_inquiry || '');
    formData.append('conversation', state.transcript.join('\n'));

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    }).catch(err => console.error('Axel submission error:', err));
  }

  function openPanel() {
    $panel.classList.add('open');
    $fab.classList.add('open');
    $badge.style.display = 'none';
    if (state.transcript.length === 0) {
      goTo('welcome');
    }
  }

  function closePanel() {
    $panel.classList.remove('open');
    $fab.classList.remove('open');
  }

  $fab.addEventListener('click', () => {
    $panel.classList.contains('open') ? closePanel() : openPanel();
  });

  $close.addEventListener('click', closePanel);
  $send.addEventListener('click', handleInput);
  $input.addEventListener('keypress', e => {
    if (e.key === 'Enter') handleInput();
  });

  // Auto-prompt after 8 seconds if user hasn't engaged
  setTimeout(() => {
    if (!$panel.classList.contains('open') && state.transcript.length === 0) {
      $badge.style.background = '#c9a66b';
    }
  }, 8000);

  return { open: openPanel, close: closePanel };
})();
