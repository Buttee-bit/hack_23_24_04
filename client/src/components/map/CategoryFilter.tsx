import GoodCategories from './GoodCategories'
import BadCategories from './BadCategories'
import { categories as data } from '@/consts/categories'
import { FC } from 'react'

interface Props {
	goodCategories: any
	setGoodCategories: any
	badCategories: any
	setBadCategories: any
}

const CategoryFilter: FC<Props> = ({
	goodCategories,
	setGoodCategories,
	badCategories,
	setBadCategories
}) => {
	return (
		<>
			<GoodCategories
				categories={goodCategories}
				setCategories={setGoodCategories}
				altCategories={badCategories}
				data={data}
			/>
			<BadCategories
				categories={badCategories}
				setCategories={setBadCategories}
				altCategories={goodCategories}
				data={data}
			/>
		</>
	)
}

export default CategoryFilter
