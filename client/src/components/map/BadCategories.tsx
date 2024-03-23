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
		<>
			<React.Fragment>
				<ShadButton
					variant='outline'
					className='block mx-auto mt-4'
					onClick={handleClickOpen}
				>
					Убрать ненужные категории
				</ShadButton>
				<Dialog
					fullScreen
					open={open}
					onClose={handleClose}
					TransitionComponent={Transition}
				>
					<AppBar sx={{ position: 'relative' }}>
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
					</AppBar>
					<div className='flex flex-wrap gap-4 mt-4 p-4'>
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
		</>
	)
}

export default BadCategories
