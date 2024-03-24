import Slider from '@mui/material/Slider'

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
		label: '1км.'
	},
	{
		value: 1500,
		label: '1.5км'
	},
	{
		value: 2000,
		label: '2км'
	}
]

function valuetext(value: number) {
	return `${value}м`
}

export default function MetroSlider({ value, setValue }) {
	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	// console.log(value)

	return (
		<div className='px-4 mt-4'>
			<div className='flex items-center justify-between gap-4'>
				<p className='font-medium'>Удаленность от метро</p>
			</div>
			<Slider
				aria-label='Always visible'
				defaultValue={80}
				getAriaValueText={valuetext}
				step={5}
				marks={marks}
				valueLabelDisplay='off'
				size='small'
				value={value}
				onChange={handleChange}
				min={100}
				max={2000}
			/>
			<p className='mt-2 text-center'>до {value} м</p>
		</div>
	)
}
