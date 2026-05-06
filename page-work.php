<?php
/**
 * Template : page Work
 * Le contenu WP de la page s'affiche en intro optionnelle au-dessus de la grille.
 * La grille liste les articles des catégories event / art / vj avec filtres JS.
 */

get_header();

/* Intro depuis l'éditeur WP (optionnel) */
$work_intro = '';
if ( have_posts() ) {
    the_post();
    $work_intro = get_the_content();
}

/* Requête des articles work */
$cat_slugs = [ 'event', 'art', 'vj' ];
$cat_ids   = [];
foreach ( $cat_slugs as $slug ) {
    $term = get_term_by( 'slug', $slug, 'category' );
    if ( $term ) $cat_ids[] = $term->term_id;
}

$work_query = new WP_Query( [
    'category__in'   => $cat_ids,
    'posts_per_page' => -1,
    'post_status'    => 'publish',
    'orderby'        => 'date',
    'order'          => 'DESC',
] );
?>

<main class="site-main">

    <?php if ( $work_intro ) : ?>
        <div class="entry-content work-intro">
            <?php echo apply_filters( 'the_content', $work_intro ); ?>
        </div>
    <?php endif; ?>

    <div class="work-filters">
        <button class="work-filter-btn is-active" data-filter="all">all</button>
        <button class="work-filter-btn" data-filter="event">event</button>
        <button class="work-filter-btn" data-filter="art">art</button>
        <button class="work-filter-btn" data-filter="vj">vj</button>
    </div>

    <?php if ( $work_query->have_posts() ) : ?>

        <div class="work-grid">
            <?php while ( $work_query->have_posts() ) : $work_query->the_post(); ?>

                <?php
                $post_cats = get_the_category();
                $cat_list  = implode( ' ', array_map( fn( $c ) => esc_attr( $c->slug ), $post_cats ) );
                ?>

                <article class="work-item" data-cats="<?php echo $cat_list; ?>">
                    <a href="<?php the_permalink(); ?>">
                        <div class="work-item-thumb">
                            <?php if ( has_post_thumbnail() ) : ?>
                                <?php the_post_thumbnail( 'medium_large' ); ?>
                            <?php endif; ?>
                        </div>
                        <h2 class="work-item-title"><?php the_title(); ?></h2>
                        <p class="work-item-meta">
                            <?php echo esc_html( implode( ' · ', array_map( fn( $c ) => $c->name, $post_cats ) ) ); ?>
                            &nbsp;—&nbsp;
                            <time datetime="<?php echo get_the_date( 'Y-m-d' ); ?>">
                                <?php echo get_the_date( 'M Y' ); ?>
                            </time>
                        </p>
                    </a>
                </article>

            <?php endwhile; wp_reset_postdata(); ?>
        </div>

    <?php else : ?>
        <p class="work-empty">Aucun projet pour le moment.</p>
    <?php endif; ?>

</main>

<script>
( function () {
    var btns  = document.querySelectorAll( '.work-filter-btn' );
    var items = document.querySelectorAll( '.work-item' );
    btns.forEach( function ( btn ) {
        btn.addEventListener( 'click', function () {
            var filter = this.dataset.filter;
            btns.forEach( function ( b ) { b.classList.remove( 'is-active' ); } );
            this.classList.add( 'is-active' );
            items.forEach( function ( item ) {
                var cats = item.dataset.cats.split( ' ' );
                item.style.display = ( filter === 'all' || cats.indexOf( filter ) !== -1 ) ? '' : 'none';
            } );
        } );
    } );
} )();
</script>

<?php get_footer(); ?>
