<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<canvas id="halftone-canvas" data-shape="<?php echo esc_attr( $GLOBALS['halftone_shape'] ?? 'circle' ); ?>" aria-hidden="true"></canvas>

<div class="site-wrapper">

    <header class="site-header">
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="site-title">thibaut.parpex</a>

        <nav class="site-nav" aria-label="Navigation principale">
            <?php
            wp_nav_menu( [
                'theme_location' => 'primary',
                'container'      => false,
                'items_wrap'     => '<ul>%3$s</ul>',
                'depth'          => 1,
                'fallback_cb'    => 'thibautparpex_fallback_nav',
            ] );
            ?>
        </nav>
    </header>

<?php
function thibautparpex_fallback_nav() {
    echo '<ul>';
    echo '<li><a href="' . esc_url( home_url( '/work' ) )    . '">Work</a></li>';
    echo '<li><a href="' . esc_url( home_url( '/about' ) )   . '">About</a></li>';
    echo '<li><a href="' . esc_url( home_url( '/contact' ) ) . '">Contact</a></li>';
    echo '</ul>';
}
