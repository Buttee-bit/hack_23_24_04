import { Slider, Switch } from '@mui/material'
import React from 'react'

const followersBigMarks = [
	{
		value: 0,
		scaledValue: 1000,
		label: '1 тыс.'
	},
	{
		value: 25,
		scaledValue: 5000,
		label: ''
	},
	{
		value: 50,
		scaledValue: 10000,
		label: '10 тыс.'
	},
	{
		value: 75,
		scaledValue: 25000,
		label: ''
	},
	{
		value: 100,
		scaledValue: 50000,
		label: '50 тыс.'
	},
	{
		value: 125,
		scaledValue: 100000,
		label: ''
	},
	{
		value: 150,
		scaledValue: 250000,
		label: '250 тыс.'
	},
	{
		value: 175,
		scaledValue: 500000,
		label: ''
	},
	{
		value: 200,
		scaledValue: 1000000,
		label: '1 млн'
	}
]

const followersSmallMarks = [
	{
		value: 0,
		scaledValue: 1,
		label: '1 ед.'
	},
	{
		value: 25,
		scaledValue: 5,
		label: ''
	},
	{
		value: 50,
		scaledValue: 10,
		label: '10 ед.'
	},
	{
		value: 75,
		scaledValue: 25,
		label: ''
	},
	{
		value: 100,
		scaledValue: 50,
		label: '50 ед.'
	},
	{
		value: 125,
		scaledValue: 100,
		label: ''
	},
	{
		value: 150,
		scaledValue: 250,
		label: '250 ед.'
	},
	{
		value: 175,
		scaledValue: 500,
		label: ''
	},
	{
		value: 200,
		scaledValue: 1000,
		label: '1 тыс.'
	}
]

export default function NonLinearSlider() {
	const [value, setValue] = React.useState([1, 25])
	const [switchSmallSize, setSwitchSmallSize] = React.useState(false)

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
			const previousMark = followersBigMarks[previousMarkIndex]
			const remainder = value % 25
			if (remainder === 0) {
				return previousMark.scaledValue
			}
			const nextMark = followersBigMarks[previousMarkIndex + 1]
			const increment =
				(nextMark.scaledValue - previousMark.scaledValue) / 25
			return remainder * increment + previousMark.scaledValue
		} else {
			const previousMarkIndex = Math.floor(value / 25)
			const previousMark = followersSmallMarks[previousMarkIndex]
			const remainder = value % 25
			if (remainder === 0) {
				return previousMark.scaledValue
			}
			const nextMark = followersSmallMarks[previousMarkIndex + 1]
			const increment =
				(nextMark.scaledValue - previousMark.scaledValue) / 25
			return remainder * increment + previousMark.scaledValue
		}
	}

	console.log(scaleValues(value))

	return (
		<div className='px-4'>
			<div className='flex items-center gap-4'>
				<p>{switchSmallSize ? 'Малая площадь' : 'Большая площадь'}</p>
				<Switch onChange={handleSwitchChange} />
			</div>
			<Slider
				value={value}
				min={0}
				step={10}
				max={200}
				marks={
					switchSmallSize ? followersSmallMarks : followersBigMarks
				}
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
