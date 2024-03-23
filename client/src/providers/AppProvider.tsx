import App from "@/App"
import MapPage from "@/pages/map/MapPage"
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
		path: "map",
		element: <MapPage />
	}
])

const AppProvider = () => {
	return <RouterProvider router={router} fallbackElement={<>loading...</>} />
}

export default AppProvider
