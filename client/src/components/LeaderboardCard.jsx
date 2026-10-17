export const LeaderboardCard = () => {
    return (
        <div className="flex flex-row items-center justify-center gap-6 p-4 backdrop-blur-xl rounded-[16px]  max-h
        border border-white/20 shadow-lg shadow-black/10 bg-brown">
            <div className="flex h-15 w-15 items-center justify-center rounded-full bg-gray-200 text-gray-700
                    transition-all duration-300 ring-1 ring-primary"
            >S</div>
            <div className="flex flex-col gap-1">
                <h1 className="text-heading text-xl font-app-heading font-bold capitalize">Zoya Khan</h1>
                <h1 className="text-primary text-md font-app-heading font-medium capitalize">~2.4k meals</h1>
            </div>
        </div>
    )
}