/* =============================================================
   Scripts de la page
   =============================================================
   Fichier unique et volontairement sans modules ES : la page
   fonctionne ainsi par simple double-clic (protocole file://),
   sans serveur local. Les navigateurs bloquent les modules ES
   en file:// ; un script classique, lui, se charge normalement.

   Sommaire :
     1. Navigation mobile
     2. Accordeon FAQ
     3. Formulaire de contact
     4. Revelation au defilement
     5. Bandeau de logos qui defile
   ============================================================= */

(function () {
  'use strict';

  /* -----------------------------------------------------------
     1. Navigation mobile
     - Bascule aria-expanded sur le bouton
     - Ferme au clic sur un lien, avec Echap, ou en passant en desktop
     - Rend le focus au bouton a la fermeture au clavier
     ----------------------------------------------------------- */
  function initNav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var menu = document.querySelector('[data-nav-menu]');

    if (!toggle || !menu) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
      menu.hidden = !open;
    }

    setOpen(false);

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      setOpen(false);
      toggle.focus();
    });

    var desktop = window.matchMedia('(min-width: 900px)');
    desktop.addEventListener('change', function (event) {
      if (event.matches) setOpen(false);
    });
  }

  /* -----------------------------------------------------------
     2. Accordeon FAQ
     Base sur <details>/<summary> : sans JS, les panneaux restent
     utilisables. Le script se contente de fermer les autres.
     ----------------------------------------------------------- */
  function initFaq() {
    var accordion = document.querySelector('[data-accordion]');
    if (!accordion) return;

    var items = Array.prototype.slice.call(accordion.querySelectorAll('details'));

    items.forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (!item.open) return;
        items.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      });
    });
  }

  /* -----------------------------------------------------------
     3. Formulaire de contact
     - Le declencheur porte aria-expanded / aria-controls
     - Un lien vers #cta ouvre aussi le formulaire
     - Focus sur le premier champ a l'ouverture, retour au
       declencheur a la fermeture (Echap ou bouton Annuler)
     Sans JS, le formulaire reste affiche et le declencheur est
     masque (voir assets/css/sections/cta.css).
     ----------------------------------------------------------- */
  function initContact() {
    var wrapper = document.querySelector('[data-contact-panel]');
    var form = document.querySelector('[data-contact-form]');
    var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-contact-open]'));

    if (!wrapper || !form || !triggers.length) return;

    var intro = document.querySelector('[data-contact-intro]');
    var status = form.querySelector('[data-contact-status]');
    var cancel = form.querySelector('[data-contact-cancel]');
    var lastTrigger = null;

    function setOpen(open) {
      wrapper.hidden = !open;
      if (intro) intro.hidden = open;
      triggers.forEach(function (trigger) {
        trigger.setAttribute('aria-expanded', String(open));
      });
    }

    // Etat initial : referme le formulaire une fois le JS actif.
    setOpen(false);

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        lastTrigger = trigger;
        setOpen(true);

        var first = form.querySelector('input, select, textarea');
        if (first) first.focus();
      });
    });

    // Les boutons « Nous contacter » du haut de page renvoient vers #cta.
    // Y arriver et devoir cliquer une seconde fois n'aurait aucun sens :
    // l'ancre ouvre donc directement le formulaire. Le focus n'est pas
    // deplace, le defilement natif fait le reste.
    document.addEventListener('click', function (event) {
      var lien = event.target.closest('a[href="#cta"]');
      if (!lien) return;

      lastTrigger = triggers[0];
      setOpen(true);
    });

    function close() {
      setOpen(false);
      if (status) status.textContent = '';
      if (lastTrigger) lastTrigger.focus();
    }

    if (cancel) cancel.addEventListener('click', close);

    form.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') close();
    });

    form.addEventListener('submit', function (event) {
      // MAQUETTE : aucun envoi n'est configure.
      // Brancher ici le service reel (action du <form> vers votre
      // back-end, un service de formulaire tiers, ou un appel fetch).
      event.preventDefault();

      if (status) {
        status.textContent =
          'Maquette : l’envoi n’est pas encore branché. Les informations saisies ne sont transmises nulle part.';
      }
    });
  }

  /* -----------------------------------------------------------
     4. Revelation au defilement
     Regle de securite : le contenu ne doit JAMAIS rester invisible.
     L'animation est abandonnee des qu'elle n'est pas pertinente
     ou pas fiable (animations reduites, API absente, onglet en
     arriere-plan au chargement).
     ----------------------------------------------------------- */
  function initReveal() {
    var targets = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

    // Signale au script de secours de la page que le JS a bien demarre.
    document.documentElement.dataset.revealReady = 'true';

    if (!targets.length) return;

    function revealAll() {
      targets.forEach(function (el) {
        el.classList.add('is-visible');
      });
    }

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || !('IntersectionObserver' in window) || document.hidden) {
      revealAll();
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          // Un defilement rapide ou un saut vers une ancre peut faire
          // passer des blocs sans qu'ils soient vus comme intersectants :
          // on revele donc aussi tout ce qui precede le bloc atteint.
          var index = targets.indexOf(entry.target);
          targets.slice(0, index + 1).forEach(function (el) {
            el.classList.add('is-visible');
            observer.unobserve(el);
          });
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }


  /* -----------------------------------------------------------
     5. Bandeau de logos qui defile
     Recopie la liste une seule fois, puis marque la bande comme
     prete : le CSS ne lance l'animation qu'a partir de la, sinon
     le raccord de la boucle serait visible.
     La copie est masquee aux lecteurs d'ecran, qui annonceraient
     sans cela chaque logo deux fois. Elle est masquee par le CSS
     sur ordinateur, ou la rangee est fixe.
     ----------------------------------------------------------- */
  function initMarquee() {
    var bandes = Array.prototype.slice.call(document.querySelectorAll('[data-marquee]'));

    bandes.forEach(function (bande) {
      var piste = bande.querySelector('[data-marquee-track]');
      if (!piste) return;

      var originaux = Array.prototype.slice.call(piste.children);
      if (!originaux.length) return;

      originaux.forEach(function (element) {
        var copie = element.cloneNode(true);
        copie.setAttribute('data-marquee-clone', '');
        copie.setAttribute('aria-hidden', 'true');
        piste.appendChild(copie);
      });

      bande.setAttribute('data-marquee-ready', '');
    });
  }

  /* --------------------------------------------------------- */

  function start() {
    initNav();
    initFaq();
    initContact();
    initMarquee();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
