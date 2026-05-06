/**
 * halftone.js — fond halftone organique interactif
 * Grille de points ultra-fins formant des formes organiques
 * attirées par le curseur de la souris.
 */
( function () {
    'use strict';

    /* ── Config ──────────────────────────────────────────────── */
    var GRID      = 13;   // espacement de la grille (px)
    var MAX_R     = 1.4;  // rayon max d'un point (px)
    var N_BLOBS   = 7;    // nombre de formes organiques
    var BLOB_RMIN = 100;  // rayon d'influence min d'un blob
    var BLOB_RMAX = 200;  // rayon d'influence max
    var BASE_EASE = 0.022; // vitesse de suivi du curseur

    /* ── State ───────────────────────────────────────────────── */
    var canvas, ctx, W, H, dots, blobs, mouse, frameId, tick;

    /* ── Init ────────────────────────────────────────────────── */
    function init() {
        canvas = document.getElementById( 'halftone-canvas' );
        if ( ! canvas ) return;
        ctx    = canvas.getContext( '2d' );
        tick   = 0;
        mouse  = { x: null, y: null };

        resize();
        spawnBlobs();
        bindEvents();

        if ( frameId ) cancelAnimationFrame( frameId );
        loop();
    }

    /* ── Grid ────────────────────────────────────────────────── */
    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
        buildGrid();
    }

    function buildGrid() {
        dots = [];
        var jitter = GRID * 0.35;
        for ( var x = GRID / 2; x < W + GRID; x += GRID ) {
            for ( var y = GRID / 2; y < H + GRID; y += GRID ) {
                dots.push( {
                    x: x + ( Math.random() - 0.5 ) * jitter * 2,
                    y: y + ( Math.random() - 0.5 ) * jitter * 2,
                } );
            }
        }
    }

    /* ── Blobs ───────────────────────────────────────────────── */
    function spawnBlobs() {
        blobs = [];
        for ( var i = 0; i < N_BLOBS; i++ ) {
            blobs.push( {
                x:          Math.random() * W,
                y:          Math.random() * H,
                r:          BLOB_RMIN + Math.random() * ( BLOB_RMAX - BLOB_RMIN ),
                ease:       BASE_EASE * ( 0.45 + Math.random() * 0.9 ),
                strength:   0.45 + Math.random() * 0.55,
                driftAmp:   60 + Math.random() * 100,
                driftSpeed: 0.00025 + Math.random() * 0.00035,
                driftPhase: Math.random() * Math.PI * 2,
            } );
        }
    }

    /* ── Events ──────────────────────────────────────────────── */
    function bindEvents() {
        window.addEventListener( 'resize', resize );

        window.addEventListener( 'mousemove', function ( e ) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        } );

        window.addEventListener( 'touchmove', function ( e ) {
            if ( e.touches.length ) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
            }
        }, { passive: true } );
    }

    /* ── Update ──────────────────────────────────────────────── */
    function update() {
        tick++;
        var mx = ( mouse.x !== null ) ? mouse.x : W * 0.5;
        var my = ( mouse.y !== null ) ? mouse.y : H * 0.5;

        for ( var i = 0; i < blobs.length; i++ ) {
            var b  = blobs[i];
            var t  = tick * b.driftSpeed + b.driftPhase;
            /* chaque blob suit la souris + une dérive organique individuelle */
            var tx = mx + b.driftAmp * Math.sin( t );
            var ty = my + b.driftAmp * Math.cos( t * 0.71 );
            b.x += ( tx - b.x ) * b.ease;
            b.y += ( ty - b.y ) * b.ease;
        }
    }

    /* ── Draw ────────────────────────────────────────────────── */
    function draw() {
        ctx.clearRect( 0, 0, W, H );

        for ( var d = 0; d < dots.length; d++ ) {
            var dot  = dots[d];
            var inf  = 0;

            for ( var b = 0; b < blobs.length; b++ ) {
                var bl = blobs[b];
                var dx = dot.x - bl.x;
                var dy = dot.y - bl.y;
                /* distance normalisée [0-1] */
                var nd = Math.sqrt( dx * dx + dy * dy ) / bl.r;
                if ( nd < 1 ) {
                    /* falloff doux (courbe cubique) pour des bords organiques */
                    var t = 1 - nd;
                    inf += t * t * ( 3 - 2 * t ) * bl.strength;
                }
            }

            if ( inf < 0.03 ) continue;
            inf = inf > 1 ? 1 : inf;

            var r     = inf * MAX_R;
            var alpha = 0.12 + inf * 0.78;

            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc( dot.x, dot.y, r, 0, 6.2832 );
            ctx.fillStyle = '#fff';
            ctx.fill();
        }

        ctx.globalAlpha = 1;
    }

    /* ── Loop ────────────────────────────────────────────────── */
    function loop() {
        frameId = requestAnimationFrame( loop );
        update();
        draw();
    }

    /* ── Boot ────────────────────────────────────────────────── */
    if ( document.readyState === 'loading' ) {
        document.addEventListener( 'DOMContentLoaded', init );
    } else {
        init();
    }

} )();
