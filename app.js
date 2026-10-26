'use strict';

const root = document.documentElement;
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
root.classList.add('js');

// Storage is optional: navigation and themes continue to work when it is blocked.
function readTheme() { try { return localStorage.getItem('mateus-portfolio-theme'); } catch { return null; } }
function saveTheme(value) { try { localStorage.setItem('mateus-portfolio-theme', value); } catch { /* No persistence available. */ } }
const themeToggle = document.querySelector('.theme-toggle');
function setTheme(theme) {
  root.dataset.theme = theme;
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
  themeToggle.querySelector('use').setAttribute('href', theme === 'dark' ? '#i-sun' : '#i-moon');
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#0b1420' : '#f4f7f8';
}
const savedTheme = readTheme();
setTheme(savedTheme === 'light' ? 'light' : 'dark');
themeToggle.hidden = false;
themeToggle.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(next); saveTheme(next);
});

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');
menuToggle.hidden = false;
function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
  navigation.classList.remove('open');
}
menuToggle.addEventListener('click', () => {
  const opened = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(opened));
  menuToggle.setAttribute('aria-label', opened ? 'Fechar menu' : 'Abrir menu');
  navigation.classList.toggle('open', opened);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) { closeMenu(); menuToggle.focus(); }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
  const navLinks = [...navigation.querySelectorAll('a')];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-20% 0px -55% 0px', threshold: 0 });
  document.querySelectorAll('main>section[id]').forEach(section => sectionObserver.observe(section));
} else document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));

const filters = document.querySelector('.filters');
filters.hidden = false;
const projects = [...document.querySelectorAll('.project')];
filters.addEventListener('click', event => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  const selected = button.dataset.filter;
  filters.querySelectorAll('button').forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  let count = 0;
  projects.forEach(project => {
    project.hidden = selected !== 'all' && project.dataset.category !== selected;
    if (!project.hidden) { count++; project.classList.add('visible'); }
  });
  document.querySelector('#project-count').textContent = `${count} ${count === 1 ? 'projeto' : 'projetos'}`;
});

const details = {
  "parceiro": {
    "id": "parceiro",
    "title": "ParceiroAuto · Web",
    "category": "Projeto integrador · Em equipe",
    "label": "Projeto integrador · Em equipe",
    "tech": [
      "Java / Spring Boot",
      "Angular",
      "PostgreSQL"
    ],
    "repo": "Adriannoo/ParceiroAuto",
    "description": "Sistema contábil com empresas, contas bancárias, movimentações e regras de recorrência.",
    "features": [
      "Construção compartilhada entre os integrantes do grupo.",
      "Contribuições em integração de empresas, contas, transações, recorrências e relatórios.",
      "Participação em testes de serviços e documentação."
    ],
    "note": "Em desenvolvimento. Participei de diferentes partes do projeto, em colaboração com a equipe. O histórico registra integrações e testes; não representa autoria exclusiva.",
    "blueprint": "Angular ↔ Spring Boot ↔ PostgreSQL"
  },
  "wikimon": {
    "id": "wikimon",
    "title": "Wikimon",
    "category": "Aplicação web · Acadêmico",
    "label": "Aplicação web · Acadêmico",
    "tech": [
      "JavaScript",
      "PokéAPI",
      "HTML / CSS"
    ],
    "repo": "mateushdsouza/wikimon",
    "description": "Enciclopédia Pokémon com busca por nome, fichas, comparação e favoritos locais.",
    "features": [
      "Consulta de dados da PokéAPI.",
      "Pesquisa por início do nome e páginas de detalhes.",
      "Comparação de Pokémon e lista de favoritos."
    ],
    "note": "Cadastro e login são uma demonstração em localStorage, sem autenticação de servidor. Não utilize senhas reais. A API exige conexão com a internet.",
    "image": "wikimon.jpg"
  },
  "desktop": {
    "id": "desktop",
    "title": "ParceiroAuto · Desktop",
    "category": "Aplicação desktop · Acadêmico",
    "label": "Aplicação desktop · Acadêmico",
    "tech": [
      "Java Swing",
      "PostgreSQL",
      "JPA / Hibernate"
    ],
    "repo": "mateushdsouza/parceiro-auto",
    "description": "Gestão financeira em Java, com interface Swing, contas, lançamentos e relatórios.",
    "features": [
      "Organização em controllers, services, repositories e telas Swing.",
      "Persistência com JPA/Hibernate e migrations com Flyway.",
      "Telas de contas, funcionários, transações e relatórios."
    ],
    "note": "Esta é a versão desktop, separada da versão web do grupo. A execução depende da configuração local do PostgreSQL.",
    "blueprint": "Java Swing ↔ JPA ↔ PostgreSQL"
  }
};
const dialog = document.querySelector('#project-dialog');
if (typeof dialog.showModal === 'function') {
  document.querySelectorAll('.project-details').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      const project = details[button.dataset.id];
      if (!project) return;
      document.querySelector('#dialog-title').textContent = project.title;
      document.querySelector('#dialog-category').textContent = project.category;
      document.querySelector('#dialog-description').textContent = project.description;
      document.querySelector('#dialog-note').textContent = project.note;
      const list = document.querySelector('#dialog-features');
      list.replaceChildren(...project.features.map(feature => { const item = document.createElement('li'); item.textContent = feature; return item; }));
      document.querySelector('#dialog-link').href = `https://github.com/${project.repo}`;
      dialog.showModal(); document.body.classList.add('dialog-open');
    });
  });
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
}

const copyButton = document.querySelector('.copy-email');
if (navigator.clipboard && window.isSecureContext) {
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    const status = document.querySelector('#copy-status');
    try { await navigator.clipboard.writeText('teushdsouza@gmail.com'); status.textContent = 'E-mail copiado.'; }
    catch { status.textContent = 'Não foi possível copiar. Selecione o endereço de e-mail acima.'; }
  });
}
document.querySelector('#year').textContent = new Date().getFullYear();

