import React from "react"
import ReactDOM from "react-dom/client"
import "@/styles/global.css"
import AppProvider from "./providers/AppProvider.tsx"
import { Provider } from 'react-redux';
import { store } from "./providers/store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Provider store={store}>
			<AppProvider />
		</Provider>
	</React.StrictMode>
)
