import Image from "next/image";
import headerBanner from "../../public/images/header_banner.jpg";

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">

      <Image
        src={headerBanner}
        alt="Calvary Carpentry Pte Ltd"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div
        className="bg-black/70 w-full h-full hidden sm:absolute sm:top-0 sm:right-0 sm:-z-10 sm:block sm:transform-gpu sm:blur-3xl"
        aria-hidden="true"
      >
        {/* <div
          className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        /> */}
      </div>
      {/* <div
        className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
        aria-hidden="true"
      >
        <div
          className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div> */}
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Calvary Carpentry Admin System
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-300">
          This is the admin system for Calvary Carpentry Pte Ltd. It is used to
          manage the company's inventory, projects, employees, and more.
        </p>
      </div>
    </div>
  );
}
