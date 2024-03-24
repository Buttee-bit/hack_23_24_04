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

interface Props {
	data: IObject[]
}

const ObjectContent: FC<Props> = ({ data }) => {
	return (
		<>
			<div className='grid grid-cols-3 mt-8'>
				{data?.map((object: IObject) => (
					<Card className='w-[500px]'>
						<CardHeader>
							<CardTitle>
								<span className='bg-green-200 px-2 m-1'>
									Адрес:
								</span>
								{object.address}e
							</CardTitle>
							<CardDescription>
								<a
									href={object.additional_info}
									target='_blank'
									rel='noopener noreferrer'
								>
									{object.additional_info}
								</a>
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p>{object.entity_type}</p>
							<p>{object.main_type}</p>
							<p>{object.lease_price}</p>
							<p>{object.source_info}</p>
						</CardContent>
						<CardFooter></CardFooter>
					</Card>
				))}
			</div>
		</>
	)
}

export default ObjectContent
