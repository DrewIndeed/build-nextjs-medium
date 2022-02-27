function Banner() {
  return (
    <div className="flex items-center justify-around border-y border-black bg-yellow-300 py-10 px-10 lg:py-20">
      <div className="space-y-5">
        <h1 className="max-w-xl font-serif text-6xl">
          <span className="decoration-red decoration-6 underline">Medium</span>{' '}
          is a place to write, read and connect
        </h1>
        <h2 className="font-serif">
          It's easy and free to post your thinking on any topic and connect with
          millions of readers.
        </h2>
      </div>

      <img
        className="hidden h-32 object-contain md:inline-flex lg:h-max"
        src="https://seeklogo.com/images/M/medium-logo-AC4BE02AB0-seeklogo.com.png"
        alt="medium logo"
      />
    </div>
  )
}

export default Banner;
