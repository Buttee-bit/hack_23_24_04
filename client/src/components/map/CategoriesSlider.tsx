import Slider from '@mui/material/Slider'
import { FC, useState } from 'react'

const marks = [
	{
		value: 100,
		label: '100м'
	},
	{
		value: 250,
		label: ''
	},
	{
		value: 500,
		label: '500м'
	},
	{
		value: 1000,
		label: '1км'
	},
	{
		value: 2000,
		label: '2км'
	},
	{
		value: 3000,
		label: '3км'
	}
]

function valuetext(value: number) {
	return `${value}м`
}

interface Props {
	value: number
	setValue: any
}

const CategoriesSlider: FC<Props> = ({ value, setValue }) => {
	const handleChange = (event: any, newValue: any) => {
		setValue(newValue)
	}

	return (
		<div className='px-4 mt-2'>
			{/* <div className='flex items-center justify-between gap-4'>
				<p className='font-medium'>
					Удаленность от категорий
				</p>
			</div> */}
			<Slider
				// aria-label='Always visible'
				defaultValue={80}
				getAriaValueText={valuetext}
				step={5}
				marks={marks}
				valueLabelDisplay='off'
				size='small'
				value={value}
				onChange={handleChange}
				min={100}
				max={3000}
			/>
			<p className='mt-2 text-center'>до {value} м</p>
		</div>
	)
}

export default CategoriesSlider
