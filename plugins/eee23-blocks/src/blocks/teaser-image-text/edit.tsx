import {
    BlockControls,
    BlockIcon,
    InnerBlocks,
    InspectorControls,
    MediaUpload,
    useBlockProps,
    __experimentalLinkControl as LinkControl,
    AlignmentToolbar,
} from '@wordpress/block-editor';
import { Template } from '@wordpress/blocks';
import { Button, FocalPointPicker, PanelBody, Popover, RangeControl, ToolbarButton } from '@wordpress/components';
import { link, linkOff } from '@wordpress/icons';
import { useCallback } from 'react';
import { useState, useEffect, useRef } from 'react';
import { ArrowIcon } from './icons';
import { __ } from '@wordpress/i18n';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';
import InputControl from '@wordpress/components/build-types/input-control';

interface CardLinkBlockAttributes {
    imageId?: number;
    imageUrl?: string;
    focalPointValueX: number;
    focalPointValueY: number;
    linkUrl: string;
    linkTarget?: string;
    linkTitle: string;
    linkRel?: string;
}

const NEW_TAB_REL = 'noreferrer noopener';

const edit = ({ attributes, setAttributes, isSelected, style }: any) => {
    const moduleRef = useRef();

    console.log('attributes.style', attributes.style);
    console.log('style', style);

    const {
        imageId,
        imageUrl,
        focalPointValueX,
        focalPointValueY,
        linkUrl,
        linkTarget,
        linkRel,
    }: CardLinkBlockAttributes = attributes;

    const BLOCKS_TEMPLATE = [
        [
            'core/heading',
            {
                level: 3,
                placeholder: 'Überschrift',
                style: {
                    typography: {
                        fontSize: 'var(--wp--preset--font-size--large)',
                        lineHeight: 1.1,
                    },
                    // color: { text: 'var(--wp--preset--color--primary)' },
                },
            },
        ] as Template,
        [
            'core/paragraph',
            {
                placeholder: 'Beschreibung',
                style: {
                    typography: {
                        fontSize: 'var(--wp--preset--font-size--small)',
                        lineHeight: 1.2,
                    },
                },
            },
        ] as Template,
    ];

    const onFocalPointChange = useCallback((value: { x: number; y: number }) => {
        setAttributes({ focalPointValueX: value.x ?? 0.5, focalPointValueY: value.y ?? 0.5 });
    }, []);

    const mediaPosition = ({ x, y } = { x: 0.5, y: 0.5 }) => {
        return `${Math.round(x * 100)}% ${Math.round(y * 100)}%`;
    };

    const [isEditingURL, setIsEditingURL] = useState(false);
    const isURLSet = !!linkUrl;
    const opensInNewTab = linkTarget === '_blank';

    const blockProps = useBlockProps({
        className: isURLSet ? 'eee-has-link' : undefined,
        ref: moduleRef,
        style: style,
    });

    function startEditing(event: { preventDefault: () => void }) {
        event.preventDefault();
        setIsEditingURL(true);
    }

    function unlink() {
        setAttributes({
            linkUrl: undefined,
            linkTarget: undefined,
            // rel: undefined,
        });
        setIsEditingURL(false);
    }

    useEffect(() => {
        if (!isSelected) {
            setIsEditingURL(false);
        }
    }, [isSelected]);

    function onToggleOpenInNewTab(value: any) {
        const newLinkTarget = value ? '_blank' : undefined;

        let updatedRel = linkRel;
        if (newLinkTarget && !linkRel) {
            updatedRel = NEW_TAB_REL;
        } else if (!newLinkTarget && linkRel === NEW_TAB_REL) {
            updatedRel = undefined;
        }

        setAttributes({
            linkTarget: newLinkTarget,
            linkRel: updatedRel,
        });
    }

    return (
        <>
            <InspectorControls>
                <PanelBody title="Bild-Einstellungen">
                    {imageUrl && (
                        <FocalPointPicker
                            url={imageUrl}
                            onChange={onFocalPointChange}
                            value={{
                                x: focalPointValueX ?? 0.5,
                                y: focalPointValueY ?? 0.5,
                            }}
                        />
                    )}
                    <MediaUpload
                        onSelect={(img) => {
                            const url = img.sizes.large?.url ?? img.url;

                            setAttributes({
                                imageId: img.id,
                                imageUrl: url,
                            });
                        }}
                        allowedTypes={['image']}
                        value={imageId}
                        render={({ open }) => (
                            <Button isDefault onClick={open}>
                                {!imageId ? 'Bild auswählen' : 'Bild ändern'}
                            </Button>
                        )}
                    />
                </PanelBody>
            </InspectorControls>
            {/* <BlockControls>
                <AlignmentToolbar value={'wide'} onChange={() => console.log('LOG')} />
            </BlockControls> */}
            <BlockControls group="block">
                {!isURLSet && (
                    <ToolbarButton
                        name="link"
                        icon={<BlockIcon icon={link} />}
                        title={__('Link')}
                        // shortcut={ displayShortcut.primary( 'k' ) }
                        onClick={startEditing}
                    />
                )}
                {isURLSet && (
                    <ToolbarButton
                        name="link"
                        icon={<BlockIcon icon={linkOff} />}
                        title={__('Unlink')}
                        // shortcut={ displayShortcut.primaryShift( 'k' ) }
                        onClick={unlink}
                        isActive={true}
                    />
                )}
            </BlockControls>
            {isSelected && (isEditingURL || isURLSet) && (
                <Popover
                    position="bottom center"
                    onClose={() => {
                        setIsEditingURL(false);
                        // richTextRef.current?.focus();
                    }}
                    anchorRef={moduleRef.current}
                    focusOnMount={isEditingURL ? 'firstElement' : false}
                    // __unstableSlotName={ '__unstable-block-tools-after' }
                >
                    <LinkControl
                        className="wp-block-navigation-link__inline-link-input"
                        value={{ url: linkUrl, opensInNewTab }}
                        onChange={({ url: newURL = '', opensInNewTab: newOpensInNewTab }: any) => {
                            console.log('newUrl', newURL);
                            setAttributes({ linkUrl: newURL });

                            if (opensInNewTab !== newOpensInNewTab) {
                                onToggleOpenInNewTab(newOpensInNewTab);
                            }
                        }}
                        onRemove={() => {
                            unlink();
                            // richTextRef.current?.focus();
                        }}
                        forceIsEditingLink={isEditingURL}
                    />
                </Popover>
            )}
            <div {...blockProps}>
                <div className="wp-block-eee23-blocks-teaser-image-text__image-container">
                    {imageUrl && (
                        <img
                            className="wp-block-eee23-blocks-teaser-image-text__image"
                            alt=""
                            src={imageUrl}
                            style={{ objectPosition: mediaPosition({ x: focalPointValueX, y: focalPointValueY }) }}
                        />
                    )}
                </div>
                <div className="wp-block-eee23-blocks-teaser-image-text__content">
                    <div className="wp-block-eee23-blocks-teaser-image-text__inner-blocks-wrapper">
                        <InnerBlocks template={BLOCKS_TEMPLATE} />
                    </div>
                    {linkUrl && (
                        <a className="wp-block-eee23-blocks-teaser-image-text__link" aria-label="Seite aufrufen">
                            <ArrowIcon />
                        </a>
                    )}
                </div>
            </div>
        </>
    );
};
export default edit;
