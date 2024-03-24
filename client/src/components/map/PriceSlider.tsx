import { priceBigMarks, priceSmallMarks } from '@/consts/rangeValues'
import { Slider, Switch } from '@mui/material'
import { useState } from 'react'

export default function PriceSlider({ value, setValue }) {
	const [localValue, setLocalValue] = useState([1, 50])
	const [switchSmallPrice, setSwitchSmallPrice] = useState(true)

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
		if (!switchSmallPrice) {
			const previousMarkIndex = Math.floor(value / 25)
			const previousMark = priceBigMarks[previousMarkIndex]
			const remainder = value % 25
			if (remainder === 0) {
				return previousMark.scaledValue
			}
			const nextMark = priceBigMarks[previousMarkIndex + 1]
			const increment =
				(nextMark.scaledValue - previousMark.scaledValue) / 25
			return remainder * increment + previousMark.scaledValue
		} else {
			const previousMarkIndex = Math.floor(value / 25)
			const previousMark = priceSmallMarks[previousMarkIndex]
			const remainder = value % 25
			if (remainder === 0) {
				return previousMark.scaledValue
			}
			const nextMark = priceSmallMarks[previousMarkIndex + 1]
			const increment =
				(nextMark.scaledValue - previousMark.scaledValue) / 25
			return remainder * increment + previousMark.scaledValue
		}
	}

	const handleSwitchChange = () => {
		setLocalValue([0, 0])
		switchSmallPrice === true
			? setValue([1000000, 1000000])
			: setValue([100, 100])
		setSwitchSmallPrice(prev => !prev)
		// setValue(scaleValues(localValue))
	}

	return (
		<div className='px-4 mt-4'>
			<div className='flex items-center justify-between gap-4'>
				<p className='font-medium'>
					{switchSmallPrice ? 'Маленькая цена' : 'Большая цена'}
				</p>
				<Switch onChange={handleSwitchChange} color='success' />
			</div>
			<Slider
				value={localValue}
				min={0}
				step={10}
				max={200}
				marks={switchSmallPrice ? priceSmallMarks : priceBigMarks}
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
