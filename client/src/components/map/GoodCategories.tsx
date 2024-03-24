import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import { toast } from 'sonner'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/components/ui/accordion'

import { Button as ShadButton } from '@/components/ui/button'
import React, { FC } from 'react'
import clsx from 'clsx'
import { Input } from '../ui/input'

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement
	},
	ref: React.Ref<unknown>
) {
	return <Slide direction='up' ref={ref} {...props} />
})

interface Props {
	categories: string[]
	setCategories: any
	data: any
	altCategories: any
}

const GoodCategories: FC<Props> = ({
	categories,
	setCategories,
	data,
	altCategories
}) => {
	const [open, setOpen] = React.useState(false)
	const [text, setText] = React.useState('')

	const handleCategory = (text: string) => {
		const inAltArray = altCategories.includes(text)
		if (!inAltArray) {
			setCategories((prev: any) => {
				const inArray = prev.includes(text)
				if (inArray) {
					return prev.filter((item: any) => item !== text)
				} else {
					return [...prev, text]
				}
			})
		} else {
			toast(
				'Одна из выбранных категорий уже в списке нежелаемых категорий!'
			)
		}
	}

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	const handleChange = (event: any) => {
		setText(event.target.value)
	}

	const filteredCategories = data.filter((category: any) =>
		category.key.toLowerCase().includes(text.toLowerCase())
	)

	const handleAddAll = (values: string[]) => {
		values.forEach(text => {
			const inAltArray = altCategories.includes(text)
			if (!inAltArray) {
				setCategories((prev: any) => {
					const inArray = prev.includes(text)
					if (inArray) {
						return prev.filter((item: any) => item !== text)
					} else {
						return [...prev, text]
					}
				})
			} else {
				toast(
					'Некоторые категории не были добавлены в список, поскольку они указаны в нежелаемых категориях!'
				)
			}
		})
	}

	const handleDeleteAll = (values: string[]) => {
		setCategories(prevCategories =>
			prevCategories.filter(category => !values.includes(category))
		)
	}

	// console.log(categories)

	return (
		<div className='mt-4'>
			<React.Fragment>
				<div className='flex items-center justify-center gap-4'>
					<ShadButton variant='outline' onClick={handleClickOpen}>
						Желаемые категории рядом
					</ShadButton>
					<h4
						className={clsx(
							'border rounded-full w-8 h-8 flex items-center justify-center',
							{
								'bg-green-300': categories.length > 3,
								'bg-yellow-300': categories.length > 5,
								'bg-red-400 text-white': categories.length > 8
							}
						)}
					>
						{categories.length}
					</h4>
				</div>
				<Dialog
					fullScreen
					open={open}
					onClose={handleClose}
					TransitionComponent={Transition}
				>
					<AppBar sx={{ position: 'relative' }}>
						<div className='fixed bg-inherit w-full'>
							<Toolbar
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center'
								}}
							>
								<div className='flex items-center gap-2'>
									<IconButton
										edge='start'
										color='inherit'
										onClick={handleClose}
										aria-label='close'
									>
										<CloseIcon />
									</IconButton>
									<p>Желаемые категории</p>
								</div>
								<div className='flex items-center gap-2 basis-1/2'>
									<p>Поиск</p>
									<Input
										type='email'
										placeholder='Категория'
										className='bg-white text-black w-full rounded-sm'
										onChange={handleChange}
									/>
								</div>
								<Button
									autoFocus
									color='inherit'
									onClick={handleClose}
								>
									<span>Сохранить</span>
								</Button>
							</Toolbar>
						</div>
					</AppBar>
					<div className='mt-4 p-4 py-20'>
						{filteredCategories.map((item: any, index: any) => {
							return (
								<Accordion
									key={index}
									type='single'
									collapsible
								>
									<AccordionItem value='val-1'>
										<AccordionTrigger className='text-lg flex items-center justify-center gap-4'>
											<p>{item.key}</p>
										</AccordionTrigger>
										<AccordionContent>
											<div className='w-fit mx-auto my-6 flex gap-4 items-center'>
												<ShadButton
													className='bg-green-500 active:scale-95 transition-all'
													onClick={() =>
														handleAddAll(item.value)
													}
												>
													Выбрать все
												</ShadButton>
												<ShadButton
													onClick={() =>
														handleDeleteAll(
															item.value
														)
													}
													variant='outline'
													className='bg-red-500 hover:bg-red-600 text-white hover:text-white active:scale-95 transition-all'
												>
													Удалить все
												</ShadButton>
											</div>
											<div className='flex flex-wrap gap-4'>
												{item.value.map(
													(
														cat: string,
														indexCat: number
													) => {
														const inArray =
															categories.includes(
																cat
															)

														return (
															<div key={indexCat}>
																<ShadButton
																	variant='outline'
																	className={`${
																		inArray
																			? 'bg-green-200 hover:bg-green-300'
																			: ''
																	} block`}
																	onClick={() =>
																		handleCategory(
																			cat
																		)
																	}
																>
																	{cat}
																</ShadButton>
															</div>
														)
													}
												)}
											</div>
										</AccordionContent>
									</AccordionItem>
								</Accordion>
							)
						})}
					</div>
				</Dialog>
			</React.Fragment>
		</div>
	)
}

export default GoodCategories
