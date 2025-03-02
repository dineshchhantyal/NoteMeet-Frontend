import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MeetingInterface } from '@/types';
import { MeetingStatus } from '@/types/meeting';

interface MeetingsState {
	meetings: MeetingInterface[];
	selectedMeeting: MeetingInterface | null;
	loading: boolean;
	error: string | null;
}

const initialState: MeetingsState = {
	meetings: [],
	selectedMeeting: null,
	loading: false,
	error: null,
};

// Async thunks for API calls
export const fetchMeetings = createAsyncThunk(
	'meetings/fetchMeetings',
	async (_, { rejectWithValue }) => {
		try {
			const response = await fetch('/api/meetings');
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to fetch meetings');
			}

			return data.data;
		} catch (error) {
			return rejectWithValue(
				error instanceof Error ? error.message : 'Failed to fetch meetings',
			);
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

export const deleteMeeting = createAsyncThunk(
	'meetings/deleteMeeting',
	async (id: string, { rejectWithValue }) => {
		try {
			const response = await fetch(`/api/meetings/${id}`, {
				method: 'DELETE',
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to delete meeting');
			}

			return id;
		} catch (error) {
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

		// Delete meeting
		builder.addCase(
			deleteMeeting.fulfilled,
			(state, action: PayloadAction<string>) => {
				state.meetings = state.meetings.filter(
					(meeting) => meeting.id !== action.payload,
				);

				if (state.selectedMeeting?.id === action.payload) {
					state.selectedMeeting = null;
				}
			},
		);
	},
});

export const { selectMeeting, clearSelectedMeeting, setMeetings } =
	meetingsSlice.actions;
export default meetingsSlice.reducer;
