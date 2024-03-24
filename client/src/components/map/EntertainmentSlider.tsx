import Slider from '@mui/material/Slider'
import { FC, useState } from 'react'

const marks = [
	{
		value: 100,
		label: '100м'
	},
	{
		value: 1000,
		label: ''
	},
	{
		value: 2500,
		label: '2.5км'
	},
	{
		value: 5000,
		label: '5км'
	},
	{
		value: 7500,
		label: '7.5км'
	},
	{
		value: 10000,
		label: '10км'
	}
]

function valuetext(value: number) {
	return `${value}м`
}

interface Props {
	value: number
	setValue: any
}

const EntertainmentSlider: FC<Props> = ({ value, setValue }) => {
	const handleChange = (event: any, newValue: any) => {
		setValue(newValue)
	}

	return (
		<div className='px-4'>
			<div className='flex items-center justify-between gap-4'>
				<p className='font-medium'>
					Удаленность от достопримечательностей
				</p>
			</div>
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
				max={10000}
			/>
			<p className='mt-2 text-center'>до {value} м</p>
		</div>
	)
}

export default EntertainmentSlider
