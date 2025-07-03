import { createSlice } from "@reduxjs/toolkit";

const servicePricesSlice = createSlice({
  name: "servicePrices",
  initialState: [],
  reducers: {
    setServicePrices: (state, action) => action.payload,
    updateServicePrice: (state, action) => {
      const { id, price } = action.payload;
      const priceObj = state.find((p) => p.id === id);
      if (priceObj) priceObj.price = price;
    },
  },
});

export const { setServicePrices, updateServicePrice } =
  servicePricesSlice.actions;
export default servicePricesSlice.reducer;
