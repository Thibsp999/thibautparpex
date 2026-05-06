/* about-distortion.js — tearing-cube effect on the top of the about photo */
(function () {
  'use strict';

  var TILE    = 11;    // cube size in px
  var COVER   = 0.54;  // fraction of image height that gets the effect
  var DENSITY = 0.22;  // probability a grid cell becomes an active tile

  function init() {
    var img = document.querySelector('img.wp-image-163');
    if (!img) return;

    var figure = img.closest('figure');
    if (!figure) return;

    function setup() {
      if (!img.naturalWidth) { setTimeout(setup, 150); return; }

      figure.style.position = 'relative';

      var canvas = document.createElement('canvas');
      canvas.style.cssText =
        'position:absolute;top:0;left:0;pointer-events:none;z-index:4;';
      figure.appendChild(canvas);

      var ctx = canvas.getContext('2d');
      var W, H, tiles;

      function resize() {
        var fr = figure.getBoundingClientRect();
        var ir = img.getBoundingClientRect();
        W = Math.round(ir.width);
        H = Math.round(ir.height * COVER);
        canvas.width  = W;
        canvas.height = H;
        canvas.style.top    = (ir.top  - fr.top)  + 'px';
        canvas.style.left   = (ir.left - fr.left) + 'px';
        canvas.style.width  = W + 'px';
        canvas.style.height = H + 'px';
        buildTiles();
      }

      function buildTiles() {
        tiles = [];
        var cols = Math.ceil(W / TILE);
        var rows = Math.ceil(H / TILE);
        for (var r = 0; r < rows; r++) {
          for (var c = 0; c < cols; c++) {
            if (Math.random() > DENSITY) continue;
            var frac = 1 - r / rows; // 1 at top, 0 at bottom edge of effect zone
            tiles.push({
              col: c, row: r,
              dx: 0, dy: 0,
              tdx: 0, tdy: 0,
              ease: 0.018 + Math.random() * 0.038,
              ampX: 5 + frac * 26,
              ampY: 1 + frac * 7,
              tick: Math.floor(Math.random() * 80),
              period: 50 + Math.floor(Math.random() * 100),
            });
          }
        }
      }

      resize();
      window.addEventListener('resize', resize);

      var iW = img.naturalWidth;
      var iH = img.naturalHeight;

      function animate() {
        var ir  = img.getBoundingClientRect();
        var scX = iW / ir.width;
        var scY = iH / ir.height;

        ctx.clearRect(0, 0, W, H);

        for (var i = 0; i < tiles.length; i++) {
          var t = tiles[i];
          t.tick++;
          if (t.tick >= t.period) {
            t.tick   = 0;
            t.period = 50 + Math.floor(Math.random() * 100);
            t.tdx    = (Math.random() - 0.5) * t.ampX * 2;
            t.tdy    = (Math.random() - 0.5) * t.ampY * 2;
          }
          t.dx += (t.tdx - t.dx) * t.ease;
          t.dy += (t.tdy - t.dy) * t.ease;

          var srcX = t.col * TILE;
          var srcY = t.row * TILE;

          ctx.drawImage(
            img,
            srcX * scX, srcY * scY, TILE * scX, TILE * scY,
            srcX + t.dx, srcY + t.dy, TILE, TILE
          );
        }

        requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
    }

    if (img.complete && img.naturalWidth > 0) {
      requestAnimationFrame(setup);
    } else {
      img.addEventListener('load', function () { requestAnimationFrame(setup); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
