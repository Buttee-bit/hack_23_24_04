import Slider from '@mui/material/Slider'
import { FC, useState } from 'react'

const marks = [
	{
		value: 1,
		label: '1км'
	},
	{
		value: 100,
		label: '100км'
	},
	{
		value: 200,
		label: '200км'
	},
	{
		value: 300,
		label: '300км'
	},
	{
		value: 400,
		label: '400км'
	},
	{
		value: 500,
		label: '500км'
	}
]

function valuetext(value: number) {
	return `${value}км`
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
				min={1}
				max={500}
			/>
			<p className='mt-2 text-center'>до {value} км.</p>
		</div>
	)
}

export default EntertainmentSlider
