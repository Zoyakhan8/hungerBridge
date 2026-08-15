import { useState } from "react"

export const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        message: ""
    })
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => (
            {
                ...prev,
                [name]: value
            }
        ))
    }
    const handleSubmit = async (event) => {
        event.preventDefault()
        console.log("formSubmitted", formData)
        try {
            const res = await fetch("/api/contact-us", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (res.ok) {
                alert("Thank you for contacting us. We'll get back to you soon.")
                setFormData({
                    name: "",
                    email: "",
                    phoneNumber: "",
                    message: ""
                })
            } else {
                alert("Something went wrong")
            }
        } catch (error) {
            console.log(error)
            alert("Something went wrong")
        }
    }
    return (
        <section className="bg-brown ">
            <div className="relative z-10">
                <div className="flex flex-row justify-between items-center px-24 py-16">
                    <div className="flex flex-col justify-center gap-5 w-[40%] p-4">
                        <div className=" bg-background/30 backdrop-blur-3xl px-4 py-1 rounded-[20px] w-max 
                        border border-white/20 shadow-xl shadow-black/10">
                            <h4 className="text-secondary font-body font-bold">
                                . Academic Project
                            </h4>
                        </div>
                        <div className="font-heading font-extrabold text-6xl text-inactive">
                            <h1 className="leading-[1.2]">
                                <span>Illuminating the Path </span>
                                <span>to Zero </span>
                                <span>Hunger</span>
                            </h1>
                        </div>
                        <h3 className="font-body font-medium text-inactive">
                            Building a safer future for food donation starts with a conversation.
                            Whether you're an NGO, donor, researcher,
                            or simply interested in HungerBridge, we'd love to hear from you.
                        </h3>
                        <div className="flex flex-row items-center justify-between gap-6">
                            <div className="flex flex-col gap-2
                         bg-background/20 backdrop-blur-xl rounded-[20px] 
                    max-w-[500px] border border border-white/20 px-4 py-6
                    shadow-xl shadow-black/10 transition-all duration-300
                    hover:border-white/30
                    hover: hover:scale-105 transition-all duration-300">
                                <h1 className="font-body font-bold text-xl text-heading">Inquiries</h1>
                                <h1 className="font-body text-md text-inactive 
                             flex flex-col gap-1 leading-[1.2]">
                                    <span>hungerbridge@gmail.com</span>
                                    <span> +910000000</span>
                                </h1>
                            </div>
                            <div className="flex flex-col gap-2 bg-background/20 backdrop-blur-xl rounded-[20px] 
                    max-w-[500px] border border border-white/20 px-4 py-6
                    shadow-xl shadow-black/10 transition-all duration-300
                    hover:border-white/30
                    hover: hover:scale-105 transition-all duration-300">
                                <h1 className="font-body font-bold text-xl text-heading">Location</h1>
                                <h1 className="font-body text-md text-inactive 
                             flex flex-col gap-1 leading-[1.2]">
                                    <span>Mumbai,Maharashtra</span>
                                    <span>India</span>
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div className="bg-background/20 backdrop-blur-xl rounded-[20px] 
                    max-w-[500px] border border border-white/20 p-10
                    shadow-xl shadow-black/10 transition-all duration-300
                    hover:border-white/30 flex flex-col gap-4">
                        <h4 className="font-heading font-extrabold text-4xl text-inactive ">Send a Message</h4>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-row gap-6">
                                <div className="flex flex-col gap-2 flex-1">
                                    <label className="font-heading text-md text-inactive font-bold" htmlFor="name" >Full Name</label>
                                    <input className=" text-inactive px-4 py-3 bg-background/20
                             backdrop-blur-xl rounded-[8px] w-full border 
                             border border-cta/40 shadow-xl shadow-black/10"
                                        type="text" id="name" name="name" placeholder="Enter your name"
                                        value={formData.name} onChange={handleChange} />
                                </div>
                                <div className="flex flex-col gap-2 flex-1">
                                    <label className="font-heading text-md text-inactive font-bold" htmlFor="email" >Email</label>
                                    <input className=" text-inactive px-4 py-3 bg-background/20
                             backdrop-blur-xl rounded-[8px] w-full border 
                             border border-cta/40 shadow-xl shadow-black/10"
                                        type="email" id="email" name="email" placeholder="Enter your email"
                                        value={formData.email} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="font-heading text-md text-inactive font-bold" htmlFor="phone-number" >Phone Number</label>
                                <input className=" text-inactive px-4 py-3 bg-background/20
                             backdrop-blur-xl rounded-[8px] w-full border 
                             border border-cta/40 shadow-xl shadow-black/10"
                                    type="tel" id="phone-number" name="phoneNumber" placeholder="Enter your number"
                                    value={formData.phoneNumber} onChange={handleChange} />
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="font-heading text-md text-inactive font-bold" htmlFor="message" >Enquires</label>
                                <textarea className=" text-inactive px-4 py-3 bg-background/20
                             backdrop-blur-xl rounded-[8px] w-full border 
                             border border-cta/40 shadow-xl shadow-black/10"
                                    id="message" name="message" placeholder="Enter a message........"
                                    value={formData.message} onChange={handleChange}></textarea>
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                                <button type="submit"
                                    className="inline-block backdrop-blur-3xl px-10 py-3 shadow-[0_4px_20px] shadow-primary/50
                            bg-primary
                            border border-white/40 text-brown rounded-[10px] text-xl font-bold
                            cursor-pointer">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="absolute z-0 ">
                    <div
                        className=" absolute bottom-50 -right-250 w-[200px] h-[200px] 
                    rounded-full bg-primary/25 blur-[90px]"
                    />
                    <div
                        className=" absolute bottom-50 -right-200 w-[200px] h-[200px] rounded-full bg-primary/15 blur-[90px]"
                    />
                </div>
            </div>
        </section>
    )
}