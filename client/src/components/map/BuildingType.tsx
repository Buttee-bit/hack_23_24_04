import * as React from 'react'
import { Theme, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Chip from '@mui/material/Chip'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250
		}
	}
}

const names = ['Офисные', 'Производственные', 'Торговые', 'Иные']

function getStyles(name: string, category: readonly string[], theme: Theme) {
	return {
		fontWeight:
			category.indexOf(name) === -1
				? theme.typography.fontWeightRegular
				: theme.typography.fontWeightMedium
	}
}

export default function BuildingType({ category, setCategory }) {
	const theme = useTheme()

	const handleChange = (event: SelectChangeEvent<typeof category>) => {
		const {
			target: { value }
		} = event
		setCategory(
			// On autofill we get a stringified value.
			typeof value === 'string' ? value.split(',') : value
		)
	}

	console.log(category)

	return (
		<div>
			<FormControl fullWidth variant='filled'>
				<p className='font-medium mb-2 ml-4'>Тип помещения</p>
				<Select
					labelId='demo-multiple-chip-label'
					id='demo-multiple-chip'
					multiple
					value={category}
					onChange={handleChange}
					input={
						<OutlinedInput id='select-multiple-chip' label='Chip' />
					}
					renderValue={selected => (
						<Box
							sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
						>
							{selected.map(value => (
								<Chip key={value} label={value} />
							))}
						</Box>
					)}
					MenuProps={MenuProps}
				>
					{names.map(name => (
						<MenuItem
							key={name}
							value={name}
							style={getStyles(name, category, theme)}
						>
							<p>{name}</p>
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</div>
	)
}
