import { IObject } from '@/pages/map/MapPage'
import { FC } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Button } from '../ui/button'
import { motion } from 'framer-motion'

interface Props {
	data: IObject[]
}

const ObjectContent: FC<Props> = ({ data }) => {
	const container = {
		hidden: { opacity: 1, scale: 0 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				delayChildren: 0.3,
				staggerChildren: 0.2
			}
		}
	}

	const item = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1
		}
	}

	return (
		<>
			<motion.div
				className='grid grid-cols-1 gap-4 items-center justify-center lg:grid-cols-2 xl:grid-cols-3 mt-8'
				variants={container}
				initial='hidden'
				animate='visible'
				// viewport={{ once: true }}
			>
				{data?.map((object: IObject, index: number) => (
					<motion.div variants={item}>
						<Card
							className={`relative w-[350px] mx-auto ${
								index >= 0 && index <= 5 ? 'bg-green-100' : ''
							}`}
						>
							<CardHeader>
								<CardTitle>
									<p className=''>
										<span className='bg-green-200 px-2 m-1'>
											Адрес:
										</span>
										{object.address}
									</p>
								</CardTitle>
								<CardDescription>
									<Button
										asChild
										variant='link'
										className='px-0'
									>
										<a
											href={object.additional_info}
											target='_blank'
											rel='noopener noreferrer'
										>
											Перейти по ссылке
										</a>
									</Button>
									<p className='absolute top-[45%] right-[-25%] text-red-400 text-lg rotate-90'>
										Наиболее подходящая
									</p>
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className='flex gap-1 items-center'>
									<span className='bg-green-200 px-2 m-1'>
										Тип объявления:
									</span>
									<p>{object.main_type}</p>
								</div>
								{/* <p>{object.entity_type}</p> */}

								<div className='flex gap-1 items-center mt-1'>
									<span className='bg-green-200 px-2 m-1'>
										Стоимость:
									</span>
									<p>{object.lease_price}</p>
								</div>

								<div className='flex gap-1 items-center mt-1'>
									<span className='bg-green-200 px-2 m-1'>
										Источник:
									</span>
									<p>{object.source_info}</p>
								</div>
							</CardContent>
							<CardFooter></CardFooter>
						</Card>
					</motion.div>
				))}
			</motion.div>
		</>
	)
}

export default ObjectContent
