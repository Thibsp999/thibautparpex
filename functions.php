<?php
if ( ! defined( 'ABSPATH' ) ) exit;

function thibautparpex_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'html5', [ 'search-form', 'comment-form', 'gallery', 'caption' ] );

    register_nav_menus( [
        'primary' => __( 'Navigation principale', 'thibautparpex' ),
    ] );
}
add_action( 'after_setup_theme', 'thibautparpex_setup' );

function thibautparpex_enqueue() {
    $ver = wp_get_theme()->get( 'Version' );

    wp_enqueue_style(
        'playfair-display',
        'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap',
        [],
        null
    );

    wp_enqueue_style(
        'thibautparpex-main',
        get_template_directory_uri() . '/assets/css/main.css',
        [ 'playfair-display' ],
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
