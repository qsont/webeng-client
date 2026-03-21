import Navigation from "@/components/custom/Navigation";
import Banner from "@/components/landing/Banner";
import Demo from "@/components/landing/Demo";
import Footer from "@/components/landing/Footer";
import Story from "@/components/landing/Story";
import { Navigate } from "react-router-dom";
import useAuthentication from "@/hooks/useAuthentication";

function LandingPage() {

    const { isChecking, path } = useAuthentication();

    if (isChecking) return null;
    if (path) return <Navigate to={path} replace />;

    return (<main className="flex w-full flex-col items-center bg-background text-foreground">
        <Navigation />
        <Banner />
        <Demo />
        <Story />
        <Footer />
    </main>);
}

export default LandingPage;