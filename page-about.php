<?php
/**
 * Template : page About
 * Entièrement géré depuis l'éditeur WordPress.
 * Utiliser le bloc "Médias et texte" ou "Colonnes" pour photo + bio.
 */

<?php $GLOBALS['halftone_shape'] = 'square'; ?>
<?php get_header(); ?>
?>

<main class="site-main">
    <?php if ( have_posts() ) : the_post(); ?>
        <div class="entry-content">
            <?php the_content(); ?>
        </div>
    <?php endif; ?>
</main>

<?php get_footer(); ?>
