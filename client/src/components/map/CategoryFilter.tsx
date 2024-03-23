import * as React from 'react'

import GoodCategories from './GoodCategories'
import BadCategories from './BadCategories'
import { categories as data } from '@/consts/categories'
import { Button } from '@mui/material'

export default function CategoryFilter() {
	const [goodCategories, setGoodCategories] = React.useState([])
	const [badCategories, setBadCategories] = React.useState([])

	console.log(goodCategories, badCategories)

	return (
		<>
			<GoodCategories
				categories={goodCategories}
				setCategories={setGoodCategories}
				altCategories={badCategories}
				setAltCategories={setBadCategories}
				data={data}
			/>
			<BadCategories
				categories={badCategories}
				setCategories={setBadCategories}
				altCategories={goodCategories}
				setAltCategories={setGoodCategories}
				data={data}
			/>
			<Button>
				<span>Сохранить</span>
			</Button>
		</>
	)
}
