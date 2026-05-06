<?php
/**
 * Template : page Contact
 * Entièrement géré depuis l'éditeur WordPress.
 * Utiliser un bloc de formulaire (ex. Contact Form 7) pour le form de contact.
 */

get_header();
?>

<main class="site-main">
    <?php if ( have_posts() ) : the_post(); ?>
        <h1 class="page-title"><?php the_title(); ?></h1>
        <div class="entry-content">
            <?php the_content(); ?>
        </div>
    <?php endif; ?>
</main>

<?php get_footer(); ?>
