import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { ArrowIcon } from './icons';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @param {{attributes: import('./edit').BlockAttributes}} root0
 * @return {import("@wordpress/element").WPElement} Element to render
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 */
export default function save({ attributes }) {
    const { linkUrl, linkTarget, imageUrl, alt, focalPointValueX, focalPointValueY } = attributes;

    const blockProps = useBlockProps.save({
        className: ['eee23-blocks-teaser-image-text', linkUrl !== undefined ? 'eee-has-link' : undefined].join(' '),
    });

    const mediaPosition = ({ x = 0.5, y = 0.5 }) => {
        return `${Math.round(x * 100)}% ${Math.round(y * 100)}%`;
    };

    return (
        <div {...blockProps}>
            {imageUrl && (
                <div className="wp-block-eee23-blocks-teaser-image-text__image-container">
                    <img
                        className="wp-block-eee23-blocks-teaser-image-text__image"
                        alt={alt ?? ''}
                        src={imageUrl}
                        style={{ objectPosition: mediaPosition({ x: focalPointValueX, y: focalPointValueY }) }}
                    />
                </div>
            )}
            <div className="wp-block-eee23-blocks-teaser-image-text__content">
                <div className="wp-block-eee23-blocks-teaser-image-text__inner-blocks-wrapper">
                    <InnerBlocks.Content />
                </div>
                {linkUrl && (
                    <a
                        className="wp-block-eee23-blocks-teaser-image-text__link"
                        aria-label="Seite aufrufen"
                        target={linkTarget}
                        rel={linkTarget ? 'noopener' : undefined}
                        href={linkUrl}
                    >
                        <ArrowIcon />
                    </a>
                )}
            </div>
            {linkUrl && (
                // eslint-disable-next-line jsx-a11y/anchor-has-content
                <a
                    className="wp-block-eee23-blocks-teaser-image-text__linkclickarea"
                    aria-hidden="true"
                    tabIndex={-1}
                    target={linkTarget}
                    rel={linkTarget ? 'noopener' : undefined}
                    href={linkUrl}
                ></a>
            )}
        </div>
    );
}
