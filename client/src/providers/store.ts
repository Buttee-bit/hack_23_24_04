import { MapApi } from "@/pages/map/services/MapApi"
import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query/react"


export const store = configureStore({
	reducer: {
		[MapApi.reducerPath]: MapApi.reducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat([
			MapApi.middleware,
		])
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
setupListeners(store.dispatch)
