export const Feature = ({ image, title, text }) => {
    return (

        <div className="relative h-full">
            <div
                className="flex flex-col h-full gap-4 justify-center text-inactive
                py-10 px-7
                bg-gradient-to-br from-primary/15 via-background to-background
                backdrop-blur-xl rounded-[20px] min-w-[250px]
                border border-white/20
                shadow-xl shadow-black/10
                transition-all duration-300
                hover:border-white/30 hover:shadow-2xl
                hover:scale-102 hover:-translate-y-2"
            >
                <div className="pb-2"><img src={image} alt="" /></div>
                <div className="font-heading font-extrabold text-3xl ">{title}</div>
                <div className="font-body text-medium text-inactive/70">{text}</div>
            </div>
        </div>

    )
}