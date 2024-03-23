import Filter from '@/components/map/Filter'
import { Paper } from '@mui/material'

const MapPage = () => {
	return (
		<main className='h-screen p-5 max-w-[1900px] mx-auto'>
			<div className='flex gap-10 justify-between h-full'>
				<Filter />
				<Paper className='h-full w-full'></Paper>
			</div>
		</main>
	)
}

export default MapPage
