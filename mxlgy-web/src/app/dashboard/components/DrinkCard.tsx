export type DrinkCardProps = {
    name: string,
    imageUrl: string,
    percent: number,
    price: number,
}

export default function DrinkCard(props: DrinkCardProps) {
    return (
        <div className="aspect-square overflow-hidden scale-90 hover:scale-100 transition border-2 border-black">
            <img className="object-cover w-full" src={props.imageUrl} />
            <div className="flex justify-between items-center absolute bottom-0 left-0 right-0 p-4 bg-white">
                <p className="z-20 text-black text-2xl font-semibold">{props.name}</p>
                <p className="z-20 text-black text-2xl">{`$${props.price}`}</p>
                <div style={{ width: `${props.percent}%` }} className={`z-10 absolute bg-red-200 left-0 right-0 top-0 bottom-0`}></div>
            </div>
        </div>
    )
}
