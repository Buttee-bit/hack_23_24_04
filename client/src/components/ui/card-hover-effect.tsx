import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode } from 'react'

export const HoverEffect = ({
	className,
	setHoveredIndex,
	hoveredIndex,
	children,
	index
}: {
	className?: string
	index: number
	children: ReactNode
	setHoveredIndex: (index: number | null) => void
	hoveredIndex: number | null
}) => {
	return (
		<div className={cn('grid grid-cols-1', className)}>
			<div
				className='relative group block h-full w-full'
				onMouseEnter={() => setHoveredIndex(index)}
				onMouseLeave={() => setHoveredIndex(null)}
			>
				<AnimatePresence>
					{hoveredIndex === index && (
						<motion.span
							className='absolute inset-0 h-full w-full bg-green-100 dark:bg-slate-800/[0.8] block  rounded-md'
							layoutId='hoverBackground'
							initial={{ opacity: 0 }}
							animate={{
								opacity: 1,
								transition: { duration: 0.15 }
							}}
							exit={{
								opacity: 0,
								transition: { duration: 0.15, delay: 0.2 }
							}}
						/>
					)}
				</AnimatePresence>
				<Card>{children}</Card>
			</div>
		</div>
	)
}

export const Card = ({
	className,
	children
}: {
	className?: string
	children: React.ReactNode
}) => {
	return (
		<div
			className={cn(
				'rounded-lg h-full w-full p-2 overflow-hidden border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20',
				className
			)}
		>
			<div className='relative z-50'>
				<div className='p-2'>{children}</div>
			</div>
		</div>
	)
}
export const CardTitle = ({
	className,
	children
}: {
	className?: string
	children: React.ReactNode
}) => {
	return (
		<h4
			className={cn(
				'text-zinc-100 font-bold tracking-wide mt-4',
				className
			)}
		>
			{children}
		</h4>
	)
}
export const CardDescription = ({
	className,
	children
}: {
	className?: string
	children: React.ReactNode
}) => {
	return (
		<p
			className={cn(
				'mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm',
				className
			)}
		>
			{children}
		</p>
	)
}
