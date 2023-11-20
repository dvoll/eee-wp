import { InspectorControls, MediaUpload, useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { Template } from '@wordpress/blocks';
import { Button, Disabled, FocalPointPicker, PanelBody } from '@wordpress/components';
import React, { useCallback, useEffect, useRef } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

export interface BlockAttributes {
    mediaId?: number;
    mediaSrc?: string;
    mediaMime?: string;
    mediaPoster?: string;
    focalPointValueX: number;
    focalPointValueY: number;
    style: any;
}

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @param {{attributes: BlockAttributes, setAttributes: (param: any) => void, isSelected: boolean, style: object}} root0
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 */
const Edit = ({
    attributes,
    setAttributes,
    isSelected,
    className,
}: {
    attributes: BlockAttributes;
    setAttributes: (param: any) => void;
    isSelected: boolean;
    className: string;
}): JSX.Element => {
    // Attributes
    const { mediaId, mediaSrc, mediaMime, mediaPoster, focalPointValueX, focalPointValueY, style }: BlockAttributes =
        attributes;

    const BLOCKS_TEMPLATE = [
        [
            'core/heading',
            {
                level: 1,
                placeholder: 'Titel der Seite',
            },
        ] as Template,
        [
            'core/paragraph',
            {
                placeholder: 'Untertitel',
                style: {
                    typography: {
                        fontSize: 'var(--wp--preset--font-size--small)',
                        lineHeight: 1.2,
                    },
                },
            },
        ] as Template,
    ];

    const onFocalPointChange = useCallback(
        (value: { x: number; y: number }) => {
            setAttributes({ focalPointValueX: value.x ?? 0.5, focalPointValueY: value.y ?? 0.5 });
        },
        [setAttributes]
    );

    const mediaPosition = ({ x, y } = { x: 0.5, y: 0.5 }) => {
        return `${Math.round(x * 100)}% ${Math.round(y * 100)}%`;
    };

    const blockProps = useBlockProps({
        style: { background: 'transparent' },
        className: className + ' alignfull',
    });

    const innerBlockProps = useInnerBlocksProps(
        {
            className: 'wp-block-eee23-blocks-stage-homepage__content',
        },
        {
            template: BLOCKS_TEMPLATE,
        }
    );

    const videoPlayerRef = useRef<HTMLVideoElement>() as React.MutableRefObject<HTMLVideoElement | null>;

    useEffect(() => {
        // Placeholder may be rendered.
        if (videoPlayerRef.current) {
            videoPlayerRef.current.load();
        }
    }, [mediaPoster]);

    return (
        <>
            <InspectorControls>
                <PanelBody title="Bild/Video-Einstellungen">
                    {mediaPoster || (mediaMime === 'image' && mediaSrc) ? (
                        <FocalPointPicker
                            url={mediaMime === 'image' ? mediaSrc! : mediaPoster!}
                            onChange={onFocalPointChange}
                            value={{
                                x: focalPointValueX ?? 0.5,
                                y: focalPointValueY ?? 0.5,
                            }}
                        />
                    ) : null}
                    <MediaUpload
                        onSelect={(media) => {
                            if (!media || !media.url) {
                                // In this case there was an error previous attributes should be removed because they may be temporary blob urls.
                                setAttributes({
                                    mediaMime: undefined,
                                    mediaSrc: undefined,
                                    mediaId: undefined,
                                    mediaPoster: undefined,
                                    focalPointValueX: undefined,
                                    focalPointValueY: undefined,
                                });
                                return;
                            }

                            if (media.mime === 'video/mp4') {
                                setAttributes({
                                    mediaMime: 'video/mp4',
                                    mediaSrc: media.url,
                                    mediaId: media.id,
                                    mediaPoster: media.image?.src !== media.icon ? media.image?.src : undefined,
                                    focalPointValueX: undefined,
                                    focalPointValueY: undefined,
                                });
                                return;
                            }
                            setAttributes({
                                mediaMime: 'image',
                                mediaSrc: media.sizes.large?.url ?? media.url,
                                mediaId: media.id,
                                mediaPoster: undefined,
                                focalPointValueX: undefined,
                                focalPointValueY: undefined,
                            });
                        }}
                        allowedTypes={['video/mp4', 'image']}
                        value={mediaId}
                        render={({ open }) => (
                            <Button variant="primary" onClick={open}>
                                {!mediaId ? 'Bild/Video auswählen' : 'Bild/Video ändern'}
                            </Button>
                        )}
                    />
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                <div {...innerBlockProps}></div>
                <div
                    className="wp-block-eee23-blocks-stage-homepage__media-container"
                    style={{ ['--stage-background-color' as any]: style.color.background }}
                >
                    {mediaSrc && mediaMime === 'image' && (
                        <img
                            className="wp-block-eee23-blocks-stage-homepage__media"
                            alt=""
                            src={mediaSrc}
                            style={{ objectPosition: mediaPosition({ x: focalPointValueX, y: focalPointValueY }) }}
                        />
                    )}
                    {mediaSrc && mediaMime === 'video/mp4' && (
                        <Disabled>
                            <video
                                className="wp-block-eee23-blocks-stage-homepage__media"
                                src={mediaSrc}
                                style={{ objectPosition: mediaPosition({ x: focalPointValueX, y: focalPointValueY }) }}
                                poster={mediaPoster}
                                ref={videoPlayerRef}
                            />
                        </Disabled>
                    )}
                </div>
            </div>
        </>
    );
};
export default Edit;
