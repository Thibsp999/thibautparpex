/**
 * halftone.js — fond halftone organique interactif
 * Grille de points ultra-fins formant des blobs organiques
 * attirés par le curseur. Chaque point scintille individuellement.
 */
( function () {
    'use strict';

    /* ── Config ──────────────────────────────────────────────── */
    var GRID      = 13;    // espacement grille (px)
    var MAX_R     = 1.4;   // rayon max d'un point (px)
    var N_BLOBS   = 10;    // nombre de formes organiques
    var BLOB_RMIN = 90;
    var BLOB_RMAX = 230;
    var BASE_EASE = 0.022;

    /* ── State ───────────────────────────────────────────────── */
    var canvas, ctx, W, H, dots, blobs, mouse, frameId, tick;

    /* ── Init ────────────────────────────────────────────────── */
    function init() {
        canvas = document.getElementById( 'halftone-canvas' );
        if ( ! canvas ) return;
        ctx   = canvas.getContext( '2d' );
        tick  = 0;
        mouse = { x: null, y: null };

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
        var jitter = GRID * 0.65;
        for ( var x = GRID / 2; x < W + GRID; x += GRID ) {
            for ( var y = GRID / 2; y < H + GRID; y += GRID ) {
                dots.push( {
                    x:            x + ( Math.random() - 0.5 ) * jitter * 2,
                    y:            y + ( Math.random() - 0.5 ) * jitter * 2,
                    /* scintillement individuel */
                    phase:        Math.random() * Math.PI * 2,
                    flickerSpeed: 0.006 + Math.random() * 0.02,
                    flickerAmp:   0.07 + Math.random() * 0.3,
                } );
            }
        }
    }

    /* ── Blobs ───────────────────────────────────────────────── */
    function spawnBlobs() {
        blobs = [];
        for ( var i = 0; i < N_BLOBS; i++ ) {
            /* les 3 derniers blobs sont des "errants" : peu sensibles à la souris */
            var wanderer = i >= N_BLOBS - 3;
            blobs.push( {
                x:          Math.random() * W,
                y:          Math.random() * H,
                r:          BLOB_RMIN + Math.random() * ( BLOB_RMAX - BLOB_RMIN ),
                rCurrent:   0,
                ease:       wanderer
                                ? 0.002 + Math.random() * 0.006
                                : BASE_EASE * ( 0.35 + Math.random() * 1.1 ),
                strength:   0.3 + Math.random() * 0.7,
                driftAmp:   wanderer
                                ? 200 + Math.random() * 250
                                : 45  + Math.random() * 140,
                driftSpeed: 0.00018 + Math.random() * 0.00055,
                driftPhaseX: Math.random() * Math.PI * 2,
                driftPhaseY: Math.random() * Math.PI * 2,
                /* pulsation du rayon */
                pulseAmp:   0.1 + Math.random() * 0.25,
                pulseSpeed: 0.0006 + Math.random() * 0.0018,
                pulsePhase: Math.random() * Math.PI * 2,
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
            var b = blobs[i];
            var ts = tick * b.driftSpeed;
            /* dérive sur X et Y avec des phases indépendantes → trajectoire non répétitive */
            var tx = mx + b.driftAmp * Math.sin( ts + b.driftPhaseX );
            var ty = my + b.driftAmp * Math.cos( ts * 0.63 + b.driftPhaseY );
            b.x += ( tx - b.x ) * b.ease;
            b.y += ( ty - b.y ) * b.ease;
            /* rayon pulsant */
            b.rCurrent = b.r * ( 1 + b.pulseAmp * Math.sin( tick * b.pulseSpeed + b.pulsePhase ) );
        }
    }

    /* ── Draw ────────────────────────────────────────────────── */
    function draw() {
        ctx.clearRect( 0, 0, W, H );

        for ( var d = 0; d < dots.length; d++ ) {
            var dot = dots[d];
            var inf = 0;

            for ( var b = 0; b < blobs.length; b++ ) {
                var bl = blobs[b];
                var dx = dot.x - bl.x;
                var dy = dot.y - bl.y;
                var nd = Math.sqrt( dx * dx + dy * dy ) / bl.rCurrent;
                if ( nd < 1 ) {
                    var nt = 1 - nd;
                    inf += nt * nt * ( 3 - 2 * nt ) * bl.strength;
                }
            }

            if ( inf < 0.03 ) continue;
            if ( inf > 1 ) inf = 1;

            /* scintillement individuel du point */
            var fl = 1 - dot.flickerAmp + dot.flickerAmp * Math.sin( tick * dot.flickerSpeed + dot.phase );
            inf   *= fl;
            if ( inf < 0.03 ) continue;

            ctx.globalAlpha = 0.1 + inf * 0.82;
            ctx.beginPath();
            ctx.arc( dot.x, dot.y, inf * MAX_R, 0, 6.2832 );
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
