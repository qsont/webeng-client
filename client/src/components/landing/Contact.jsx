import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";


function Contact() {

  const onSubmit = (e) => {
    e.preventDefault();
  }

  return (<section className="flex flex-col items-center bg-[#12cfcf] w-full p-6">
    <h1 className="font-bold text-4xl text-white mb-10">Help to spread more bars? Contact us!</h1>

    <div className="flex flex-col-reverse md:flex-row gap-6 justify-around items-center w-full">
        <form onSubmit={onSubmit} className="ui-form-stack">
          <Input className="ui-field" type="text" name="" id="" placeholder="YOUR NAME" />
          <Input className="ui-field" type="text" name="" id="" placeholder="EMAIL ADDRESS" />
          <div className="flex flex-row gap-2">
            <Input className="ui-field" type="text" name="" id="" placeholder="COMPANY" />
            <Input className="ui-field" type="text" name="" id="" placeholder="PHONE" />
          </div>
          <Textarea className="ui-textarea" name="" id="" placeholder="MESSAGE" />
          <Button className="self-end bg-yellow-300 rounded-full px-4" type="submit" disabled>Create an account to contact</Button>
        </form>

      <div>
        <h1>Contact Us! Maybe insert a pic here</h1>
      </div>
    </div>
  </section>);
}

export default Contact;