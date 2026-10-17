/*
  Parts cabinet: clicking a drawer pulls it out and lifts its index card
  into a modal <dialog>. Each drawer's contents live in a <template>.
*/
(function () {
    var card = document.getElementById('card');
    var body = document.getElementById('card-body');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var openDrawer = null;
    var animating = false;

    // Offset and scale that shrink the card onto the drawer, so it can travel between them
    function drawerOffset(drawer) {
        var d = drawer.getBoundingClientRect();
        var c = card.getBoundingClientRect();
        return {
            x: d.left + d.width / 2 - (c.left + c.width / 2),
            y: d.top + d.height / 2 - (c.top + c.height / 2),
            s: d.width / c.width,
            lift: d.height
        };
    }

    function frames(drawer) {
        if (reduceMotion.matches) return [{ opacity: 0 }, { opacity: 1 }];
        var o = drawerOffset(drawer);
        var at = function (x, y, s, r) { return 'translate(' + x + 'px,' + y + 'px) scale(' + s + ') rotate(' + r + 'deg)'; };
        return [
            // Inside the drawer
            { transform: at(o.x, o.y + 8, o.s, 0), opacity: 0, offset: 0, easing: 'cubic-bezier(.3,.6,.4,1)' },
            // Lifted clear of the drawer front
            { transform: at(o.x, o.y - o.lift, o.s * 1.08, -4), opacity: 1, offset: 0.3, easing: 'cubic-bezier(.2,.75,.25,1)' },
            // Held up in front of you, at its resting tilt
            { transform: at(0, 0, 1, 0.6), opacity: 1, offset: 1 }
        ];
    }

    // Play the same path backwards; offsets must be mirrored to stay ascending
    function reversed(kf) {
        return kf.slice().reverse().map(function (f) {
            return f.offset == null ? f : Object.assign({}, f, { offset: 1 - f.offset });
        });
    }

    function fadeBackdrop(from, to, duration, delay) {
        try {
            card.animate({ opacity: [from, to] }, { duration: duration, delay: delay || 0, fill: 'both', pseudoElement: '::backdrop' });
        } catch (e) { /* Older browsers just show the backdrop without fading */ }
    }

    function open(drawer) {
        var tpl = document.getElementById('tool-' + drawer.dataset.tool);
        if (!tpl || animating || card.open) return;
        body.replaceChildren(tpl.content.cloneNode(true));
        body.querySelector('.card-label').id = 'card-title';
        openDrawer = drawer;
        drawer.classList.add('is-open');
        card.showModal();
        card.scrollTop = 0;

        var quick = reduceMotion.matches;
        var path = frames(drawer);
        animating = true;
        fadeBackdrop(0, 1, quick ? 150 : 400);
        // Short delay so the drawer slides out before the card comes up
        card.animate(path, { duration: quick ? 150 : 700, delay: quick ? 0 : 140, fill: 'backwards' })
            .finished.then(function () { animating = false; });
    }

    function close() {
        if (animating || !card.open) return;
        var drawer = openDrawer;
        var quick = reduceMotion.matches;
        var path = reversed(frames(drawer));
        animating = true;
        fadeBackdrop(1, 0, quick ? 150 : 450);
        card.animate(path, { duration: quick ? 150 : 550, fill: 'forwards' })
            .finished.then(function (anim) {
                card.close();
                anim.cancel();
                // The drawer slides shut once its card is back inside
                drawer.classList.remove('is-open');
                drawer.focus();
                openDrawer = null;
                animating = false;
            });
    }

    document.querySelectorAll('.drawer').forEach(function (drawer) {
        drawer.addEventListener('click', function () { open(drawer); });
    });
    card.querySelector('.card-close').addEventListener('click', close);
    // Esc plays the put-back animation instead of closing instantly
    card.addEventListener('cancel', function (e) { e.preventDefault(); close(); });
    // A click on the dimmed backdrop lands on the dialog itself, outside the card's box
    card.addEventListener('click', function (e) {
        if (e.target !== card) return;
        var r = card.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close();
    });

    // Ruler numbers along the top edge, one per heavy grid line
    var ruler = document.getElementById('ruler');
    function drawRuler() {
        var html = '';
        for (var i = 1; i <= Math.ceil(window.innerWidth / 120); i++) {
            html += '<span style="left:' + (i * 120) + 'px">' + i + '</span>';
        }
        ruler.innerHTML = html;
    }
    drawRuler();
    window.addEventListener('resize', drawRuler);
})();
