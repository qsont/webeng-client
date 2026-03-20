import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";

function Contact() {
  const onSubmit = (e) => {
    e.preventDefault();
  }

  return (<section className="flex flex-col items-center bg-linear-to-r from-brand-accent-600 to-brand-accent-500 w-full p-4 sm:p-6 lg:p-8">
    <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-6 sm:mb-8 lg:mb-10 text-center px-2">Get in Touch!</h1>

    <div className="flex flex-col md:flex-row gap-4 sm:gap-6 lg:gap-8 justify-around items-start w-full max-w-6xl px-2">
      {/* Contact Info */}
      <div className="flex-1 text-white space-y-6">
        <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
        
        <div className="flex gap-4 items-start">
          <Mail className="w-5 h-5 mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium">Email</p>
            <p className="text-brand-accent-100">hello@graham.com</p>
          </div>
        </div>
        
        <div className="flex gap-4 items-start">
          <Phone className="w-5 h-5 mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium">Phone</p>
            <p className="text-brand-accent-100">+1 (555) 123-4567</p>
          </div>
        </div>
        
        <div className="flex gap-4 items-start">
          <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium">Location</p>
            <p className="text-brand-accent-100">123 Graham Street, City, Country</p>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <form onSubmit={onSubmit} className="ui-form-stack w-full sm:w-96 flex-1">
        <Input className="ui-field" type="text" placeholder="YOUR NAME" />
        <Input className="ui-field" type="email" placeholder="EMAIL ADDRESS" />
        <div className="flex flex-col sm:flex-row gap-2">
          <Input className="ui-field" type="text" placeholder="COMPANY" />
          <Input className="ui-field" type="tel" placeholder="PHONE" />
        </div>
        <Textarea className="ui-textarea" placeholder="MESSAGE" />
        <Button className="self-end bg-brand-accent-900 hover:bg-black rounded-full px-4 sm:px-6 text-sm text-white transition-colors" type="submit">Send Message</Button>
      </form>
    </div>
  </section>);
}

export default Contact;