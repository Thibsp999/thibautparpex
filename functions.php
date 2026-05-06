<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/* ── Theme setup ─────────────────────────────────────────────── */
function thibautparpex_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'html5', [ 'search-form', 'comment-form', 'gallery', 'caption' ] );

    register_nav_menus( [
        'primary' => __( 'Navigation principale', 'thibautparpex' ),
    ] );
}
add_action( 'after_setup_theme', 'thibautparpex_setup' );

/* ── Assets ──────────────────────────────────────────────────── */
function thibautparpex_enqueue() {
    $ver = wp_get_theme()->get( 'Version' );

    wp_enqueue_style(
        'instrument-serif',
        'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap',
        [],
        null
    );

    wp_enqueue_style(
        'thibautparpex-main',
        get_template_directory_uri() . '/assets/css/main.css',
        [ 'instrument-serif' ],
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

/* ── Activation : pages, menu, réglages lecture ──────────────── */
function thibautparpex_activate() {

    /* 1. Créer les pages si elles n'existent pas encore */
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
        if ( $found ) {
            $page_ids[ $slug ] = $found[0]->ID;
        } else {
            $page_ids[ $slug ] = wp_insert_post( [
                'post_title'  => $title,
                'post_name'   => $slug,
                'post_status' => 'publish',
                'post_type'   => 'page',
            ] );
        }
    }

    /* 2. Réglages lecture : page d'accueil statique = Home */
    update_option( 'show_on_front', 'page' );
    update_option( 'page_on_front', $page_ids['home'] );

    /* 3. Créer le menu de navigation (ou récupérer l'existant) */
    $menu_name = 'Navigation principale';
    $existing  = get_term_by( 'name', $menu_name, 'nav_menu' );
    $menu_id   = $existing ? $existing->term_id : wp_create_nav_menu( $menu_name );

    if ( ! is_wp_error( $menu_id ) ) {
        /* Ajouter Work, About, Contact uniquement si le menu est vide */
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

        /* 4. Assigner le menu à l'emplacement "primary" */
        $locations            = get_theme_mod( 'nav_menu_locations', [] );
        $locations['primary'] = $menu_id;
        set_theme_mod( 'nav_menu_locations', $locations );
    }
}
add_action( 'after_switch_theme', 'thibautparpex_activate' );
