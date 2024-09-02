import React from "react";
import { Button, Input, Textarea, Typography } from "@material-tailwind/react";
import imgcontact from "../../Assets/8951.jpg";
export function Contact() {
  return (
    <section className="px-8 py-8 lg:py-16 mt-28 max-w-7xl mx-auto">
      <div className="container text-center ">
        <Typography
          variant="h5"
          color="blue-gray"
          className="mb-4 !text-base lg:!text-2xl"
        >
          COI SHOP Customer Service
        </Typography>
        <Typography
          variant="h1"
          color="blue-gray"
          className="mb-4 !text-3xl lg:!text-5xl"
        >
          Your Luxury Fashion Concierge
        </Typography>
        <Typography className="!mb-5 font-normal !text-lg lg:mb-20 mx-auto max-w-3xl !text-gray-500">
          For inquiries about our exclusive collections, personal shopping
          assistance, or any other luxury fashion needs, COI SHOP's dedicated
          team is at your service.
        </Typography>
        <div className="grid grid-cols-1 gap-x-12 gap-y-6 lg:grid-cols-2 items-center p-3">
          <img
            src={imgcontact}
            alt="fashion show"
            className="w-full h-full lg:max-h-[700px]"
          />
          <form action="#" className="flex flex-col gap-4 lg:max-w-auto">
            <Typography
              variant="small"
              className="text-left !font-semibold !text-gray-600"
            >
              How Can We Assist You?
            </Typography>
            <div className="flex gap-4">
              <Button variant="outlined" className="max-w-fit">
                General Inquiry
              </Button>
              <Button variant="outlined" className="max-w-fit">
                Personal Shopping
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Typography
                  variant="small"
                  className="mb-2 text-left font-medium !text-gray-900"
                >
                  First Name
                </Typography>
                <Input
                  color="gray"
                  size="lg"
                  placeholder="First Name"
                  name="first-name"
                  className="focus:border-t-gray-900"
                  containerProps={{
                    className: "min-w-full",
                  }}
                  labelProps={{
                    className: "hidden",
                  }}
                />
              </div>
              <div>
                <Typography
                  variant="small"
                  className="mb-2 text-left font-medium !text-gray-900"
                >
                  Last Name
                </Typography>
                <Input
                  color="gray"
                  size="lg"
                  placeholder="Last Name"
                  name="last-name"
                  className="focus:border-t-gray-900"
                  containerProps={{
                    className: "!min-w-full",
                  }}
                  labelProps={{
                    className: "hidden",
                  }}
                />
              </div>
            </div>
            <div>
              <Typography
                variant="small"
                className="mb-2 text-left font-medium !text-gray-900"
              >
                Your Email
              </Typography>
              <Input
                color="gray"
                size="lg"
                placeholder="yourname@email.com"
                name="email"
                className="focus:border-t-gray-900"
                containerProps={{
                  className: "!min-w-full",
                }}
                labelProps={{
                  className: "hidden",
                }}
              />
            </div>
            <div>
              <Typography
                variant="small"
                className="mb-2 text-left font-medium !text-gray-900"
              >
                Your Message
              </Typography>
              <Textarea
                rows={6}
                color="gray"
                placeholder="How can we help you?"
                name="message"
                className="focus:border-t-gray-900"
                containerProps={{
                  className: "!min-w-full",
                }}
                labelProps={{
                  className: "hidden",
                }}
              />
            </div>
            <Button className="w-full" color="gray">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
