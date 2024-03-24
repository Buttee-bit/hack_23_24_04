import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import { toast } from 'sonner'

import { Button as ShadButton } from '@/components/ui/button'
import React, { FC } from 'react'
import clsx from 'clsx'

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement
	},
	ref: React.Ref<unknown>
) {
	return <Slide direction='up' ref={ref} {...props} />
})

interface Props {
	categories: any
	setCategories: any
	data: any
	altCategories: any
}

const BadCategories: FC<Props> = ({
	categories,
	setCategories,
	data,
	altCategories
}) => {
	const [open, setOpen] = React.useState(false)

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
			toast('Данная категория выбрана в списке желаемых категорий!')
		}
	}

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	return (
		<div className='mt-4'>
			<React.Fragment>
				<div className='flex items-center justify-center gap-4'>
					<ShadButton variant='outline' onClick={handleClickOpen}>
						Нежелаемые категории рядом
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
									<p>Нужные категории</p>
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
					<div className='flex flex-wrap gap-4 mt-4 p-4 py-20'>
						{data.map((item: any, index: any) => {
							const inArray = categories.includes(item)

							return (
								<div key={index}>
									<ShadButton
										variant='outline'
										className={`${
											inArray
												? 'bg-red-200 hover:bg-red-300'
												: ''
										} block`}
										onClick={() => handleCategory(item)}
									>
										{item}
									</ShadButton>
								</div>
							)
						})}
					</div>
				</Dialog>
			</React.Fragment>
		</div>
	)
}

export default BadCategories
