import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MeetingInterface } from '@/types';

interface MeetingsState {
	meetings: MeetingInterface[];
	sharedMeetings: MeetingInterface[];
	allMeetings: MeetingInterface[];
	selectedMeeting: MeetingInterface | null;
	loading: boolean;
	error: string | null;
	pendingDeletes: Record<string, MeetingInterface>; // Store meetings being deleted
	searchTerm: string; // Add searchTerm to state
}

// Add this interface near the top of your file with the other interfaces
interface SharedMeetingResponse {
	meeting: MeetingInterface;
	sharedBy: {
		name?: string;
		email?: string;
	};
	permission: string;
	id: string;
}

const initialState: MeetingsState = {
	meetings: [],
	sharedMeetings: [],
	allMeetings: [],
	selectedMeeting: null,
	loading: false,
	error: null,
	pendingDeletes: {},
	searchTerm: '', // Initialize as empty string
};

// Async thunks for API calls
export const fetchMeetings = createAsyncThunk(
	'meetings/fetchMeetings',
	async (_, { dispatch, rejectWithValue }) => {
		try {
			const response = await fetch('/api/meetings');
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to fetch meetings');
			}

			dispatch(fetchSharedMeetings());

			return data.data;
		} catch (error) {
			return rejectWithValue(
				error instanceof Error ? error.message : 'Failed to fetch meetings',
			);
		}
	},
);

export const fetchSharedMeetings = createAsyncThunk(
	'meetings/fetchSharedMeetings',
	async () => {
		try {
			const response = await fetch('/api/shares/me');
			const data = await response.json();
			return data.data || [];
		} catch (error) {
			console.error('Failed to fetch shared meetings:', error);
			return []; // Fail silently to maintain compatibility
		}
	},
);

export const createMeeting = createAsyncThunk(
	'meetings/createMeeting',
	async (meeting: Partial<MeetingInterface>, { rejectWithValue }) => {
		try {
			const response = await fetch('/api/meetings', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(meeting),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to create meeting');
			}

			return data.data;
		} catch (error) {
			return rejectWithValue(
				error instanceof Error ? error.message : 'Failed to create meeting',
			);
		}
	},
);

export const updateMeeting = createAsyncThunk(
	'meetings/updateMeeting',
	async (
		{ id, updates }: { id: string; updates: Partial<MeetingInterface> },
		{ rejectWithValue },
	) => {
		try {
			const response = await fetch(`/api/meetings/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updates),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to update meeting');
			}

			return data.data;
		} catch (error) {
			return rejectWithValue(
				error instanceof Error ? error.message : 'Failed to update meeting',
			);
		}
	},
);

// Updated delete meeting thunk with optimistic updates
export const deleteMeeting = createAsyncThunk(
	'meetings/deleteMeeting',
	async (id: string, { dispatch, rejectWithValue, getState }) => {
		// Get the meeting before deletion for potential recovery
		const state = getState() as { meetings: MeetingsState };
		const meetingToDelete = state.meetings.meetings.find((m) => m.id === id);

		if (!meetingToDelete) {
			return rejectWithValue('Meeting not found');
		}

		// Optimistically remove the meeting from UI
		dispatch(meetingsSlice.actions.optimisticDeleteMeeting(id));

		try {
			const response = await fetch(`/api/meetings/${id}`, {
				method: 'DELETE',
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to delete meeting');
			}

			// Success case - we've already removed from UI, so just return the ID
			return id;
		} catch (error) {
			// If deletion fails, restore the meeting by undoing the optimistic update
			dispatch(meetingsSlice.actions.undoDeleteMeeting(meetingToDelete));

			return rejectWithValue(
				error instanceof Error ? error.message : 'Failed to delete meeting',
			);
		}
	},
);

const meetingsSlice = createSlice({
	name: 'meetings',
	initialState,
	reducers: {
		selectMeeting: (state, action: PayloadAction<MeetingInterface | null>) => {
			state.selectedMeeting = action.payload;
		},
		clearSelectedMeeting: (state) => {
			state.selectedMeeting = null;
		},
		setMeetings: (state, action: PayloadAction<MeetingInterface[]>) => {
			state.meetings = action.payload;
		},

		// Add search term reducer
		setSearchTerm: (state, action: PayloadAction<string>) => {
			state.searchTerm = action.payload;
		},

		// New reducers for optimistic updates
		optimisticDeleteMeeting: (state, action: PayloadAction<string>) => {
			const id = action.payload;
			const meetingToDelete = state.meetings.find((m) => m.id === id);

			// Store the meeting in case we need to restore it later
			if (meetingToDelete) {
				state.pendingDeletes[id] = meetingToDelete;
			}

			// Remove from the meetings list
			state.meetings = state.meetings.filter((meeting) => meeting.id !== id);

			// If it was selected, deselect it
			if (state.selectedMeeting?.id === id) {
				state.selectedMeeting = null;
			}
		},

		undoDeleteMeeting: (state, action: PayloadAction<MeetingInterface>) => {
			const meeting = action.payload;

			// Restore the meeting to the list
			state.meetings.push(meeting);

			// Sort to maintain order
			state.meetings.sort(
				(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
			);

			// Remove from pending deletes
			delete state.pendingDeletes[meeting.id];
		},
	},
	extraReducers: (builder) => {
		// Fetch meetings
		builder.addCase(fetchMeetings.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(
			fetchMeetings.fulfilled,
			(state, action: PayloadAction<MeetingInterface[]>) => {
				state.meetings = action.payload;
				state.loading = false;
				state.allMeetings = [...state.meetings, ...state.sharedMeetings];
			},
		);
		builder.addCase(fetchMeetings.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload as string;
		});

		// Create meeting
		builder.addCase(
			createMeeting.fulfilled,
			(state, action: PayloadAction<MeetingInterface>) => {
				state.meetings = [action.payload, ...state.meetings];
				state.selectedMeeting = action.payload;
			},
		);

		// Update meeting
		builder.addCase(
			updateMeeting.fulfilled,
			(state, action: PayloadAction<MeetingInterface>) => {
				state.meetings = state.meetings.map((meeting) =>
					meeting.id === action.payload.id ? action.payload : meeting,
				);

				if (state.selectedMeeting?.id === action.payload.id) {
					state.selectedMeeting = action.payload;
				}
			},
		);

		// Modify delete meeting cases for optimistic updates
		builder.addCase(deleteMeeting.pending, (state) => {
			// We've already handled this in the optimisticDeleteMeeting reducer
			state.loading = true;
		});

		builder.addCase(
			deleteMeeting.fulfilled,
			(state, action: PayloadAction<string>) => {
				// The meeting is already removed, just clean up the pending state
				const id = action.payload;
				delete state.pendingDeletes[id];
			},
		);

		builder.addCase(deleteMeeting.rejected, (state) => {
			// The undoDeleteMeeting action is dispatched in the thunk itself
			// So we just need to update the loading state
			state.loading = false;
		});

		// Then update the builder.addCase function to use this type
		builder.addCase(fetchSharedMeetings.fulfilled, (state, action) => {
			state.sharedMeetings = action.payload.map(
				(share: SharedMeetingResponse) => ({
					...share.meeting,
					isShared: true,
					sharedBy: share.sharedBy?.name || share.sharedBy?.email,
					sharePermission: share.permission,
					shareId: share.id,
				}),
			);
			state.allMeetings = [...state.meetings, ...state.sharedMeetings];
		});
	},
});

export const {
	selectMeeting,
	clearSelectedMeeting,
	setMeetings,
	optimisticDeleteMeeting,
	undoDeleteMeeting,
	setSearchTerm, // Export the new action
} = meetingsSlice.actions;

export default meetingsSlice.reducer;
