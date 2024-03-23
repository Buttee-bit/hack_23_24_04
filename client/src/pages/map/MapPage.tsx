import Filter from '@/components/map/Filter'
import { Paper } from '@mui/material'

const MapPage = () => {
	return (
		<main className='h-screen p-4 max-w-[1900px] mx-auto'>
			<div className='relative h-full'>
				<Filter />
				<Paper className='h-full w-full'></Paper>
			</div>
		</main>
	)
}

export default MapPage
