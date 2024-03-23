import { Paper } from '@mui/material'
import { HoverEffect } from '../ui/card-hover-effect'
import { useState } from 'react'
import { filters } from '@/consts/filters'

const Filter = () => {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

	return (
		<>
			<Paper className='absolute z-10 top-5 left-5 w-1/5 h-[calc(100%-2.5rem)] py-4'>
				<h2 className='text-center text-lg font-semibold'>Фильтры</h2>
				<div className='max-w-5xl mx-auto px-4 mt-2'>
					{filters.map((item, index) => (
						<HoverEffect
							key={index}
							hoveredIndex={hoveredIndex}
							setHoveredIndex={setHoveredIndex}
							index={index}
						>
							{item.component}
						</HoverEffect>
					))}
				</div>
			</Paper>
		</>
	)
}

export default Filter
