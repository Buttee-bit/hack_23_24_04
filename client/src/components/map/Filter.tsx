import { Paper } from '@mui/material'
import { HoverEffect } from '../ui/card-hover-effect'

const Filter = () => {
	return (
		<>
			<Paper className='absolute z-10 top-5 left-5 w-1/6 h-[calc(100%-2.5rem)] p-2'>
				<h3 className='text-center text-lg font-semibold'>Фильтры</h3>
				<div className='max-w-5xl mx-auto px-8'>
					{/* <HoverEffect>
                        child
                    </HoverEffect> */}
				</div>
			</Paper>
		</>
	)
}

export default Filter
