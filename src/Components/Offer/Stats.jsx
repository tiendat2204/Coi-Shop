import React from "react";

const Stats = () => {
  return (
    <section
      id="comparison"
      aria-label="Coi Shop versus traditional stores"
      className="bg-slate-50 dark:bg-gray-800 py-20 sm:py-5 "
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:p-8 border shadow-md rounded-md">
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Quick, Cost-Effective, Efficient Solutions
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700 dark:text-gray-300">
            Discover the benefits of choosing Coi Shop over traditional stores.
            Say goodbye to delays and enhance your content creation process.
          </p>
        </div>
        <ul
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3"
        >
          <li>
            <ul  className="flex flex-col gap-y-6 sm:gap-y-8">
              <li>
                <figure className="relative bg-white dark:bg-gray-900 p-6 text-center border rounded-md">
                  <blockquote className="relative p-3">
                    <p className="text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
                      98%
                    </p>
                  </blockquote>
                  <figcaption className="text-center">
                    <div className="font-display text-slate-900 dark:text-white">
                      ✅ Faster than traditional stores
                    </div>
                  </figcaption>
                </figure>
              </li>
            </ul>
          </li>
          <li>
            <ul role="list" className="flex flex-col gap-y-6 sm:gap-y-8">
              <li>
                <figure className="relative bg-white dark:bg-gray-900 p-6 text-center border rounded-md">
                  <blockquote className="relative p-3">
                    <p className="text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
                      85%
                    </p>
                  </blockquote>
                  <figcaption className="text-center">
                    <div className="font-display text-slate-900 dark:text-white">
                      💰 More cost-effective than traditional stores
                    </div>
                  </figcaption>
                </figure>
              </li>
            </ul>
          </li>
          <li>
            <ul role="list" className="flex flex-col gap-y-6 sm:gap-y-8">
              <li>
                <figure className="relative bg-white dark:bg-gray-900 p-6 text-center border rounded-md">
                  <blockquote className="relative p-3">
                    <p className="text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
                      120%
                    </p>
                  </blockquote>
                  <figcaption className="text-center">
                    <div className="font-display text-slate-900 dark:text-white">
                      😎 More efficient and feature-rich
                    </div>
                  </figcaption>
                </figure>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      



    </section>
  );
};

export default Stats;
