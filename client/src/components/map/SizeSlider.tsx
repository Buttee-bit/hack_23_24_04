import { sizeBigMarks, sizeSmallMarks } from '@/consts/rangeValues'
import { Slider, Switch } from '@mui/material'
import { useState } from 'react'

export default function SizeSlider({ value, setValue }) {
	const [switchSmallSize, setSwitchSmallSize] = useState(true)
	const [localValue, setLocalValue] = useState([1, 50])

	const handleChange = (event: any, newValue: any) => {
		setLocalValue(newValue)
		setValue(scaleValues(newValue))
	}

	const handleSwitchChange = () => {
		setLocalValue([0, 0])
		switchSmallSize === true ? setValue([1000, 1000]) : setValue([1, 1])
		setSwitchSmallSize(prev => !prev)
		// setValue(scaleValues(localValue))
	}

	const scaleValues = (valueArray: any) => {
		return [scale(valueArray[0]), scale(valueArray[1])]
	}
	const scale = (value: any) => {
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

	// console.log(value)

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
				value={localValue}
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
				<p>от {scaleValues(localValue)[0]} м.кв.</p>
				<p>до {scaleValues(localValue)[1]} м.кв</p>
			</div>
		</div>
	)
}
