"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const invoices = [
  { rank: "1", team: "John Smith", points: "67" },
  { rank: "2", team: "Emma Johnson", points: "58" },
  { rank: "3", team: "Liam Williams", points: "62" },
  { rank: "4", team: "Olivia Brown", points: "75" },
  { rank: "5", team: "Noah Jones", points: "82" },
  { rank: "6", team: "Ava Garcia", points: "59" },
  { rank: "7", team: "Elijah Miller", points: "53" },
  { rank: "8", team: "Sophia Davis", points: "61" },
  { rank: "9", team: "James Martinez", points: "56" },
  { rank: "10", team: "Isabella Wilson", points: "45" },
  { rank: "11", team: "William Moore", points: "48" },
  { rank: "12", team: "Mia Taylor", points: "62" },
  { rank: "13", team: "Benjamin Anderson", points: "42" },
  { rank: "14", team: "Charlotte Thomas", points: "51" },
  { rank: "15", team: "Lucas Jackson", points: "50" },
];

export default function Leaderboards() {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 15;

  const totalPages = Math.ceil(invoices.length / recordsPerPage);

  const paginatedInvoices = invoices.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <>
      <div className="flex w-full justify-center items-center pt-[80px] py-8">
        <div className="flex flex-col justify-center items-center container max-w-4xl">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Rank</TableHead>
                <TableHead>Team & Manager </TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {paginatedInvoices.map((invoice, key) => (
                <TableRow key={key}>
                  <TableCell className="font-medium">{invoice.rank}</TableCell>
                  <TableCell className="font-semibold text-[#37003c]">
                    {invoice.team}
                  </TableCell>
                  <TableCell className="text-right">{invoice.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-16 w-full ">
            <button
              className="px-4 py-2 bg-button rounded text-theme font-medium"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-button rounded text-theme font-medium"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
