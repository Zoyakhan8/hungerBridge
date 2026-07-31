export const Feature = ({ image, title, text }) => {
    return (
        <div className="relative">
                <div className=" absolute z-0 -top-5 left-20 w-30 h-30 rounded-full bg-primary/60 blur-[90px]">
                </div>
            <div className="relative z-10">
                <div className=" flex flex-col gap-4 justify-center text-inactive py-10 px-7
        bg-background/20 backdrop-blur-xl rounded-[20px] min-w-[250px] max-w-fit border border border-white/20
        shadow-xl shadow-black/10 transition-all duration-300 hover:bg-white/15 
        hover:border-white/30 hover:shadow-2xl hover:scale-102 hover:-translate-y-2">
                    <div className="pb-2"><img src={image} alt="" /></div>
                    <div className="font-heading font-extrabold text-3xl ">{title}</div>
                    <div className="font-body text-medium text-inactive/70">{text}</div>
                </div>
            </div>
        </div>
    )
}