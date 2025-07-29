// import { SessionStatusType } from "@/types/session-status-type";
// import BreadCrumbs from "../breadcrumbs/breadcrumbs";
import Container from "../container/container";
// import Footer from "../navigation/footer";
import Navigation from "../navigation/navigation";
// import UserAccountNavigation from "../navigation/user-account-navigation";
// import { Session } from "../session/session";

interface Props {
  children: React.ReactNode;
  isDisplayingBreadcrumbs?: boolean;
  withSideBar?: boolean;
  // sessionStatus?: SessionStatusType;
}

const Layout = ({
  children,
  // isDisplayingBreadcrumbs = true,
  withSideBar,
}: // sessionStatus,
Props) => {
  let view: React.ReactElement = <></>;

  view = (
    <>
      <Navigation />
      {withSideBar ? (
        <Container className="mb-14">
          <div className="grid grid-cols-12 gap-7">
            {/* <div className="col-span-3">
            <UserAccountNavigation />
          </div> */}
            <div className="col-span-9">{children}</div>
          </div>
        </Container>
      ) : (
        <>{children}</>
      )}
    </>
  );
  //   <Session sessionStatus={sessionStatus}>
  //  <Navigation />
  //   {isDisplayingBreadcrumbs && <BreadCrumbs />}
  //   { <Footer />
  // </Session> }

  return view;
};

export default Layout;
