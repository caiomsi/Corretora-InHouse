/* Corretora IN HOUSE — vanilla JS */
(function () {
  'use strict';

  /* ⚠️ PLACEHOLDER — trocar pelo número real da corretora (DDI + DDD + número, só dígitos) */
  var WHATSAPP_NUMBER = '5534999999999';
  /* ⚠️ PLACEHOLDER — trocar pelo primeiro nome real da corretora (usado na mensagem) */
  var AGENT_NAME = 'Mariana';

  /* ── Nav: estado scrolled ── */
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Nav: menu mobile ── */
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Scroll-spy ── */
  var spyLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  var sections = [];
  spyLinks.forEach(function (a) {
    var sec = document.querySelector(a.getAttribute('href'));
    if (sec) sections.push({ link: a, sec: sec });
  });
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sections.forEach(function (s) {
          s.link.classList.toggle('is-active', s.sec === entry.target);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s.sec); });
  }

  /* ── Reveal escalonado ── */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      var delay = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.style.transitionDelay = delay + 'ms';
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
        delay += 90;
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── Parallax suave do retrato do hero ── */
  var heroFig = document.getElementById('hero-fig');
  if (heroFig && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var ticking = false;
    var parallax = function () {
      var y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        heroFig.style.transform = 'translateY(' + (y * 0.06).toFixed(1) + 'px)';
      }
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(parallax); ticking = true; }
    }, { passive: true });
  }

  /* ── Ano no rodapé ── */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ── Links diretos de WhatsApp ── */
  var directMsg = 'Olá, ' + AGENT_NAME + '! Vi seu site e quero conversar sobre um imóvel.';
  var directUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(directMsg);
  ['wa-direct', 'wa-footer', 'wa-float'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.href = directUrl;
  });
  var waFloat = document.getElementById('wa-float');
  if (waFloat) {
    var hero = document.querySelector('.hero');
    var floatToggle = function () {
      var past = hero ? window.scrollY > hero.offsetHeight * 0.7 : window.scrollY > 600;
      waFloat.classList.toggle('is-visible', past);
    };
    window.addEventListener('scroll', floatToggle, { passive: true });
    floatToggle();
  }

  /* ══════════ Wizard dinâmico de qualificação ══════════ */
  var form = document.getElementById('lead-wiz');
  if (!form) return;

  var allSteps = Array.prototype.slice.call(form.querySelectorAll('.wiz-step'));
  var answers = {};
  var branch = null;   /* comprar | alugar | vender | investir */
  var flow = [];       /* passos do ramo ativo, em ordem */
  var idx = 0;         /* índice do passo atual dentro do fluxo */

  var BRANCH_KEY = {
    'Comprar': 'comprar',
    'Alugar': 'alugar',
    'Vender meu imóvel': 'vender',
    'Investir': 'investir'
  };

  var label = document.getElementById('wiz-current');
  var totalEl = document.getElementById('wiz-total');
  var fill = document.getElementById('wiz-fill');
  var btnBack = document.getElementById('wiz-back');
  var btnNext = document.getElementById('wiz-next');
  var btnSend = document.getElementById('wiz-send');
  var success = form.querySelector('.wiz-success');
  var wizNav = document.getElementById('wiz-nav');
  var wizHead = document.getElementById('wiz-head');
  var nomeInput = document.getElementById('lead-nome');

  function stepBranches(step) {
    return (step.dataset.branch || 'all').split(',');
  }

  function flowFor(b) {
    return allSteps.filter(function (s) {
      var list = stepBranches(s);
      return list.indexOf('all') !== -1 || (b && list.indexOf(b) !== -1);
    });
  }

  /* sem ramo escolhido, o contador mostra o fluxo mais longo */
  var longestFlow = Object.keys(BRANCH_KEY).reduce(function (max, k) {
    return Math.max(max, flowFor(BRANCH_KEY[k]).length);
  }, 0);

  /* fluxo = passos cujo data-branch contém o ramo (ou 'all') */
  function buildFlow() {
    flow = flowFor(branch);
    if (totalEl) totalEl.textContent = String(branch ? flow.length : longestFlow);
  }
  buildFlow();

  function hideError(step) {
    if (!step) return;
    var err = step.querySelector('.wiz-error');
    if (err) err.hidden = true;
  }
  function showError(step) {
    var err = step.querySelector('.wiz-error');
    if (err) err.hidden = false;
  }

  /* limpa respostas e seleções dos outros ramos ao trocar a intenção */
  function resetBranchAnswers(intentValue) {
    answers = { intencao: intentValue };
    form.querySelectorAll('.chips').forEach(function (group) {
      if (group.dataset.field === 'intencao') return;
      group.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('is-selected'); });
    });
  }

  /* chips: seleção única por grupo */
  form.querySelectorAll('.chips').forEach(function (group) {
    group.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      group.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('is-selected'); });
      chip.classList.add('is-selected');

      if (group.dataset.field === 'intencao') {
        var newBranch = BRANCH_KEY[chip.dataset.value];
        if (newBranch !== branch) resetBranchAnswers(chip.dataset.value);
        else answers.intencao = chip.dataset.value;
        branch = newBranch;
        buildFlow();
        hideError(group.closest('.wiz-step'));
        /* passo 1 tem uma pergunta só: avança sozinho */
        window.setTimeout(function () { goTo(1); }, 260);
        return;
      }

      answers[group.dataset.field] = chip.dataset.value;
      hideError(group.closest('.wiz-step'));
    });
  });

  function validate(step) {
    if (!step) return true;
    if (step.dataset.stepId === 'contato') {
      var ok = !!nomeInput.value.trim();
      nomeInput.classList.toggle('is-invalid', !ok);
      if (!ok) { showError(step); return false; }
      return true;
    }
    var groups = step.querySelectorAll('.chips[data-required="true"]');
    var valid = true;
    groups.forEach(function (g) {
      /* a resposta precisa ter vindo de um chip deste grupo */
      if (!g.querySelector('.chip.is-selected')) valid = false;
    });
    if (!valid) showError(step);
    return valid;
  }

  function goTo(n) {
    if (n < 0 || n >= flow.length) return;
    idx = n;
    allSteps.forEach(function (s) {
      s.classList.toggle('is-active', s === flow[idx]);
    });
    if (label) label.textContent = String(idx + 1);
    if (fill) fill.style.width = ((idx + 1) / flow.length) * 100 + '%';
    btnBack.hidden = idx === 0;
    var last = idx === flow.length - 1;
    btnNext.hidden = last;
    btnSend.hidden = !last;
    var active = flow[idx];
    var first = active && active.querySelector('input');
    if (first && window.matchMedia('(min-width: 721px)').matches) first.focus();
  }

  btnNext.addEventListener('click', function () {
    if (validate(flow[idx])) goTo(idx + 1);
  });
  btnBack.addEventListener('click', function () { goTo(idx - 1); });
  if (nomeInput) {
    nomeInput.addEventListener('input', function () {
      nomeInput.classList.remove('is-invalid');
      hideError(flow[idx]);
    });
  }

  /* mensagem de WhatsApp montada a partir das respostas do ramo */
  function buildMessage() {
    var lines = [];
    lines.push('Olá, ' + AGENT_NAME + '! Sou ' + nomeInput.value.trim() + '.');
    lines.push('');
    lines.push('Preenchi a busca no seu site:');
    lines.push('— Quero: ' + (answers.intencao || '—'));
    if (answers.tipo) lines.push('— Imóvel: ' + answers.tipo);
    if (answers.quartos) lines.push('— Quartos: ' + answers.quartos);
    if (answers.situacao) lines.push('— Situação: ' + answers.situacao);
    if (answers.objetivo) lines.push('— Objetivo: ' + answers.objetivo);
    if (answers.regiao) {
      lines.push((branch === 'vender' ? '— Onde fica: ' : '— Região: ') + answers.regiao);
    }
    if (answers.valor) {
      var valorLabel = branch === 'alugar' ? '— Aluguel: '
        : branch === 'vender' ? '— Expectativa: '
        : '— Faixa: ';
      lines.push(valorLabel + answers.valor);
    }
    if (answers.pagamento) lines.push('— Pagamento: ' + answers.pagamento);
    if (answers.momento) lines.push('— Para quando: ' + answers.momento);
    if (answers.horario) lines.push('— Melhor horário p/ falar: ' + answers.horario);
    lines.push('');
    lines.push('Pode me ajudar?');
    return lines.join('\n');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate(flow[idx])) return;

    var msg = buildMessage();
    var preview = document.getElementById('wa-preview');
    var openBtn = document.getElementById('wa-open');
    if (preview) preview.textContent = msg;
    if (openBtn) openBtn.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);

    allSteps.forEach(function (s) { s.classList.remove('is-active'); });
    wizNav.hidden = true;
    wizHead.hidden = true;
    success.hidden = false;
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  /* copiar mensagem */
  var copyBtn = document.getElementById('wa-copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var preview = document.getElementById('wa-preview');
      if (!preview || !navigator.clipboard) return;
      navigator.clipboard.writeText(preview.textContent).then(function () {
        copyBtn.textContent = 'Copiado ✓';
        window.setTimeout(function () { copyBtn.textContent = 'Copiar mensagem'; }, 2000);
      });
    });
  }

  /* refazer */
  var restart = document.getElementById('wiz-restart');
  if (restart) {
    restart.addEventListener('click', function () {
      answers = {};
      branch = null;
      form.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('is-selected'); });
      if (nomeInput) { nomeInput.value = ''; nomeInput.classList.remove('is-invalid'); }
      form.querySelectorAll('.wiz-error').forEach(function (er) { er.hidden = true; });
      success.hidden = true;
      wizNav.hidden = false;
      wizHead.hidden = false;
      buildFlow();
      goTo(0);
    });
  }
})();
