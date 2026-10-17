/*
  Parts cabinet: each drawer's contents live in a <template> so the page
  works without JS (the default card is already in the HTML).
*/
(function () {
    var card = document.getElementById('card');
    var drawers = document.querySelectorAll('.drawer');

    drawers.forEach(function (drawer) {
        drawer.addEventListener('click', function () {
            var tpl = document.getElementById('tool-' + drawer.dataset.tool);
            if (!tpl) return;
            drawers.forEach(function (d) {
                d.setAttribute('aria-pressed', d === drawer ? 'true' : 'false');
            });
            card.replaceChildren(tpl.content.cloneNode(true));
            // On phones the card sits below the cabinet, so bring it into view
            if (window.matchMedia('(max-width: 900px)').matches) {
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
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
