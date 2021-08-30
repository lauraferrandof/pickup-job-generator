import { EVENTS, STATES } from './constants';

function handleItemChangeEvent(state, event) {
	const { name, value } = event.payload;

	return {
		...state,
		form: {
			...state.form,
			[name]: {
				...state.form[name],
				value
			}
		},
		status: STATES.idle
	};
}

function formReducer(state, event) {
	switch (state.status) {
		case STATES.map_loading:
			if (event.type === EVENTS.MAP_LOAD_RESOLVE) {
				return {
					...state,
					googleMap: event.payload,
					status: STATES.idle
				};
			}

			if (event.type === EVENTS.MAP_LOAD_REJECT) {
				return {
					...state,
					status: STATES.map_load_error
				};
			}
			break;

		case STATES.idle:
			if (event.type === EVENTS.EDIT) {
				return handleItemChangeEvent(state, event);
			}

			if (event.type === EVENTS.GEOCODE) {
				return {
					...state,
					status: STATES.geocoding
				};
			}
			break;

		case STATES.geocoding:
			if (event.type === EVENTS.EDIT) {
				return handleItemChangeEvent(state, event);
			}

			if (event.type === EVENTS.GEOCODE_RESOLVE) {
				return {
					...state,
					status: STATES.geocode_success
				};
			}

			if (event.type === EVENTS.GEOCODE_REJECT) {
				const { errorIcon, name } = event.payload;

				return {
					...state,
					form: {
						...state.form,
						[name]: {
							...state.form[name],
							icon: errorIcon,
							isValid: false,
							mapMarker: null
						}
					},
					status: STATES.geocode_error
				};
			}

			if (event.type === EVENTS.CLEAR_FIELD) {
				const { blankIcon, name } = event.payload;

				return {
					...state,
					form: {
						...state.form,
						[name]: {
							...state.form[name],
							icon: blankIcon,
							isValid: false,
							mapMarker: null
						}
					},
					status: STATES.idle
				};
			}
			break;

		case STATES.geocode_success:
			if (event.type === EVENTS.MAP_CREATE_MARKER) {
				return {
					...state,
					status: STATES.map_creating_marker
				};
			}
			break;

		case STATES.geocode_error:
			if (event.type === EVENTS.EDIT) {
				return handleItemChangeEvent(state, event);
			}
			break;

		case STATES.map_creating_marker:
			if (event.type === EVENTS.EDIT) {
				return handleItemChangeEvent(state, event);
			}

			if (event.type === EVENTS.MAP_CREATE_MARKER_RESOLVE) {
				const { name, mapMarker, successIcon } = event.payload;

				return {
					...state,
					form: {
						...state.form,
						[name]: {
							...state.form[name],
							icon: successIcon,
							isValid: true,
							mapMarker
						}
					},
					status: STATES.map_create_marker_success
				};
			}

			if (event.type === EVENTS.MAP_CREATE_MARKER_REJECT) {
				return {
					...state,
					status: STATES.map_create_marker_error
				};
			}
			break;

		case STATES.map_create_marker_success:
			if (event.type === EVENTS.EDIT) {
				return handleItemChangeEvent(state, event);
			}
			break;

		case STATES.map_create_marker_error:
			if (event.type === EVENTS.EDIT) {
				return handleItemChangeEvent(state, event);
			}
			break;

		default:
			return state;
	}
	return state;
}

export default formReducer;
