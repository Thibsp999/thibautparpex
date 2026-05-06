<?php
/**
 * Template : page Contact
 * Colonne gauche : texte intro (contenu de la page WP, sinon placeholder)
 * Colonne droite : formulaire NOM / MESSAGE → sovideoevent@gmail.com
 */

/* Traitement du formulaire avant get_header() pour éviter les problèmes de headers HTTP */
$form_sent  = false;
$form_error = false;
$form_msg   = '';

if (
    ! empty( $_POST['thibaut_contact_nonce'] )
    && wp_verify_nonce( $_POST['thibaut_contact_nonce'], 'thibaut_contact_action' )
) {
    $name    = sanitize_text_field( $_POST['contact_name']    ?? '' );
    $message = sanitize_textarea_field( $_POST['contact_message'] ?? '' );

    if ( $name && $message ) {
        $sent = wp_mail(
            'sovideoevent@gmail.com',
            'Contact — thibaut.parpex — ' . $name,
            "Nom : {$name}\n\n{$message}",
            [ 'Content-Type: text/plain; charset=UTF-8' ]
        );
        if ( $sent ) {
            $form_sent = true;
        } else {
            $form_error = true;
            $form_msg   = 'Une erreur est survenue. Réessayez ou contactez-moi directement.';
        }
    } else {
        $form_error = true;
        $form_msg   = 'Merci de remplir tous les champs.';
    }
}

get_header();
the_post();
?>

<main class="site-main">
    <div class="contact-layout">

        <!-- Texte intro -->
        <div class="contact-side">
            <?php
            $content = get_the_content();
            if ( $content ) :
                echo wp_kses_post( $content );
            else :
            ?>
                <p>Vous avez un projet, une idée,<br>une collaboration en tête ?</p>
                <p>Je suis disponible pour des performances live,<br>
                   installations visuelles et créations sur-mesure.</p>
                <p>— Texte à personnaliser dans WordPress › Pages › Contact</p>
            <?php endif; ?>
        </div>

        <!-- Formulaire -->
        <div>
            <?php if ( $form_sent ) : ?>
                <p class="contact-notice contact-notice--success">
                    Message envoyé. À bientôt.
                </p>
            <?php else : ?>

                <?php if ( $form_error ) : ?>
                    <p class="contact-notice contact-notice--error">
                        <?php echo esc_html( $form_msg ); ?>
                    </p>
                <?php endif; ?>

                <form class="contact-form" method="post" action="">
                    <?php wp_nonce_field( 'thibaut_contact_action', 'thibaut_contact_nonce' ); ?>

                    <div class="contact-field">
                        <label for="contact_name">Nom</label>
                        <input
                            type="text"
                            id="contact_name"
                            name="contact_name"
                            value="<?php echo esc_attr( $_POST['contact_name'] ?? '' ); ?>"
                            autocomplete="name"
                            required
                        >
                    </div>

                    <div class="contact-field">
                        <label for="contact_message">Message</label>
                        <textarea
                            id="contact_message"
                            name="contact_message"
                            required
                        ><?php echo esc_textarea( $_POST['contact_message'] ?? '' ); ?></textarea>
                    </div>

                    <button type="submit" class="contact-submit">envoyer</button>
                </form>

            <?php endif; ?>
        </div>

    </div>
</main>

<?php get_footer(); ?>
