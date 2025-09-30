import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 예시: Redux Toolkit을 사용한 상태 관리
interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

// 예시: createSlice로 액션과 리듀서를 한 번에 생성
export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
