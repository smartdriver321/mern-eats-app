import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useSearchRestaurants } from '@/api/RestaurantApi'
import SearchBar, { SearchForm } from '@/components/SearchBar'
import SearchResultInfo from '@/components/SearchResultInfo'
import SearchResultCard from '@/components/SearchResultCard'
import PaginationSelector from '@/components/PaginationSelector'

export type SearchState = {
	searchQuery: string
	page: number
	selectedCuisines: string[]
	sortOption: string
}

export default function SearchPage() {
	const [searchState, setSearchState] = useState<SearchState>({
		searchQuery: '',
		page: 1,
		selectedCuisines: [],
		sortOption: 'bestMatch',
	})

	const { city } = useParams()
	const { results, isLoading } = useSearchRestaurants(searchState, city)

	const setSearchQuery = (searchFormData: SearchForm) => {
		setSearchState((prevState) => ({
			...prevState,
			searchQuery: searchFormData.searchQuery,
			page: 1,
		}))
	}

	const resetSearch = () => {
		setSearchState((prevState) => ({
			...prevState,
			searchQuery: '',
			page: 1,
		}))
	}

	const setPage = (page: number) => {
		setSearchState((prevState) => ({
			...prevState,
			page,
		}))
	}

	if (!results?.data || !city) {
		return <span>No results found</span>
	}

	if (isLoading) {
		;<span>Loading ...</span>
	}

	return (
		<div className='grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5'>
			<div id='cuisines-list'>Insert cuisines here</div>

			<div id='main-content' className='flex flex-col gap-5'>
				<SearchBar
					searchQuery={searchState.searchQuery}
					onSubmit={setSearchQuery}
					placeHolder='Search by Cuisine or Restaurant Name'
					onReset={resetSearch}
				/>
				<div className='flex justify-between flex-col gap-3 lg:flex-row'>
					<SearchResultInfo total={results.pagination.total} city={city} />
				</div>

				{results.data.map((restaurant) => (
					<SearchResultCard restaurant={restaurant} />
				))}

				<PaginationSelector
					page={results.pagination.page}
					pages={results.pagination.pages}
					onPageChange={setPage}
				/>
			</div>
		</div>
	)
}
