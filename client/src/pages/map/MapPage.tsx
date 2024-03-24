// import Filter from '@/components/map/Filter'
import { Button, Paper } from '@mui/material'
import { MapApi } from '@/pages/map/services/MapApi'
import { Toaster } from '@/components/ui/sonner'
import { useEffect, useRef, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import BuildingType from '@/components/map/BuildingType'
import CategoryFilter from '@/components/map/CategoryFilter'
import EntertainmentSlider from '@/components/map/EntertainmentSlider'
import FloorSlider from '@/components/map/FloorSlider'
import MetroSlider from '@/components/map/MetroSlider'
import PriceSlider from '@/components/map/PriceSlider'
import SizeSlider from '@/components/map/SizeSlider'
import Loader from '@/components/ui/loader'
import { Button as ShadButton } from '@/components/ui/button'
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown'
import { motion } from 'framer-motion'
import ObjectContent from '@/components/map/ObjectContent'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import { HoverEffect } from '@/components/ui/card-hover-effect'
// import { AuroraBackground } from '@/components/ui/aurora-background'

export interface IObject {
	point_x: number
	point_y: number
	main_type: string
	segment_type: string
	total_arena: number
	floor: number
	additional_info: string
	address: string
	id: number
	entity_type: string
	lease_price: number
	source_info: string
	update_date: string
}

const MapPage = () => {
	const dataRef = useRef<HTMLHeadingElement | null>(null)

	const {
		data: initialHTML,
		isLoading: initialHTMLLoading,
		isSuccess
	} = MapApi.useGetCustomViewQuery('')
	const [content, setContent] = useState('')
	const [objectContent, setObjectContent] = useState<IObject[]>([])
	const [buildingCategory, setBuildingCategory] = useState<string[]>([
		'Офисные',
		'Производственные',
		'Торговые',
		'Иные'
	])
	const [floorValue, setFloorValue] = useState([1, 3])
	const [metroValue, setMetroValue] = useState(100)
	const [entertainmentValue, setEntertainmentValue] = useState(100)
	const [priceValue, setPriceValue] = useState([296, 10000])
	const [sizeValue, setSizeValue] = useState([1, 10])
	const [goodCategories, setGoodCategories] = useState([])
	const [badCategories, setBadCategories] = useState([])
	const [categoriesSlider, setCategoriesSlider] = useState(100)
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

	const [postData, { data: postDataResponse, isLoading: isPostDataLoading }] =
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
			metro_radius: metroValue,
			love: goodCategories,
			hate: badCategories,
			select_radius: categoriesSlider
		})
	}

	const handleDownloadExcel = async () => {
		try {
			const url = 'http://localhost:8000/custom_view/download_excel'

			const response = await fetch(url, {
				method: 'GET'
			})

			if (response.ok) {
				const contentDisposition = response.headers.get(
					'Content-Disposition'
				)
				const filename =
					contentDisposition?.split('filename=')[1] ?? 'data.xlsx'

				const blob = await response.blob()

				const downloadUrl = window.URL.createObjectURL(blob)
				const link = document.createElement('a')
				link.href = downloadUrl
				link.setAttribute('download', filename)
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)

				window.URL.revokeObjectURL(downloadUrl)
			} else {
				console.error('Failed to download file')
			}
		} catch (error) {
			console.error('Error during file download:', error)
		}
	}

	function handleScroll() {
		if (dataRef && dataRef.current) {
			// Проверка на существование current
			dataRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}

	return (
		<main className='h-screen p-4 max-w-[1900px] mx-auto'>
			<div className='relative h-full'>
				{/* <Filter /> */}
				<Paper className='absolute z-10 top-5 left-20 w-1/3 h-[calc(100%-2.5rem)] py-4'>
					<ScrollArea className='h-full'>
						<h2 className='text-center text-lg font-semibold'>
							Фильтры
						</h2>
						<div className='max-w-5xl mx-auto px-4 mt-2'>
							<HoverEffect
								hoveredIndex={hoveredIndex}
								setHoveredIndex={setHoveredIndex}
								index={1}
							>
								<PriceSlider
									value={priceValue}
									setValue={setPriceValue}
								/>
							</HoverEffect>
							<HoverEffect
								hoveredIndex={hoveredIndex}
								setHoveredIndex={setHoveredIndex}
								index={2}
							>
								<SizeSlider
									value={sizeValue}
									setValue={setSizeValue}
								/>
							</HoverEffect>
							<HoverEffect
								hoveredIndex={hoveredIndex}
								setHoveredIndex={setHoveredIndex}
								index={3}
							>
								<FloorSlider
									value={floorValue}
									setValue={setFloorValue}
								/>
							</HoverEffect>
							<HoverEffect
								hoveredIndex={hoveredIndex}
								setHoveredIndex={setHoveredIndex}
								index={4}
							>
								<BuildingType
									category={buildingCategory}
									setCategory={setBuildingCategory}
								/>
							</HoverEffect>
							<HoverEffect
								hoveredIndex={hoveredIndex}
								setHoveredIndex={setHoveredIndex}
								index={5}
							>
								<MetroSlider
									value={metroValue}
									setValue={setMetroValue}
								/>
							</HoverEffect>
							<HoverEffect
								hoveredIndex={hoveredIndex}
								setHoveredIndex={setHoveredIndex}
								index={6}
							>
								<EntertainmentSlider
									value={entertainmentValue}
									setValue={setEntertainmentValue}
								/>
							</HoverEffect>

							<HoverEffect
								hoveredIndex={hoveredIndex}
								setHoveredIndex={setHoveredIndex}
								index={7}
							>
								<CategoryFilter
									goodCategories={goodCategories}
									badCategories={badCategories}
									setGoodCategories={setGoodCategories}
									setBadCategories={setBadCategories}
									categoriesSlider={categoriesSlider}
									setCategoriesSlider={setCategoriesSlider}
								/>
							</HoverEffect>

							<Button
								variant='contained'
								sx={{
									mt: 2,
									display: 'block',
									mx: 'auto'
								}}
								disabled={isPostDataLoading ? true : false}
								// ОТПРАВКА ФИЛЬТРОВ НА БЭК СЮДА
								onClick={() => handleClick()}
							>
								<span>Сохранить</span>
							</Button>
						</div>
					</ScrollArea>
				</Paper>

				<Paper className='h-full w-full bg-red-300 overflow-hidden relative'>
					{(initialHTMLLoading || isPostDataLoading) && <Loader />}
					{isSuccess && (
						<>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
							>
								<ShadButton
									className='absolute z-50 bottom-14 p-10 left-[50%] text-[60px] rounded-full'
									size='icon'
									onClick={handleScroll}
								>
									<ArrowCircleDownIcon fontSize='inherit' />
								</ShadButton>
							</motion.div>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
							>
								{/* СЕМЫЧ СЮДА СМАРИ */}
								<ShadButton
									className='absolute z-50 bottom-16 right-44 text-3lg py-6 rounded-2xl'
									onClick={() => handleDownloadExcel()}
								>
									<span className='flex items-center gap-3'>
										Скачать данные
										<CloudDownloadIcon className='' />
									</span>
								</ShadButton>
							</motion.div>
						</>
					)}
					<div dangerouslySetInnerHTML={{ __html: content }}></div>
					{/* Контент будет вставлен сюда */}
				</Paper>
				{isSuccess && (
					<Paper sx={{ mt: 5 }}>
						<div className='p-8'>
							<h3
								ref={dataRef}
								className='text-3xl font-bold text-center'
							>
								Результаты поиска
							</h3>
							{objectContent && (
								<ObjectContent data={objectContent} />
							)}
						</div>
					</Paper>
				)}
			</div>
			<Toaster />
		</main>
	)
}

export default MapPage
