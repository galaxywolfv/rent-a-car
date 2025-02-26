import Head from 'next/head';
import config from '@/lib/config';
import { useRouter } from 'next/router';
import useAuthentication from '@/lib/hooks/useAuthentication';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/AuthContext';
import Link from 'next/link';
import useCar from '@/lib/hooks/useCar';
import React from 'react';
import { useCarContext } from '@/CarContext';
import ActionButton from '@/components/common/actionButton';
import { motion } from 'framer-motion';
import { Car } from '@/lib/types';

export default function Home() {
  // Access car-related state from the Car Context
  const { carState, carsState, setCarState } = useCarContext();
  const { cars } = carsState; // Array of cars
  const router = useRouter();
  // const { getCars, setLoading } = useCars();
  const { getCars, setLoading, deleteCarById } = useCar();
  const { token } = useAuthentication();
  const { isAuthenticated } = useAuth();
  const isAuth = !!isAuthenticated;

  // Fetch cars when the token is available
  useEffect(() => {
    if (token) {
      getCars();
    }
  }, [token]);

  // Modal state for delete confirmation (or similar actions)
  const [showModal, setShowModal] = React.useState<boolean>(false);

  const [selectedCar, setSelectedCar] = React.useState<Car>();

  const toggleModal = (car: Car) => {
    if (car) {
      setSelectedCar(car);
      setShowModal(!showModal);
    }
  };

  // // Pagination logic
  // const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage, setItemsPerPage] = useState(5);
  const tableRef = useRef<HTMLTableElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = cars.slice(indexOfFirstItem, indexOfLastItem);

  // const totalPages = Math.ceil(cars.length / itemsPerPage);

  // const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  // const prevPage = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // };
  // const nextPage = () => {
  //   if (currentPage < totalPages) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // };

  // // Adjust items per page based on screen/table size
  // useEffect(() => {
  //   const handleResize = () => {
  //     if (!tableRef.current || !screenRef.current) return;

  //     const tableHeight = screenRef.current.getBoundingClientRect().height - tableRef.current.offsetTop;
  //     const rowHeight = tableRef.current.querySelector('tbody tr')?.getBoundingClientRect().height || 0;
  //     const calculatedItemsPerPage = Math.floor(tableHeight / rowHeight) - 1;
  //     setItemsPerPage(calculatedItemsPerPage || 5);
  //   };

  //   handleResize();
  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, [cars, screenRef, tableRef]);

  return (
    <>
      <Head>
        <title>{config.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="relative">
        <section className="bg-white overflow-hidden pt-24 min-h-screen" ref={screenRef} style={{ minHeight: 'calc(100vh - 3rem)' }}>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg" ref={tableRef}>
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="p-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-all-search"
                        type="checkbox"
                        className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 focus:ring-2"
                      />
                      <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">Make & Model</th>
                  <th scope="col" className="px-6 py-3">Year</th>
                  <th scope="col" className="px-6 py-3">Mileage</th>
                  <th scope="col" className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => (
                  <tr key={car._id} className="bg-white border-b hover:bg-gray-50">
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          id={`checkbox-table-search-${car._id}`}
                          type="checkbox"
                          className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 focus:ring-2"
                        />
                        <label htmlFor={`checkbox-table-search-${car._id}`} className="sr-only">checkbox</label>
                      </div>
                    </td>
                    <motion.th
                      layoutId={car._id}
                      scope="row"
                      className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap"
                    >
                      <Link href={`/car/${car._id}`}>
                        {car.make} {car.model}
                      </Link>
                    </motion.th>
                    <td className="px-6 py-4">{car.year}</td>
                    <td className="px-6 py-4">{car.mileage}</td>
                    <td className="flex items-center justify-end px-3 py-2 space-x-2">
                      <ActionButton
                        onClick={() => {
                          setCarState((prevState: any) => ({
                            ...prevState,
                            car: car,
                          }));
                        }}
                        icon="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        item={car}
                        href={`/car/${car._id}/edit`}
                      />
                      <ActionButton
                        onClick={() => toggleModal(car)}
                        icon="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        item={car}
                      />
                      {/* <ActionButton
                        onClick={addToList}
                        icon="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                        item={car}
                      /> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      {/* <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between p-2 w-full" aria-label="Table navigation">
        <span className="text-sm font-normal text-gray-500 md:mb-0 block md:inline md:w-auto">
          Showing <span className="font-semibold text-gray-900">
            {indexOfFirstItem + 1}-{indexOfLastItem >= cars.length ? cars.length : indexOfLastItem}
          </span> of <span className="font-semibold text-gray-900">{cars.length}</span>
        </span>
        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
          <li>
            <button onClick={prevPage} className={`flex items-center justify-center px-3 h-8 ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700'}`}>
              Previous
            </button>
          </li>
          {Array.from({ length: Math.min(totalPages, 3) }).map((_, index) => {
            const pageNumber = currentPage - Math.floor(5 / 3) + index;
            if (pageNumber < 1 || pageNumber > totalPages) return null;
            return (
              <li key={pageNumber}>
                <button onClick={() => paginate(pageNumber)} className={`flex items-center justify-center px-3 h-8 ${currentPage === pageNumber ? 'text-cyan-600 border border-gray-300 bg-cyan-50 hover:bg-cyan-100 hover:text-cyan-700' : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'}`}>
                  {pageNumber}
                </button>
              </li>
            );
          })}
          <li>
            <button onClick={nextPage} className={`flex items-center justify-center px-3 h-8 ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700'}`}>
              Next
            </button>
          </li>
        </ul>
      </nav> */}
    </>
  );
}
