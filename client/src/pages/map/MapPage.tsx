// import Filter from '@/components/map/Filter'
import { Button, Paper } from '@mui/material'
import { MapApi } from '@/pages/map/services/MapApi'
import { Toaster } from '@/components/ui/sonner'
import { useEffect, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import BuildingType from '@/components/map/BuildingType'
import CategoryFilter from '@/components/map/CategoryFilter'
import EntertainmentSlider from '@/components/map/EntertainmentSlider'
import FloorSlider from '@/components/map/FloorSlider'
import MetroSlider from '@/components/map/MetroSlider'
import PriceSlider from '@/components/map/PriceSlider'
import SizeSlider from '@/components/map/SizeSlider'

interface IObject {
	point_x: number,
	point_y: number,
	main_type: string,
	segment_type: string,
	total_arena: number,
	floor: number,
	additional_info: string,
	address: string,
	id: number,
	entity_type: string,
	lease_price: number,
	source_info: string,
	update_date: string
}

const MapPage = () => {
	const { data: initialHTML, isLoading: initialHTMLLoading } =
		MapApi.useGetCustomViewQuery('')
	const [content, setContent] = useState('')
	const [objectContent, setObjectContent] = useState<IObject[]>([])
	const [buildingCategory, setBuildingCategory] = useState<string[]>(['Офисные', 'Производственные', 'Торговые', 'Иные'])
	const [floorValue, setFloorValue] = useState([1, 3])
	const [metroValue, setMetroValue] = useState(100)
	const [entertainmentValue, setEntertainmentValue] = useState(100)
	const [priceValue, setPriceValue] = useState([296, 10000])
	const [sizeValue, setSizeValue] = useState([1, 10])
	const [goodCategories, setGoodCategories] = useState([])
	const [badCategories, setBadCategories] = useState([])

	const [postData, { data: postDataResponse }] =
		MapApi.usePostCustomViewMutation()

	useEffect(() => {
		if (initialHTML) {
			console.log('setContent(initialHTML)')
			setContent(initialHTML?.iframe)
			setObjectContent(initialHTML?.data)
		}
	}, [initialHTML])

	console.log(objectContent)

	useEffect(() => {
		if (postDataResponse) {
			console.log('setContent(postDataResponse)')
			setContent(postDataResponse?.iframe)
			setObjectContent(postDataResponse?.data)
		}
	}, [postDataResponse])

	const handleClick = async () => {
		await postData({
			price_min: priceValue[0],
			price_max: priceValue[1],
			square_min: sizeValue[0],
			square_max: sizeValue[1],
			floor_min: floorValue[0],
			floor_max: floorValue[1],
			segment_type_list: buildingCategory,
			tourist_radius: entertainmentValue,
			metro_radius: metroValue
		})
	}

	return (
		<main className='h-screen p-4 max-w-[1900px] mx-auto'>
			<div className='relative h-full'>
				{/* <Filter /> */}
				<Paper className='absolute z-10 top-5 left-20 w-1/5 h-[calc(100%-2.5rem)] py-4'>
					<ScrollArea className='h-full'>
						<h2 className='text-center text-lg font-semibold'>
							Фильтры
						</h2>
						<div className='max-w-5xl mx-auto px-4 mt-2'>
							<PriceSlider
								value={priceValue}
								setValue={setPriceValue}
							/>
							<SizeSlider
								value={sizeValue}
								setValue={setSizeValue}
							/>
							<FloorSlider
								value={floorValue}
								setValue={setFloorValue}
							/>
							<BuildingType
								category={buildingCategory}
								setCategory={setBuildingCategory}
							/>
							<MetroSlider
								value={metroValue}
								setValue={setMetroValue}
							/>
							<EntertainmentSlider
								value={entertainmentValue}
								setValue={setEntertainmentValue}
							/>
							<CategoryFilter
								goodCategories={goodCategories}
								badCategories={badCategories}
								setGoodCategories={setGoodCategories}
								setBadCategories={setBadCategories}
							/>
							<Button
								variant='contained'
								sx={{
									mt: 2,
									display: 'block',
									mx: 'auto'
								}}
								// ОТПРАВКА ФИЛЬТРОВ НА БЭК СЮДА
								onClick={() => handleClick()}
							>
								<span>Сохранить</span>
							</Button>
						</div>
					</ScrollArea>
				</Paper>
				<Paper
					className='h-full w-full bg-red-300'
					dangerouslySetInnerHTML={{ __html: content }}
				>
					{/* Контент будет вставлен сюда */}
				</Paper>
				<Paper

				>
					{objectContent.map((object: IObject) => (
						<>
							<div>
								{object.address}
							</div>
							<div>
								{object.additional_info}
							</div>
							<div>
								{object.entity_type}
							</div>
							<div>
								{object.main_type}
							</div>
							<div>
								{object.lease_price}
							</div>
							<div>
								{object.source_info}
							</div>
						</>
					))}
				</Paper>
			</div>
			<Toaster />
		</main>
	)
}

export default MapPage
