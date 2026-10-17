/*
    App screenshot slideshows. The track is a CSS scroll-snap strip, so touch
    swipe and trackpad scrolling work natively; the buttons and dots only move
    scrollLeft, which keeps all three input methods in sync.
*/
(function () {
    document.querySelectorAll('.carousel').forEach(function (carousel) {
        var track = carousel.querySelector('.carousel-track');
        var slides = track.children;
        var dotsBox = carousel.querySelector('.carousel-dots');
        // Mid-animation scrollLeft is between slides, so rapid clicks step from the target instead
        var target = 0;
        var settle;

        if (slides.length < 2) {
            carousel.classList.add('single');
            return;
        }

        var dots = Array.prototype.map.call(slides, function (_, i) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.setAttribute('aria-label', 'Screenshot ' + (i + 1));
            dot.addEventListener('click', function () { go(i); });
            dotsBox.appendChild(dot);
            return dot;
        });

        function current() {
            return Math.round(track.scrollLeft / track.clientWidth);
        }

        function go(i) {
            // Wrap around so the arrows never dead-end
            target = (i + slides.length) % slides.length;
            track.scrollTo({ left: target * track.clientWidth, behavior: 'smooth' });
        }

        function sync() {
            var i = current();
            dots.forEach(function (dot, j) {
                dot.setAttribute('aria-current', i === j ? 'true' : 'false');
            });
        }

        carousel.querySelector('.carousel-prev').addEventListener('click', function () { go(target - 1); });
        carousel.querySelector('.carousel-next').addEventListener('click', function () { go(target + 1); });
        track.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') { e.preventDefault(); go(target - 1); }
            if (e.key === 'ArrowRight') { e.preventDefault(); go(target + 1); }
        });
        track.addEventListener('scroll', function () {
            sync();
            // Pick up swipes once scrolling stops
            clearTimeout(settle);
            settle = setTimeout(function () { target = current(); }, 150);
        }, { passive: true });
        sync();
    });
})();
