import Navigation from "@/components/custom/Navigation";
import Banner from "@/components/landing/Banner";
import Contact from "@/components/landing/Contact";
import Demo from "@/components/landing/Demo";
import Footer from "@/components/landing/Footer";
import Story from "@/components/landing/Story";

function LandingPage() {
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