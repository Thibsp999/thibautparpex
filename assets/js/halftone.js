/**
 * halftone.js — fond halftone organique
 * La majorité des blobs se déplacent de façon totalement autonome
 * sur des trajectoires de Lissajous. Seuls 3 suivent vaguement le curseur.
 */
( function () {
    'use strict';

    /* ── Config ──────────────────────────────────────────────── */
    var GRID     = 13;   // espacement grille (px)
    var MAX_R    = 1.4;  // rayon max d'un point (px)
    var N_FOLLOW = 3;    // blobs qui suivent le curseur (faiblement)
    var N_WANDER = 9;    // blobs totalement autonomes

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
        var jitter = GRID * 0.7;
        for ( var x = GRID / 2; x < W + GRID; x += GRID ) {
            for ( var y = GRID / 2; y < H + GRID; y += GRID ) {
                dots.push( {
                    x:            x + ( Math.random() - 0.5 ) * jitter * 2,
                    y:            y + ( Math.random() - 0.5 ) * jitter * 2,
                    phase:        Math.random() * Math.PI * 2,
                    flickerSpeed: 0.005 + Math.random() * 0.025,
                    flickerAmp:   0.1   + Math.random() * 0.38,
                } );
            }
        }
    }

    /* ── Blobs ───────────────────────────────────────────────── */
    function spawnBlobs() {
        blobs = [];

        /* Followers : suivent le curseur avec un easing très lent */
        for ( var i = 0; i < N_FOLLOW; i++ ) {
            blobs.push( {
                x:         Math.random() * W,
                y:         Math.random() * H,
                r:         110 + Math.random() * 140,
                rCurrent:  0,
                ease:      0.006 + Math.random() * 0.010,
                strength:  0.35 + Math.random() * 0.5,
                driftAmpX: 70  + Math.random() * 110,
                driftAmpY: 60  + Math.random() * 100,
                driftSX:   0.00018 + Math.random() * 0.00035,
                driftSY:   0.00014 + Math.random() * 0.00028,
                driftPX:   Math.random() * Math.PI * 2,
                driftPY:   Math.random() * Math.PI * 2,
                pulseAmp:  0.1  + Math.random() * 0.22,
                pulseSpeed:0.0007 + Math.random() * 0.0016,
                pulsePhase:Math.random() * Math.PI * 2,
                wander:    false,
            } );
        }

        /* Wanderers : trajectoires de Lissajous totalement autonomes */
        for ( var j = 0; j < N_WANDER; j++ ) {
            /* Ratios de fréquences irrationnels → trajectoires non répétitives */
            var fx = 0.00006 + Math.random() * 0.00022;
            var fy = fx * ( 0.38 + Math.random() * 1.7 );
            blobs.push( {
                x:         Math.random() * W,
                y:         Math.random() * H,
                r:         80 + Math.random() * 220,
                rCurrent:  0,
                ease:      0.0025 + Math.random() * 0.007,
                strength:  0.2 + Math.random() * 0.65,
                /* centre de la trajectoire (fraction du canvas) */
                cx:        0.15 + Math.random() * 0.7,
                cy:        0.15 + Math.random() * 0.7,
                /* amplitude (fraction du canvas) */
                rx:        0.18 + Math.random() * 0.42,
                ry:        0.14 + Math.random() * 0.38,
                freqX:     fx,
                freqY:     fy,
                phaseX:    Math.random() * Math.PI * 2,
                phaseY:    Math.random() * Math.PI * 2,
                pulseAmp:  0.08 + Math.random() * 0.32,
                pulseSpeed:0.0004 + Math.random() * 0.002,
                pulsePhase:Math.random() * Math.PI * 2,
                wander:    true,
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

            var tx, ty;
            if ( b.wander ) {
                /* Trajectoire de Lissajous indépendante du curseur */
                tx = W * b.cx + W * b.rx * Math.sin( tick * b.freqX + b.phaseX );
                ty = H * b.cy + H * b.ry * Math.cos( tick * b.freqY + b.phaseY );
            } else {
                /* Suit la souris + dérive organique propre */
                tx = mx + b.driftAmpX * Math.sin( tick * b.driftSX + b.driftPX );
                ty = my + b.driftAmpY * Math.cos( tick * b.driftSY + b.driftPY );
            }

            b.x += ( tx - b.x ) * b.ease;
            b.y += ( ty - b.y ) * b.ease;
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
                    var t = 1 - nd;
                    inf += t * t * ( 3 - 2 * t ) * bl.strength;
                }
            }

            if ( inf < 0.03 ) continue;
            if ( inf > 1 ) inf = 1;

            var fl = 1 - dot.flickerAmp + dot.flickerAmp * Math.sin( tick * dot.flickerSpeed + dot.phase );
            inf   *= fl;
            if ( inf < 0.03 ) continue;

            ctx.globalAlpha = 0.09 + inf * 0.84;
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
