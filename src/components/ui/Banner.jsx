export const Banner = ({ children, ...props }) => {
  return (
    <div
      className="relative my-6 flex max-h-44 min-h-44 w-full items-center justify-between overflow-hidden rounded-2xl px-6 bg-green-500"
      {...props}
    >
      {children}
    </div>
  );
};

export const BannerBackground = ({ src, title, alt }) => {
  return (
    <img
      className="absolute left-0 top-0 h-full w-full object-cover select-none"
      draggable={false}
      src={src}
      title={title || "Imagen de fondo"}
      alt={alt || "Imagen de fondo"}
    />
  );
};

export const BannerHeader = ({ children, ...props }) => {
  return (
    <div
      className="z-10 flex min-h-full w-full flex-col items-start justify-center"
      {...props}
    >
      {children}
    </div>
  );
};

export const BannerTitle = ({ children, ...props }) => {
  return (
    <h1 className="mb-4 text-xl text-white sm:text-2xl md:text-3xl lg:text-5xl w-full font-semibold " {...props}>
      {children}
    </h1>
  );
};

export const BannerDescription = ({ children, ...props }) => {
  return (
    <p
      className="text-lg text-white/80 sm:text-xl md:text-2xl md:mt-2"
      {...props}
    >
      {children}
    </p>
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
    <img
      className="z-10 size-12 shrink-0 lg:size-24"
      {...props}
    >
      {children}
    </img>
  );
};
