<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/* ── Theme setup ─────────────────────────────────────────────── */
function thibautparpex_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'html5', [ 'search-form', 'comment-form', 'gallery', 'caption' ] );
    add_theme_support( 'align-wide' );
    add_theme_support( 'responsive-embeds' );
    add_theme_support( 'editor-styles' );

    add_editor_style( [
        'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap',
        get_template_directory_uri() . '/assets/css/editor.css',
    ] );

    register_nav_menus( [
        'primary' => __( 'Navigation principale', 'thibautparpex' ),
    ] );
}
add_action( 'after_setup_theme', 'thibautparpex_setup' );

/* ── Assets ──────────────────────────────────────────────────── */
function thibautparpex_enqueue() {
    $ver = wp_get_theme()->get( 'Version' );

    wp_enqueue_style(
        'open-sans',
        'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap',
        [],
        null
    );

    wp_enqueue_style(
        'thibautparpex-main',
        get_template_directory_uri() . '/assets/css/main.css',
        [ 'open-sans' ],
        $ver
    );

    wp_enqueue_script(
        'thibautparpex-halftone',
        get_template_directory_uri() . '/assets/js/halftone.js',
        [],
        $ver,
        true
    );
}
add_action( 'wp_enqueue_scripts', 'thibautparpex_enqueue' );

/* ── Activation : pages, catégories, menu, réglages lecture ──── */
function thibautparpex_activate() {

    /* 1. Catégories work */
    foreach ( [ 'event', 'art', 'vj' ] as $slug ) {
        if ( ! get_term_by( 'slug', $slug, 'category' ) ) {
            wp_insert_term( ucfirst( $slug ), 'category', [ 'slug' => $slug ] );
        }
    }

    /* 2. Pages */
    $pages = [
        'home'    => 'Home',
        'work'    => 'Work',
        'about'   => 'About',
        'contact' => 'Contact',
    ];

    $page_ids = [];
    foreach ( $pages as $slug => $title ) {
        $found = get_posts( [
            'name'        => $slug,
            'post_type'   => 'page',
            'post_status' => [ 'publish', 'draft' ],
            'numberposts' => 1,
        ] );
        $page_ids[ $slug ] = $found
            ? $found[0]->ID
            : wp_insert_post( [
                'post_title'  => $title,
                'post_name'   => $slug,
                'post_status' => 'publish',
                'post_type'   => 'page',
            ] );
    }

    /* 3. Réglages lecture */
    update_option( 'show_on_front', 'page' );
    update_option( 'page_on_front', $page_ids['home'] );

    /* 4. Menu */
    $menu_name = 'Navigation principale';
    $existing  = get_term_by( 'name', $menu_name, 'nav_menu' );
    $menu_id   = $existing ? $existing->term_id : wp_create_nav_menu( $menu_name );

    if ( ! is_wp_error( $menu_id ) ) {
        $items = wp_get_nav_menu_items( $menu_id );
        if ( empty( $items ) ) {
            foreach ( [ 'work', 'about', 'contact' ] as $slug ) {
                wp_update_nav_menu_item( $menu_id, 0, [
                    'menu-item-title'     => ucfirst( $slug ),
                    'menu-item-object'    => 'page',
                    'menu-item-object-id' => $page_ids[ $slug ],
                    'menu-item-type'      => 'post_type',
                    'menu-item-status'    => 'publish',
                ] );
            }
        }
        $locations            = get_theme_mod( 'nav_menu_locations', [] );
        $locations['primary'] = $menu_id;
        set_theme_mod( 'nav_menu_locations', $locations );
    }
}
add_action( 'after_switch_theme', 'thibautparpex_activate' );

/* ── Fallback setup (OVH sans SSH) ───────────────────────────── */
function thibautparpex_maybe_setup() {
    if ( get_option( 'thibautparpex_setup_done' ) ) return;
    thibautparpex_activate();
    update_option( 'thibautparpex_setup_done', true );
}
add_action( 'init', 'thibautparpex_maybe_setup' );
