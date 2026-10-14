// Don't Queue At The Bar: homepage prototype script (review/homepage, Round 3).
// Loaded after /script.js. It owns the vote pill and the poll screen together, with one
// state, one GET /api/poll and one cookie: script.js's own poll block stands down because
// the prototype's form is #poll-form-p, not #poll-form. It also writes the hero count line
// and watches the petition form for a signature, which retires the pill.
// At merge this replaces the poll block in script.js, and pollWords in src/worker.js takes
// the same Stop / Keep lines for the no-JavaScript results page.

(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const guard = (label, fn) => {
    try {
      return fn();
    } catch (err) {
      console.error(`${label} failed`, err);
      return undefined;
    }
  };

  /* ---------- Words: Stop / Keep. The stored values stay cluster (stop) and single (keep). ---------- */

  const SIDE = { cluster: 'stop', single: 'keep' };
  // The lead line goes by the counts, not the rounded percentages (501 to 499 shows 50/50).
  const leadFor = (single, cluster) => {
    if (single + cluster < 50) return 'Early days. The jury’s still at the bar.';
    if (cluster > single) return 'The Cluster is winning.';
    if (single > cluster) return 'The Single File is ahead. We have work to do.';
    return 'Dead heat. Over to the barperson.';
  };
  const QUIPS = {
    cluster: 'You said stop. Correct. Now make it official.',
    single: 'You said keep. Noted. Take the hazard perception test, then we’ll talk.',
    capped: 'Your connection has had its fill of votes today, so this one didn’t count. Here’s the tally anyway.',
    missing: 'We couldn’t find your first vote, so nothing changed.',
  };
  const NEXT = {
    cluster: { text: 'Sign the petition', href: '#petition-section' },
    single: { text: 'Take the test', href: '/hazard.html' },
  };
  const plural = (n) => `${n.toLocaleString('en-GB')} ${n === 1 ? 'vote' : 'votes'}`;

  // Whole percentages that always add up to 100.
  const tally = (results) => {
    const single = Number(results?.single) || 0;
    const cluster = Number(results?.cluster) || 0;
    const total = single + cluster;
    const stopPc = total ? Math.round((cluster / total) * 100) : 0;
    return { single, cluster, total, pc: { cluster: stopPc, single: total ? 100 - stopPc : 0 } };
  };

  const explain = (status, body) => {
    if ([400, 429, 503].includes(status) && typeof body?.error === 'string' && body.error) return body.error;
    if (status === 403) return 'That was blocked. Reload the page and try again.';
    if (status >= 500) return 'That one is on us, not you. Try again in a minute.';
    return 'Something went wrong. Try again in a minute.';
  };
  const explainThrown = (err) => {
    if (err?.name === 'AbortError') return 'That took too long. Try again in a moment.';
    if (navigator.onLine === false) return 'You look to be offline. Try again when you’re back.';
    return 'Couldn’t reach the server. Check your connection and try again.';
  };

  /* ---------- One state for the pill and the screen ---------- */

  const state = {
    status: 'loading', // loading | vote | posting | voted | notcounted | signed
    data: null, // the latest answer from /api/poll (voted, capped or missing)
    last: null, // the answer with this browser's vote on record, for "Keep my vote"
    changing: false, // on the screen's "Changed your mind?" step
    sending: false,
    error: '', // the last failed vote's reason, for the screen's note
  };
  const views = [];
  const render = (justVoted, from) => views.forEach((v) => guard(v.name, () => v.render(justVoted, from)));

  const POLL_TIMEOUT_MS = 15000;

  // `data` is an answer from /api/poll. A vote over the daily cap (capped) or a change with
  // no vote on record (missing) wasn't counted: the tally shows with no "you".
  const apply = (data, justVoted, from) => {
    const counted = !data.capped && !data.missing;
    state.data = data;
    if (counted) state.last = data;
    state.status = counted ? 'voted' : 'notcounted';
    state.changing = false;
    state.error = '';
    render(justVoted, from);
  };

  // The one vote routine. `from` is 'pill' or 'section'; it goes in the body as `source`
  // (the Worker ignores unknown fields today; logging it is a merge-time change).
  const castVote = async (choice, from) => {
    if (state.sending) return false;
    const before = state.status;
    state.sending = true;
    state.status = 'posting';
    state.error = '';
    render(false, from);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), POLL_TIMEOUT_MS);
    let ok = false;
    try {
      const body = state.changing ? { choice, change: true, source: from } : { choice, source: from };
      const res = await fetch('/api/poll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !(json?.voted || json?.capped || json?.missing) || !json.results) {
        state.error = explain(res.ok ? 502 : res.status, json);
      } else {
        ok = true;
        apply(json, true, from);
      }
    } catch (err) {
      state.error = explainThrown(err);
    } finally {
      clearTimeout(timer);
      state.sending = false;
      if (!ok) {
        // The vote state stays; the screen shows the reason in its own note, the pill says
        // nothing visible (it only tells screen readers).
        state.status = before === 'posting' ? 'vote' : before;
        render(false, from);
      }
    }
    return ok;
  };

  /* ---------- The poll screen (#poll): the chart, "Changed your mind?", the no-JS form ---------- */

  guard('poll screen', () => {
    const section = document.getElementById('poll');
    const form = document.getElementById('poll-form-p');
    const results = section?.querySelector('.poll-results');
    if (!section || !form || !results) return;

    const note = form.querySelector('.poll-note');
    const NOTE = note.textContent;
    const buttons = [...form.querySelectorAll('button[name="choice"]')];
    const again = results.querySelector('.poll-again');
    const keep = form.querySelector('.poll-keep');
    let pendingFocus = null;

    const showResults = (data, justVoted) => {
      const { choice } = data;
      const counted = !data.capped && !data.missing;
      const t = tally(data.results);
      results.querySelector('.poll-head').textContent = leadFor(t.single, t.cluster);
      results.querySelectorAll('.poll-row').forEach((row) => {
        const key = row.dataset.choice;
        row.querySelector('.poll-pc').textContent = `${t.pc[key]}%`;
        row.querySelector('.poll-n').textContent = plural(t[key]);
        row.querySelector('.poll-fill').style.setProperty('--v', t.pc[key] / 100);
        row.querySelector('.poll-you').hidden = !counted || key !== choice;
      });
      results.querySelector('.poll-total').textContent =
        `${plural(t.total)} so far. Self‑selecting and unscientific, like every pub argument.`;
      results.querySelector('.poll-quip').textContent =
        (data.capped && QUIPS.capped) || (data.missing && QUIPS.missing) || QUIPS[choice] || '';
      results.querySelectorAll('.poll-next').forEach((a) => (a.hidden = a.dataset.for !== choice));
      again.hidden = !counted; // a vote that didn't count has nothing to change

      keep.hidden = true;
      buttons.forEach((b) => (b.querySelector('.poll-you').hidden = true));
      note.textContent = NOTE;

      section.classList.add('voted');
      form.hidden = true;
      results.hidden = false;
      // The button they pressed has gone, so take focus to the results.
      if (justVoted) results.querySelector('.poll-head').focus();
    };

    const showForm = () => {
      results.hidden = true;
      form.hidden = false;
    };

    views.push({
      name: 'poll screen',
      render(justVoted, from) {
        const busy = state.status === 'posting';
        buttons.forEach((b) => (b.disabled = busy));
        form.toggleAttribute('aria-busy', busy);
        if (busy) {
          if (from === 'section') note.textContent = 'Counting…';
          return;
        }
        if ((state.status === 'voted' || state.status === 'notcounted') && state.data && !state.changing) {
          showResults(state.data, justVoted && from === 'section');
          return;
        }
        // vote (or a failed vote): the form, with the reason if the section asked
        if (state.status === 'vote' || state.changing) {
          if (!state.changing) {
            showForm();
            note.textContent = from === 'section' && state.error ? state.error : NOTE;
          }
          if (from === 'section' && state.error && pendingFocus) pendingFocus.focus();
        }
      },
    });

    // "Changed your mind?": back to the buttons, with the side on record stamped. The question
    // stays small (#poll keeps .voted), so it doesn't look like a first visit. The next vote
    // replaces the old one; "Keep my vote" goes back to the results.
    again.addEventListener('click', () => {
      if (!state.last) return;
      state.changing = true;
      showForm();
      buttons.forEach((b) => (b.querySelector('.poll-you').hidden = b.value !== state.last.choice));
      keep.hidden = false;
      note.textContent = `You’re down as ${SIDE[state.last.choice]}. Pick again to switch.`;
      // Focus the note, not a vote button, so a held Enter can't vote by accident.
      note.focus();
    });

    keep.addEventListener('click', () => {
      if (!state.last) return;
      state.changing = false;
      state.status = 'voted';
      state.data = state.last;
      render(true, 'section');
    });

    form.addEventListener('submit', async (event) => {
      const button = event.submitter;
      // A browser without event.submitter sends the plain form post and gets the results page.
      if (!button?.value) return;
      event.preventDefault();
      pendingFocus = button;
      const ok = await castVote(button.value, 'section');
      if (!ok) button.focus(); // disabling it dropped the focus
    });
  });

  /* ---------- The vote pill ---------- */

  guard('vote pill', () => {
    const pill = document.getElementById('vote-pill');
    if (!pill) return;

    const part = (name) => pill.querySelector(`[data-part="${name}"]`);
    const kickerD = part('kicker');
    const kickerM = part('kicker-m');
    const ask = part('ask');
    const buttons = [...pill.querySelectorAll('button[name="choice"]')];
    const noteEl = part('note');
    const rows = part('rows');
    const next = part('next');
    const more = part('more');
    const live = part('live');
    const toggle = pill.querySelector('.vote-toggle');
    const close = pill.querySelector('.vote-close');
    const question = pill.querySelector('.vote-q');
    // A page without the poll and petition sections (the history page) says where they live:
    // data-home="/prototypes/home.html" here, "/" at merge.
    const home = pill.dataset.home || '';
    const resolve = (href) => (href.startsWith('#') ? home + href : href);

    const setKicker = (text) => {
      kickerD.textContent = text;
    };

    views.push({
      name: 'vote pill',
      render(justVoted, from) {
        pill.dataset.state = state.status;
        const s = state.status;
        ask.hidden = !(s === 'vote' || s === 'posting');
        buttons.forEach((b) => (b.disabled = s === 'posting'));
        pill.toggleAttribute('aria-busy', s === 'posting');
        noteEl.hidden = s !== 'posting';
        rows.hidden = !(s === 'voted' || s === 'notcounted');
        next.hidden = true;
        more.hidden = true;

        if (s === 'vote') {
          setKicker('vote');
          if (from === 'pill' && state.error) live.textContent = state.error;
        } else if (s === 'posting') {
          setKicker('one sec');
          noteEl.textContent = 'Counting…';
        } else if (s === 'voted' || s === 'notcounted') {
          const data = state.data;
          const t = tally(data.results);
          rows.querySelectorAll('.vote-row').forEach((row) => {
            const key = row.dataset.side;
            row.querySelector('.pc').textContent = `${t.pc[key]}%`;
            row.querySelector('i').style.setProperty('--v', t.pc[key] / 100);
            row.querySelector('.you').hidden = s !== 'voted' || key !== data.choice;
          });
          const onRecord = s === 'voted' ? data.choice : state.last?.choice;
          if (onRecord && NEXT[onRecord]) {
            next.textContent = NEXT[onRecord].text;
            next.setAttribute('href', resolve(NEXT[onRecord].href));
            next.hidden = false;
          }
          more.setAttribute('href', resolve('#poll'));
          more.hidden = false;
          if (s === 'voted') {
            setKicker(`you voted ${SIDE[data.choice]}`);
            // The phone pill hides the rows, so its kicker carries the voter's own figure.
            kickerM.textContent = `${SIDE[data.choice]} ${t.pc[data.choice]}%`;
            more.textContent = 'full result ↓';
            live.textContent = `Stop ${t.pc.cluster}%, keep ${t.pc.single}%. You voted ${SIDE[data.choice]}.`;
          } else {
            setKicker('not counted');
            kickerM.textContent = 'not counted';
            more.textContent = 'why? ↓';
            live.textContent = `That vote wasn’t counted. Stop ${t.pc.cluster}%, keep ${t.pc.single}%.`;
          }
          pill.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          if (justVoted && from === 'pill') (next.hidden ? more : next).focus();
        }
      },
    });

    pill.addEventListener('submit', (event) => {
      const button = event.submitter;
      if (!button?.value) return;
      event.preventDefault();
      castVote(button.value, 'pill');
    });

    // Phones: the collapsed pill opens in place; × or Escape closes it.
    // Focus goes to the question, never a vote button: a second Enter must not vote a side.
    const open = () => {
      pill.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      (question || close).focus();
    };
    const shut = () => {
      pill.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    };
    toggle.addEventListener('click', open);
    close.addEventListener('click', shut);
    pill.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && pill.classList.contains('open')) shut();
    });

    // Shown from the first screen after the hero, hidden on any screen marked data-pill="off"
    // (the hero, the poll, the petition, the pubs chapter, the footer). Same threshold as the
    // rail: the screen that holds the middle of the window.
    const blocks = [...document.querySelectorAll('section, footer')];
    const update = () => {
      const mid = window.scrollY + window.innerHeight * 0.5;
      let current = null;
      blocks.forEach((el) => {
        if (el.getBoundingClientRect().top + window.scrollY <= mid) current = el;
      });
      // The test teaser is a Keep voter's own next step, so the pill stands down there too.
      const keepOnTest = current?.id === 'test' && state.status === 'voted' && state.data?.choice === 'single';
      const off = !current || current.dataset.pill === 'off' || keepOnTest;
      pill.classList.toggle('show', !off);
      if (off && pill.classList.contains('open')) {
        pill.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    };
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  /* ---------- Signed: the petition form's success retires the pill ---------- */

  guard('signed', () => {
    const flag = (() => {
      try {
        return localStorage.getItem('dq_signed') === '1';
      } catch {
        return false;
      }
    })();
    const sign = () => {
      state.status = 'signed';
      try {
        localStorage.setItem('dq_signed', '1');
      } catch {
        /* a private window: the pill still goes for this visit */
      }
      render(false, 'section');
    };
    if (flag) {
      state.status = 'signed';
    }
    const share = document.querySelector('#petition .share');
    if (share && 'MutationObserver' in window) {
      new MutationObserver(() => {
        if (!share.hidden && state.status !== 'signed') sign();
      }).observe(share, { attributes: true, attributeFilter: ['hidden'] });
    }
  });

  /* ---------- Load: one GET decides the state for both ---------- */

  guard('poll load', () => {
    const settle = (d) => {
      if (state.status === 'signed') {
        render(false, 'load');
        return;
      }
      if (d?.voted && d.results) {
        state.last = d;
        apply(d, false, 'load');
      } else {
        state.status = 'vote';
        render(false, 'load');
      }
    };
    fetch('/api/poll')
      .then((r) => (r.ok ? r.json() : null))
      .then(settle)
      .catch(() => settle(null));
  });

  /* ---------- The hero count: a fact with a link, only from 500 signatures ---------- */

  guard('hero count', () => {
    const line = document.querySelector('.hero-count');
    if (!line) return;
    const n = line.querySelector('.hero-count-n');
    fetch('/api/count')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d || !Number.isFinite(d.count) || d.count < 500) return;
        n.textContent = `${d.count.toLocaleString('en-GB')} have signed.`;
        line.hidden = false;
      })
      .catch(() => {});
  });

  // Reduced motion needs nothing extra here: the pill's transitions are off in proto.css and
  // the states swap in place.
  void reduceMotion;
})();
