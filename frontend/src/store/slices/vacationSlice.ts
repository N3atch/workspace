import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { vacationService } from '../../services/vacationService';

export interface Vacation {
  id: number;
  description: string;
  destination: string;
  image: string | null;
  start_date: string;
  end_date: string;
  price: number;
  followers_count: number;
  is_following?: number;
  created_at?: string;
  updated_at?: string;
}

interface VacationState {
  vacations: Vacation[];
  loading: boolean;
  error: string | null;
}

const initialState: VacationState = {
  vacations: [],
  loading: false,
  error: null,
};

export const fetchVacations = createAsyncThunk(
  'vacations/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await vacationService.getAll();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch vacations');
    }
  }
);

export const createVacation = createAsyncThunk(
  'vacations/create',
  async (vacationData: Partial<Vacation>, { rejectWithValue }) => {
    try {
      return await vacationService.create(vacationData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create vacation');
    }
  }
);

export const updateVacation = createAsyncThunk(
  'vacations/update',
  async ({ id, data }: { id: number; data: Partial<Vacation> }, { rejectWithValue }) => {
    try {
      return await vacationService.update(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update vacation');
    }
  }
);

export const deleteVacation = createAsyncThunk(
  'vacations/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await vacationService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete vacation');
    }
  }
);

export const followVacation = createAsyncThunk(
  'vacations/follow',
  async (vacationId: number, { rejectWithValue }) => {
    try {
      await vacationService.follow(vacationId);
      return vacationId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to follow vacation');
    }
  }
);

export const unfollowVacation = createAsyncThunk(
  'vacations/unfollow',
  async (vacationId: number, { rejectWithValue }) => {
    try {
      await vacationService.unfollow(vacationId);
      return vacationId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to unfollow vacation');
    }
  }
);

const vacationSlice = createSlice({
  name: 'vacations',
  initialState,
  reducers: {
    updateVacationInState: (state, action: PayloadAction<Vacation>) => {
      const index = state.vacations.findIndex(v => v.id === action.payload.id);
      if (index !== -1) {
        state.vacations[index] = action.payload;
      }
    },
    removeVacation: (state, action: PayloadAction<number>) => {
      state.vacations = state.vacations.filter(v => v.id !== action.payload);
    },
    addVacation: (state, action: PayloadAction<Vacation>) => {
      state.vacations.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVacations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVacations.fulfilled, (state, action) => {
        state.loading = false;
        state.vacations = action.payload;
      })
      .addCase(fetchVacations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createVacation.fulfilled, (state, action) => {
        state.vacations.push(action.payload);
      })
      .addCase(updateVacation.fulfilled, (state, action) => {
        const index = state.vacations.findIndex(v => v.id === action.payload.id);
        if (index !== -1) {
          state.vacations[index] = action.payload;
        }
      })
      .addCase(deleteVacation.fulfilled, (state, action) => {
        state.vacations = state.vacations.filter(v => v.id !== action.payload);
      })
      .addCase(followVacation.fulfilled, (state, action) => {
        const vacation = state.vacations.find(v => v.id === action.payload);
        if (vacation) {
          vacation.is_following = 1;
          vacation.followers_count += 1;
        }
      })
      .addCase(unfollowVacation.fulfilled, (state, action) => {
        const vacation = state.vacations.find(v => v.id === action.payload);
        if (vacation) {
          vacation.is_following = 0;
          vacation.followers_count = Math.max(0, vacation.followers_count - 1);
        }
      });
  },
});

export const { updateVacationInState, removeVacation, addVacation } = vacationSlice.actions;
export default vacationSlice.reducer;

