import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @param {{attributes: import('./edit').BlockAttributes}} root0
 * @return {import("@wordpress/element").WPElement} Element to render.
 */
export default function save({ attributes }) {
    const { mediaSrc, mediaMime, mediaPoster, focalPointValueX, focalPointValueY } = attributes;

    const blockProps = useBlockProps.save({
        className: ['alignfull'].join(' '),
    });

    const innerBlockProps = useInnerBlocksProps.save({
        className: 'wp-block-eee23-blocks-stage-homepage__content',
    });

    const mediaPosition = ({ x = 0.5, y = 0.5 }) => {
        return `${Math.round(x * 100)}% ${Math.round(y * 100)}%`;
    };

    return (
        <div {...blockProps}>
            {mediaSrc && (
                <div className="wp-block-eee23-blocks-stage-homepage__media-container">
                    {mediaSrc && mediaMime === 'image' && (
                        <img
                            className="wp-block-eee23-blocks-stage-homepage__media wp-block-eee23-blocks-stage-homepage__image"
                            alt=""
                            src={mediaSrc}
                            style={{ objectPosition: mediaPosition({ x: focalPointValueX, y: focalPointValueY }) }}
                        />
                    )}
                    {mediaSrc && mediaMime === 'video/mp4' && (
                        <video
                            className="wp-block-eee23-blocks-stage-homepage__media wp-block-eee23-blocks-stage-homepage__video"
                            src={mediaSrc}
                            autoPlay
                            muted
                            loop
                            preload="auto"
                            poster={mediaPoster}
                            style={{ objectPosition: mediaPosition({ x: focalPointValueX, y: focalPointValueY }) }}
                        />
                    )}
                </div>
            )}
            <div className="wp-block-eee23-blocks-stage-homepage__content">
                <div {...innerBlockProps}></div>
            </div>
        </div>
    );
}
