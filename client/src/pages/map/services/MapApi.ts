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
        postSpecialOffer: builder.mutation<any, { date_advertisement: string, old_coast: number, new_coast: number }>({
            query: ({ date_advertisement, old_coast, new_coast }) => ({
                url: `/special_adv/admin_create`,
                method: "post",
                body: {
                    date_advertisement,
                    old_coast,
                    new_coast
                },
                headers: {
                    "Content-Type": "application/json",
                },
            })
        }),
    }),
});

export const {
    useGetCustomViewQuery, usePostSpecialOfferMutation
} = MapApi;
