import React from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const imageVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0 },
};

const Paralax = () => {
  const [ref1, inView1] = useInView({ triggerOnce: true });
  const [ref2, inView2] = useInView({ triggerOnce: true });
  const [ref3, inView3] = useInView({ triggerOnce: true });
  const [ref4, inView4] = useInView({ triggerOnce: true });

  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const controls3 = useAnimation();
  const controls4 = useAnimation();

  React.useEffect(() => {
    if (inView1) {
      controls1.start("visible");
    } else {
      controls1.start("hidden");
    }
  }, [controls1, inView1]);

  React.useEffect(() => {
    if (inView2) {
      controls2.start("visible");
    } else {
      controls2.start("hidden");
    }
  }, [controls2, inView2]);

  React.useEffect(() => {
    if (inView3) {
      controls3.start("visible");
    } else {
      controls3.start("hidden");
    }
  }, [controls3, inView3]);

  React.useEffect(() => {
    if (inView4) {
      controls4.start("visible");
    } else {
      controls4.start("hidden");
    }
  }, [controls4, inView4]);

  return (
    <div className="grid mx-auto grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl my-10">
      <motion.div
        ref={ref1}
        animate={controls1}
        initial="hidden"
        variants={imageVariants}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid gap-4"
      >
        <div>
          <img
            className="h-auto max-w-full rounded-lg"
            src="https://assets.hermes.com/is/image/hermesproduct/241085N%2091_front_wm_2?size=3000,3000&extend=0,0,0,0&align=0,0&$product_item_grid_g$&wid=700&hei=700"
            alt=""
          />
        </div>
        <div>
          <img
            className="h-auto max-w-full rounded-lg"
            src="https://assets.hermes.com/is/image/hermesproduct/izia-seashell-hat--241068N%20NB-worn-1-0-0-800-800_g.jpg"
            alt=""
          />
        </div>
        <div>
          <img
            className="h-auto max-w-full rounded-lg"
            src="https://assets.hermes.com/is/image/hermesproduct/harper-emile-hermes-bucket-hat--241059N%2060-worn-1-0-0-800-800_g.jpg"
            alt=""
          />
        </div>
      </motion.div>
      <motion.div
        ref={ref2}
        animate={controls2}
        initial="hidden"
        variants={imageVariants}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid gap-4"
      >
        <div>
          <img
            className="h-auto max-w-full rounded-lg"
            src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-3.jpg"
            alt=""
          />
        </div>
        <div>
          <img
            className="h-auto max-w-full rounded-lg"
            src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-4.jpg"
            alt=""
          />
        </div>
        <div>
          <img
            className="h-auto max-w-full rounded-lg"
            src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-5.jpg"
            alt=""
          />
        </div>
      </motion.div>
      <motion.div
        ref={ref3}
        animate={controls3}
        initial="hidden"
        variants={imageVariants}
        transition={{ duration: 0.5 }}
        className="grid gap-4"
      >
        <div>
          <img
            className="h-auto max-w-full rounded-lg"
            src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-6.jpg"
            alt=""
          />
        </div>
        <div>
          <img
            className="h-auto max-w-full rounded-lg"
            src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-7.jpg"
            alt=""
          />
        </div>
        <div>
          <img
            className="h-auto max-w-full rounded-lg"
            src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-8.jpg"
            alt=""
          />
        </div>
      </motion.div>
      <motion.div
        ref={ref4}
        animate={controls4}
        initial="hidden"
        variants={imageVariants}
        transition={{ duration: 0.5 }}
        className="grid gap-4"
      >
        <div>
          <img
            className="h-auto max-w-full rounded-lg"
            src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-9.jpg"
            alt=""
          />
        </div>
        <div>
          <img
            className="h-auto max-w-full rounded-lg"
            src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-10.jpg"
            alt=""
          />
        </div>
        <div>
          <img
            className="h-auto max-w-full rounded-lg"
            src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-11.jpg"
            alt=""
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Paralax;
