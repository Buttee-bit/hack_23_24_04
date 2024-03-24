import { motion } from 'framer-motion'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export default function App() {
	return (
		<AuroraBackground>
			<motion.div
				initial={{ opacity: 0.0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{
					delay: 0.3,
					duration: 0.8,
					ease: 'easeInOut'
				}}
				className='relative flex flex-col gap-4 items-center justify-center px-4'
			>
				<div className='text-3xl md:text-7xl font-bold dark:text-white text-center'>
					NaturaLP
				</div>
				<div className='font-extralight text-base md:text-4xl dark:text-neutral-200 py-4'>
					Сервис поиска{' '}
					<span className='font-semibold'> подходящего </span>
					помещения для ведения{' '}
					<span className='font-semibold'> успешного </span>
					бизнеса
				</div>
				{/* <button className='bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2'>
					Debug now
				</button> */}
				<div className='flex items-center gap-6 justify-center mb-4'>
					<div className='w-1/3 border h-full p-6 rounded-lg shadow-xl shadow-cyan-300 bg-slate-200'>
						<p className='text-lg font-medium mb-4'>Описание</p>
						<p>
							Фактор близости объектов — это один из ключевых
							элементов геомаркетинга, который позволяет
							определить, насколько близко находятся объекты
							бизнеса к потенциальным клиентам.
						</p>
					</div>
					<div className='w-1/3 border h-full p-6 rounded-lg shadow-xl shadow-cyan-300 bg-slate-200'>
						<p className='text-lg font-medium mb-4'>
							Что мы сделали
						</p>
						<div>
							<p>
								Создали алгоритм поиска кратчайшего расстояния
							</p>
							<p className='mt-2'>
								Создали отчёт оценки привлекательности объектов
								для размещения бизнеса сферы услуг
							</p>
							<p className='mt-2'>
								Создали современное веб-приложение с удобным
								функционалом
							</p>
						</div>
					</div>
				</div>

				<Link to='map'>
					<Button
						variant='default'
						className='text-3xl p-12 rounded-xl'
						size='lg'
					>
						Начать
					</Button>
				</Link>
			</motion.div>
		</AuroraBackground>
	)
}
