// Effets liés au mouvement de la souris. Rien ne s'active sur écran tactile,
// ni si l'utilisateur a demandé moins d'animations : la page reste alors statique.
//
// [data-pointeur]        zone suivie. Elle reçoit quatre variables CSS, lissées :
//                        --mx, --my (position en pixels) et --dx, --dy (de -1 à 1 depuis le centre).
//                        La valeur de l'attribut règle la douceur du suivi (0.1 par défaut).
// [data-pointeur-zone]   enfant à utiliser comme repère à la place de la zone elle-même.
// [data-pointeur-saut]   la position saute au curseur quand il entre (lueur, pilule « Voir »).
// [data-aimant]          bouton légèrement attiré par le curseur.

const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canHover && !calm) {
  const zones: { forget: () => void }[] = [];

  document.querySelectorAll<HTMLElement>('[data-pointeur]').forEach((host) => {
    const zone = host.querySelector<HTMLElement>('[data-pointeur-zone]') ?? host;
    const ease = Number(host.dataset.pointeur) || 0.1;
    const jump = host.hasAttribute('data-pointeur-saut');
    let rect: DOMRect | null = null;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let frame = 0;
    let inside = false;
    let started = false;
    let pointer: { x: number; y: number } | null = null;

    const tick = () => {
      frame = 0;
      // Lecture d'abord (une seule mesure, mise en cache), écriture ensuite.
      if (!rect) {
        rect = zone.getBoundingClientRect();
        if (!started) {
          started = true;
          x = tx = rect.width / 2;
          y = ty = rect.height / 2;
        }
      }
      if (pointer) {
        const px = pointer.x - rect.left;
        const py = pointer.y - rect.top;
        const within = px >= 0 && py >= 0 && px <= rect.width && py <= rect.height;
        if (within) {
          if (!inside && jump) {
            x = px;
            y = py;
          }
          tx = px;
          ty = py;
        } else {
          tx = rect.width / 2;
          ty = rect.height / 2;
        }
        if (within !== inside) {
          inside = within;
          zone.classList.toggle('is-survol', within);
        }
      }
      x += (tx - x) * ease;
      y += (ty - y) * ease;
      zone.style.setProperty('--mx', `${x.toFixed(1)}px`);
      zone.style.setProperty('--my', `${y.toFixed(1)}px`);
      zone.style.setProperty('--dx', ((x / rect.width - 0.5) * 2).toFixed(3));
      zone.style.setProperty('--dy', ((y / rect.height - 0.5) * 2).toFixed(3));
      if (Math.abs(tx - x) + Math.abs(ty - y) > 0.3) frame = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    host.addEventListener('pointermove', (event) => {
      pointer = { x: event.clientX, y: event.clientY };
      wake();
    });
    host.addEventListener('pointerleave', () => {
      pointer = null;
      if (inside) {
        inside = false;
        zone.classList.remove('is-survol');
      }
      if (rect) {
        tx = rect.width / 2;
        ty = rect.height / 2;
      }
      wake();
    });
    zones.push({ forget: () => (rect = null) });
  });

  // La mesure d'une zone n'est plus valable après un défilement ou un redimensionnement.
  const forgetAll = () => zones.forEach((zone) => zone.forget());
  addEventListener('scroll', forgetAll, { passive: true });
  addEventListener('resize', forgetAll, { passive: true });

  document.querySelectorAll<HTMLElement>('[data-aimant]').forEach((button) => {
    let rect: DOMRect | null = null;
    button.addEventListener('pointerenter', () => (rect = button.getBoundingClientRect()));
    button.addEventListener('pointermove', (event) => {
      if (!rect) return;
      const dx = (event.clientX - rect.left - rect.width / 2) * 0.22;
      const dy = (event.clientY - rect.top - rect.height / 2) * 0.3;
      button.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
    });
    button.addEventListener('pointerleave', () => {
      rect = null;
      button.style.translate = '';
    });
  });
}
