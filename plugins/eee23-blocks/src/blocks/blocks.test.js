/* eslint-env jest */
/**
 * Unit tests for custom Gutenberg blocks.
 *
 * Verifies that all custom blocks register properly, serialize valid markup,
 * and do not trigger block invalidation or validation errors.
 */
import { registerBlockType, unregisterBlockType, getBlockType, createBlock, serialize, parse } from '@wordpress/blocks';

import gridMeta from './grid/block.json';
import gridSave from './grid/save';

import gridColMeta from './grid-col/block.json';
import gridColSave from './grid-col/save';

import stageMeta from './stage-homepage/block.json';
import stageSave from './stage-homepage/save';

import teaserMeta from './teaser-image-text/block.json';
import teaserSave from './teaser-image-text/save';

const blocks = [
    {
        meta: gridMeta,
        save: gridSave,
        sampleAttributes: {},
    },
    {
        meta: gridColMeta,
        save: gridColSave,
        sampleAttributes: {
            startCol: 1,
            colSpan: 12,
            startColTablet: 1,
            colSpanTablet: 6,
            startColDesktop: 1,
            colSpanDesktop: 4,
            verticalAlignment: 'center',
        },
    },
    {
        meta: stageMeta,
        save: stageSave,
        sampleAttributes: {
            mediaSrc: 'https://example.com/banner.jpg',
            mediaMime: 'image',
            mediaAlt: 'Hero image',
            focalPointValueX: 0.5,
            focalPointValueY: 0.5,
            style: { color: { background: '#000000' } },
        },
    },
    {
        meta: teaserMeta,
        save: teaserSave,
        sampleAttributes: {
            linkUrl: 'https://example.com',
            imageUrl: 'https://example.com/photo.jpg',
            alt: 'Sample photo',
            focalPointValueX: 0.5,
            focalPointValueY: 0.5,
        },
    },
];

describe('Custom Gutenberg Blocks', () => {
    beforeAll(() => {
        blocks.forEach(({ meta, save }) => {
            if (!getBlockType(meta.name)) {
                registerBlockType(meta.name, {
                    ...meta,
                    save,
                    edit: () => null,
                });
            }
        });
    });

    afterAll(() => {
        blocks.forEach(({ meta }) => {
            if (getBlockType(meta.name)) {
                unregisterBlockType(meta.name);
            }
        });
    });

    test.each(blocks)('$meta.name registers successfully with valid metadata', ({ meta }) => {
        const registered = getBlockType(meta.name);
        expect(registered).toBeDefined();
        expect(registered.name).toBe(meta.name);
        expect(registered.title).toBe(meta.title);
        expect(registered.category).toBe(meta.category);
    });

    test.each(blocks)('$meta.name serializes markup and passes validation without invalidation', ({ meta, sampleAttributes }) => {
        const block = createBlock(meta.name, sampleAttributes);
        expect(block).toBeDefined();

        const serialized = serialize(block);
        expect(typeof serialized).toBe('string');
        expect(serialized).toContain(`<!-- wp:${meta.name}`);

        const parsed = parse(serialized);
        expect(parsed.length).toBe(1);
        expect(parsed[0].name).toBe(meta.name);
        expect(parsed[0].isValid).toBe(true);
    });
});
