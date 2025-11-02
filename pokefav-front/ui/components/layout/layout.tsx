import Container from "../container/container";
import Navigation from "../navigation/navigation";
import ScrollToTop from "../scroll-to-top/scroll-to-top";
import Footer from "../footer/footer";

interface Props {
  children: React.ReactNode;
  isDisplayingBreadcrumbs?: boolean;
  withSideBar?: boolean;
}

const Layout = ({ children, withSideBar }: Props) => {
  let view: React.ReactElement = <></>;

  view = (
    <div className="flex flex-col min-h-screen justify-between">
      <Navigation />
      {withSideBar ? (
        <Container className="mb-14">
          <div className="grid grid-cols-12 gap-7">
            <div className="col-span-9">{children}</div>
          </div>
        </Container>
      ) : (
        <>{children}</>
      )}
      <ScrollToTop />
      <Footer />
    </div>
  );

  return view;
};

export default Layout;
