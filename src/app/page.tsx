import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HomeMenu from "@/components/HomeMenu";
import SectionHeaders from "@/components/SectionHeaders";
import Phone from "@/components/icons/Phone";


export default function page() {
  return (
    <>
      <Hero />
      <HomeMenu />
      <section className="text-center my-16" id="about">
        <SectionHeaders subHeader="Our story" mainHeader="About us" />
        <div className="max-w-md mx-auto mt-4 text-left text-slate-500 flex flex-col gap-4">
          <p className="">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui quasi minima autem praesentium fuga impedit possimus commodi, dolores ut magnam veritatis excepturi saepe ducimus. Voluptate amet nihil impedit praesentium a cupiditate deserunt aliquam, suscipit quae eligendi!
          </p>
          <p className="">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui quasi minima autem praesentium fuga impedit possimus commodi, dolores ut magnam veritatis excepturi saepe ducimus. Voluptate amet nihil impedit praesentium a cupiditate deserunt aliquam, suscipit quae eligendi!
          </p>
        </div>
      </section>

      <section className="text-center my-8" id="contact">
        <SectionHeaders subHeader="Don't hesitate" mainHeader="Contact us" />
        <div className="mt-8 flex gap-4 justify-center items-center">
          <Phone/>
          <a className="text-4xl underline text-slate-500" href="tel:+919381152943">  +91-9381152943</a>
        </div>
        <div className="mt-8 flex gap-4 justify-center items-center">
          <Phone/>
          <a className="text-4xl underline text-slate-500" href="tel:+919100668999">+91-9100668999</a>
        </div>
      </section>
    </>
  )
}
