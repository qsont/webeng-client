import Navigation from "@/components/custom/Navigation";
import Banner from "@/components/landing/Banner";
import Contact from "@/components/landing/Contact";
import Demo from "@/components/landing/Demo";
import Footer from "@/components/landing/Footer";
import Story from "@/components/landing/Story";
import { Navigate } from "react-router-dom";
import useAuthentication from "@/hooks/useAuthentication";

function LandingPage() {

    const { isChecking, path } = useAuthentication();

    if (isChecking) return <p className="w-full h-screen bg-green-500">Loading...</p>;
    if (path) return <Navigate to={path} replace />;

    return (<main className="flex flex-col items-center">
        <Navigation />
        <Banner />
        <Demo />
        <Story />
        <Contact />
        <Footer />
    </main>);
}

export default LandingPage;