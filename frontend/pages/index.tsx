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
import { Car, Role } from '@/lib/types';
import { useLayoutEffect } from "react";

export default function Home() {
  // Access car-related state from the Car Context
  const { carState, carsState, setCarState } = useCarContext();
  const { cars } = carsState;

  const router = useRouter();
  const { getCars, setLoading, deleteCarById } = useCar();
  const { token } = useAuthentication();
  const { isAuthenticated, role } = useAuth();

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

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const tableRef = useRef<HTMLTableElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cars.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(cars.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Adjust items per page based on screen/table size
  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tableRef.current || !screenRef.current) return;

      // Get the total height available from screen container and the top offset of the table
      const screenRect = screenRef.current.getBoundingClientRect();
      const tableRect = tableRef.current.getBoundingClientRect();
      // Calculate available height below the table's top position
      const availableHeight = screenRect.height - tableRect.top;
      // Get the height of a single row from the first row in tbody
      const firstRow = tableRef.current.querySelector("tbody tr");
      const rowHeight = firstRow ? firstRow.getBoundingClientRect().height : 0;

      if (rowHeight > 0) {
        // Subtract 1 row to account for header or padding if needed
        const calculatedItemsPerPage = Math.floor(availableHeight / rowHeight) - 1;
        setItemsPerPage(calculatedItemsPerPage || 5);
      }
    };

    // Call once after mounting
    handleResize();

    // Listen for window resize events
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [cars]);

  return (
    <>
      <Head>
        <title>{config.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="relative">
        <section
          className="bg-white overflow-hidden pt-24 min-h-screen"
          ref={screenRef}
          style={{ minHeight: 'calc(100vh - 3rem)' }}
        >
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg" ref={tableRef}>
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Make & Model</th>
                  <th scope="col" className="px-6 py-3">Year</th>
                  <th scope="col" className="px-6 py-3">Mileage</th>
                  <th scope="col" className="px-6 py-3">Body Type</th>
                  <th scope="col" className="px-6 py-3">Fuel Type</th>
                  <th scope="col" className="px-6 py-3">Power (HP)</th>
                  <th scope="col" className="px-6 py-3">Gear</th>
                  {role === Role.maintainer && (
                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((car) => (
                  <tr key={car._id} className="bg-white border-b hover:bg-gray-50">
                    <motion.th
                      layoutId={car._id}
                      scope="row"
                      className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap"
                    >
                      <Link href={`/car/${car._id}`}>
                        {car.make} {car.model}
                      </Link>
                    </motion.th>
                    <td className="px-6 py-4">{car.firstRegistration}</td>
                    <td className="px-6 py-4">{car.mileage}</td>
                    <td className="px-6 py-4">{car.bodyType}</td>
                    <td className="px-6 py-4">{car.fuelType}</td>
                    <td className="px-6 py-4">{car.powerHP}</td>
                    <td className="px-6 py-4">{car.gear}</td>
                    {role === Role.maintainer && (
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
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Pagination */}
      <nav
        className="flex items-center flex-column flex-wrap md:flex-row justify-between p-2 w-full"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500 md:mb-0 block md:inline md:w-auto">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {indexOfFirstItem + 1}-{indexOfLastItem >= cars.length ? cars.length : indexOfLastItem}
          </span>{" "}
          of <span className="font-semibold text-gray-900">{cars.length}</span>
        </span>
        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
          <li>
            <button
              onClick={prevPage}
              className={`flex items-center justify-center px-3 h-8 ${currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
                }`}
            >
              Previous
            </button>
          </li>
          {Array.from({ length: Math.min(totalPages, 3) }).map((_, index) => {
            const pageNumber = currentPage - Math.floor(5 / 3) + index;
            if (pageNumber < 1 || pageNumber > totalPages) return null;
            return (
              <li key={pageNumber}>
                <button
                  onClick={() => paginate(pageNumber)}
                  className={`flex items-center justify-center px-3 h-8 ${currentPage === pageNumber
                      ? "text-cyan-600 border border-gray-300 bg-cyan-50 hover:bg-cyan-100 hover:text-cyan-700"
                      : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                    }`}
                >
                  {pageNumber}
                </button>
              </li>
            );
          })}
          <li>
            <button
              onClick={nextPage}
              className={`flex items-center justify-center px-3 h-8 ${currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
                }`}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
