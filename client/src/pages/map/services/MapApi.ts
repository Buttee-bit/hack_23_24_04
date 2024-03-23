import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const MapApi = createApi({
    reducerPath: "MapApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8000",
    }),
    endpoints: (builder) => ({
        getCustomView: builder.query({
            query: () => ({
                url: `/custom_view/custom_map`,
            })
        }),
        postCustomView: builder.mutation<any, { price_min: number, price_max: number, square_min: number, square_max: number, floor_min: number, floor_max: number, segment_type_list: string[]}>({
            query: ({ price_min, price_max, square_min, square_max, floor_min, floor_max, segment_type_list }) => ({
                url: `/custom_view/custom_map`,
                method: "post",
                body: {
                    price_min,
                    price_max,
                    square_min,
                    square_max, 
                    floor_min, 
                    floor_max, 
                    segment_type_list
                },
                headers: {
                    "Content-Type": "application/json",
                },
            })
        }),
    }),
});

export const {
    useGetCustomViewQuery, usePostCustomViewMutation,
} = MapApi;
