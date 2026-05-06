<?php get_header(); ?>

<main class="site-main site-main--home">
    <?php if ( have_posts() ) : the_post(); ?>
        <div class="entry-content">
            <?php the_content(); ?>
        </div>
    <?php endif; ?>
</main>

<?php get_footer(); ?>
