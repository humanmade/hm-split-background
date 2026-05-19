import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	RangeControl,
	ColorPalette,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';

const DEFAULTS = {
	startColor: '#ffffff',
	endColor: '#000000',
	position: 50,
};

/**
 * Build a hard-edge linear-gradient CSS value (both stops at the same position).
 */
const buildGradient = ( startColor, endColor, position ) =>
	`linear-gradient(180deg, ${ startColor } ${ position }%, ${ endColor } ${ position }%)`;

/**
 * Parse a hard-edge gradient back into its components.
 * Returns null if the string is not a split gradient produced by this plugin.
 */
const parseGradient = ( gradient ) => {
	if ( ! gradient ) {
		return null;
	}

	const match = gradient.match(
		/^linear-gradient\(\s*180deg\s*,\s*(.+?)\s+([\d.]+)%\s*,\s*(.+?)\s+([\d.]+)%\s*\)$/i
	);

	if ( ! match ) {
		return null;
	}

	const [ , startColor, startPos, endColor, endPos ] = match;

	if ( startPos !== endPos ) {
		return null;
	}

	return {
		startColor,
		endColor,
		position: parseFloat( startPos ),
	};
};

const SplitBackgroundPanel = ( { attributes, setAttributes } ) => {
	const gradient = attributes?.style?.color?.gradient ?? '';
	const parsed = parseGradient( gradient );
	const isEnabled = parsed !== null;

	const colors = useSelect( ( select ) => {
		const settings = select( 'core/block-editor' ).getSettings();
		return settings?.colors ?? [];
	}, [] );

	const setGradient = ( value ) => {
		setAttributes( {
			style: {
				...( attributes.style ?? {} ),
				color: {
					...( attributes.style?.color ?? {} ),
					gradient: value,
				},
			},
			// Clear any named gradient preset when setting a custom value.
			gradient: undefined,
		} );
	};

	const handleToggle = ( enabled ) => {
		if ( enabled ) {
			setGradient(
				buildGradient(
					DEFAULTS.startColor,
					DEFAULTS.endColor,
					DEFAULTS.position
				)
			);
		} else {
			setGradient( undefined );
		}
	};

	const handleStartColor = ( color ) => {
		if ( ! color ) return;
		setGradient(
			buildGradient(
				color,
				parsed?.endColor ?? DEFAULTS.endColor,
				parsed?.position ?? DEFAULTS.position
			)
		);
	};

	const handleEndColor = ( color ) => {
		if ( ! color ) return;
		setGradient(
			buildGradient(
				parsed?.startColor ?? DEFAULTS.startColor,
				color,
				parsed?.position ?? DEFAULTS.position
			)
		);
	};

	const handlePosition = ( value ) => {
		setGradient(
			buildGradient(
				parsed?.startColor ?? DEFAULTS.startColor,
				parsed?.endColor ?? DEFAULTS.endColor,
				value
			)
		);
	};

	return (
		<InspectorControls group="styles">
			<PanelBody
				title="Split Background Color"
				initialOpen={ isEnabled }
			>
				<ToggleControl
					__nextHasNoMarginBottom
					label="Enable split background"
					checked={ isEnabled }
					onChange={ handleToggle }
				/>
				{ isEnabled && (
					<>
						<RangeControl
							__next40pxDefaultSize
							label="Split position"
							value={ parsed?.position ?? DEFAULTS.position }
							onChange={ handlePosition }
							min={ 0 }
							max={ 100 }
							step={ 1 }
						/>
						<div style={ { marginBottom: '1rem' } }>
							<p style={ { marginBottom: '0.5rem', fontWeight: 500 } }>
								Start color (top)
							</p>
							<ColorPalette
								colors={ colors }
								value={ parsed?.startColor }
								onChange={ handleStartColor }
								clearable={ false }
							/>
						</div>
						<div>
							<p style={ { marginBottom: '0.5rem', fontWeight: 500 } }>
								End color (bottom)
							</p>
							<ColorPalette
								colors={ colors }
								value={ parsed?.endColor }
								onChange={ handleEndColor }
								clearable={ false }
							/>
						</div>
					</>
				) }
			</PanelBody>
		</InspectorControls>
	);
};

const withSplitBackground = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if ( props.name !== 'core/group' ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />
				<SplitBackgroundPanel
					attributes={ props.attributes }
					setAttributes={ props.setAttributes }
				/>
			</>
		);
	};
}, 'withSplitBackground' );

addFilter(
	'editor.BlockEdit',
	'hm/group-split-background',
	withSplitBackground
);
