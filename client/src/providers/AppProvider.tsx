import App from "@/App"
import DashboardPage from "@/pages/dashboard/DashboardPage"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <>error</>,
		children: [
			{
				path: "about",
				element: <>abt</>
			}
		]
	},
	{
		path: "dashboard",
		element: <DashboardPage />
	}
])

const AppProvider = () => {
	return <RouterProvider router={router} fallbackElement={<>loading...</>} />
}

export default AppProvider
