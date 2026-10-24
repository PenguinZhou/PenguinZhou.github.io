/* Zhenhui Peng Academic Homepage: navigation and cumulative publication filters */
(() => {
  'use strict';
  const nav = document.getElementById('primary-nav');
  const toggle = document.querySelector('.nav-toggle');
  if (nav && toggle) {
    const close = () => { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); };
    toggle.addEventListener('click', () => {
      const open = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    document.addEventListener('click', e => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) close();
    });
  }
  const papers = Array.from(document.querySelectorAll('.pub-item'));
  if (!papers.length) return; // Blog page has no publication list.

  const groups = Array.from(document.querySelectorAll('.pub-group'));
  const venueButtons = Array.from(document.querySelectorAll('.filter-btn[data-filter]'));
  const typeButtons = Array.from(document.querySelectorAll('.type-filter[data-type]'));
  const search = document.getElementById('pub-search');
  const result = document.querySelector('.result-count');
  const empty = document.getElementById('no-papers');
  let venue = 'all';
  let type = 'all';

  function updateButtons(buttons, selected) {
    buttons.forEach(button => {
      const active = button === selected;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }
  function render() {
    const query = (search ? search.value : '').normalize('NFKC').toLocaleLowerCase().trim();
    let visible = 0;
    papers.forEach(paper => {
      const matchesVenue = venue === 'all' || paper.dataset.venue === venue;
      const matchesType = type === 'all' || paper.dataset.kind === type;
      const matchesText = !query || paper.textContent.normalize('NFKC').toLocaleLowerCase().includes(query);
      paper.hidden = !(matchesVenue && matchesType && matchesText);
      if (!paper.hidden) visible += 1;
    });
    groups.forEach(group => {
      const shown = group.querySelectorAll('.pub-item:not([hidden])').length;
      group.hidden = shown === 0;
      const count = group.querySelector('.pub-group-title span');
      if (count) count.textContent = String(shown);
    });
    if (result) result.textContent = venue === 'all' && type === 'all' && !query
      ? '' : `${visible} publication${visible === 1 ? '' : 's'} found`;
    if (empty) empty.hidden = visible !== 0;
  }
  venueButtons.forEach(button => button.addEventListener('click', () => {
    venue = button.dataset.filter;
    updateButtons(venueButtons, button);
    render();
  }));
  typeButtons.forEach(button => button.addEventListener('click', () => {
    type = button.dataset.type;
    updateButtons(typeButtons, button);
    render();
  }));
  if (search) search.addEventListener('input', render);
  render();
})();
