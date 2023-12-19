import {
    BlockControls,
    BlockIcon,
    InnerBlocks,
    InspectorControls,
    MediaUpload,
    useBlockProps,
    __experimentalLinkControl as LinkControl,
} from '@wordpress/block-editor';
import { Template } from '@wordpress/blocks';
import {
    BaseControl,
    Button,
    ExternalLink,
    FocalPointPicker,
    PanelBody,
    Popover,
    TextareaControl,
    ToolbarButton,
} from '@wordpress/components';
import { link, linkOff } from '@wordpress/icons';
import { useCallback, useState, useEffect, useRef } from 'react';
import { ArrowIcon } from './icons';
import { __ } from '@wordpress/i18n';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

export interface BlockAttributes {
    imageId?: number;
    imageUrl?: string;
    alt?: string;
    focalPointValueX: number;
    focalPointValueY: number;
    linkUrl: string;
    linkTarget?: string;
    linkTitle: string;
    linkRel?: string;
}

const NEW_TAB_REL = 'noreferrer noopener';

const Edit = ({ attributes, setAttributes, isSelected }: any) => {
    const moduleRef = useRef<HTMLDivElement>();

    const {
        imageId,
        imageUrl,
        alt,
        focalPointValueX,
        focalPointValueY,
        linkUrl,
        linkTarget,
        linkRel,
    }: BlockAttributes = attributes;

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

    const onFocalPointChange = useCallback(
        (value: { x: number; y: number }) => {
            setAttributes({ focalPointValueX: value.x ?? 0.5, focalPointValueY: value.y ?? 0.5 });
        },
        [setAttributes]
    );

    const onImageSelect = useCallback(
        (
            img: {
                id: number;
            } & {
                [k: string]: any;
            }
        ) => {
            const url = img.sizes.large?.url ?? img.url;

            setAttributes({
                imageId: img.id,
                imageUrl: url,
                alt: img.alt ?? '',
            });
        },
        [setAttributes]
    );

    const onImageAltChange = useCallback(
        (value: string) => {
            setAttributes({ alt: value });
        },
        [setAttributes]
    );

    const mediaPosition = ({ x, y } = { x: 0.5, y: 0.5 }) => {
        return `${Math.round(x * 100)}% ${Math.round(y * 100)}%`;
    };

    const [isEditingURL, setIsEditingURL] = useState(false);
    const isURLSet = !!linkUrl;
    const opensInNewTab = linkTarget === '_blank';

    const blockProps = useBlockProps({
        className: isURLSet ? 'eee-has-link' : undefined,
        ref: moduleRef,
        // style,
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
                    <BaseControl>
                        <MediaUpload
                            onSelect={onImageSelect}
                            allowedTypes={['image']}
                            value={imageId}
                            render={({ open }) => (
                                <Button variant="primary" onClick={open}>
                                    {!imageId ? 'Bild auswählen' : 'Bild ändern'}
                                </Button>
                            )}
                        />
                    </BaseControl>
                    <TextareaControl
                        label={__('Alternative text')}
                        value={alt ?? ''}
                        onChange={onImageAltChange}
                        help={
                            <>
                                <ExternalLink href="https://www.w3.org/WAI/tutorials/images/decision-tree">
                                    {__('Describe the purpose of the image.')}
                                </ExternalLink>
                                <br />
                                {__('Leave empty if decorative.')}
                            </>
                        }
                        __nextHasNoMarginBottom
                    />
                </PanelBody>
            </InspectorControls>
            <BlockControls group="block">
                {!isURLSet && (
                    <ToolbarButton
                        label="Verlinkung"
                        icon={<BlockIcon icon={link} />}
                        title={__('Link')}
                        // shortcut={ displayShortcut.primary( 'k' ) }
                        onClick={startEditing}
                    />
                )}
                {isURLSet && (
                    <ToolbarButton
                        label="Verlinkung"
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
                        moduleRef.current?.focus();
                    }}
                    anchor={moduleRef.current}
                    focusOnMount={isEditingURL ? 'firstElement' : false}
                >
                    <LinkControl
                        className="wp-block-navigation-link__inline-link-input"
                        value={{ url: linkUrl, opensInNewTab }}
                        onChange={({ url: newURL = '', opensInNewTab: newOpensInNewTab }: any) => {
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
                        // eslint-disable-next-line jsx-a11y/anchor-is-valid
                        <a
                            className="wp-block-eee23-blocks-teaser-image-text__link"
                            aria-label="Seite aufrufen"
                            target={linkTarget}
                        >
                            <ArrowIcon />
                        </a>
                    )}
                </div>
            </div>
        </>
    );
};
export default Edit;
