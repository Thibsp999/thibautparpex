<?php get_header(); ?>

<main class="site-main">
    <?php if ( have_posts() ) : the_post(); ?>
        <article id="page-<?php the_ID(); ?>" <?php post_class( 'entry' ); ?>>
            <h1 class="entry-title page-title"><?php the_title(); ?></h1>
            <div class="entry-content">
                <?php the_content(); ?>
            </div>
        </article>
    <?php endif; ?>
</main>

<?php get_footer(); ?>
