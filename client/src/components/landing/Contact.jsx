import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";


function Contact() {

  const onSubmit = (e) => {
    e.preventDefault();
  }

  return (<section className="flex flex-col items-center bg-[#12cfcf] w-full p-4 sm:p-6 lg:p-8">
    <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-6 sm:mb-8 lg:mb-10 text-center px-2">Help to spread more bars? Contact us!</h1>

    <div className="flex flex-col-reverse md:flex-row gap-4 sm:gap-6 lg:gap-8 justify-around items-center w-full max-w-6xl px-2">
        <form onSubmit={onSubmit} className="ui-form-stack w-full sm:w-96">
          <Input className="ui-field" type="text" name="" id="" placeholder="YOUR NAME" />
          <Input className="ui-field" type="text" name="" id="" placeholder="EMAIL ADDRESS" />
          <div className="flex flex-col sm:flex-row gap-2">
            <Input className="ui-field" type="text" name="" id="" placeholder="COMPANY" />
            <Input className="ui-field" type="text" name="" id="" placeholder="PHONE" />
          </div>
          <Textarea className="ui-textarea" name="" id="" placeholder="MESSAGE" />
          <Button className="self-end bg-yellow-300 rounded-full px-3 sm:px-4 text-sm" type="submit" disabled>Create an account to contact</Button>
        </form>

      <div className="text-center md:text-left px-2">
        <h1 className="text-lg sm:text-xl">Contact Us! Maybe insert a pic here</h1>
      </div>
    </div>
  </section>);
}

export default Contact;