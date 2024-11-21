import HeaderContent from "./HeaderContent";
import HeaderClientProvider from "./HeaderClientProvider";

// export const runtime = "edge";

const Header = async () => {
  return (
    <HeaderClientProvider>
      <HeaderContent />
    </HeaderClientProvider>
  );
};

export default Header;
