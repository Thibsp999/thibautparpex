<?php get_header(); ?>

<main class="site-main">
    <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class( 'entry' ); ?>>
            <h1 class="entry-title"><?php the_title(); ?></h1>
            <div class="entry-content">
                <?php the_content(); ?>
            </div>
        </article>
    <?php endwhile; else : ?>
        <p class="no-content">Aucun contenu trouvé.</p>
    <?php endif; ?>
</main>

<?php get_footer(); ?>
