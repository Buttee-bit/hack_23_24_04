import { sizeBigMarks, sizeSmallMarks } from '@/consts/rangeValues'
import { Slider, Switch } from '@mui/material'
import React from 'react'

export default function NonLinearSlider() {
	const [value, setValue] = React.useState([1, 25])
	const [switchSmallSize, setSwitchSmallSize] = React.useState(true)

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	const handleSwitchChange = () => {
		setSwitchSmallSize(prev => !prev)
	}

	const scaleValues = valueArray => {
		return [scale(valueArray[0]), scale(valueArray[1])]
	}
	const scale = value => {
		if (value === undefined) {
			return undefined
		}
		if (!switchSmallSize) {
			const previousMarkIndex = Math.floor(value / 25)
			const previousMark = sizeBigMarks[previousMarkIndex]
			const remainder = value % 25
			if (remainder === 0) {
				return previousMark.scaledValue
			}
			const nextMark = sizeBigMarks[previousMarkIndex + 1]
			const increment =
				(nextMark.scaledValue - previousMark.scaledValue) / 25
			return remainder * increment + previousMark.scaledValue
		} else {
			const previousMarkIndex = Math.floor(value / 25)
			const previousMark = sizeSmallMarks[previousMarkIndex]
			const remainder = value % 25
			if (remainder === 0) {
				return previousMark.scaledValue
			}
			const nextMark = sizeSmallMarks[previousMarkIndex + 1]
			const increment =
				(nextMark.scaledValue - previousMark.scaledValue) / 25
			return remainder * increment + previousMark.scaledValue
		}
	}

	// console.log(scaleValues(value))

	return (
		<div className='px-4'>
			<div className='flex items-center justify-between gap-4'>
				<p className='font-medium'>
					{switchSmallSize ? 'Маленькая площадь' : 'Большая площадь'}
				</p>
				<Switch onChange={handleSwitchChange} color='success' />
			</div>
			<Slider
				value={value}
				min={0}
				step={10}
				max={200}
				marks={switchSmallSize ? sizeSmallMarks : sizeBigMarks}
				scale={scaleValues}
				onChange={handleChange}
				valueLabelDisplay='off'
				aria-labelledby='non-linear-slider'
				disableSwap
				size='small'
				className='px-10'
			/>
			<div className='flex items-center gap-2 justify-center mt-2'>
				<p>от {scaleValues(value)[0]} м.кв.</p>
				<p>до {scaleValues(value)[1]} м.кв</p>
			</div>
		</div>
	)
}
