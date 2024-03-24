import { priceMarks } from '@/consts/rangeValues'
import { Slider } from '@mui/material'
import { useState } from 'react'

export default function PriceSlider({ value, setValue }) {
	const [localValue, setLocalValue] = useState([1, 50])

	const handleChange = (event: any, newValue: any) => {
		// console.log(newValue)
		setLocalValue(newValue)
		setValue(scaleValues(newValue))
	}

	const scaleValues = (valueArray: any) => {
		return [scale(valueArray[0]), scale(valueArray[1])]
	}
	const scale = (value: any) => {
		if (value === undefined) {
			return undefined
		}
		const previousMarkIndex = Math.floor(value / 25)
		const previousMark = priceMarks[previousMarkIndex]
		const remainder = value % 25
		if (remainder === 0) {
			return previousMark.scaledValue
		}
		const nextMark = priceMarks[previousMarkIndex + 1]
		const increment = (nextMark.scaledValue - previousMark.scaledValue) / 25
		return remainder * increment + previousMark.scaledValue
	}

	// console.log(scaleValues(localValue))

	// console.log(value, 'value rn')

	return (
		<div className='px-4'>
			<div className='flex items-center justify-between gap-4'>
				<p className='font-medium'>Стоимость</p>
			</div>
			<Slider
				value={localValue}
				min={0}
				step={10}
				max={400}
				marks={priceMarks}
				scale={scaleValues}
				onChange={handleChange}
				valueLabelDisplay='off'
				aria-labelledby='non-linear-slider'
				disableSwap
				size='small'
				className='px-10'
			/>
			<div className='flex items-center gap-2 justify-center mt-2'>
				<p>
					от {scaleValues(localValue)[0]} {'\u20BD'}
				</p>
				<p>
					до {scaleValues(localValue)[1]} {'\u20BD'}
				</p>
			</div>
		</div>
	)
}
