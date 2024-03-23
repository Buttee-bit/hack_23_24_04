// import Filter from '@/components/map/Filter'
import { Button, Paper } from '@mui/material'
import { MapApi } from '@/pages/map/services/MapApi'
import { Toaster } from '@/components/ui/sonner'
import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import BuildingType from '@/components/map/BuildingType'
import CategoryFilter from '@/components/map/CategoryFilter'
import EntertainmentSlider from '@/components/map/EntertainmentSlider'
import FloorSlider from '@/components/map/FloorSlider'
import MetroSlider from '@/components/map/MetroSlider'
import PriceSlider from '@/components/map/PriceSlider'
import SizeSlider from '@/components/map/SizeSlider'

const MapPage = () => {
	const { data: HTML } = MapApi.useGetCustomViewQuery('')
	const [buildingCategory, setBuildingCategory] = useState<string[]>([])
	const [entertainmentValue, setEntertainmentValue] = useState(100)
	const [floorValue, setFloorValue] = useState([1, 50])
	const [metroValue, setMetroValue] = useState(100)
	const [priceValue, setPriceValue] = useState([1, 25])
	const [sizeValue, setSizeValue] = useState([1, 25])
	const [goodCategories, setGoodCategories] = useState([])
	const [badCategories, setBadCategories] = useState([])

	const handleClick = () => {}

	console.log(HTML)
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
					dangerouslySetInnerHTML={{ __html: HTML }}
				>
					{/* Контент будет вставлен сюда */}
				</Paper>
			</div>
			<Toaster />
		</main>
	)
}

export default MapPage
