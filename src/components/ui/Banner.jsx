export const Banner = ({ children, ...props }) => {
  return (
    <div
      className="relative my-6 flex max-h-44 min-h-44 w-full items-center justify-between overflow-hidden rounded-2xl px-6"
      {...props}
    >
      {children}
    </div>
  );
};

export const BannerBackground = ({ src, title, alt }) => {
  return (
    <img
      className="absolute left-0 top-0 h-full w-full object-cover"
      src={src}
      title={title || 'Imagen de fondo'}
      alt={alt || 'Imagen de fondo'}
    />
  );
};

export const BannerHeader = ({ children, ...props }) => {
  return (
    <div
      className="z-10 flex h-full flex-col items-start justify-center"
      {...props}
    >
      {children}
    </div>
  );
};

export const BannerTitle = ({ children, ...props }) => {
  return (
    <section className="flex align-baseline font-semibold sm:text-2xl md:text-3xl lg:text-5xl">
      <h1 className="mb-4 text-xl text-white ">
      </h1>
      {children}
    </section>
  );
};

export const BannerAction = ({ children, ...props }) => {
  // ! This must use button component once implemented

  return (
    <button
      className="brightness-85 rounded-md bg-[#FFC800] mt-5 p-2 px-5 text-black transition"
      {...props}
    >
      {children}
    </button>
  );
};

export const BannerLogo = ({ children, ...props }) => {
  return (
    <img className="z-10 size-12 shrink-0 lg:size-24" {...props}>
      {children}
    </img>
  );
};
