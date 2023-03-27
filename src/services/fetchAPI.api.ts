import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ICompany, ICompanyData } from "../types";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://test.v5.pryaniky.com",
  }),
  endpoints: (build) => ({
    logIn: build.mutation({
      query: (body) => ({
        url: "/ru/data/v3/testmethods/docs/login",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const companyApi = createApi({
  reducerPath: "companyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://test.v5.pryaniky.com",
    prepareHeaders: (headers: Headers) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        headers.set("x-auth", token);
      }
    },
  }),
  tagTypes: ["Company"],
  endpoints: (build) => ({
    getCompany: build.query<ICompany, void>({
      query: () => ({
        url: "/ru/data/v3/testmethods/docs/userdocs/get",
      }),
      providesTags: (result) => {
        return result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Company" as const,
                id,
              })),
              { type: "Company", id: "LIST" },
            ]
          : [{ type: "Company", id: "LIST" }];
      },
    }),
    createCompany: build.mutation({
      query: (json) => ({
        url: "/ru/data/v3/testmethods/docs/userdocs/create",
        method: "POST",
        body: json,
      }),
      invalidatesTags: ["Company"],
    }),
    deleteCompany: build.mutation({
      query: (id: string) => ({
        url: `/ru/data/v3/testmethods/docs/userdocs/delete/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Company"],
    }),
    setCompany: build.mutation({
      query: (body: ICompanyData) => ({
        url: `/ru/data/v3/testmethods/docs/userdocs/set/${body.id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Company"],
    }),
  }),
});

export const { useLogInMutation } = userApi;
export const {
  useGetCompanyQuery,
  useCreateCompanyMutation,
  useDeleteCompanyMutation,
  useSetCompanyMutation,
} = companyApi;
