<?php
/**
 * Template : page About
 * Colonne gauche : photo (image à la une de la page, sinon placeholder)
 * Colonne droite : contenu de la page (éditable dans WP admin)
 */

get_header();
the_post();
?>

<main class="site-main">
    <div class="about-layout">

        <!-- Photo -->
        <div class="about-photo-wrap">
            <?php if ( has_post_thumbnail() ) : ?>
                <?php the_post_thumbnail( 'large' ); ?>
            <?php else : ?>
                <div class="about-photo-placeholder">photo</div>
            <?php endif; ?>
        </div>

        <!-- Texte -->
        <div class="about-text">
            <?php
            $content = get_the_content();
            if ( $content ) :
                the_content();
            else :
            ?>
                <p>
                    Thibaut Parpex est un artiste visuel et VJ basé en France.
                    Son travail explore les intersections entre image en mouvement,
                    performance live et environnements sonores.
                </p>
                <p>
                    À travers des projets d'art numérique, des installations et
                    des performances scéniques, il développe un langage visuel
                    organique où la technologie devient matière sensible.
                </p>
                <p>
                    — Texte à remplacer dans WordPress › Pages › About
                </p>
            <?php endif; ?>
        </div>

    </div>
</main>

<?php get_footer(); ?>
