import GoodCategories from './GoodCategories'
import BadCategories from './BadCategories'
import { categories as data } from '@/consts/categories'
import { FC } from 'react'
import CategoriesSlider from './CategoriesSlider'

interface Props {
	goodCategories: any
	setGoodCategories: any
	badCategories: any
	setBadCategories: any
	categoriesSlider: any
	setCategoriesSlider: any
}

const CategoryFilter: FC<Props> = ({
	goodCategories,
	setGoodCategories,
	badCategories,
	setBadCategories,
	categoriesSlider,
	setCategoriesSlider
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
			<CategoriesSlider
				value={categoriesSlider}
				setValue={setCategoriesSlider}
			/>
		</>
	)
}

export default CategoryFilter
