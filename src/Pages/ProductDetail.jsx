import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Button,
  IconButton,
  Rating,
  Typography,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { HeartIcon } from "@heroicons/react/24/outline";
import { getProduct } from "../api/productApi";
import { useParams } from "react-router-dom";
import Loading from "../Components/Loading/Loading";
import { addToCart } from "../redux/cartSlice";
import { showNotification } from "../redux/notificationSlice";
import ProductOrder from "../Components/ProductOrder/ProductOrder";
import Comment from "../Components/Comment/Comment";
export function ProductDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");

  const cart = useSelector((state) => state.cart.items);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProduct(id);

        setProduct(productData);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      dispatch(
        showNotification({
          message: "Please select a size for the product!",
          type: "error",
        })
      );
      return;
    }

    const existingCartItem = cart.find(
      (item) => item._id === product._id && item.size === selectedSize
    );
    const totalQuantity = existingCartItem
      ? existingCartItem.quantity + quantity
      : quantity;

    if (totalQuantity > product.quantity) {
      dispatch(
        showNotification({
          message: "Cannot add more items to the cart than available in stock.",
          type: "error",
        })
      );
      return;
    }

    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.new_price,
        size: selectedSize,
        description: product.description,
        image: product.image,
        quantity: quantity,
      })
    );

    dispatch(
      showNotification({
        message: "Product added to cart successfully!",
        type: "success",
      })
    );
  };

  const handleQuantityChange = (e) => {
    const newQuantity = Number(e.target.value);
    if (newQuantity > product.quantity) {
      dispatch(
        showNotification({
          message: "You have exceeded the quantity in stock!",
          type: "warning",
        })
      );
    } else {
      setQuantity(newQuantity);
    }
  };

  return (
    <section className="py-16 px-8 pt-40">
      <div className="mx-auto container grid place-items-center grid-cols-1 md:grid-cols-2 max-w-6xl px-4">
        <img
          src={
            product.image ||
            "https://www.material-tailwind.com/image/product-4.png"
          }
          alt={product.name}
          className="w-9/12 h-auto"
        />
        <div>
          <Typography className="mb-4" variant="h3">
            {product.name}
          </Typography>
          <Typography variant="h5">
            {product.new_price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </Typography>
          <Typography className="!mt-4 text-base font-normal leading-[27px] !text-gray-500">
            {product.description}
          </Typography>
          <div className="my-8 flex items-center gap-2">
            <Typography className="!text-sm font-bold !text-gray-700">
              ({product.view} reviews)
            </Typography>
          </div>
          <div className=" flex items-center gap-28 justify-start">
            <div className="">
              <Typography color="blue-gray" variant="h6">
                Size
              </Typography>
              <div className="my-8 mt-3 flex items-center gap-2">
                {product.size.map((sizeItem) => (
                  <div key={sizeItem} className="inline-flex items-center">
                    <label
                      className="relative flex items-center p-3 rounded-full cursor-pointer"
                      htmlFor={`size${sizeItem}`}
                    >
                      <input
                        name="size"
                        type="radio"
                        className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-gray-900 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
                        id={`size${sizeItem}`}
                        onChange={() => setSelectedSize(sizeItem)}
                      />
                      <span className="absolute text-gray-900 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100"></span>
                    </label>
                    <label
                      className="mt-px font-light text-gray-700 cursor-pointer select-none"
                      htmlFor={`size${sizeItem}`}
                    >
                      Size {sizeItem}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="">
              <Typography color="blue-gray" variant="h6">
                Quantity
              </Typography>
              <div className="my-8 mt-3">
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  className="w-20 border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>
          </div>

          <div className="mb-4 flex w-full items-center gap-3 md:w-1/2 ">
            {product.quantity > 0 ? (
              <Button color="gray" className="w-52" onClick={handleAddToCart}>
                Add to Cart
              </Button>
            ) : (
              <div className="text-red-500 font-bold px-6 py-2 border-2 rounded-md">
                Sold Out
              </div>
            )}

            <IconButton color="gray" variant="text" className="shrink-0">
              <HeartIcon className="h-6 w-6" />
            </IconButton>
          </div>
        </div>
      </div>
      <div className="m-auto 2xl:container">
        <ProductOrder />
      </div>
      <div>
        <Comment productId={id} />
      </div>
      <div className="2xl:container 2xl:mx-auto md:py-12 lg:px-20 md:px-6 py-9 px-4">
        <h2 className="font-semibold dark:text-white lg:text-4xl text-3xl lg:leading-9 md:leading-7 leading-9 text-gray-800">
          Frequently Asked Questions
        </h2>
        <div className="mt-4 flex md:justify-between md:items-start md:flex-row flex-col justify-start items-start">
          <div className="">
            <p className="font-normal dark:text-gray-400 text-base leading-6 text-gray-600 lg:w-8/12 md:w-9/12">
              Here are few of the most frequently asked questions by our
              valueable customers
            </p>
          </div>

          <div className="border-b-2 border-gray-200 pb-2 flex justify-center items-center md:mt-0 mt-10 md:w-auto w-full">
            <input
              placeholder="Search"
              type="text"
              aria-label="Search"
              className="dark:bg-transparent dark:text-gray-400 dark:placeholder-gray-400 lg:w-96 md:w-72 w-full focus:outline-none placeholder-gray-600 text-base font-normal text-gray-600 leading-4"
            />
            <svg
              className="cursor-pointer text-gray-600 dark:text-gray-400"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.66667 11.3333C9.244 11.3333 11.3333 9.244 11.3333 6.66667C11.3333 4.08934 9.244 2 6.66667 2C4.08934 2 2 4.08934 2 6.66667C2 9.244 4.08934 11.3333 6.66667 11.3333Z"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 14L10 10"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div className="flex md:flex-row flex-col md:space-x-8 md:mt-16 mt-8">
          <div className="md:w-5/12 lg:w-4/12 w-full">
            <img
              src="../Assets/portrait-young-japanese-woman-with-jacket.jpg"
              alt="Image of Glass bottle"
              className="w-full md:block hidden"
            />
          </div>
          <div className="md:w-7/12 lg:w-8/12 w-full md:mt-0 sm:mt-14 mt-10">
            <AccordionCustomIcon />
          </div>
        </div>
      </div>
    </section>
  );
}

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

function AccordionCustomIcon() {
  const [open, setOpen] = React.useState(0);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  return (
    <>
      <Accordion open={open === 1} icon={<Icon id={1} open={open} />}>
        <AccordionHeader onClick={() => handleOpen(1)}>
          What types of clothes are best for summer?
        </AccordionHeader>
        <AccordionBody>
          Lightweight, breathable fabrics like cotton and linen are ideal for
          summer because they help keep the body cool and comfortable in hot
          weather.
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 2} icon={<Icon id={2} open={open} />}>
        <AccordionHeader onClick={() => handleOpen(2)}>
          How should I wash my delicate clothes?
        </AccordionHeader>
        <AccordionBody>
          Delicate clothes should be hand washed or machine washed in a gentle
          cycle with cold water and a mild detergent. Air drying is recommended
          to preserve the fabric's integrity.
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 3} icon={<Icon id={3} open={open} />}>
        <AccordionHeader onClick={() => handleOpen(3)}>
          What is the best way to store winter clothes?
        </AccordionHeader>
        <AccordionBody>
          Winter clothes should be cleaned before storage and kept in a cool,
          dry place. Using vacuum-sealed bags or containers can save space and
          protect garments from moisture and pests.
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 4} icon={<Icon id={4} open={open} />}>
        <AccordionHeader onClick={() => handleOpen(4)}>
          How can I identify sustainable clothing?
        </AccordionHeader>
        <AccordionBody>
          Look for certifications like GOTS (Global Organic Textile Standard),
          Fair Trade, and materials that are organic, recycled, or eco-friendly.
          Researching the brand's practices and sustainability commitment can
          also provide insights.
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 5} icon={<Icon id={5} open={open} />}>
        <AccordionHeader onClick={() => handleOpen(5)}>
          Can I mix different styles of clothes?
        </AccordionHeader>
        <AccordionBody>
          Absolutely! Mixing different styles can create a unique and personal
          look. It's all about balancing proportions, colors, and textures to
          achieve a cohesive appearance.
        </AccordionBody>
      </Accordion>
    </>
  );
}
export default ProductDetail;
