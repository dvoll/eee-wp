/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
    BlockControls,
    BlockVerticalAlignmentToolbar,
    InnerBlocks,
    InspectorControls,
    store,
    useBlockProps,
    useInnerBlocksProps,
} from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';
import { useSelect } from '@wordpress/data';
import { PanelBody, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { useCallback } from 'react';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes, clientId }: any) {
    const hasChildBlocks = useSelect(
        (select) => {
            const { getBlockOrder } = select(store);
            return getBlockOrder(clientId).length > 0;
        },
        [clientId]
    );

    const { startCol, colSpan, startColTablet, colSpanTablet, startColDesktop, colSpanDesktop, verticalAlignment } =
        attributes;

    const blockProps = useBlockProps({
        className: verticalAlignment ? `is-vertically-aligned-${verticalAlignment}` : '',
    });

    const innerBlocksProps = useInnerBlocksProps(
        { ...blockProps },
        {
            renderAppender: hasChildBlocks ? undefined : InnerBlocks.ButtonBlockAppender,
        }
    );

    const startColDesktopHandler = useCallback(
        (value: string | undefined) => {
            setAttributes({ startColDesktop: parseInt(value ?? '1', 10) });
        },
        [setAttributes]
    );

    const colSpanDesktopHandler = useCallback(
        (value: string | undefined) => {
            setAttributes({ colSpanDesktop: parseInt(value ?? '1', 10) });
        },
        [setAttributes]
    );

    const startColTabletHandler = useCallback(
        (value: string | undefined) => {
            setAttributes({ startColTablet: parseInt(value ?? '1', 10) });
        },
        [setAttributes]
    );

    const colSpanTabletHandler = useCallback(
        (value: string | undefined) => {
            setAttributes({ colSpanTablet: parseInt(value ?? '1', 10) });
        },
        [setAttributes]
    );

    const startColHandler = useCallback(
        (value: string | undefined) => {
            setAttributes({ startCol: parseInt(value ?? '1', 10) });
        },
        [setAttributes]
    );

    const colSpanHandler = useCallback(
        (value: string | undefined) => {
            setAttributes({ colSpan: parseInt(value ?? '1', 10) });
        },
        [setAttributes]
    );

    const updateAlignment = (value: string | undefined) => {
        // Update own alignment.
        setAttributes({ verticalAlignment: value });
    };

    return (
        <>
            <BlockControls>
                <BlockVerticalAlignmentToolbar
                    onChange={updateAlignment}
                    value={verticalAlignment}
                    controls={['top', 'center', 'bottom', 'stretch']}
                />
            </BlockControls>
            <InspectorControls>
                <PanelBody title={'Desktop'}>
                    <NumberControl
                        label="Start Spalte"
                        isShiftStepEnabled={true}
                        onChange={startColDesktopHandler}
                        shiftStep={10}
                        value={startColDesktop}
                        min={1}
                        max={12}
                        required={true}
                    />
                    <NumberControl
                        label="Spaltenbreite"
                        isShiftStepEnabled={true}
                        onChange={colSpanDesktopHandler}
                        shiftStep={10}
                        value={colSpanDesktop}
                        min={1}
                        max={12}
                        required={true}
                    />
                </PanelBody>
                <PanelBody title={'Tablet'}>
                    <NumberControl
                        label="Start Spalte"
                        isShiftStepEnabled={true}
                        onChange={startColTabletHandler}
                        shiftStep={10}
                        value={startColTablet}
                        min={1}
                        max={12}
                        required={true}
                    />
                    <NumberControl
                        label="Spaltenbreite"
                        isShiftStepEnabled={true}
                        onChange={colSpanTabletHandler}
                        shiftStep={10}
                        value={colSpanTablet}
                        min={1}
                        max={12}
                        required={true}
                    />
                </PanelBody>
                <PanelBody title={'Mobil'}>
                    <NumberControl
                        label="Start Spalte"
                        isShiftStepEnabled={true}
                        onChange={startColHandler}
                        shiftStep={10}
                        value={startCol}
                        min={1}
                        max={4}
                        required={true}
                    />
                    <NumberControl
                        label="Spaltenbreite"
                        isShiftStepEnabled={true}
                        onChange={colSpanHandler}
                        shiftStep={10}
                        value={colSpan}
                        min={1}
                        max={4}
                        required={true}
                    />
                </PanelBody>
            </InspectorControls>
            <div
                {...innerBlocksProps}
                style={{
                    ['--start-col-mobile' as any]: startCol ?? 1,
                    ['--col-span-mobile' as any]: colSpan ?? 1,
                    ['--start-col-tablet' as any]: startColTablet ?? 1,
                    ['--col-span-tablet' as any]: colSpanTablet ?? 1,
                    ['--start-col-desktop' as any]: startColDesktop ?? 1,
                    ['--col-span-desktop' as any]: colSpanDesktop ?? 1,
                }}
            ></div>
        </>
    );
}
