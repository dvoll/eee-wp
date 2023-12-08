<?php
/**
 * Title: Kontakt-Teaser
 * Slug: eee23-theme/contact-teaser
 * Categories: featured, contact
 * Block Types: core/template-part/footer
 */
?>
<!-- wp:group {"align":"wide","style":{"border":{"radius":"16px"},"spacing":{"margin":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50"},"padding":{"right":"var:preset|spacing|30","left":"var:preset|spacing|30"}}},"backgroundColor":"white","textColor":"contrast"} -->
<div class="wp-block-group alignwide has-contrast-color has-white-background-color has-text-color has-background"
	style="border-radius:16px;margin-top:var(--wp--preset--spacing--50);margin-bottom:var(--wp--preset--spacing--50);padding-right:var(--wp--preset--spacing--30);padding-left:var(--wp--preset--spacing--30)">
	<!-- wp:spacer {"height":"64px"} -->
	<div style="height:64px" aria-hidden="true" class="wp-block-spacer"></div>
	<!-- /wp:spacer -->

	<!-- wp:paragraph {"align":"center","style":{"typography":{"lineHeight":".9"}},"fontSize":"small","fontFamily":"lato"} -->
	<p class="has-text-align-center has-lato-font-family has-small-font-size" style="line-height:.9">
		<strong>KONTAKTMÖGLICHKEITEN</strong>
	</p>
	<!-- /wp:paragraph -->

	<!-- wp:heading {"textAlign":"center","style":{"typography":{"fontStyle":"normal","fontWeight":"500"},"spacing":{"margin":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30"}}},"fontSize":"xx-large"} -->
	<h2 class="wp-block-heading has-text-align-center has-xx-large-font-size"
		style="margin-top:var(--wp--preset--spacing--30);margin-bottom:var(--wp--preset--spacing--30);font-style:normal;font-weight:500">
		Nehmen Sie Kontakt auf</h2>
	<!-- /wp:heading -->

	<!-- wp:group {"layout":{"type":"constrained","contentSize":"620px"}} -->
	<div class="wp-block-group"><!-- wp:columns -->
		<div class="wp-block-columns"><!-- wp:column {"verticalAlignment":"top"} -->
			<div class="wp-block-column is-vertically-aligned-top"><!-- wp:paragraph -->
				<p>Unser Kontaktformular bietet eine bequeme und sichere Möglichkeit, mich zu erreichen.</p>
				<!-- /wp:paragraph -->

				<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center","orientation":"horizontal"}} -->
				<div class="wp-block-buttons">
					<!-- wp:button {"textColor":"white","style":{"border":{"radius":"16px"},"elements":{"link":{"color":{"text":"var:preset|color|white"}}}}} -->
					<div class="wp-block-button"><a
							class="wp-block-button__link has-white-color has-text-color has-link-color wp-element-button"
							href="https://eee-titkemeyer.de/kontakt/" style="border-radius:16px">Zum Kontaktformular</a>
					</div>
					<!-- /wp:button -->
				</div>
				<!-- /wp:buttons -->
			</div>
			<!-- /wp:column -->

			<!-- wp:column -->
			<div class="wp-block-column">
				<!-- wp:group {"style":{"spacing":{"blockGap":"1rem"}},"layout":{"type":"flex","orientation":"vertical"}} -->
				<div class="wp-block-group"><!-- wp:paragraph -->
					<p>Weitere Kontaktmöglichkeiten:</p>
					<!-- /wp:paragraph -->

					<!-- wp:paragraph {"className":"eee-icon eee-icon-email eee-icon--before"} -->
					<p class="eee-icon eee-icon-email eee-icon--before"><a
							href="mailto:kontakt@eee-titkemeyer.de">kontakt@eee-titkemeyer.de</a></p>
					<!-- /wp:paragraph -->

					<!-- wp:paragraph {"className":"eee-icon eee-icon-deskphone eee-icon--before"} -->
					<p class="eee-icon eee-icon-deskphone eee-icon--before"><a href="tel:057425090629">05742 50 90
							629</a></p>
					<!-- /wp:paragraph -->

					<!-- wp:paragraph {"className":"eee-icon eee-icon-mobilephone eee-icon--before"} -->
					<p class="eee-icon eee-icon-mobilephone eee-icon--before"><a href="tel:017630333641" data-type="tel"
							data-id="tel:017630333641">0176 30 333 641</a></p>
					<!-- /wp:paragraph -->
				</div>
				<!-- /wp:group -->
			</div>
			<!-- /wp:column -->
		</div>
		<!-- /wp:columns -->
	</div>
	<!-- /wp:group -->

	<!-- wp:spacer {"height":"64px"} -->
	<div style="height:64px" aria-hidden="true" class="wp-block-spacer"></div>
	<!-- /wp:spacer -->
</div>
<!-- /wp:group -->
