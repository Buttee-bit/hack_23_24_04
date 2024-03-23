import App from "@/App"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <>error</>,
		children: [
			{
				path: "dashboard",
				element: <>dasb</>
			},
			{
				path: "about",
				element: <>abt</>
			}
		]
	}
])

const AppProvider = () => {
	return <RouterProvider router={router} fallbackElement={<>loading...</>} />
}

export default AppProvider
