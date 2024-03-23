import BuildingType from '@/components/map/BuildingType'
import EntertainmentSlider from '@/components/map/EntertainmentSlider'
import FloorSlider from '@/components/map/FloorSlider'
import MetroSlider from '@/components/map/MetroSlider'
import PriceSlider from '@/components/map/PriceSlider'
import SizeSlider from '@/components/map/SizeSlider'

export const filters = [
	{
		component: <PriceSlider />
	},
	{
		component: <SizeSlider />
	},
	{
		component: <FloorSlider />
	},
	{ component: <BuildingType /> },
	{ component: <MetroSlider /> },
	{ component: <EntertainmentSlider /> }
]
