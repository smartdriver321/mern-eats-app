import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'

import './global.css'
import Auth0ProviderWithNavigate from './auth/Auth0ProviderWithNavigate.tsx'
import AppRoutes from './AppRoutes.tsx'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
})

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Router>
			<QueryClientProvider client={queryClient}>
				<Auth0ProviderWithNavigate>
					<AppRoutes />
				</Auth0ProviderWithNavigate>
			</QueryClientProvider>
		</Router>
	</StrictMode>
)
